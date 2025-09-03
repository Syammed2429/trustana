"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  FC,
  useEffect,
} from "react";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { Product } from "@/app/types/product";
import { SupplierAttribute } from "@/app/types/attribute";
import { apiClient } from "@/lib/api-client";

interface ProductPage {
  items: Product[];
  nextCursor?: number;
}

interface ProductsContextType {
  data: InfiniteData<ProductPage> | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  availableAttributes: string[];
  searchTerm: string;
  attributeFilters: Record<string, string>;
  setSearchAndFilters: (
    search: string,
    attributes: Record<string, string>
  ) => void;
  setAdvancedFilters: (filters: Record<string, unknown>) => void;
  clearFilters: () => void;
  currentFilters: Record<string, unknown>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}

interface ProductsProviderProps {
  children: ReactNode;
}

// Fetch products with pagination
async function fetchProducts({
  pageParam = 0,
  searchTerm = "",
  attributeFilters = {},
  advancedFilters = {},
}: {
  pageParam?: number;
  searchTerm?: string;
  attributeFilters?: Record<string, string>;
  advancedFilters?: Record<string, unknown>;
}): Promise<ProductPage> {
  try {
    // Start with advanced filters if they exist
    let combinedFilter: Record<string, unknown> = {};

    // If we have advanced filters, use them as the base
    if (Object.keys(advancedFilters).length > 0) {
      combinedFilter = { ...advancedFilters };
    } else {
      // Otherwise, use simple attribute filters
      Object.entries(attributeFilters).forEach(([key, value]) => {
        if (value === "has-value") {
          combinedFilter[key] = { $ne: null };
        } else if (value === "empty") {
          combinedFilter[key] = { $eq: null };
        }
      });
    }

    // Add search term filter if provided
    if (searchTerm) {
      const searchFilter = {
        $or: [
          { id: { $regex: searchTerm, $options: "i" } },
          { skuId: { $regex: searchTerm, $options: "i" } },
          { "attributes.name": { $regex: searchTerm, $options: "i" } },
          { "attributes.brand": { $regex: searchTerm, $options: "i" } },
          {
            "attributes.smartProductTitle": {
              $regex: searchTerm,
              $options: "i",
            },
          },
          {
            "attributes._basicInfoAboutThisItem2": {
              $regex: searchTerm,
              $options: "i",
            },
          },
          { "attributes.category": { $regex: searchTerm, $options: "i" } },
          { "attributes.description": { $regex: searchTerm, $options: "i" } },
        ],
      };

      // If we already have filters, combine with AND
      if (Object.keys(combinedFilter).length > 0) {
        combinedFilter = {
          $and: [combinedFilter, searchFilter],
        };
      } else {
        combinedFilter = searchFilter;
      }
    }

    const response = await apiClient.post("/api/products", {
      filter: combinedFilter,
      pagination: {
        offset: pageParam * 100,
        limit: 100,
      },
    });

    return {
      items: response.data?.data || [],
      nextCursor: response.data?.pagination?.hasMore
        ? pageParam + 1
        : undefined,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch products"
    );
  }
}

// Fetch attributes
async function fetchAttributes(): Promise<SupplierAttribute[]> {
  try {
    const response = await apiClient.post("/api/attributes");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching attributes:", error);

    // Return empty array instead of throwing to prevent app crash
    // The app should work even if attributes fail to load
    console.warn("Falling back to empty attributes list");
    return [];
  }
}

export const ProductsProvider: FC<ProductsProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [attributeFilters, setAttributeFilters] = useState<
    Record<string, string>
  >({});
  const [availableAttributes, setAvailableAttributes] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<Record<string, unknown>>(
    {}
  );

  // Advanced filters methods
  const setAdvancedFilters = useCallback((filters: Record<string, unknown>) => {
    setCurrentFilters(filters);
    // For now, we'll just store the filters but still use the original simple filtering
    // In a real app, you'd modify the API call to handle complex filters
  }, []);

  const clearFilters = useCallback(() => {
    setCurrentFilters({});
    setSearchTerm("");
    setAttributeFilters({});
  }, []);

  // Load filters from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlFilters = urlParams.get("filters");
    if (urlFilters) {
      try {
        const parsedFilters = JSON.parse(urlFilters);
        if (parsedFilters.search) setSearchTerm(parsedFilters.search);
        if (parsedFilters.attributes)
          setAttributeFilters(parsedFilters.attributes);
      } catch (error) {
        console.error("Error parsing URL filters:", error);
      }
    }
  }, []);

  // Fetch attributes on mount and extract available attribute keys
  useEffect(() => {
    const loadAttributes = async () => {
      try {
        const attrs = await fetchAttributes();
        const attrKeys = attrs.map((attr) => attr.key);
        setAvailableAttributes(attrKeys);
        console.log(`[Attributes] Loaded ${attrKeys.length} attributes`);
      } catch (error) {
        console.error("[Attributes] Failed to load attributes:", error);
        // Continue with empty attributes - don't crash the app
        setAvailableAttributes([]);
      }
    };

    loadAttributes();
  }, []);

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", searchTerm, attributeFilters, currentFilters],
    queryFn: ({ pageParam }) =>
      fetchProducts({
        pageParam,
        searchTerm,
        attributeFilters,
        advancedFilters: currentFilters,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    retry: (failureCount, error) => {
      // Retry up to 2 times for network errors, but not for 404s
      if (failureCount >= 2) return false;
      if (error?.message?.includes("404")) return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  });

  const setSearchAndFilters = useCallback(
    (search: string, attributes: Record<string, string>) => {
      setSearchTerm(search);
      setAttributeFilters(attributes);
    },
    []
  );

  const contextValue: ProductsContextType = {
    data,
    isLoading,
    isError,
    error: error as Error | null,
    hasNextPage: !!hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    availableAttributes,
    searchTerm,
    attributeFilters,
    setSearchAndFilters,
    setAdvancedFilters,
    clearFilters,
    currentFilters,
  };

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};
