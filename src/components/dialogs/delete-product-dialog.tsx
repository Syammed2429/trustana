import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Product } from "@/app/types/product";
import { formatAttributeKey } from "@/lib/text-utils";
import { toast } from "sonner";

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onDelete: (productId: string) => void;
  onBack?: () => void;
}

export const DeleteProductDialog: FC<DeleteProductDialogProps> = ({
  open,
  onOpenChange,
  product,
  onDelete,
  onBack,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Get product name for display
  const productName =
    product.attributes?.find((attr) => attr.key === "name")?.value ||
    "Unnamed Product";

  // Handle product deletion (dummy implementation)
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real implementation, this would be an API call
      console.log("Deleting product:", product.id);

      onDelete(product.id);
      onOpenChange(false);

      toast.success("Product Deleted", {
        description: "Product has been successfully deleted.",
      });

      // Navigate back to product list if callback provided
      if (onBack) {
        setTimeout(onBack, 500); // Small delay to show toast
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Delete Failed", {
        description: "Failed to delete product. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-destructive'>
            <Trash2 className='h-5 w-5' />
            Delete Product
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className='bg-muted p-4 rounded-lg space-y-3'>
          <div className='grid grid-cols-1 gap-2'>
            <div>
              <span className='text-sm font-medium text-muted-foreground'>
                Product ID:
              </span>
              <p className='font-mono text-sm'>{product.id}</p>
            </div>
            <div>
              <span className='text-sm font-medium text-muted-foreground'>
                SKU ID:
              </span>
              <p className='font-mono text-sm'>{product.skuId}</p>
            </div>
            <div>
              <span className='text-sm font-medium text-muted-foreground'>
                Product Name:
              </span>
              <p className='font-medium'>{String(productName)}</p>
            </div>
            {/* Show a few key attributes */}
            {product.attributes?.slice(0, 3).map((attr) => (
              <div key={attr.key}>
                <span className='text-sm font-medium text-muted-foreground'>
                  {formatAttributeKey(attr.key)}:
                </span>
                <p className='text-sm truncate'>
                  {String(attr.value).length > 50
                    ? `${String(attr.value).substring(0, 50)}...`
                    : String(attr.value)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-destructive/10 border border-destructive/20 p-3 rounded-lg'>
          <p className='text-sm text-destructive font-medium'>
            ⚠️ Warning: This action is permanent
          </p>
          <p className='text-sm text-muted-foreground mt-1'>
            All product data, attributes, and associated information will be
            permanently removed from the system.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className='mr-2 h-4 w-4' />
            {isDeleting ? "Deleting..." : "Delete Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
