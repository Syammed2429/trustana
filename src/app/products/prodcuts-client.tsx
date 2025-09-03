'use client';
import { motion } from 'motion/react';
import { AdvancedProductsDashboard } from '@/components/products/advanced-products-dashboard';
import {
  containerVariants,
  fadeInUpVariants,
  headerVariants,
  sectionVariants,
} from '@/lib/animation-variants';

export const ProductsClient = () => {
  return (
    <motion.div
      className='container mx-auto py-8'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <motion.div className='space-y-6 px-1' variants={sectionVariants}>
        <motion.div className='space-y-2' variants={headerVariants}>
          <motion.h1 className='text-3xl font-bold tracking-tight' variants={fadeInUpVariants}>
            Trustana Advanced Product Dashboard
          </motion.h1>
          <motion.p className='text-muted-foreground' variants={fadeInUpVariants}>
            Advanced filtering with complex query operators, shareable filters, and powerful data
            exploration capabilities.
          </motion.p>
        </motion.div>
        <motion.div variants={sectionVariants}>
          <AdvancedProductsDashboard />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
