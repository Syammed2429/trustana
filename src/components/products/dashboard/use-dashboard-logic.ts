"use client";

import { useCallback, useMemo, useState } from "react";
import { useProductsAdvanced } from "@/contexts/products-context-advanced";
import { Product } from "@/app/types/product";

/**
 * Custom hook that handles dashboard business logic and data transformations
 * Separates business logic from UI components for better maintainability
 */
export const useDashboardLogic = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    availableAttributes,
    supplierAttributes,
    setAdvancedFilters,
    clearFilters,
    currentFilters,
  } = useProductsAdvanced();

  // Create Product Dialog State
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Memoized calculations
  const dashboardData = useMemo(() => {
    const allProducts = data?.pages.flatMap((page) => page.items) ?? [];
    const totalProducts = allProducts.length;
    const hasActiveFilters = Object.keys(currentFilters).length > 0;
    const activeFiltersCount = Object.keys(currentFilters).length;

    return {
      allProducts,
      totalProducts,
      hasActiveFilters,
      activeFiltersCount,
      availableAttributesCount: availableAttributes.length,
    };
  }, [data, currentFilters, availableAttributes.length]);

  // Handlers
  const handleFiltersChange = useCallback(
    (filters: Record<string, unknown>) => {
      setAdvancedFilters(filters);
    },
    [setAdvancedFilters]
  );

  const handleCreateProduct = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const handleProductCreated = useCallback((newProduct: Product) => {
    // In a real application, this would:
    // 1. Make API call to create the product
    // 2. Invalidate and refetch the products query
    // 3. Show success notification

    console.log("Product created:", newProduct);

    // For now, we'll just close the dialog
    // In real implementation, the context would handle adding to the list
    setIsCreateDialogOpen(false);

    // TODO: Add to products list when real API is implemented
    // This would typically be handled by the context/query invalidation
  }, []);

  const handleExport = useCallback(() => {
    // TODO: Implement export functionality
    console.log("Export functionality to be implemented");
  }, []);

  const handleShare = useCallback(() => {
    // TODO: Implement share functionality
    console.log("Share functionality to be implemented");
  }, []);

  const handleSettings = useCallback(() => {
    // TODO: Implement settings functionality
    console.log("Settings functionality to be implemented");
  }, []);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    // Data
    ...dashboardData,
    availableAttributes,
    supplierAttributes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,

    // Create Product Dialog State
    isCreateDialogOpen,
    setIsCreateDialogOpen,

    // Handlers
    handleFiltersChange,
    handleClearFilters: clearFilters,
    handleExport,
    handleShare,
    handleSettings,
    handleRetry,
    handleCreateProduct,
    handleProductCreated,
  };
};
