"use client";

import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SimpleDataTable } from "@/components/advanced-data-table";
import { Product } from "@/app/types/product";

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

export const DataTableCard = memo(function DataTableCard({
  data,
  totalProducts,
  hasActiveFilters,
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  className = "",
}: DataTableCardProps) {
  const getDescription = () => {
    if (isLoading) return "Loading products...";

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
        <SimpleDataTable
          data={data}
          hasNextPage={hasNextPage ?? false}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
});
