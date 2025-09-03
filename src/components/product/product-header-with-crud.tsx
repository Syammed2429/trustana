import { FC, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, Edit, Trash2, Copy, MoreVertical } from 'lucide-react';
import { Product } from '@/app/types/product';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

const EditProductDialog = dynamic(
  () => import('@/components/dialogs/edit-product-dialog').then((mod) => mod.EditProductDialog),
  {}
);

const DeleteProductDialog = dynamic(
  () => import('@/components/dialogs/delete-product-dialog').then((mod) => mod.DeleteProductDialog),
  {}
);
interface ProductHeaderWithCRUDProps {
  productName: string;
  productBrand?: string | number | object | string[] | null;
  productCategory?: string | number | object | string[] | null;
  product: Product;
  onBack: () => void;
  onUpdate?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onDuplicate?: (product: Product) => void;
}

/**
 * Product detail page header with CRUD operations
 * Includes Edit, Delete, Duplicate functionality as dummy implementations
 */
export const ProductHeaderWithCRUD: FC<ProductHeaderWithCRUDProps> = ({
  productName,
  productBrand,
  productCategory,
  product,
  onBack,
  onUpdate,
  onDelete,
  onDuplicate,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Handle product duplication (dummy implementation)
  const handleDuplicate = async () => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const duplicatedProduct = {
        ...product,
        id: `${product.id}-copy`,
        skuId: `${product.skuId}-copy`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        attributes: product.attributes?.map((attr) =>
          attr.key === 'name' ? { ...attr, value: `${attr.value} (Copy)` } : attr
        ),
      };

      // In real implementation, this would be an API call
      console.log('Duplicating product:', duplicatedProduct);

      onDuplicate?.(duplicatedProduct);

      toast.success('Product Duplicated', {
        description: 'Product has been successfully duplicated.',
      });
    } catch (error) {
      console.error('Duplication error:', error);
      toast.error('Duplication Failed', {
        description: 'Failed to duplicate product. Please try again.',
      });
    }
  };

  return (
    <>
      <div data-testid='product-header' className='flex items-center gap-4'>
        <Button variant='outline' size='icon' onClick={onBack} className='shrink-0'>
          <ArrowLeft className='h-4 w-4' />
        </Button>

        <div className='min-w-0 flex-1'>
          <h1 className='truncate text-2xl font-bold'>{productName}</h1>
          <div className='mt-1 flex items-center gap-2'>
            {productBrand && <Badge variant='secondary'>{String(productBrand)}</Badge>}
            {productCategory && <Badge variant='outline'>{String(productCategory)}</Badge>}
          </div>
        </div>

        {/* CRUD Action Buttons */}
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsEditModalOpen(true)}
            className='flex items-center gap-2'
          >
            <Edit className='h-4 w-4' />
            Edit
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className='mr-2 h-4 w-4' />
                Duplicate Product
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteModalOpen(true)}
                className='text-destructive'
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Edit Product Dialog */}
      <EditProductDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        product={product}
        onUpdate={onUpdate || (() => {})}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteProductDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        product={product}
        onDelete={onDelete || (() => {})}
        onBack={onBack}
      />
    </>
  );
};
