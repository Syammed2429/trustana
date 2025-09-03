import { FC } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";

interface ProductNotFoundProps {
  productId: string;
}

/**
 * Product not found error component
 */
export const ProductNotFound: FC<ProductNotFoundProps> = ({ productId }) => {
  return (
    <div className='container mx-auto p-6'>
      <div className='flex items-center justify-center h-64 text-center'>
        <div className='flex flex-col items-center gap-4'>
          <Package className='h-12 w-12 text-muted-foreground' />
          <div>
            <h2 className='text-lg font-medium'>Product not found</h2>
            <p className='text-sm text-muted-foreground'>
              Product with ID &quot;{productId}&quot; doesn&apos;t exist or has
              been removed.
            </p>
          </div>
          <Button asChild variant='outline'>
            <Link href='/'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
