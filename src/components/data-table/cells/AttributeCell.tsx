import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { RichContentRenderer } from '@/components/rich-content-renderer';
import { isMediaOrSpecialField } from '@/utils/attribute-formatting';

interface AttributeCellProps {
  value: unknown;
  attr: string;
}

export const AttributeCell = memo<AttributeCellProps>(({ value, attr }) => {
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
                  <span className='text-muted-foreground ml-1 flex-shrink-0 text-xs'>more</span>
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
                <RichContentRenderer content={value} maxLength={-1} allowWrap={true} className='' />
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
  }

  // Handle other types...
  if (Array.isArray(value)) {
    return <ArrayCell items={value} />;
  }

  if (typeof value === 'object') {
    return <span className='text-muted-foreground text-xs'>[Object]</span>;
  }

  return (
    <span
      className='overflow-wrap-anywhere inline-block max-w-full overflow-hidden text-sm break-all hyphens-auto'
      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
    >
      {String(value)}
    </span>
  );
});

AttributeCell.displayName = 'AttributeCell';

// Separate component for array values
const ArrayCell = memo<{ items: unknown[] }>(({ items }) => {
  const displayItems = items.slice(0, 3);
  const hasMore = items.length > displayItems.length;

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
                {String(item).length > 15 ? `${String(item).substring(0, 15)}...` : String(item)}
              </span>
            ))}
            {hasMore && (
              <span className='text-muted-foreground self-center text-xs'>
                +{items.length - displayItems.length} more
              </span>
            )}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent className='max-w-md'>
        <div className='space-y-2'>
          <div className='text-sm font-medium'>All Items ({items.length})</div>
          <div className='space-y-1'>
            {items.map((item, idx) => (
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
});

ArrayCell.displayName = 'ArrayCell';
