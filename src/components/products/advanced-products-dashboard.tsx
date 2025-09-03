'use client';

import React from 'react';
import { AdvancedFilters } from '@/components/filters';
import { Separator } from '@/components/ui/separator';
import { HeaderCard } from './cards/header-card';
import { DataTableCard } from './cards/data-table-card';
import { ErrorState } from './dashboard/error-state';
import { CreateProductDialog } from '@/components/dialogs/create-product-dialog';
import { useDashboardLogic } from './dashboard/use-dashboard-logic';

/**
 * Optimized Advanced Products Dashboard Component
 *
 * Features:
 * - Separated into focused, reusable components
 * - Custom hook for business logic separation
 * - Memoized components for performance
 * - Proper TypeScript interfaces
 * - Clear component hierarchy
 * - Error boundary ready
 * - Integrated product creation functionality
 */
export const AdvancedProductsDashboard = () => {
  const {
    // Data
    allProducts,
    totalProducts,
    hasActiveFilters,
    activeFiltersCount,
    availableAttributesCount,
    availableAttributes,
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
    handleClearFilters,
    handleExport,
    handleShare,
    handleSettings,
    handleRetry,
    handleCreateProduct,
    handleProductCreated,
  } = useDashboardLogic();

  // Early return for error state
  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} className='min-h-[400px]' />;
  }

  return (
    <div className='space-y-6'>
      {/* Header with Stats */}
      <HeaderCard
        totalProducts={totalProducts}
        availableAttributes={availableAttributesCount}
        activeFiltersCount={activeFiltersCount}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        onShare={handleShare}
        onSettings={handleSettings}
        onCreateProduct={handleCreateProduct}
      />

      {/* Advanced Filter Controls */}
      <AdvancedFilters
        onFiltersChange={handleFiltersChange}
        availableAttributes={availableAttributes}
        isDisabled={isLoading}
        className='bg-card'
      />

      <Separator />

      {/* Data Table */}
      <DataTableCard
        data={allProducts}
        totalProducts={totalProducts}
        hasActiveFilters={hasActiveFilters}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />

      {/* Create Product Dialog */}
      <CreateProductDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onProductCreated={handleProductCreated}
      />
    </div>
  );
};
