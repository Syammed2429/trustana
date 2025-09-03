import { memo } from 'react';
import { Table as TanStackTable, flexRender } from '@tanstack/react-table';
import { TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Product } from '@/app/types/product';
import { ColumnMeta } from '../types';

interface TableHeaderComponentProps {
  table: TanStackTable<Product>;
}

export const TableHeaderComponent = memo<TableHeaderComponentProps>(({ table }) => {
  return (
    <TableHeader className='bg-muted sticky top-0 z-30'>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const meta = header.column.columnDef.meta as ColumnMeta;
            const isHorizontalSticky = meta?.sticky === 'left';
            const stickyLeft = meta?.stickyLeft || 0;

            return (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                style={{
                  width: header.getSize(),
                  ...(isHorizontalSticky
                    ? {
                        position: 'sticky',
                        left: `${stickyLeft}px`,
                        zIndex: 31,
                      }
                    : {}),
                }}
                className={`${isHorizontalSticky ? '' : ''} ${meta?.className || ''} overflow-hidden px-2 py-3 text-left align-top`}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
});

TableHeaderComponent.displayName = 'TableHeaderComponent';
