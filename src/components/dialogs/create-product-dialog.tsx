import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';
import { Product } from '@/app/types/product';
import { toast } from 'sonner';

// Zod validation schema
const createProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters'),
  brand: z.string().max(50, 'Brand name must be less than 50 characters').optional(),
  category: z.string().max(50, 'Category must be less than 50 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  price: z
    .string()
    .refine((val) => {
      if (!val) return true; // Allow empty string
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, 'Price must be a valid positive number')
    .optional(),
  sku: z.string().max(50, 'SKU must be less than 50 characters').optional(),
});

type CreateProductFormData = z.infer<typeof createProductSchema>;

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductCreated: (product: Product) => void;
}

export const CreateProductDialog: FC<CreateProductDialogProps> = ({
  open,
  onOpenChange,
  onProductCreated,
}) => {
  const [isCreating, setIsCreating] = useState(false);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      brand: '',
      category: '',
      description: '',
      price: '',
      sku: '',
    },
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  // Handle product creation (dummy implementation)
  const onSubmit = async (data: CreateProductFormData) => {
    setIsCreating(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a new product object
      const generatedId = `product-${Date.now()}`;
      const generatedSkuId = data.sku || `SKU-${Date.now()}`;

      const createdProduct: Product = {
        id: generatedId,
        skuId: generatedSkuId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        attributes: [
          { key: 'name', value: data.name },
          { key: 'brand', value: data.brand || 'Unknown Brand' },
          { key: 'category', value: data.category || 'General' },
          {
            key: 'description',
            value: data.description || 'No description provided',
          },
          { key: 'price', value: data.price || '0' },
          { key: 'created_date', value: new Date().toISOString() },
          { key: 'status', value: 'active' },
        ].filter((attr) => attr.value), // Remove empty values
      };

      // In real implementation, this would be an API call

      onProductCreated(createdProduct);
      onOpenChange(false);

      toast.success('Product Created', {
        description: `Product "${data.name}" has been successfully created.`,
      });
    } catch (error) {
      console.error('Create error:', error);
      toast.error('Creation Failed', {
        description: 'Failed to create product. Please try again.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex h-[80vh] max-w-2xl flex-col p-0'>
        <DialogHeader className='border-b px-6 py-4'>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>
            Add a new product to the catalog. Fill in the basic information below.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className='flex-1 overflow-y-auto px-6 py-4'>
          <form id='create-product-form' onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Product Name *</Label>
                  <Input
                    id='name'
                    {...register('name')}
                    placeholder='Enter product name'
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className='text-destructive mt-1 text-sm'>{errors.name.message}</p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='brand'>Brand</Label>
                  <Input
                    id='brand'
                    {...register('brand')}
                    placeholder='Enter brand name'
                    className={errors.brand ? 'border-destructive' : ''}
                  />
                  {errors.brand && (
                    <p className='text-destructive mt-1 text-sm'>{errors.brand.message}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='category'>Category</Label>
                  <Input
                    id='category'
                    {...register('category')}
                    placeholder='Enter category'
                    className={errors.category ? 'border-destructive' : ''}
                  />
                  {errors.category && (
                    <p className='text-destructive mt-1 text-sm'>{errors.category.message}</p>
                  )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='sku'>SKU (Optional)</Label>
                  <Input
                    id='sku'
                    {...register('sku')}
                    placeholder='Auto-generated if empty'
                    className={errors.sku ? 'border-destructive' : ''}
                  />
                  {errors.sku && (
                    <p className='text-destructive mt-1 text-sm'>{errors.sku.message}</p>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='price'>Price</Label>
                <Input
                  id='price'
                  type='number'
                  {...register('price')}
                  placeholder='0.00'
                  min='0'
                  step='0.01'
                  className={errors.price ? 'border-destructive' : ''}
                />
                {errors.price && (
                  <p className='text-destructive mt-1 text-sm'>{errors.price.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  {...register('description')}
                  placeholder='Enter product description'
                  rows={4}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && (
                  <p className='text-destructive mt-1 text-sm'>{errors.description.message}</p>
                )}
              </div>

              <div className='bg-muted rounded-lg p-4'>
                <p className='text-muted-foreground text-sm'>
                  <strong>Note:</strong> This is a demo implementation. In a real application, this
                  would create a new product in the database and refresh the product list.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Sticky Footer */}
        <DialogFooter className='bg-background/95 supports-[backdrop-filter]:bg-background/60 border-t px-6 py-4 backdrop-blur'>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isCreating}>
            <X className='mr-2 h-4 w-4' />
            Cancel
          </Button>
          <Button type='submit' form='create-product-form' disabled={isCreating || !isValid}>
            <Save className='mr-2 h-4 w-4' />
            {isCreating ? 'Creating...' : 'Create Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
