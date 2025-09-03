import { memo } from 'react';
import { Table as TanStackTable } from '@tanstack/react-table';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Product } from '@/app/types/product';
import { TableRowComponent } from './TableRow';

interface TableBodyComponentProps {
  table: TanStackTable<Product>;
  columnsLength: number;
}

export const TableBodyComponent = memo<TableBodyComponentProps>(({ table, columnsLength }) => {
  const rows = table.getRowModel().rows;

  if (!rows?.length) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columnsLength} className='h-24 text-center'>
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRowComponent key={row.id} row={row} />
      ))}
    </TableBody>
  );
});

TableBodyComponent.displayName = 'TableBodyComponent';
