import { AttributeGroup } from '@/app/enums/attribute';

export interface AttributeOption {
  value: string;
  label: string;
  group: string;
  originalKey?: string;
}
export const systemAttributes: AttributeOption[] = [
  { value: 'id', label: 'ID', group: 'System' },
  { value: 'skuId', label: 'SKU ID', group: 'System' },
  { value: 'createdAt', label: 'Created At', group: 'System' },
  { value: 'updatedAt', label: 'Updated At', group: 'System' },
];

// Core product attributes that are most commonly used
export const coreAttributes: AttributeOption[] = [
  {
    value: 'attributes.name',
    label: 'Product Name',
    group: AttributeGroup.BASIC_INFO,
  },
  {
    value: 'attributes.brand',
    label: 'Brand',
    group: AttributeGroup.BASIC_INFO,
  },
  {
    value: 'attributes.category',
    label: 'Category',
    group: AttributeGroup.BASIC_INFO,
  },
  {
    value: 'attributes.price',
    label: 'Price',
    group: AttributeGroup.PRICING_AND_INVENTORY,
  },
  {
    value: 'attributes.description',
    label: 'Description',
    group: AttributeGroup.DESCRIPTIONS,
  },
  {
    value: 'attributes.sku',
    label: 'SKU',
    group: AttributeGroup.BASIC_INFO,
  },
  {
    value: 'attributes.status',
    label: 'Status',
    group: AttributeGroup.BASIC_INFO,
  },
  {
    value: 'attributes.type',
    label: 'Type',
    group: AttributeGroup.SPECIFICATIONS,
  },
];
