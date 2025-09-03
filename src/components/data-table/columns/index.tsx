import { ColumnDef } from '@tanstack/react-table';
import { Product } from '@/app/types/product';
import { ColumnMeta } from '../types';
import { AttributeCell } from '../cells/AttributeCell';
import { formatAttributeHeader } from '@/utils/attribute-formatting';

export const createProductIdColumn = (): ColumnDef<Product> => ({
  accessorKey: 'id',
  header: 'Product ID',
  enableHiding: false,
  size: 340,
  minSize: 340,
  cell: ({ row }) => (
    <div
      className='overflow-wrap-anywhere max-w-full overflow-hidden font-mono text-sm break-all hyphens-auto'
      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
    >
      {row.getValue('id')}
    </div>
  ),
  meta: {
    sticky: 'left',
    stickyLeft: 0, // First column now
    className: 'bg-background border-r border-border font-medium',
  } as ColumnMeta,
});

export const createSkuIdColumn = (): ColumnDef<Product> => ({
  accessorKey: 'skuId',
  header: 'SKU ID',
  size: 160,
  minSize: 140,
  cell: ({ row }) => (
    <div
      className='overflow-wrap-anywhere max-w-full overflow-hidden font-mono text-sm break-all hyphens-auto'
      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
    >
      {row.getValue('skuId')}
    </div>
  ),
});

export const createAttributeColumns = (attributes: string[]): ColumnDef<Product>[] => {
  return attributes.slice(0, 8).map((attr) => ({
    id: attr,
    header: () => (
      <div className='flex h-full w-full min-w-0 items-start py-1'>
        <div className='w-full text-left text-sm font-medium'>{formatAttributeHeader(attr)}</div>
      </div>
    ),
    cell: ({ row }) => {
      const attributeObj = row.original.attributes?.find((a) => a.key === attr);
      const value = attributeObj?.value;
      return <AttributeCell value={value} attr={attr} />;
    },
    size: 200,
    minSize: 150,
    enableSorting: true,
    enableColumnFilter: true,
  }));
};

export const createProductColumns = (attributes: string[]): ColumnDef<Product>[] => {
  return [createProductIdColumn(), createSkuIdColumn(), ...createAttributeColumns(attributes)];
};
