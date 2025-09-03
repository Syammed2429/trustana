'use client';

import { memo } from 'react';
import { PAGE_CONFIG } from '@/utils/home';

interface HeroSectionProps {
  className?: string;
}

/**
 * Hero section component with title and subtitle
 * Memoized for performance optimization
 */
const HeroSection = memo<HeroSectionProps>(({ className = '' }) => {
  return (
    <div className={`space-y-4 text-center ${className}`}>
      <h1 className='text-4xl font-bold tracking-tight'>{PAGE_CONFIG.title}</h1>
      <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>{PAGE_CONFIG.subtitle}</p>
    </div>
  );
});

HeroSection.displayName = 'HeroSection';

export { HeroSection };
