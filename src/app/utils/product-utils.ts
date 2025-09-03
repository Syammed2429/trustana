import { Product, ProductAttribute } from '@/app/types/product';

/**
 * Utility functions for product data manipulation and formatting
 */

export interface CategorizedAttributes {
  basic: ProductAttribute[];
  media: ProductAttribute[];
  technical: ProductAttribute[];
  marketing: ProductAttribute[];
  other: ProductAttribute[];
}

/**
 * Format attribute keys into readable labels
 * @param key - The raw attribute key
 * @returns Formatted, human-readable attribute label
 */
export function formatAttributeKey(key: string): string {
  const formatted = key
    .replace(/^_+/, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-zA-Z])/g, '$1 $2')
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();

  // Truncate very long attribute names for better UI
  if (formatted.length > 50) {
    return formatted.substring(0, 47) + '...';
  }

  return formatted;
}

/**
 * Categorize product attributes into logical groups
 * @param attributes - Array of product attributes
 * @returns Categorized attributes object
 */
export function categorizeAttributes(attributes: ProductAttribute[]): CategorizedAttributes {
  const categories: CategorizedAttributes = {
    basic: [],
    media: [],
    technical: [],
    marketing: [],
    other: [],
  };

  attributes.forEach((attr) => {
    const key = attr.key.toLowerCase();

    if (
      key.includes('name') ||
      key.includes('brand') ||
      key.includes('title') ||
      key.includes('category')
    ) {
      categories.basic.push(attr);
    } else if (
      key.includes('image') ||
      key.includes('media') ||
      key.includes('photo') ||
      key.includes('video')
    ) {
      categories.media.push(attr);
    } else if (
      key.includes('spec') ||
      key.includes('technical') ||
      key.includes('dimension') ||
      key.includes('weight') ||
      key.includes('model')
    ) {
      categories.technical.push(attr);
    } else if (
      key.includes('description') ||
      key.includes('about') ||
      key.includes('marketing') ||
      key.includes('feature')
    ) {
      categories.marketing.push(attr);
    } else {
      categories.other.push(attr);
    }
  });

  return categories;
}

/**
 * Extract main product information from attributes
 * @param product - Product object
 * @returns Main product info (name, brand, category)
 */
export function extractProductInfo(product: Product) {
  const productName = String(
    product.attributes?.find((attr) => attr.key === 'name')?.value || 'Unnamed Product'
  );
  const productBrand = product.attributes?.find((attr) => attr.key === 'brand')?.value;
  const productCategory = product.attributes?.find((attr) => attr.key === 'category')?.value;

  return {
    name: productName,
    brand: productBrand,
    category: productCategory,
  };
}

/**
 * Generate metadata insights for a product
 * @param product - Product object
 * @returns Metadata insights
 */
export function generateProductMetadata(product: Product) {
  return {
    totalAttributes: product.attributes?.length || 0,
    idLength: product.id.length,
    skuFormat: product.skuId.match(/^[A-Z]+/) ? 'Letter-Number' : 'Custom',
  };
}
