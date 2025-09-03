'use client';

import { memo } from 'react';
import { motion } from 'motion/react';
import {
  cardVariants as sharedCardVariants,
  fadeInLeftVariants,
  rotateYVariants,
  headerVariants,
} from '@/lib/animation-variants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { API_EXAMPLES, PAGE_CONFIG, formatCodeExample } from '@/utils/home';

interface ApiExamplesCardProps {
  className?: string;
}

/**
 * API examples card component
 * Displays code examples with syntax highlighting
 */
const ApiExamplesCard = memo<ApiExamplesCardProps>(({ className = '' }) => {
  return (
    <motion.div variants={sharedCardVariants} initial='hidden' animate='visible' whileHover='hover'>
      <Card className={className}>
        <CardHeader>
          <motion.div variants={headerVariants}>
            <CardTitle>{PAGE_CONFIG.apiExamplesTitle}</CardTitle>
            <CardDescription>{PAGE_CONFIG.apiExamplesDescription}</CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div
            className='space-y-4'
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {API_EXAMPLES.map((example, index) => (
              <motion.div
                key={`api-example-${index}`}
                variants={fadeInLeftVariants}
                whileHover={{
                  x: 5,
                  transition: {
                    type: 'spring' as const,
                    stiffness: 400,
                    damping: 30,
                  },
                }}
              >
                <motion.h4
                  className='mb-2 font-medium'
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { delay: index * 0.1 },
                  }}
                >
                  {example.title}
                </motion.h4>
                <motion.p
                  className='text-muted-foreground mb-2 text-sm'
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { delay: index * 0.1 + 0.05 },
                  }}
                >
                  {example.description}
                </motion.p>
                <motion.code
                  className='bg-muted block rounded p-3 text-sm whitespace-pre-wrap'
                  variants={rotateYVariants}
                  whileHover='hover'
                  style={{
                    perspective: '1000px',
                  }}
                >
                  {formatCodeExample(example.code)}
                </motion.code>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

ApiExamplesCard.displayName = 'ApiExamplesCard';

export { ApiExamplesCard };
