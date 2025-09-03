'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DEMO_LINKS, getDemoLinkProps } from '@/utils/home';

interface DemoLinksProps {
  className?: string;
}

/**
 * Demo links component
 * Navigation buttons to different dashboard views
 */
const DemoLinks = memo<DemoLinksProps>(({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 sm:flex-row ${className}`}>
      {DEMO_LINKS.map((demo) => {
        const Icon = demo.icon;
        const linkProps = getDemoLinkProps(demo);

        return (
          <Link key={demo.id} href={demo.href} {...linkProps}>
            <Button size='lg' variant={demo.variant} className='gap-2'>
              <Icon className='h-4 w-4' />
              {demo.title}
            </Button>
          </Link>
        );
      })}
    </div>
  );
});

DemoLinks.displayName = 'DemoLinks';

export { DemoLinks };
