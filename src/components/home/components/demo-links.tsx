'use client';

import { memo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { containerVariants, scaleUpVariants } from '@/lib/animation-variants';
import { Button } from '@/components/ui/button';
import { DEMO_LINKS, getDemoLinkProps } from '@/utils/home';

interface DemoLinksProps {
  className?: string;
}

/**
 * Demo links component with Motion animations
 * Navigation buttons to different dashboard views with engaging hover effects
 */
const DemoLinks = memo<DemoLinksProps>(({ className = '' }) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center gap-4 sm:flex-row ${className}`}
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      {DEMO_LINKS.map((demo) => {
        const Icon = demo.icon;
        const linkProps = getDemoLinkProps(demo);

        return (
          <motion.div
            key={demo.id}
            variants={scaleUpVariants}
            whileHover={{
              scale: 1.05,
              y: -2,
              transition: {
                type: 'spring' as const,
                stiffness: 400,
                damping: 25,
              },
            }}
            whileTap={{
              scale: 0.95,
              transition: { duration: 0.1 },
            }}
          >
            <Link href={demo.href} {...linkProps}>
              <Button
                size='lg'
                variant={demo.variant}
                className='gap-2 transition-all duration-200'
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{
                    rotate: 360,
                    transition: { duration: 0.3 },
                  }}
                >
                  <Icon className='h-4 w-4' />
                </motion.div>
                <motion.span
                  initial={{ opacity: 1 }}
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.2 },
                  }}
                >
                  {demo.title}
                </motion.span>
              </Button>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
});

DemoLinks.displayName = 'DemoLinks';

export { DemoLinks };
