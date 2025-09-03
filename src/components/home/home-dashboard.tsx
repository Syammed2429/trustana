'use client';

import { memo } from 'react';
import { motion } from 'motion/react';
import { containerVariants, sectionVariants } from '@/lib/animation-variants';
import {
  HeroSection,
  FeatureCardsGrid,
  AdvancedFeaturesCard,
  DemoLinks,
  ApiExamplesCard,
} from './components';

interface HomeDashboardProps {
  className?: string;
}

/**
 * Main home dashboard component with Motion animations
 * Orchestrates all home page sections with optimal layout and smooth transitions
 */
const HomeDashboard = memo<HomeDashboardProps>(({ className = '' }) => {
  return (
    <motion.div
      className={`container mx-auto p-8 ${className}`}
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <motion.div className='space-y-8' variants={containerVariants}>
        {/* Hero Section */}
        <motion.div variants={sectionVariants}>
          <HeroSection />
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div variants={sectionVariants}>
          <FeatureCardsGrid />
        </motion.div>

        {/* Advanced Features */}
        <motion.div variants={sectionVariants}>
          <AdvancedFeaturesCard />
        </motion.div>

        {/* Demo Navigation Links */}
        <motion.div variants={sectionVariants}>
          <DemoLinks />
        </motion.div>

        {/* API Examples */}
        <motion.div variants={sectionVariants}>
          <ApiExamplesCard />
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

HomeDashboard.displayName = 'HomeDashboard';

export { HomeDashboard };
