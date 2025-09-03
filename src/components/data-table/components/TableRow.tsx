import { memo, useCallback } from 'react';
import { Row, flexRender } from '@tanstack/react-table';
import { TableRow, TableCell } from '@/components/ui/table';
import { Product } from '@/app/types/product';
import { ColumnMeta } from '../types';
import { useRouter } from '@bprogress/next/app';

interface TableRowComponentProps {
  row: Row<Product>;
}

export const TableRowComponent = memo<TableRowComponentProps>(({ row }) => {
  const router = useRouter();

  const handleProductClick = useCallback(
    (productId: string, event: React.MouseEvent) => {
      // Check if the click is on a checkbox or its container
      const target = event.target as HTMLElement;
      if (
        target.closest('[role="checkbox"]') ||
        target.closest('[data-slot="checkbox"]') ||
        target.closest('.checkbox-container')
      ) {
        return;
      }
      router.push(`/product/${productId}`);
    },
    [router]
  );

  return (
    <TableRow
      data-testid='product-row'
      data-state={row.getIsSelected() && 'selected'}
      className='hover:bg-muted/50 cursor-pointer transition-colors'
      onClick={(event) => handleProductClick(row.original.id, event)}
    >
      {row.getVisibleCells().map((cell) => {
        const meta = cell.column.columnDef.meta as ColumnMeta;
        const isHorizontalSticky = meta?.sticky === 'left';
        const stickyLeft = meta?.stickyLeft || 0;

        return (
          <TableCell
            key={cell.id}
            style={{
              width: cell.column.getSize(),
              ...(isHorizontalSticky
                ? {
                    position: 'sticky',
                    left: `${stickyLeft}px`,
                    zIndex: 1,
                  }
                : {}),
            }}
            className={`${meta?.className || ''} max-h-24 overflow-hidden px-2 py-2 align-top ${
              cell.column.id === 'select' ? 'cursor-auto' : ''
            }`}
            onClick={cell.column.id === 'select' ? (e) => e.stopPropagation() : undefined}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
});

TableRowComponent.displayName = 'TableRowComponent';
