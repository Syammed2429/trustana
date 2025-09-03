"use client";

import {
  Component,
  ComponentType,
  ErrorInfo,
  ReactNode,
  useCallback,
} from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);

    // In a real application, you would send this to your error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo })
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

const DefaultErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  return (
    <div className='flex min-h-[400px] flex-col items-center justify-center p-8 text-center'>
      <div className='rounded-full bg-destructive/10 p-4 mb-4'>
        <AlertTriangle className='h-8 w-8 text-destructive' />
      </div>
      <h2 className='text-xl font-semibold mb-2'>Something went wrong</h2>
      <p className='text-muted-foreground mb-4 max-w-md'>
        An unexpected error occurred while loading the application. This has
        been logged and our team has been notified.
      </p>
      {error && (
        <details className='mb-4 text-sm text-muted-foreground'>
          <summary className='cursor-pointer hover:text-foreground'>
            Show error details
          </summary>
          <pre className='mt-2 p-2 bg-muted rounded text-left text-xs overflow-auto max-w-md'>
            {error.message}
            {error.stack}
          </pre>
        </details>
      )}
      <Button onClick={resetError} className='gap-2'>
        <RefreshCcw className='h-4 w-4' />
        Try again
      </Button>
    </div>
  );
};

// Hook for functional components
export const useErrorHandler = () => {
  return useCallback((error: Error, errorInfo?: { componentStack: string }) => {
    console.error("Error caught by handler:", error, errorInfo);
    // In a real application, you would send this to your error reporting service
  }, []);
};
