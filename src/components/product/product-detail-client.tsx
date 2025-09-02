"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Image, Globe } from "lucide-react";
import { Product } from "@/app/types/product";
import {
  categorizeAttributes,
  extractProductInfo,
} from "@/app/utils/product-utils";
import { ProductHeaderWithCRUD } from "@/components/product/product-header-with-crud";
import { ProductOverview } from "@/components/product/product-overview";
import { AttributeCard } from "@/components/product/attribute-card";
import { ProductMetadata } from "@/components/product/product-metadata";
import { ToastProvider } from "@/hooks/use-toast";

interface ProductDetailClientProps {
  product: Product;
}

/**
 * Client-side product detail component
 * Handles user interactions and browser-specific functionality
 * Includes CRUD operations for product management
 */
export const ProductDetailClient = ({
  product: initialProduct,
}: ProductDetailClientProps) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product>(initialProduct);
  const categorizedAttributes = categorizeAttributes(product.attributes || []);
  const { name, brand, category } = extractProductInfo(product);

  const handleBack = () => {
    router.back();
  };

  // Handle product update
  const handleUpdate = (updatedProduct: Product) => {
    setProduct(updatedProduct);
    console.log("Product updated locally:", updatedProduct);
    // In real implementation, this would trigger a refetch or update the cache
  };

  // Handle product deletion
  const handleDelete = (productId: string) => {
    console.log("Product deleted:", productId);
    // In real implementation, this would redirect to products list
    // and possibly show a success message
  };

  // Handle product duplication
  const handleDuplicate = (duplicatedProduct: Product) => {
    console.log("Product duplicated:", duplicatedProduct);
    // In real implementation, this might navigate to the new product
    // or refresh the current view to show the duplicate
  };

  return (
    <ToastProvider>
      <div className='container mx-auto p-6 space-y-6'>
        {/* Header with CRUD Operations */}
        <ProductHeaderWithCRUD
          productName={name}
          productBrand={brand}
          productCategory={category}
          product={product}
          onBack={handleBack}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />

        {/* Bento Grid Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
          {/* Main Info - Large Card */}
          <ProductOverview
            product={product}
            categorizedAttributes={categorizedAttributes}
          />

          {/* Sidebar */}
          <div className='lg:col-span-4 space-y-6'>
            {/* Technical Specs */}
            <AttributeCard
              title='Technical Specs'
              attributes={categorizedAttributes.technical}
              icon={Star}
              className='bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
            />

            {/* Media & Assets */}
            <AttributeCard
              title='Media & Assets'
              attributes={categorizedAttributes.media}
              icon={Image}
              className='bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
            />

            {/* Additional Information */}
            {categorizedAttributes.other.length > 0 && (
              <AttributeCard
                title='Additional Info'
                attributes={categorizedAttributes.other}
                icon={Globe}
                className='bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
              />
            )}

            {/* Metadata Card */}
            <ProductMetadata product={product} />
          </div>
        </div>
      </div>
    </ToastProvider>
  );
};
