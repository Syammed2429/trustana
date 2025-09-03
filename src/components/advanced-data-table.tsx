'use client';

import { IconLoader } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Product } from '@/app/types/product';
import { ColumnCustomization } from '@/components/column-customization';
import { RichContentRenderer } from '@/components/rich-content-renderer';
import { formatAttributeHeader, isMediaOrSpecialField } from '@/utils/attribute-formatting';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader2 } from 'lucide-react';
import { FC, MouseEvent, useEffect, useMemo, useState } from 'react';

interface ColumnMeta {
  sticky?: 'left';
  stickyLeft?: number;
  className?: string;
}

const createProductColumns = (attributes: string[]): ColumnDef<Product>[] => {
  const columns: ColumnDef<Product>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className='flex items-center justify-center'>
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
            aria-label='Select all'
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className='flex items-center justify-center'>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
            aria-label='Select row'
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
      meta: {
        sticky: 'left',
        stickyLeft: 0,
        className: 'bg-background border-r border-border',
      },
    },
    {
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
        stickyLeft: 40, // After checkbox width
        className: 'bg-background border-r border-border font-medium',
      },
    },
    {
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
    },
  ];

  const attributeColumns: ColumnDef<Product>[] = attributes.slice(0, 8).map((attr) => {
    return {
      id: attr,
      header: () => (
        <div className='flex h-full w-full min-w-0 items-start py-1'>
          <div className='w-full text-left text-sm font-medium'>{formatAttributeHeader(attr)}</div>
        </div>
      ),
      cell: ({ row }) => {
        const attributeObj = row.original.attributes?.find((a) => a.key === attr);
        const value = attributeObj?.value;

        if (value === null || value === undefined) {
          return <span className='text-muted-foreground'>—</span>;
        }

        // Handle different value types
        if (typeof value === 'string') {
          const isMediaOrSpecial = isMediaOrSpecialField(attr);

          // Special handling for _basicInfoRtfTestLoop field
          if (attr === '_basicInfoRtfTestLoop') {
            return (
              <div className='w-full max-w-full overflow-hidden'>
                <RichContentRenderer
                  content={value}
                  showElementsLimit={3}
                  allowWrap={true}
                  className='w-full max-w-full min-w-0 break-words'
                />
              </div>
            );
          }

          if (isMediaOrSpecial) {
            // Handle media and special fields with tooltip and truncation
            const maxLength = 50;
            const hasMore = value.length > maxLength;

            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='w-full max-w-full cursor-help overflow-hidden'>
                    <div className='flex min-w-0 items-center'>
                      <div className='min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap'>
                        <RichContentRenderer
                          content={value}
                          maxLength={maxLength}
                          allowWrap={false}
                          className='inline'
                        />
                      </div>
                      {hasMore && (
                        <span className='text-muted-foreground ml-1 flex-shrink-0 text-xs'>
                          more
                        </span>
                      )}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className='max-w-md'>
                  <div className='space-y-2'>
                    <div className='text-sm font-medium'>Full Content</div>
                    <div
                      className='rounded bg-gray-50 p-2 text-xs'
                      style={{
                        wordBreak: 'break-all',
                        overflowWrap: 'anywhere',
                        hyphens: 'auto',
                        whiteSpace: 'normal',
                      }}
                    >
                      <RichContentRenderer
                        content={value}
                        maxLength={-1}
                        allowWrap={true}
                        className=''
                      />
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          }

          // Handle regular text fields with wrapping
          return (
            <div className='w-full max-w-full min-w-0 overflow-hidden'>
              <RichContentRenderer
                content={value}
                maxLength={-1}
                allowWrap={true}
                className='word-break-break-all w-full max-w-full min-w-0 break-words'
              />
            </div>
          );
        } else if (Array.isArray(value)) {
          // Show only 3 items for all arrays, then "+X more" with tooltip
          const displayItems = value.slice(0, 3);
          const hasMore = value.length > displayItems.length;

          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='cursor-help text-sm'>
                  <div className='flex flex-wrap gap-1'>
                    {displayItems.map((item, idx) => (
                      <span
                        key={idx}
                        className='inline-flex rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-800'
                      >
                        {String(item).length > 15
                          ? `${String(item).substring(0, 15)}...`
                          : String(item)}
                      </span>
                    ))}
                    {hasMore && (
                      <span className='text-muted-foreground self-center text-xs'>
                        +{value.length - displayItems.length} more
                      </span>
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className='max-w-md'>
                <div
                  className='space-y-2'
                  style={{
                    wordBreak: 'break-all',
                    overflowWrap: 'anywhere',
                    hyphens: 'auto',
                  }}
                >
                  <div
                    className='text-sm font-medium'
                    style={{
                      wordBreak: 'break-all',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    All Items ({value.length})
                  </div>
                  <div className='space-y-1'>
                    {value.map((item, idx) => (
                      <div
                        key={idx}
                        className='rounded bg-gray-50 p-1 text-xs'
                        style={{
                          wordBreak: 'break-all',
                          overflowWrap: 'anywhere',
                          hyphens: 'auto',
                          whiteSpace: 'normal',
                        }}
                      >
                        {String(item)}
                      </div>
                    ))}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        } else if (typeof value === 'string' && (value as string).includes('<')) {
          // Helper function to parse HTML into meaningful elements
          const parseHtmlElements = (htmlString: string) => {
            if (!htmlString || typeof htmlString !== 'string') return [];

            // First, try to match block-level elements like <p>, <div>, <li>, etc.
            const blockElements =
              htmlString.match(/<(p|div|li|h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi) || [];

            const parsedElements = blockElements
              .map((match) => {
                // Remove HTML tags and clean up content
                const content = match
                  .replace(/<[^>]+>/g, '') // Remove all HTML tags
                  .replace(/\s+/g, ' ') // Normalize whitespace
                  .trim();
                return content;
              })
              .filter((content) => content && content.length > 0);

            // If no block elements found, try to split by common patterns
            if (parsedElements.length === 0) {
              // Try splitting by line breaks or other patterns
              const lines = htmlString
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<[^>]+>/g, '')
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line.length > 0);
              return lines;
            }

            return parsedElements;
          };

          // For HTML strings, try to parse elements and treat like arrays
          const htmlElements = parseHtmlElements(value);

          if (htmlElements.length > 3) {
            const displayItems = htmlElements.slice(0, 3);
            const remainingCount = htmlElements.length - 3;

            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='cursor-help text-sm'>
                    <div className='flex flex-wrap gap-1'>
                      {displayItems.map((item, idx) => (
                        <span
                          key={idx}
                          className='inline-flex rounded border border-blue-200 bg-blue-100 px-2 py-1 text-xs text-blue-800'
                        >
                          {item.length > 15 ? `${item.substring(0, 15)}...` : item}
                        </span>
                      ))}
                      <span className='text-muted-foreground self-center text-xs'>
                        +{remainingCount} more
                      </span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className='max-w-md'>
                  <div
                    className='space-y-2'
                    style={{
                      wordBreak: 'break-all',
                      overflowWrap: 'anywhere',
                      hyphens: 'auto',
                    }}
                  >
                    <div
                      className='text-sm font-medium'
                      style={{
                        wordBreak: 'break-all',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      Parsed Elements ({htmlElements.length})
                    </div>
                    <div className='space-y-1'>
                      {htmlElements.map((item, idx) => (
                        <div
                          key={idx}
                          className='rounded bg-gray-50 p-1 text-xs'
                          style={{
                            wordBreak: 'break-all',
                            overflowWrap: 'anywhere',
                            hyphens: 'auto',
                            whiteSpace: 'normal',
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          } else if (htmlElements.length > 0) {
            // Show all parsed elements if 3 or fewer
            return (
              <div className='flex flex-wrap gap-1'>
                {htmlElements.map((item, idx) => (
                  <span
                    key={idx}
                    className='inline-flex rounded border border-blue-200 bg-blue-100 px-2 py-1 text-xs text-blue-800'
                  >
                    {item.length > 15 ? `${item.substring(0, 15)}...` : item}
                  </span>
                ))}
              </div>
            );
          }
          // If HTML parsing doesn't yield meaningful elements, fall through to regular string handling
        } else if (typeof value === 'object') {
          return <span className='text-muted-foreground text-xs'>[Object]</span>;
        } else {
          return (
            <span
              className='overflow-wrap-anywhere inline-block max-w-full overflow-hidden text-sm break-all hyphens-auto'
              style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
            >
              {String(value)}
            </span>
          );
        }
      },
      size: 260,
      minSize: 220,
      maxSize: 380,
    };
  });

  return [...columns, ...attributeColumns];
};

const SimpleRow: FC<{ row: Row<Product> }> = ({ row }) => {
  const router = useRouter();

  const handleRowClick = (e: MouseEvent) => {
    // Don't navigate if clicking on checkbox or other interactive elements
    if ((e.target as HTMLElement).closest('input[type="checkbox"]')) {
      return;
    }

    // Navigate to product detail page
    router.push(`/product/${row.original.id}`);
  };

  return (
    <TableRow
      data-testid='product-row'
      data-state={row.getIsSelected() && 'selected'}
      className='hover:bg-muted/50 relative cursor-pointer transition-colors'
      onClick={handleRowClick}
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
              minWidth: cell.column.getSize(),
              maxWidth: cell.column.getSize(),
              ...(isHorizontalSticky
                ? { position: 'sticky', left: `${stickyLeft}px`, zIndex: 20 }
                : {}),
            }}
            className={` ${isHorizontalSticky ? `` : ''} ${meta?.className || ''} px-3 py-3 align-top`}
          >
            {/* <div
              className='w-full min-w-0 max-w-full '
              style={{
                wordBreak: "break-all",
                overflowWrap: "anywhere",
                hyphens: "auto",
              }}
            > */}
            {/* <div className='w-full min-w-0 max-w-full break-words overflow-wrap-anywhere overflow-hidden'> */}
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

interface SimpleDataTableProps {
  data: Product[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  isLoading: boolean;
}

export const SimpleDataTable: FC<SimpleDataTableProps> = ({
  data: initialData,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  isLoading,
}) => {
  const [data, setData] = useState(() => initialData);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Update data when prop changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

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

  const columns = useMemo(() => createProductColumns(allAttributes), [allAttributes]);

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
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin' />
          <p className='text-muted-foreground text-sm'>Loading products...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className='flex h-64 items-center justify-center text-center'>
        <div className='flex flex-col items-center gap-2'>
          <p className='text-lg font-medium'>No products found</p>
          <p className='text-muted-foreground text-sm'>
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full flex-col justify-start gap-6'>
      <div className='mb-4 flex items-center justify-between px-4 lg:px-6'>
        <div className='flex items-center gap-2'>
          <h3 className='font-medium'>
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} product(s) selected
          </h3>
        </div>
        <div className='flex items-center gap-2'>
          <ColumnCustomization table={table} />
        </div>
      </div>

      <div className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'>
        <div className='overflow-hidden rounded-lg border'>
          <InfiniteScroll
            dataLength={data.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={
              <div className='flex items-center justify-center p-4'>
                <div className='flex items-center gap-2'>
                  <IconLoader className='h-4 w-4 animate-spin' />
                  <span className='text-muted-foreground text-sm'>Loading more products...</span>
                </div>
              </div>
            }
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
                            className={` ${isHorizontalSticky ? `` : ''} ${meta?.className || ''} overflow-hidden px-2 py-3 text-left align-top`}
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
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => <SimpleRow key={row.id} row={row} />)
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className='h-24 text-center'>
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </InfiniteScroll>

          {isFetchingNextPage && (
            <div className='bg-muted/20 flex items-center justify-center border-t p-2'>
              <div className='flex items-center gap-2'>
                <Loader2 className='h-3 w-3 animate-spin' />
                <span className='text-muted-foreground text-xs'>Fetching more...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
