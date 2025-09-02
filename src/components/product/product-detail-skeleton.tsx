import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for product detail page
 */
export function ProductDetailSkeleton() {
  return (
    <div className='container mx-auto p-6 space-y-6'>
      {/* Header Skeleton */}
      <div className='flex items-center gap-4'>
        <Skeleton className='h-10 w-10' />
        <div className='space-y-2 flex-1'>
          <Skeleton className='h-8 w-48' />
          <div className='flex gap-2'>
            <Skeleton className='h-6 w-16' />
            <Skeleton className='h-6 w-20' />
          </div>
        </div>
      </div>

      {/* Bento Grid Skeleton */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        <div className='lg:col-span-8 space-y-6'>
          <Skeleton className='h-48 w-full' />
          <Skeleton className='h-64 w-full' />
        </div>
        <div className='lg:col-span-4 space-y-6'>
          <Skeleton className='h-32 w-full' />
          <Skeleton className='h-48 w-full' />
          <Skeleton className='h-40 w-full' />
          <Skeleton className='h-32 w-full' />
        </div>
      </div>
    </div>
  );
}
