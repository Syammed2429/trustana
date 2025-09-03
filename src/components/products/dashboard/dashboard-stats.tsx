"use client";

import { FC, memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardStatsProps {
  totalProducts: number;
  availableAttributes: number;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  className?: string;
}

export const DashboardStats: FC<DashboardStatsProps> = memo(
  function DashboardStats({
    totalProducts,
    availableAttributes,
    activeFiltersCount,
    hasActiveFilters,
    onClearFilters,
    className = "",
  }) {
    return (
      <div className={`flex items-center gap-6 flex-wrap ${className}`}>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>Total Products:</span>
          <Badge variant='secondary' className='font-mono text-sm'>
            {totalProducts.toLocaleString()}
          </Badge>
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>
            Available Attributes:
          </span>
          <Badge variant='outline' className='font-mono text-sm'>
            {availableAttributes}
          </Badge>
        </div>

        {hasActiveFilters && (
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>
              Active Filters:
            </span>
            <Badge variant='default' className='text-sm'>
              {activeFiltersCount}
            </Badge>
            <Button
              variant='outline'
              size='sm'
              onClick={onClearFilters}
              className='h-6 px-2 text-xs'
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
    );
  }
);
