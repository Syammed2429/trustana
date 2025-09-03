'use client';

import { FC, memo } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: FC<ErrorStateProps> = memo(function ErrorState({
  error,
  onRetry,
  className = '',
}) {
  return (
    <div className={`flex h-64 items-center justify-center text-center ${className}`}>
      <div className='flex max-w-md flex-col items-center gap-4'>
        <div className='bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full'>
          <AlertTriangle className='text-destructive h-8 w-8' />
        </div>

        <div className='space-y-2'>
          <h3 className='text-destructive text-lg font-semibold'>Error Loading Products</h3>
          <p className='text-muted-foreground text-sm'>
            {error.message || 'Something went wrong while fetching the product data.'}
          </p>
        </div>

        <Button
          variant='outline'
          onClick={onRetry || (() => window.location.reload())}
          className='gap-2'
        >
          <RefreshCw className='h-4 w-4' />
          Try Again
        </Button>
      </div>
    </div>
  );
});
