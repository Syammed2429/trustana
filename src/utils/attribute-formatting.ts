/**
 * Utility functions for formatting and handling product attributes
 */

import { AttributeGroup, AttributeFieldType } from '@/app/enums/attribute';

/**
 * Formats attribute keys into readable, user-friendly headers
 * Handles camelCase conversion, common abbreviations, and technical terms
 */
export function formatAttributeHeader(key: string): string {
  return (
    key
      // Remove leading underscores
      .replace(/^_+/, '')
      // Handle common patterns first (more concise)
      .replace(/basicInfo/g, 'Basic')
      .replace(/addNew/g, 'New')
      .replace(/templateAttribute/g, 'Template')
      .replace(/fromVariant/g, 'Variant')
      .replace(/productAttribute/g, 'Product')
      .replace(/newCreated/g, 'Created')
      .replace(/aboutThis/g, 'About')
      .replace(/Item(\d+)/g, 'Item$1')
      .replace(/Product(\d+)/g, 'Prod$1')
      .replace(/testLoop/g, 'Loop')
      .replace(/testRtf/g, 'RTF')
      // Split camelCase and add spaces
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Split on numbers
      .replace(/([a-zA-Z])(\d)/g, '$1 $2')
      .replace(/(\d)([a-zA-Z])/g, '$1 $2')
      // Replace common technical terms with proper formatting
      .replace(/\bsku\b/gi, 'SKU')
      .replace(/\bid\b/gi, 'ID')
      .replace(/\burl\b/gi, 'URL')
      .replace(/\bapi\b/gi, 'API')
      .replace(/\bhtml\b/gi, 'HTML')
      .replace(/\bcss\b/gi, 'CSS')
      .replace(/\bjs\b/gi, 'JS')
      .replace(/\bactive\b/gi, 'Active')
      // Capitalize each word
      .split(' ')
      .map((word) => {
        if (word.length === 0) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ')
      // Clean up any remaining issues
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Simpler version of formatAttributeHeader for basic attribute formatting
 * Used when you need a less aggressive transformation
 */
export function formatAttributeHeaderSimple(key: string): string {
  return key
    .replace(/^_+/, '')
    .replace(/basicInfo/g, 'Basic Info ')
    .replace(/addNew/g, 'Add New ')
    .replace(/templateAttribute/g, 'Template Attribute')
    .replace(/fromVariant/g, 'From Variant ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-zA-Z])/g, '$1 $2')
    .replace(/\bsku\b/gi, 'SKU')
    .replace(/\bid\b/gi, 'ID')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if an attribute key represents a media or special field
 */
export function isMediaOrSpecialField(attr: string): boolean {
  return (
    attr.toLowerCase().includes('media') ||
    attr.toLowerCase().includes('image') ||
    attr.toLowerCase().includes('video') ||
    attr.toLowerCase().includes('photo') ||
    attr.toLowerCase().includes('rtf') ||
    attr.toLowerCase().includes('test') ||
    attr.toLowerCase().includes('loop') ||
    attr.toLowerCase().includes('name') ||
    attr.toLowerCase().includes('template') ||
    attr.toLowerCase().includes('title')
  );
}

/**
 * Get a short, truncated version of an attribute value for display
 */
export function truncateAttributeValue(
  value: string,
  maxLength: number = 50
): { truncated: string; hasMore: boolean } {
  if (!value || value.length <= maxLength) {
    return { truncated: value, hasMore: false };
  }

  return {
    truncated: value.substring(0, maxLength),
    hasMore: true,
  };
}

/**
 * Core product attributes that are most commonly used for filtering
 */
export const CORE_PRODUCT_ATTRIBUTES = [
  'name',
  'brand',
  'category',
  'price',
  'description',
  'sku',
  'status',
  'type',
] as const;

/**
 * Check if an attribute is a core product attribute
 */
export function isCoreAttribute(attr: string): boolean {
  return (CORE_PRODUCT_ATTRIBUTES as readonly string[]).includes(attr);
}

/**
 * Get the appropriate AttributeGroup for a given attribute key
 */
export function getAttributeGroup(attr: string): AttributeGroup {
  // Map common attribute patterns to groups
  const attrLower = attr.toLowerCase();

  if (['name', 'brand', 'sku', 'status', 'id'].some((key) => attrLower.includes(key))) {
    return AttributeGroup.BASIC_INFO;
  }

  if (['price', 'cost', 'inventory', 'stock'].some((key) => attrLower.includes(key))) {
    return AttributeGroup.PRICING_AND_INVENTORY;
  }

  if (['description', 'summary', 'overview'].some((key) => attrLower.includes(key))) {
    return AttributeGroup.DESCRIPTIONS;
  }

  if (['spec', 'dimension', 'weight', 'size', 'material'].some((key) => attrLower.includes(key))) {
    return AttributeGroup.SPECIFICATIONS;
  }

  if (['marketing', 'promotion', 'campaign'].some((key) => attrLower.includes(key))) {
    return AttributeGroup.MARKETING;
  }

  if (['variant', 'option', 'choice'].some((key) => attrLower.includes(key))) {
    return AttributeGroup.VARIANTS;
  }

  if (
    ['safety', 'compliance', 'regulation', 'certification'].some((key) => attrLower.includes(key))
  ) {
    return AttributeGroup.SAFETY_AND_COMPLIANCE;
  }

  if (['shipping', 'delivery', 'freight'].some((key) => attrLower.includes(key))) {
    return AttributeGroup.SHIPPING;
  }

  // Platform-specific checks
  if (attrLower.includes('magento')) return AttributeGroup.MAGENTO;
  if (attrLower.includes('shopify')) return AttributeGroup.SHOPIFY;
  if (attrLower.includes('woocommerce')) return AttributeGroup.WOOCOMMERCE;
  if (attrLower.includes('shopee')) return AttributeGroup.SHOPEE;
  if (attrLower.includes('lazada')) return AttributeGroup.LAZADA;
  if (attrLower.includes('amazon')) return AttributeGroup.AMAZON;

  // Default to basic info for unrecognized attributes
  return AttributeGroup.BASIC_INFO;
}

/**
 * Detect the likely field type of an attribute based on its key and value
 */
export function detectAttributeFieldType(key: string, value?: unknown): AttributeFieldType {
  const keyLower = key.toLowerCase();

  // Check by key patterns first
  if (['price', 'cost', 'amount'].some((pattern) => keyLower.includes(pattern))) {
    return AttributeFieldType.PRICE;
  }

  if (['url', 'link', 'href'].some((pattern) => keyLower.includes(pattern))) {
    return AttributeFieldType.URL;
  }

  if (['date', 'created', 'updated', 'timestamp'].some((pattern) => keyLower.includes(pattern))) {
    return AttributeFieldType.DATE;
  }

  if (['description', 'summary', 'content', 'rtf'].some((pattern) => keyLower.includes(pattern))) {
    return AttributeFieldType.RICH_TEXT;
  }

  if (['media', 'image', 'photo', 'gallery'].some((pattern) => keyLower.includes(pattern))) {
    return AttributeFieldType.MEDIA_GALLERY;
  }

  if (['dropdown', 'select', 'option'].some((pattern) => keyLower.includes(pattern))) {
    return AttributeFieldType.DROPDOWN;
  }

  if (['measure', 'weight', 'dimension', 'size'].some((pattern) => keyLower.includes(pattern))) {
    return AttributeFieldType.MEASURE;
  }

  // Check by value if provided
  if (value !== undefined && value !== null) {
    if (typeof value === 'number') {
      return AttributeFieldType.NUMBER;
    }

    if (Array.isArray(value)) {
      return AttributeFieldType.MULTI_SELECT;
    }

    if (typeof value === 'string') {
      // Check if it looks like a URL
      if (value.match(/^https?:\/\//)) {
        return AttributeFieldType.URL;
      }

      // Check if it looks like a date
      if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
        return AttributeFieldType.DATE;
      }

      // Check if it's long text
      if (value.length > 100) {
        return AttributeFieldType.LONG_TEXT;
      }
    }
  }

  // Default to text
  return AttributeFieldType.TEXT;
}
