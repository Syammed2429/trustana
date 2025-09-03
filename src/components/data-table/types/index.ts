import { Product } from '@/app/types/product';

export interface ColumnMeta {
  sticky?: 'left';
  stickyLeft?: number;
  className?: string;
}

export interface DataTableProps {
  data: Product[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  isLoading: boolean;
}

export interface TableStates {
  rowSelection: Record<string, boolean>;
  columnVisibility: Record<string, boolean>;
  columnFilters: Array<{ id: string; value: unknown }>;
  sorting: Array<{ id: string; desc: boolean }>;
}

export interface TableActions {
  setRowSelection: (updater: React.SetStateAction<Record<string, boolean>>) => void;
  setColumnVisibility: (updater: React.SetStateAction<Record<string, boolean>>) => void;
  setColumnFilters: (updater: React.SetStateAction<Array<{ id: string; value: unknown }>>) => void;
  setSorting: (updater: React.SetStateAction<Array<{ id: string; desc: boolean }>>) => void;
}
