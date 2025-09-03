import { AttributeFieldType } from '@/app/enums/attribute';
import { OPERATORS } from './filter-utils';

/**
 * Data type options with enum information for filter UI components
 */
export const getDataTypeOptions = () => [
  {
    value: 'string',
    label: 'Text',
    enumType: AttributeFieldType.TEXT,
  },
  {
    value: 'number',
    label: 'Number',
    enumType: AttributeFieldType.NUMBER,
  },
  {
    value: 'price',
    label: 'Price',
    enumType: AttributeFieldType.PRICE,
  },
  {
    value: 'boolean',
    label: 'Yes/No',
    enumType: AttributeFieldType.DROPDOWN,
  },
  {
    value: 'date',
    label: 'Date',
    enumType: AttributeFieldType.DATE,
  },
  {
    value: 'url',
    label: 'URL',
    enumType: AttributeFieldType.URL,
  },
];

/**
 * Maps custom data types to operator data types for filtering
 * This ensures that custom types like "price" and "url" use the appropriate operators
 */
export const getOperatorDataType = (dataType: string): keyof typeof OPERATORS => {
  switch (dataType) {
    case 'price':
      return 'number';
    case 'url':
      return 'string';
    case 'string':
    case 'number':
    case 'boolean':
    case 'date':
      return dataType as keyof typeof OPERATORS;
    default:
      return 'string';
  }
};

/**
 * Get the appropriate input type for HTML input elements based on data type
 */
export const getInputType = (dataType: string): string => {
  switch (dataType) {
    case 'number':
    case 'price':
      return 'number';
    case 'date':
      return 'date';
    default:
      return 'text';
  }
};

/**
 * Check if a data type should use numeric operations
 */
export const isNumericType = (dataType: string): boolean => {
  return dataType === 'number' || dataType === 'price';
};

/**
 * Check if a data type should use boolean operations
 */
export const isBooleanType = (dataType: string): boolean => {
  return dataType === 'boolean';
};
