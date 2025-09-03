import { memo } from 'react';
import { motion } from 'motion/react';
import {
  cardVariants,
  headerVariants,
  iconSpinVariants,
  fadeInLeftVariants,
  listItemVariants,
} from '@/lib/animation-variants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { ADVANCED_FEATURES, PAGE_CONFIG } from '@/utils/home';

interface AdvancedFeaturesCardProps {
  className?: string;
}

/**
 * Advanced features card component
 * Displays detailed feature lists for technical users
 */
const AdvancedFeaturesCard = memo<AdvancedFeaturesCardProps>(({ className = '' }) => {
  return (
    <motion.div variants={cardVariants} initial='hidden' animate='visible' whileHover='hover'>
      <Card className={className}>
        <CardHeader>
          <motion.div variants={headerVariants}>
            <CardTitle className='flex items-center gap-2'>
              <motion.div variants={iconSpinVariants} whileHover='hover'>
                <Zap className='h-5 w-5' />
              </motion.div>
              {PAGE_CONFIG.advancedFeaturesTitle}
            </CardTitle>
            <CardDescription>{PAGE_CONFIG.advancedFeaturesDescription}</CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div
            className='grid grid-cols-1 gap-4 md:grid-cols-2'
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {ADVANCED_FEATURES.map((feature, index) => (
              <motion.div
                key={`advanced-feature-${index}`}
                className='space-y-3'
                variants={fadeInLeftVariants}
                whileHover='hover'
                style={{
                  perspective: '1000px',
                }}
              >
                <motion.h4
                  className='font-medium'
                  initial={{ opacity: 0, y: -5 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: index * 0.1,
                      type: 'spring' as const,
                      stiffness: 300,
                      damping: 30,
                    },
                  }}
                >
                  {feature.title}
                </motion.h4>
                <motion.ul
                  className='text-muted-foreground space-y-1 text-sm'
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.03,
                      },
                    },
                  }}
                >
                  {feature.items.map((item, itemIndex) => (
                    <motion.li
                      key={`${feature.title}-item-${itemIndex}`}
                      variants={listItemVariants}
                      whileHover='hover'
                      className='cursor-default'
                    >
                      • {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

AdvancedFeaturesCard.displayName = 'AdvancedFeaturesCard';

export { AdvancedFeaturesCard };
