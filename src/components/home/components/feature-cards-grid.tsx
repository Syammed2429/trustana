'use client';

import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FEATURE_CARDS, getFeatureCardProps, getGridClasses } from '@/utils/home';

interface FeatureCardsGridProps {
  className?: string;
}

/**
 * Feature cards grid component
 * Displays main platform features with icons and badges
 */
const FeatureCardsGrid = memo<FeatureCardsGridProps>(({ className = '' }) => {
  const gridClasses = getGridClasses(FEATURE_CARDS.length);

  return (
    <div className={`grid ${gridClasses} gap-6 ${className}`}>
      {FEATURE_CARDS.map((feature) => {
        const Icon = feature.icon;
        const cardProps = getFeatureCardProps(feature);

        return (
          <Card key={feature.id} {...cardProps}>
            <CardHeader>
              <Icon className='text-primary h-8 w-8' />
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {feature.badges.map((badge, index) => (
                  <Badge key={`${feature.id}-badge-${index}`} variant='secondary'>
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});

FeatureCardsGrid.displayName = 'FeatureCardsGrid';

export { FeatureCardsGrid };
