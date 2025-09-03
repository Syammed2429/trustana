'use client';

import { FC, memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/app/types/product';
import { ModularDataTable } from '@/components/data-table/ModularDataTable';

interface DataTableCardProps {
  data: Product[];
  totalProducts: number;
  hasActiveFilters: boolean;
  isLoading: boolean;
  hasNextPage?: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  className?: string;
}

export const DataTableCard: FC<DataTableCardProps> = memo(function DataTableCard({
  data,
  totalProducts,
  hasActiveFilters,
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  className = '',
}) {
  const getDescription = () => {
    if (isLoading) return 'Loading products...';

    const baseText = `Showing ${totalProducts.toLocaleString()} products`;
    return hasActiveFilters ? `${baseText} (filtered)` : baseText;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='text-lg'>Product Data</CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        <ModularDataTable
          data={data}
          hasNextPage={hasNextPage ?? false}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          showColumnCustomization={true}
        />
      </CardContent>
    </Card>
  );
});
