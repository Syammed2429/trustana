"use client";

import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Zap } from "lucide-react";
import { ADVANCED_FEATURES, PAGE_CONFIG } from "@/utils/home";

interface AdvancedFeaturesCardProps {
  className?: string;
}

/**
 * Advanced features card component
 * Displays detailed feature lists for technical users
 */
const AdvancedFeaturesCard = memo<AdvancedFeaturesCardProps>(({ className = "" }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          {PAGE_CONFIG.advancedFeaturesTitle}
        </CardTitle>
        <CardDescription>
          {PAGE_CONFIG.advancedFeaturesDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ADVANCED_FEATURES.map((feature, index) => (
            <div key={`advanced-feature-${index}`} className="space-y-3">
              <h4 className="font-medium">{feature.title}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {feature.items.map((item, itemIndex) => (
                  <li key={`${feature.title}-item-${itemIndex}`}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

AdvancedFeaturesCard.displayName = "AdvancedFeaturesCard";

export { AdvancedFeaturesCard };
