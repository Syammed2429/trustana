import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RichContentRenderer } from "@/components/rich-content-renderer";
import { Hash, Package, Tag, Info, FileText } from "lucide-react";
import { Product } from "@/app/types/product";
import {
  CategorizedAttributes,
  formatAttributeKey,
} from "@/app/utils/product-utils";

interface ProductOverviewProps {
  product: Product;
  categorizedAttributes: CategorizedAttributes;
}

/**
 * Main product overview card component
 */
export const ProductOverview = ({
  product,
  categorizedAttributes,
}: ProductOverviewProps) => {
  return (
    <Card data-testid='product-overview' className='lg:col-span-8 h-fit'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Info className='h-5 w-5' />
          Product Overview
        </CardTitle>
        <CardDescription>
          Complete product information and specifications
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Product IDs */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg'>
          <div className='space-y-1'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <Hash className='h-4 w-4' />
              Product ID
            </div>
            <code className='text-xs bg-background px-2 py-1 rounded border font-mono'>
              {product.id}
            </code>
          </div>
          <div className='space-y-1'>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <Package className='h-4 w-4' />
              SKU ID
            </div>
            <code className='text-xs bg-background px-2 py-1 rounded border font-mono'>
              {product.skuId}
            </code>
          </div>
        </div>

        <Separator />

        {/* Basic Information */}
        {categorizedAttributes.basic.length > 0 && (
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold flex items-center gap-2'>
              <Tag className='h-5 w-5' />
              Basic Information
            </h3>
            <div className='grid gap-4'>
              {categorizedAttributes.basic.map((attr) => (
                <div key={attr.key} className='space-y-2'>
                  <Badge
                    variant='outline'
                    className='text-xs max-w-full break-words whitespace-normal leading-relaxed inline-block'
                  >
                    {formatAttributeKey(attr.key)}
                  </Badge>
                  <div className='pl-4 border-l-2 border-primary/20'>
                    <RichContentRenderer
                      content={String(attr.value || "—")}
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
            <h3 className='text-lg font-semibold flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Product Details
            </h3>
            <div className='grid gap-4'>
              {categorizedAttributes.marketing.map((attr) => (
                <div key={attr.key} className='space-y-2'>
                  <Badge
                    variant='outline'
                    className='text-xs max-w-full break-words whitespace-normal leading-relaxed inline-block'
                  >
                    {formatAttributeKey(attr.key)}
                  </Badge>
                  <div className='pl-4 border-l-2 border-blue-200'>
                    <RichContentRenderer
                      content={String(attr.value || "—")}
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
