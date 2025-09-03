'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Star, Image, Globe } from 'lucide-react';
import { Product } from '@/app/types/product';
import { categorizeAttributes, extractProductInfo } from '@/app/utils/product-utils';
import { ProductHeaderWithCRUD } from '@/components/product/product-header-with-crud';
import { ProductOverview } from '@/components/product/product-overview';
import { AttributeCard } from '@/components/product/attribute-card';
import { ProductMetadata } from '@/components/product/product-metadata';
import { containerVariants, fadeInUpVariants, fadeInLeftVariants } from '@/lib/animation-variants';

interface ProductDetailClientProps {
  product: Product;
}

/**
 * Client-side product detail component
 * Handles user interactions and browser-specific functionality
 * Includes CRUD operations for product management
 */
export const ProductDetailClient: FC<ProductDetailClientProps> = ({ product: initialProduct }) => {
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
    console.log('Product updated locally:', updatedProduct);
    // In real implementation, this would trigger a refetch or update the cache
  };

  // Handle product deletion
  const handleDelete = (productId: string) => {
    console.log('Product deleted:', productId);
    // In real implementation, this would redirect to products list
    // and possibly show a success message
  };

  // Handle product duplication
  const handleDuplicate = (duplicatedProduct: Product) => {
    console.log('Product duplicated:', duplicatedProduct);
    // In real implementation, this might navigate to the new product
    // or refresh the current view to show the duplicate
  };

  const cardHoverEffect = {
    y: -2,
    transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
  };
  return (
    <motion.div
      className='container mx-auto space-y-6 p-6'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      {/* Header with CRUD Operations */}
      <motion.div variants={fadeInUpVariants}>
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
      </motion.div>

      {/* Bento Grid Layout */}
      <motion.div
        className='grid grid-cols-1 gap-6 lg:grid-cols-12'
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.3,
            },
          },
        }}
      >
        {/* Main Info - Large Card */}
        <motion.div
          className='lg:col-span-8'
          variants={fadeInLeftVariants}
          whileHover={cardHoverEffect}
        >
          <ProductOverview product={product} categorizedAttributes={categorizedAttributes} />
        </motion.div>

        {/* Sidebar */}
        <motion.div
          className='space-y-6 lg:col-span-4'
          variants={{
            hidden: { opacity: 0, x: 20 },
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                type: 'spring',
                stiffness: 200,
                damping: 25,
                staggerChildren: 0.15,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {/* Technical Specs */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                },
              },
            }}
            whileHover={cardHoverEffect}
          >
            <AttributeCard
              title='Technical Specs'
              attributes={categorizedAttributes.technical}
              icon={Star}
              className='border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50'
            />
          </motion.div>

          {/* Media & Assets */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                  delay: 0.1,
                },
              },
            }}
            whileHover={cardHoverEffect}
          >
            <AttributeCard
              title='Media & Assets'
              attributes={categorizedAttributes.media}
              icon={Image}
              className='border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50'
            />
          </motion.div>

          {/* Additional Information */}
          {categorizedAttributes.other.length > 0 && (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                    delay: 0.2,
                  },
                },
              }}
              whileHover={cardHoverEffect}
            >
              <AttributeCard
                title='Additional Info'
                attributes={categorizedAttributes.other}
                icon={Globe}
                className='border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
              />
            </motion.div>
          )}

          {/* Metadata Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                  delay: 0.3,
                },
              },
            }}
            whileHover={cardHoverEffect}
          >
            <ProductMetadata product={product} />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
