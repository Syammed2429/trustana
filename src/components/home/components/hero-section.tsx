import { memo } from 'react';
import { motion } from 'motion/react';
import { containerVariants, fadeInUpVariants, heroTitleVariants } from '@/lib/animation-variants';
import { PAGE_CONFIG } from '@/utils/home';

interface HeroSectionProps {
  className?: string;
}

/**
 * Hero section component with title and subtitle
 * Enhanced with Motion animations for engaging entrance
 */
const HeroSection = memo<HeroSectionProps>(({ className = '' }) => {
  return (
    <motion.div
      className={`space-y-4 text-center ${className}`}
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <motion.h1
        className='text-4xl font-bold tracking-tight'
        variants={heroTitleVariants}
        whileHover={{
          scale: 1.02,
          transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
        }}
      >
        {PAGE_CONFIG.title}
      </motion.h1>
      <motion.p
        className='text-muted-foreground mx-auto max-w-2xl text-xl'
        variants={fadeInUpVariants}
        whileHover={{
          scale: 1.01,
          transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
        }}
      >
        {PAGE_CONFIG.subtitle}
      </motion.p>
    </motion.div>
  );
});

HeroSection.displayName = 'HeroSection';

export { HeroSection };
