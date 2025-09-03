'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import { Product } from '@/app/types/product';
import { TableStates, TableActions } from '../types';
import { createProductColumns } from '../columns';

interface UseDataTableProps {
  data: Product[];
}

export const useDataTable = ({ data }: UseDataTableProps) => {
  // Table states
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [columnFilters, setColumnFilters] = useState<Array<{ id: string; value: unknown }>>([]);
  const [sorting, setSorting] = useState<Array<{ id: string; desc: boolean }>>([]);

  // Extract attributes from data
  const allAttributes = useMemo(() => {
    const attributeSet = new Set<string>();
    data.forEach((product) => {
      if (product.attributes && Array.isArray(product.attributes)) {
        product.attributes.forEach((attr) => {
          if (attr.key) {
            attributeSet.add(attr.key);
          }
        });
      }
    });
    return Array.from(attributeSet);
  }, [data]);

  // Create columns
  const columns = useMemo(() => createProductColumns(allAttributes), [allAttributes]);

  // Memoized callbacks
  const handleRowSelectionChange = useCallback(
    (updater: React.SetStateAction<Record<string, boolean>>) => {
      setRowSelection(updater);
    },
    []
  );

  const handleSortingChange = useCallback(
    (updater: React.SetStateAction<Array<{ id: string; desc: boolean }>>) => {
      setSorting(updater);
    },
    []
  );

  const handleColumnFiltersChange = useCallback(
    (updater: React.SetStateAction<Array<{ id: string; value: unknown }>>) => {
      setColumnFilters(updater);
    },
    []
  );

  const handleColumnVisibilityChange = useCallback(
    (updater: React.SetStateAction<Record<string, boolean>>) => {
      setColumnVisibility(updater);
    },
    []
  );

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: handleRowSelectionChange,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const states: TableStates = {
    rowSelection,
    columnVisibility,
    columnFilters,
    sorting,
  };

  const actions: TableActions = {
    setRowSelection: handleRowSelectionChange,
    setColumnVisibility: handleColumnVisibilityChange,
    setColumnFilters: handleColumnFiltersChange,
    setSorting: handleSortingChange,
  };

  return {
    table,
    columns,
    states,
    actions,
    allAttributes,
  };
};
