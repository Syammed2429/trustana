import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FC } from "react";

interface ProductHeaderProps {
  productName: string;
  productBrand?: string | number | object | string[] | null;
  productCategory?: string | number | object | string[] | null;
  onBack: () => void;
}

/**
 * Product detail page header component
 */
export const ProductHeader: FC<ProductHeaderProps> = ({
  productName,
  productBrand,
  productCategory,
  onBack,
}) => {
  return (
    <div className='flex items-center gap-4'>
      <Button
        variant='outline'
        size='icon'
        onClick={onBack}
        className='shrink-0'
      >
        <ArrowLeft className='h-4 w-4' />
      </Button>
      <div className='min-w-0 flex-1'>
        <h1 className='text-2xl font-bold truncate'>{productName}</h1>
        <div className='flex items-center gap-2 mt-1'>
          {productBrand && (
            <Badge variant='secondary'>{String(productBrand)}</Badge>
          )}
          {productCategory && (
            <Badge variant='outline'>{String(productCategory)}</Badge>
          )}
        </div>
      </div>
    </div>
  );
};
