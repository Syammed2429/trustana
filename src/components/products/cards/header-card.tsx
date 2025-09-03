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
  onExport?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
  onCreateProduct?: () => void;
  className?: string;
}

export const HeaderCard: FC<HeaderCardProps> = memo(function HeaderCard({
  totalProducts,
  availableAttributes,
  activeFiltersCount,
  hasActiveFilters,
  onClearFilters,
  onExport,
  onShare,
  onSettings,
  onCreateProduct,
  className = '',
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <DashboardHeader
          onExport={onExport}
          onShare={onShare}
          onSettings={onSettings}
          onCreateProduct={onCreateProduct}
        />
      </CardHeader>
      <CardContent>
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
