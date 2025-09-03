import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Product } from "@/app/types/product";
import { CreateProductDialog } from "@/components/dialogs/create-product-dialog";

interface CreateProductButtonProps {
  onProductCreated?: (product: Product) => void;
}

/**
 * Button component for creating new products
 * Opens a modal with a form to create a new product
 */
export const CreateProductButton: FC<CreateProductButtonProps> = ({
  onProductCreated,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className='flex items-center gap-2'
      >
        <Plus className='h-4 w-4' />
        Create Product
      </Button>

      <CreateProductDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onProductCreated={onProductCreated || (() => {})}
      />
    </>
  );
};
