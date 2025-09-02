"use client";

import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { API_EXAMPLES, PAGE_CONFIG, formatCodeExample } from "@/utils/home";

interface ApiExamplesCardProps {
  className?: string;
}

/**
 * API examples card component
 * Displays code examples with syntax highlighting
 */
const ApiExamplesCard = memo<ApiExamplesCardProps>(({ className = "" }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{PAGE_CONFIG.apiExamplesTitle}</CardTitle>
        <CardDescription>
          {PAGE_CONFIG.apiExamplesDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {API_EXAMPLES.map((example, index) => (
            <div key={`api-example-${index}`}>
              <h4 className="font-medium mb-2">{example.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {example.description}
              </p>
              <code className="block p-3 bg-muted rounded text-sm whitespace-pre-wrap">
                {formatCodeExample(example.code)}
              </code>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

ApiExamplesCard.displayName = "ApiExamplesCard";

export { ApiExamplesCard };
