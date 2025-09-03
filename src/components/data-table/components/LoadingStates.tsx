import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { IconLoader } from '@tabler/icons-react';

interface LoadingStateProps {
  type: 'initial' | 'infinite' | 'fetching';
  message?: string;
}

export const LoadingState = memo<LoadingStateProps>(({ type, message }) => {
  switch (type) {
    case 'initial':
      return (
        <div className='flex h-64 items-center justify-center'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <p className='text-muted-foreground text-sm'>{message || 'Loading products...'}</p>
          </div>
        </div>
      );

    case 'infinite':
      return (
        <div className='flex items-center justify-center p-4'>
          <div className='flex items-center gap-2'>
            <IconLoader className='h-4 w-4 animate-spin' />
            <span className='text-muted-foreground text-sm'>
              {message || 'Loading more products...'}
            </span>
          </div>
        </div>
      );

    case 'fetching':
      return (
        <div className='bg-muted/20 flex items-center justify-center border-t p-2'>
          <div className='flex items-center gap-2'>
            <Loader2 className='h-3 w-3 animate-spin' />
            <span className='text-muted-foreground text-xs'>{message || 'Fetching more...'}</span>
          </div>
        </div>
      );

    default:
      return null;
  }
});

LoadingState.displayName = 'LoadingState';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState = memo<EmptyStateProps>(
  ({
    title = 'No products found',
    description = 'Try adjusting your search or filter criteria',
  }) => {
    return (
      <div className='flex h-64 items-center justify-center text-center'>
        <div className='flex flex-col items-center gap-2'>
          <p className='text-lg font-medium'>{title}</p>
          <p className='text-muted-foreground text-sm'>{description}</p>
        </div>
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
