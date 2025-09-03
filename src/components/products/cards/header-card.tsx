'use client';

import { FC, memo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DashboardHeader } from '../dashboard/dashboard-header';
import { DashboardStats } from '../dashboard/dashboard-stats';

interface HeaderCardProps {
  totalProducts: number;
  availableAttributes: number;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onCreateProduct?: () => void;
  className?: string;
}

export const HeaderCard: FC<HeaderCardProps> = memo(function HeaderCard({
  totalProducts,
  availableAttributes,
  activeFiltersCount,
  hasActiveFilters,
  onClearFilters,
  onCreateProduct,
  className = '',
}) {
  return (
    <Card className={className}>
      <CardHeader className='px-3'>
        <DashboardHeader onCreateProduct={onCreateProduct} />
      </CardHeader>
      <CardContent className='px-3'>
        <DashboardStats
          totalProducts={totalProducts}
          availableAttributes={availableAttributes}
          activeFiltersCount={activeFiltersCount}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
        />
      </CardContent>
    </Card>
  );
});
