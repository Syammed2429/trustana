import React, { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Product } from '@/app/types/product';
import { generateProductMetadata } from '@/app/utils/product-utils';

interface ProductMetadataProps {
  product: Product;
}

/**
 * Product metadata card component
 */
export const ProductMetadata: FC<ProductMetadataProps> = ({ product }) => {
  const metadata = generateProductMetadata(product);

  return (
    <Card className='border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50'>
      <CardHeader className='pb-4'>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <Calendar className='h-5 w-5' />
          Metadata
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='text-sm'>
          <span className='text-muted-foreground'>Total Attributes:</span>
          <Badge variant='secondary' className='ml-2'>
            {metadata.totalAttributes}
          </Badge>
        </div>
        <div className='text-sm'>
          <span className='text-muted-foreground'>Product ID Length:</span>
          <Badge variant='outline' className='ml-2 font-mono'>
            {metadata.idLength} chars
          </Badge>
        </div>
        <div className='text-sm'>
          <span className='text-muted-foreground'>SKU Format:</span>
          <Badge variant='outline' className='ml-2 font-mono'>
            {metadata.skuFormat}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
