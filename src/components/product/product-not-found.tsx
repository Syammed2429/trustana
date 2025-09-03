import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';

interface ProductNotFoundProps {
  productId: string;
}

/**
 * Product not found error component
 */
export const ProductNotFound: FC<ProductNotFoundProps> = ({ productId }) => {
  return (
    <div className='container mx-auto p-6'>
      <div className='flex h-64 items-center justify-center text-center'>
        <div className='flex flex-col items-center gap-4'>
          <Package className='text-muted-foreground h-12 w-12' />
          <div>
            <h2 className='text-lg font-medium'>Product not found</h2>
            <p className='text-muted-foreground text-sm'>
              Product with ID &quot;{productId}&quot; doesn&apos;t exist or has been removed.
            </p>
          </div>
          <Button asChild variant='outline'>
            <Link href='/'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
