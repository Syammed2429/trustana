"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = memo(function ErrorState({
  error,
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex items-center justify-center h-64 text-center ${className}`}
    >
      <div className='flex flex-col items-center gap-4 max-w-md'>
        <div className='flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10'>
          <AlertTriangle className='h-8 w-8 text-destructive' />
        </div>

        <div className='space-y-2'>
          <h3 className='text-lg font-semibold text-destructive'>
            Error Loading Products
          </h3>
          <p className='text-sm text-muted-foreground'>
            {error.message ||
              "Something went wrong while fetching the product data."}
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
