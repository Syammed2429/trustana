import { ComponentType, FC } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichContentRenderer } from "@/components/rich-content-renderer";
import { ProductAttribute } from "@/app/types/product";
import { formatAttributeKey } from "@/app/utils/product-utils";

interface AttributeCardProps {
  title: string;
  attributes: ProductAttribute[];
  icon: ComponentType<{ className?: string }>;
  className?: string;
}

/**
 * Reusable card component for displaying categorized product attributes
 */
export const AttributeCard: FC<AttributeCardProps> = ({
  title,
  attributes,
  icon: Icon,
  className = "",
}) => {
  if (attributes.length === 0) return null;

  return (
    <Card className={`h-fit ${className}`}>
      <CardHeader className='pb-4'>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <Icon className='h-5 w-5' />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {attributes.map((attr) => (
          <div key={attr.key} className='space-y-2'>
            <div className='flex items-start gap-2 flex-wrap'>
              <Badge
                variant='outline'
                className='text-xs max-w-full break-words whitespace-normal leading-relaxed'
              >
                {formatAttributeKey(attr.key)}
              </Badge>
            </div>
            <div className='pl-2 border-l-2 border-muted'>
              <RichContentRenderer
                content={String(attr.value || "—")}
                maxLength={-1}
                allowWrap={true}
                className='text-sm text-muted-foreground break-words'
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
