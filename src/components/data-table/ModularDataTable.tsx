import { FC, useEffect, useState } from 'react';
import { Table } from '@/components/ui/table';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DataTableProps } from './types';
import { useDataTable } from './hooks/useDataTable';
import { TableHeaderComponent } from './components/TableHeader';
import { TableBodyComponent } from './components/TableBody';
import { LoadingState, EmptyState } from './components/LoadingStates';

export const ModularDataTable: FC<DataTableProps> = ({
  data: initialData,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  isLoading,
}) => {
  const [data, setData] = useState(() => initialData);

  // Update data when prop changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const { table, columns } = useDataTable({ data });

  // Loading state
  if (isLoading) {
    return <LoadingState type='initial' />;
  }

  // Empty state
  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className='w-full flex-col justify-start gap-6'>
      {/* Table Toolbar */}
      {/* <TableToolbar table={table} /> */}

      {/* Table Container */}
      <div className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'>
        <div className='overflow-hidden rounded-lg border'>
          <InfiniteScroll
            dataLength={data.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={<LoadingState type='infinite' />}
            endMessage={
              <div className='p-4 text-center'>
                <p className='text-muted-foreground text-sm'>
                  You have seen all {data.length} products
                </p>
              </div>
            }
            scrollableTarget='scrollableDiv'
          >
            <div id='scrollableDiv' style={{ height: '600px', overflow: 'auto' }}>
              <Table
                data-testid='products-table'
                className='w-full table-fixed border-separate border-spacing-0'
              >
                <TableHeaderComponent table={table} />
                <TableBodyComponent table={table} columnsLength={columns.length} />
              </Table>
            </div>
          </InfiniteScroll>

          {/* Fetching More Indicator */}
          {isFetchingNextPage && <LoadingState type='fetching' />}
        </div>
      </div>
    </div>
  );
};
