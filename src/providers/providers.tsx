'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, ReactNode } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/next';
import { ProgressProvider } from '@bprogress/next/app';
import { WebVitals } from '@/components/web-vitals';

interface ProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false, // Prevent refetch on window focus
      refetchOnMount: false, // Prevent refetch on component mount if data exists
    },
  },
});

export const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ProgressProvider
        height='3.5px'
        color='#6a47ee'
        options={{ showSpinner: false }}
        shallowRouting
      >
        <TooltipProvider>{children}</TooltipProvider>
      </ProgressProvider>
      <Analytics />
      <Toaster />
      <WebVitals />
    </QueryClientProvider>
  );
};
