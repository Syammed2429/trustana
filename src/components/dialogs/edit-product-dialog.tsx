import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { Product } from "@/app/types/product";
import { formatAttributeKey } from "@/lib/text-utils";
import { RichContentRenderer } from "@/components/rich-content-renderer";
import { toast } from "sonner";

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onUpdate: (product: Product) => void;
}

export const EditProductDialog: FC<EditProductDialogProps> = ({
  open,
  onOpenChange,
  product,
  onUpdate,
}) => {
  const [editedProduct, setEditedProduct] = useState<Product>(product);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  // Check if content contains HTML tags
  const containsHTML = (text: string): boolean => {
    const htmlRegex = /<[^>]*>/;
    return htmlRegex.test(text);
  };

  // Handle product update (dummy implementation)
  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real implementation, this would be an API call

      onUpdate(editedProduct);
      onOpenChange(false);

      toast.success("Product Updated", {
        description: "Product information has been successfully updated.",
      });
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Update Failed", {
        description: "Failed to update product. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Update attribute value in edited product
  const updateAttribute = (key: string, value: string) => {
    setEditedProduct((prev) => ({
      ...prev,
      attributes: prev.attributes?.map((attr) =>
        attr.key === key ? { ...attr, value } : attr
      ),
    }));
  };

  // Get display value for attributes (max 10 for UI performance)
  const displayAttributes = editedProduct.attributes?.slice(0, 10) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl h-[80vh] flex flex-col p-0'>
        <DialogHeader className='px-6 py-4 border-b'>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update product information. Changes will be saved to the database.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className='flex-1 overflow-y-auto px-6 py-4'>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='productId'>Product ID</Label>
                <Input
                  id='productId'
                  value={editedProduct.id}
                  disabled
                  className='bg-muted'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='skuId'>SKU ID</Label>
                <Input
                  id='skuId'
                  value={editedProduct.skuId}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEditedProduct((prev) => ({
                      ...prev,
                      skuId: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className='space-y-4'>
              <h4 className='font-medium'>Product Attributes</h4>
              {displayAttributes.map((attr) => (
                <div key={attr.key} className='space-y-2'>
                  <Label htmlFor={attr.key} className='text-sm font-medium'>
                    {formatAttributeKey(attr.key)}
                  </Label>

                  {/* Show HTML preview if content contains HTML */}
                  {containsHTML(String(attr.value)) && (
                    <div className='p-3 border rounded-md bg-muted/50'>
                      <div className='text-xs text-muted-foreground mb-2'>
                        Preview:
                      </div>
                      <RichContentRenderer
                        content={String(attr.value)}
                        maxLength={500}
                        allowWrap={true}
                        className='prose prose-sm max-w-none'
                      />
                    </div>
                  )}

                  {/* Edit field */}
                  {containsHTML(String(attr.value)) ? (
                    <Textarea
                      id={attr.key}
                      value={String(attr.value)}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        updateAttribute(attr.key, e.target.value)
                      }
                      rows={containsHTML(String(attr.value)) ? 6 : 3}
                      placeholder={
                        containsHTML(String(attr.value))
                          ? "HTML content (tags will be preserved)"
                          : undefined
                      }
                    />
                  ) : (
                    <Input
                      id={attr.key}
                      value={String(attr.value)}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        updateAttribute(attr.key, e.target.value)
                      }
                      placeholder={
                        containsHTML(String(attr.value))
                          ? "HTML content"
                          : undefined
                      }
                    />
                  )}
                </div>
              ))}
              {(editedProduct.attributes?.length || 0) > 10 && (
                <p className='text-sm text-muted-foreground'>
                  Showing first 10 attributes.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <DialogFooter className='px-6 py-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            <X className='mr-2 h-4 w-4' />
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isUpdating}>
            <Save className='mr-2 h-4 w-4' />
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
