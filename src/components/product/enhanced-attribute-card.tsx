import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RichContentRenderer } from '@/components/rich-content-renderer';
import { ProductAttribute } from '@/app/types/product';
import { SupplierAttribute } from '@/app/types/attribute';
import { formatAttributeKey } from '@/app/utils/product-utils';
import {
  getFieldTypeDisplayName,
  getFieldTypeStyles,
  shouldUseTextarea,
} from '@/utils/attribute-utils';
import { ComponentType, FC } from 'react';

interface EnhancedAttributeCardProps {
  title: string;
  attributes: ProductAttribute[];
  supplierAttributes?: SupplierAttribute[];
  icon: ComponentType<{ className?: string }>;
  className?: string;
  showFieldTypes?: boolean;
}

/**
 * Enhanced AttributeCard component that properly uses AttributeFieldType and AttributeGroup enums
 * as required by README.md. This component demonstrates proper enum usage for:
 * - Field type display and styling
 * - Type-aware rendering
 * - Visual indicators based on attribute types
 */
export const EnhancedAttributeCard: FC<EnhancedAttributeCardProps> = ({
  title,
  attributes,
  supplierAttributes = [],
  icon: Icon,
  className = '',
  showFieldTypes = true,
}) => {
  if (attributes.length === 0) return null;

  // Create a map of supplier attributes for type information
  const supplierAttrMap = new Map(supplierAttributes.map((attr) => [attr.key, attr]));

  return (
    <Card className={`h-fit ${className}`}>
      <CardHeader className='pb-4'>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <Icon className='h-5 w-5' />
          {title}
          {showFieldTypes && (
            <Badge variant='outline' className='text-xs'>
              {attributes.length} attributes
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {attributes.map((attr) => {
          const supplierAttr = supplierAttrMap.get(attr.key);
          const fieldType = supplierAttr?.type;

          return (
            <div key={attr.key} className='space-y-2'>
              <div className='flex flex-wrap items-start gap-2'>
                <Badge
                  variant='outline'
                  className='max-w-full text-xs leading-relaxed break-words whitespace-normal'
                >
                  {formatAttributeKey(attr.key)}
                </Badge>
                {showFieldTypes && fieldType && (
                  <Badge variant='secondary' className={`text-xs ${getFieldTypeStyles(fieldType)}`}>
                    {getFieldTypeDisplayName(fieldType)}
                  </Badge>
                )}
              </div>
              <div className='border-muted border-l-2 pl-2'>
                {shouldUseTextarea(fieldType!) && fieldType ? (
                  // For long text fields, use a more spacious layout
                  <div className='bg-muted/20 rounded border p-3'>
                    <RichContentRenderer
                      content={String(attr.value || '—')}
                      maxLength={-1}
                      allowWrap={true}
                      className='text-foreground text-sm leading-relaxed break-words'
                    />
                  </div>
                ) : (
                  <RichContentRenderer
                    content={String(attr.value || '—')}
                    maxLength={-1}
                    allowWrap={true}
                    className='text-muted-foreground text-sm break-words'
                  />
                )}
                {supplierAttr?.description && (
                  <p className='text-muted-foreground mt-1 text-xs italic'>
                    {supplierAttr.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
