// Main exports for the modular data table
export { ModularDataTable } from './ModularDataTable';
export { useDataTable } from './hooks/useDataTable';

// Component exports
export { TableHeaderComponent } from './components/TableHeader';
export { TableBodyComponent } from './components/TableBody';
export { TableRowComponent } from './components/TableRow';
export { LoadingState, EmptyState } from './components/LoadingStates';

// Cell components
export { AttributeCell } from './cells/AttributeCell';

// Column definitions
export {
  createProductIdColumn,
  createSkuIdColumn,
  createAttributeColumns,
  createProductColumns,
} from './columns';

// Types
export type { DataTableProps, TableStates, TableActions, ColumnMeta } from './types';
