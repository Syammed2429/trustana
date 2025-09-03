'use client';

import { FC } from 'react';
import { ModularDataTable } from './data-table';
import { Product } from '@/app/types/product';

interface SimpleDataTableProps {
  data: Product[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  isLoading: boolean;
}

/**
 * Advanced Data Table Component
 *
 * This is a wrapper around the ModularDataTable that maintains backward compatibility.
 * The actual implementation is now broken down into modular, reusable components.
 *
 * Architecture Benefits:
 * - Separation of concerns
 * - Better testability
 * - Reusable components
 * - Easier maintenance
 * - Performance optimizations through memoization
 */
export const SimpleDataTable: FC<SimpleDataTableProps> = (props) => {
  return <ModularDataTable {...props} />;
};
