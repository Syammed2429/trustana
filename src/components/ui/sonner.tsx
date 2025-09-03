'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      style={
        {
          '--normal-bg': 'hsl(var(--background))',
          '--normal-text': 'hsl(var(--foreground))',
          '--normal-border': 'hsl(var(--border))',
          '--success-bg': 'hsl(var(--background))',
          '--success-text': 'hsl(var(--foreground))',
          '--success-border': 'hsl(142.1 76.2% 36.3%)',
          '--error-bg': 'hsl(var(--background))',
          '--error-text': 'hsl(var(--foreground))',
          '--error-border': 'hsl(var(--destructive))',
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
          fontSize: '14px',
          fontWeight: '500',
        },
        className:
          'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
        descriptionClassName: 'group-[.toast]:text-muted-foreground',
      }}
      {...props}
    />
  );
};

export { Toaster };
