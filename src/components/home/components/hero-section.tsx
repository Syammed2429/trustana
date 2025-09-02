"use client";

import { memo } from "react";
import { PAGE_CONFIG } from "@/utils/home";

interface HeroSectionProps {
  className?: string;
}

/**
 * Hero section component with title and subtitle
 * Memoized for performance optimization
 */
const HeroSection = memo<HeroSectionProps>(({ className = "" }) => {
  return (
    <div className={`text-center space-y-4 ${className}`}>
      <h1 className="text-4xl font-bold tracking-tight">
        {PAGE_CONFIG.title}
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        {PAGE_CONFIG.subtitle}
      </p>
    </div>
  );
});

HeroSection.displayName = "HeroSection";

export { HeroSection };
