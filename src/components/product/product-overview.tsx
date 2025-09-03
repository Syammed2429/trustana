import { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RichContentRenderer } from '@/components/rich-content-renderer';
import { Hash, Package, Tag, Info, FileText } from 'lucide-react';
import { Product } from '@/app/types/product';
import { CategorizedAttributes, formatAttributeKey } from '@/app/utils/product-utils';

interface ProductOverviewProps {
  product: Product;
  categorizedAttributes: CategorizedAttributes;
}

/**
 * Main product overview card component
 */
export const ProductOverview: FC<ProductOverviewProps> = ({ product, categorizedAttributes }) => {
  return (
    <Card data-testid='product-overview' className='h-fit lg:col-span-8'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Info className='h-5 w-5' />
          Product Overview
        </CardTitle>
        <CardDescription>Complete product information and specifications</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Product IDs */}
        <div className='bg-muted/50 grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-2'>
          <div className='space-y-1'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <Hash className='h-4 w-4' />
              Product ID
            </div>
            <code className='bg-background rounded border px-2 py-1 font-mono text-xs'>
              {product.id}
            </code>
          </div>
          <div className='space-y-1'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <Package className='h-4 w-4' />
              SKU ID
            </div>
            <code className='bg-background rounded border px-2 py-1 font-mono text-xs'>
              {product.skuId}
            </code>
          </div>
        </div>

        <Separator />

        {/* Basic Information */}
        {categorizedAttributes.basic.length > 0 && (
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-lg font-semibold'>
              <Tag className='h-5 w-5' />
              Basic Information
            </h3>
            <div className='grid gap-4'>
              {categorizedAttributes.basic.map((attr) => (
                <div key={attr.key} className='space-y-2'>
                  <Badge
                    variant='outline'
                    className='inline-block max-w-full text-xs leading-relaxed break-words whitespace-normal'
                  >
                    {formatAttributeKey(attr.key)}
                  </Badge>
                  <div className='border-primary/20 border-l-2 pl-4'>
                    <RichContentRenderer
                      content={String(attr.value || '—')}
                      maxLength={-1}
                      allowWrap={true}
                      className='text-sm break-words'
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Marketing Information */}
        {categorizedAttributes.marketing.length > 0 && (
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-lg font-semibold'>
              <FileText className='h-5 w-5' />
              Product Details
            </h3>
            <div className='grid gap-4'>
              {categorizedAttributes.marketing.map((attr) => (
                <div key={attr.key} className='space-y-2'>
                  <Badge
                    variant='outline'
                    className='inline-block max-w-full text-xs leading-relaxed break-words whitespace-normal'
                  >
                    {formatAttributeKey(attr.key)}
                  </Badge>
                  <div className='border-l-2 border-blue-200 pl-4'>
                    <RichContentRenderer
                      content={String(attr.value || '—')}
                      maxLength={-1}
                      allowWrap={true}
                      className='text-sm break-words'
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
