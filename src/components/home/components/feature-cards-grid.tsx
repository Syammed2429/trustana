'use client';

import { memo } from 'react';
import { motion } from 'motion/react';
import { staggerContainerVariants, card3DVariants, badgeVariants } from '@/lib/animation-variants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FEATURE_CARDS, getFeatureCardProps, getGridClasses } from '@/utils/home';

interface FeatureCardsGridProps {
  className?: string;
}

// Custom badge container variant for staggered animation
const badgeContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.3,
    },
  },
};

/**
 * Feature cards grid component with Motion animations
 * Displays main platform features with icons and badges in an animated grid
 */
const FeatureCardsGrid = memo<FeatureCardsGridProps>(({ className = '' }) => {
  const gridClasses = getGridClasses(FEATURE_CARDS.length);

  return (
    <motion.div
      className={`grid ${gridClasses} gap-6 ${className}`}
      variants={staggerContainerVariants}
      initial='hidden'
      animate='visible'
    >
      {FEATURE_CARDS.map((feature) => {
        const Icon = feature.icon;
        const cardProps = getFeatureCardProps(feature);

        return (
          <motion.div
            key={feature.id}
            variants={card3DVariants}
            whileHover={{
              scale: 1.03,
              y: -5,
              rotateY: 2,
              transition: {
                type: 'spring' as const,
                stiffness: 300,
                damping: 20,
              },
            }}
            whileTap={{
              scale: 0.98,
              transition: { duration: 0.1 },
            }}
          >
            <Card
              {...cardProps}
              className='h-full cursor-pointer transition-shadow hover:shadow-lg'
            >
              <CardHeader>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring' as const,
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                >
                  <Icon className='text-primary h-8 w-8' />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <CardTitle>{feature.title}</CardTitle>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <CardDescription>{feature.description}</CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div
                  className='space-y-2'
                  variants={badgeContainerVariants}
                  initial='hidden'
                  animate='visible'
                >
                  {feature.badges.map((badge, index) => (
                    <motion.div
                      key={`${feature.id}-badge-${index}`}
                      variants={badgeVariants}
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Badge variant='secondary'>{badge}</Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
});

FeatureCardsGrid.displayName = 'FeatureCardsGrid';

export { FeatureCardsGrid };
