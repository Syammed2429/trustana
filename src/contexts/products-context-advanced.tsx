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
  supplierAttributes: SupplierAttribute[]; // Add full supplier attributes for enum usage
  setAdvancedFilters: (filters: Record<string, unknown>) => void;
  clearFilters: () => void;
  currentFilters: Record<string, unknown>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export function useProductsAdvanced() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error(
      "useProductsAdvanced must be used within a ProductsProviderAdvanced"
    );
  }
  return context;
}

interface ProductsProviderProps {
  children: ReactNode;
}

// Fetch products with advanced filtering
async function fetchProducts({
  pageParam = 0,
  advancedFilters = {},
}: {
  pageParam?: number;
  advancedFilters?: Record<string, unknown>;
}): Promise<ProductPage> {
  try {
    const response = await apiClient.post("/api/products", {
      filter: advancedFilters,
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

// Fetch available attributes
async function fetchAttributes(): Promise<{
  keys: string[];
  attributes: SupplierAttribute[];
}> {
  try {
    const response = await apiClient.post("/api/attributes", {
      filter: {},
      pagination: { offset: 0, limit: 1000 },
    });

    const attributes = response.data?.data || [];
    return {
      keys: attributes.map((attr: SupplierAttribute) => attr.key),
      attributes: attributes,
    };
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return { keys: [], attributes: [] };
  }
}

export const ProductsProviderAdvanced: FC<ProductsProviderProps> = ({
  children,
}) => {
  const [currentFilters, setCurrentFilters] = useState<Record<string, unknown>>(
    {}
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["products-advanced", currentFilters],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({
        pageParam,
        advancedFilters: currentFilters,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch attributes separately
  const [availableAttributes, setAvailableAttributes] = useState<string[]>([]);
  const [supplierAttributes, setSupplierAttributes] = useState<
    SupplierAttribute[]
  >([]);

  useEffect(() => {
    fetchAttributes().then(({ keys, attributes }) => {
      setAvailableAttributes(keys);
      setSupplierAttributes(attributes);
    });
  }, []);

  const setAdvancedFilters = useCallback((filters: Record<string, unknown>) => {
    console.log("Setting advanced filters:", filters);
    setCurrentFilters(filters);
  }, []);

  const clearFilters = useCallback(() => {
    setCurrentFilters({});
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        data,
        isLoading,
        isError: !!error,
        error: error as Error | null,
        hasNextPage: !!hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        availableAttributes,
        supplierAttributes,
        setAdvancedFilters,
        clearFilters,
        currentFilters,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
