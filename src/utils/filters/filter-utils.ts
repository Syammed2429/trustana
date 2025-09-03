import { InternalFilterValue } from '@/app/types/query-engine/common';

export interface FilterCondition {
  id: string;
  attribute: string;
  operator: keyof InternalFilterValue;
  value: string | number | boolean;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'price' | 'url';
}

export interface FilterGroup {
  id: string;
  name: string;
  conditions: FilterCondition[];
  logicalOperator: 'AND' | 'OR';
}

export interface SavedFilter {
  id: string;
  name: string;
  description?: string;
  filterGroups: FilterGroup[];
  createdAt: Date;
  isShared: boolean;
}

/**
 * Core product attributes that are most commonly used for filtering
 */
export const CORE_ATTRIBUTES = [
  'attributes.name',
  'attributes.brand',
  'attributes.category',
  'attributes.price',
  'attributes.description',
  'attributes.sku',
  'attributes.status',
  'attributes.type',
] as const;

/**
 * Operators configuration for different data types
 */
export const OPERATORS = {
  string: [
    { value: '$eq', label: 'Equals' },
    { value: '$ne', label: 'Not Equals' },
    { value: '$regex', label: 'Contains' },
    { value: '$exists', label: 'Exists' },
  ],
  number: [
    { value: '$eq', label: 'Equals' },
    { value: '$ne', label: 'Not Equals' },
    { value: '$gt', label: 'Greater Than' },
    { value: '$gte', label: 'Greater Than or Equal' },
    { value: '$lt', label: 'Less Than' },
    { value: '$lte', label: 'Less Than or Equal' },
    { value: '$exists', label: 'Exists' },
  ],
  boolean: [
    { value: '$eq', label: 'Equals' },
    { value: '$ne', label: 'Not Equals' },
    { value: '$exists', label: 'Exists' },
  ],
  date: [
    { value: '$eq', label: 'Equals' },
    { value: '$ne', label: 'Not Equals' },
    { value: '$gt', label: 'After' },
    { value: '$gte', label: 'After or Equal' },
    { value: '$lt', label: 'Before' },
    { value: '$lte', label: 'Before or Equal' },
    { value: '$exists', label: 'Exists' },
  ],
} as const;

/**
 * Generate a unique ID for filter components
 */
export const generateFilterId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Get a good default attribute from available attributes
 */
export const getDefaultAttribute = (availableAttributes: string[]): string => {
  // Prefer core attributes if available, otherwise use the first available
  for (const coreAttr of CORE_ATTRIBUTES) {
    const attrName = coreAttr.replace('attributes.', '');
    if (availableAttributes.includes(attrName)) {
      return coreAttr;
    }
  }
  return availableAttributes.length > 0 ? `attributes.${availableAttributes[0]}` : '';
};

/**
 * Auto-detect data type based on attribute name
 */
export const detectDataType = (attributeName: string): 'string' | 'number' | 'boolean' | 'date' => {
  const lowerName = attributeName.toLowerCase();

  // Number types
  if (
    lowerName.includes('price') ||
    lowerName.includes('cost') ||
    lowerName.includes('amount') ||
    lowerName.includes('quantity') ||
    lowerName.includes('weight') ||
    lowerName.includes('count')
  ) {
    return 'number';
  }

  // Date types
  if (
    lowerName.includes('date') ||
    lowerName.includes('created') ||
    lowerName.includes('updated') ||
    lowerName.includes('modified') ||
    lowerName.includes('time')
  ) {
    return 'date';
  }

  // Boolean types
  if (
    lowerName.includes('active') ||
    lowerName.includes('enabled') ||
    lowerName.includes('visible') ||
    lowerName.includes('published') ||
    lowerName.includes('available')
  ) {
    return 'boolean';
  }

  // Default to string
  return 'string';
};

/**
 * Convert a single value based on data type
 */
export const convertFilterValue = (
  value: string | number | boolean,
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'price' | 'url'
): string | number | boolean => {
  switch (dataType) {
    case 'number':
    case 'price':
      return parseFloat(value.toString());
    case 'boolean':
      return value === 'true' || value === true;
    case 'date':
      return new Date(value.toString()).getTime();
    case 'url':
    case 'string':
    default:
      return value;
  }
};

/**
 * Build a single filter condition for API
 */
export const buildFilterCondition = (condition: FilterCondition) => {
  const { attribute, operator, value, dataType } = condition;
  const convertedValue = convertFilterValue(value, dataType);

  // Special handling for exists operator
  if (operator === '$exists') {
    return {
      [attribute]: { [operator]: convertedValue },
    };
  }

  // For attributes, use full dot notation format
  if (attribute.startsWith('attributes.')) {
    return {
      [attribute]: {
        [operator]: convertedValue,
        ...(operator === '$regex' ? { $options: 'i' } : {}),
      },
    };
  }

  return {
    [attribute]: { [operator]: convertedValue },
  };
};

/**
 * Convert filter groups to API format
 */
export const convertToAPIFormat = (groups: FilterGroup[]): Record<string, unknown> => {
  if (groups.length === 0 || groups.every((g) => g.conditions.length === 0)) {
    return {};
  }

  const buildGroupFilter = (group: FilterGroup) => {
    if (group.conditions.length === 0) return null;

    const conditions = group.conditions.map(buildFilterCondition);

    if (conditions.length === 1) {
      return conditions[0];
    }

    return group.logicalOperator === 'AND' ? { $and: conditions } : { $or: conditions };
  };

  const groupFilters = groups.map(buildGroupFilter).filter((filter) => filter !== null);

  if (groupFilters.length === 0) return {};
  if (groupFilters.length === 1) return groupFilters[0];

  return { $and: groupFilters };
};

/**
 * Create search filter for quick search
 */
export const createSearchFilter = (searchTerm: string): Record<string, unknown> => {
  if (!searchTerm?.trim()) return {};

  return {
    $or: [
      // Direct product fields
      { id: { $regex: searchTerm.trim(), $options: 'i' } },
      { skuId: { $regex: searchTerm.trim(), $options: 'i' } },
      // Attribute fields - Brand and Name only for focused search
      {
        'attributes.brand': { $regex: searchTerm.trim(), $options: 'i' },
      },
      { 'attributes.name': { $regex: searchTerm.trim(), $options: 'i' } },
    ],
  };
};

/**
 * Compose multiple filters into a single filter object
 */
export const composeFilters = (
  advancedFilters: Record<string, unknown>,
  searchTerm?: string
): Record<string, unknown> => {
  const filters: Record<string, unknown>[] = [];

  // Add advanced filters if they exist
  if (advancedFilters && Object.keys(advancedFilters).length > 0) {
    filters.push(advancedFilters);
  }

  // Add search filter if search term exists
  const searchFilter = createSearchFilter(searchTerm || '');
  if (Object.keys(searchFilter).length > 0) {
    filters.push(searchFilter);
  }

  // Return composed filters
  if (filters.length === 0) {
    return {};
  } else if (filters.length === 1) {
    return filters[0];
  } else {
    return { $and: filters };
  }
};
