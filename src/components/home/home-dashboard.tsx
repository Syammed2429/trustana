"use client";

import { memo } from "react";
import {
  HeroSection,
  FeatureCardsGrid,
  AdvancedFeaturesCard,
  DemoLinks,
  ApiExamplesCard,
} from "./components";

interface HomeDashboardProps {
  className?: string;
}

/**
 * Main home dashboard component
 * Orchestrates all home page sections with optimal layout
 */
const HomeDashboard = memo<HomeDashboardProps>(({ className = "" }) => {
  return (
    <div className={`container mx-auto p-8 ${className}`}>
      <div className="space-y-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Feature Cards Grid */}
        <FeatureCardsGrid />

        {/* Advanced Features */}
        <AdvancedFeaturesCard />

        {/* Demo Navigation Links */}
        <DemoLinks />

        {/* API Examples */}
        <ApiExamplesCard />
      </div>
    </div>
  );
});

HomeDashboard.displayName = "HomeDashboard";

export { HomeDashboard };
