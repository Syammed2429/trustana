import { AttributeFieldType, AttributeGroup } from '@/app/enums/attribute';
import { SupplierAttribute } from '@/app/types/attribute';

/**
 * Utility functions for working with attributes using the provided enums
 * This ensures we properly utilize the enums as required by README.md
 */

/**
 * Get appropriate input type for HTML based on AttributeFieldType enum
 */
export function getInputTypeForFieldType(fieldType: AttributeFieldType): string {
  switch (fieldType) {
    case AttributeFieldType.NUMBER:
    case AttributeFieldType.PRICE:
    case AttributeFieldType.MEASURE:
      return 'number';
    case AttributeFieldType.DATE:
      return 'date';
    case AttributeFieldType.DATETIME:
      return 'datetime-local';
    case AttributeFieldType.URL:
      return 'url';
    case AttributeFieldType.TEXT:
    case AttributeFieldType.RICH_TEXT:
    case AttributeFieldType.LONG_TEXT:
    default:
      return 'text';
  }
}

/**
 * Determine if a field type should use textarea instead of input
 */
export function shouldUseTextarea(fieldType: AttributeFieldType): boolean {
  return [AttributeFieldType.LONG_TEXT, AttributeFieldType.RICH_TEXT].includes(fieldType);
}

/**
 * Get validation rules based on AttributeFieldType enum
 */
export function getValidationForFieldType(fieldType: AttributeFieldType) {
  switch (fieldType) {
    case AttributeFieldType.NUMBER:
    case AttributeFieldType.PRICE:
    case AttributeFieldType.MEASURE:
      return {
        pattern: /^-?\d*\.?\d+$/,
        errorMessage: 'Must be a valid number',
      };
    case AttributeFieldType.URL:
      return {
        pattern: /^https?:\/\/.+/,
        errorMessage: 'Must be a valid URL starting with http:// or https://',
      };
    case AttributeFieldType.DATE:
    case AttributeFieldType.DATETIME:
      return {
        pattern: /^\d{4}-\d{2}-\d{2}/,
        errorMessage: 'Must be a valid date',
      };
    default:
      return null;
  }
}

/**
 * Get appropriate operators for filtering based on field type
 */
export function getOperatorsForFieldType(fieldType: AttributeFieldType) {
  switch (fieldType) {
    case AttributeFieldType.NUMBER:
    case AttributeFieldType.PRICE:
    case AttributeFieldType.MEASURE:
    case AttributeFieldType.DATE:
    case AttributeFieldType.DATETIME:
      return [
        { value: '$eq', label: 'Equals' },
        { value: '$ne', label: 'Not Equals' },
        { value: '$gt', label: 'Greater Than' },
        { value: '$gte', label: 'Greater Than or Equal' },
        { value: '$lt', label: 'Less Than' },
        { value: '$lte', label: 'Less Than or Equal' },
        { value: '$exists', label: 'Exists' },
      ];
    case AttributeFieldType.MULTI_SELECT:
    case AttributeFieldType.DROPDOWN:
      return [
        { value: '$eq', label: 'Equals' },
        { value: '$ne', label: 'Not Equals' },
        { value: '$in', label: 'In List' },
        { value: '$nin', label: 'Not In List' },
        { value: '$exists', label: 'Exists' },
      ];
    case AttributeFieldType.TEXT:
    case AttributeFieldType.RICH_TEXT:
    case AttributeFieldType.LONG_TEXT:
    case AttributeFieldType.URL:
    default:
      return [
        { value: '$eq', label: 'Equals' },
        { value: '$ne', label: 'Not Equals' },
        { value: '$regex', label: 'Contains' },
        { value: '$exists', label: 'Exists' },
      ];
  }
}

/**
 * Group attributes by their AttributeGroup enum
 */
export function groupAttributesByGroup(
  attributes: SupplierAttribute[]
): Record<string, SupplierAttribute[]> {
  const grouped: Record<string, SupplierAttribute[]> = {};

  // Initialize with all possible groups from enum
  Object.values(AttributeGroup).forEach((group) => {
    grouped[group] = [];
  });

  // Add "Other" group for attributes without a group
  grouped['Other'] = [];

  // Group attributes
  attributes.forEach((attr) => {
    const group = attr.group || 'Other';
    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group].push(attr);
  });

  // Remove empty groups
  Object.keys(grouped).forEach((key) => {
    if (grouped[key].length === 0) {
      delete grouped[key];
    }
  });

  return grouped;
}

/**
 * Get a user-friendly display name for AttributeFieldType
 */
export function getFieldTypeDisplayName(fieldType: AttributeFieldType): string {
  switch (fieldType) {
    case AttributeFieldType.TEXT:
      return 'Text';
    case AttributeFieldType.DATE:
      return 'Date';
    case AttributeFieldType.DATETIME:
      return 'Date & Time';
    case AttributeFieldType.NUMBER:
      return 'Number';
    case AttributeFieldType.PRICE:
      return 'Price';
    case AttributeFieldType.URL:
      return 'URL';
    case AttributeFieldType.MEASURE:
      return 'Measurement';
    case AttributeFieldType.RICH_TEXT:
      return 'Rich Text';
    case AttributeFieldType.LONG_TEXT:
      return 'Long Text';
    case AttributeFieldType.MULTI_SELECT:
      return 'Multi Select';
    case AttributeFieldType.DROPDOWN:
      return 'Dropdown';
    case AttributeFieldType.MEDIA_GALLERY:
      return 'Media Gallery';
    case AttributeFieldType.TREE_NODE:
      return 'Tree Node';
    default:
      return fieldType;
  }
}

/**
 * Get CSS classes for styling based on field type
 */
export function getFieldTypeStyles(fieldType: AttributeFieldType): string {
  switch (fieldType) {
    case AttributeFieldType.PRICE:
      return 'text-green-600 bg-green-50 border-green-200';
    case AttributeFieldType.NUMBER:
    case AttributeFieldType.MEASURE:
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case AttributeFieldType.DATE:
    case AttributeFieldType.DATETIME:
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case AttributeFieldType.URL:
      return 'text-cyan-600 bg-cyan-50 border-cyan-200';
    case AttributeFieldType.RICH_TEXT:
    case AttributeFieldType.LONG_TEXT:
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case AttributeFieldType.MULTI_SELECT:
    case AttributeFieldType.DROPDOWN:
      return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    case AttributeFieldType.MEDIA_GALLERY:
      return 'text-pink-600 bg-pink-50 border-pink-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Convert value based on field type for proper data handling
 */
export function convertValueForFieldType(value: string, fieldType: AttributeFieldType): unknown {
  switch (fieldType) {
    case AttributeFieldType.NUMBER:
    case AttributeFieldType.PRICE:
    case AttributeFieldType.MEASURE:
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    case AttributeFieldType.DATE:
    case AttributeFieldType.DATETIME:
      return value ? new Date(value).getTime() : value;
    case AttributeFieldType.MULTI_SELECT:
      return value
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v);
    default:
      return value;
  }
}
