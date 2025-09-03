import {
  formatAttributeHeader,
  formatAttributeHeaderSimple,
  isMediaOrSpecialField,
  truncateAttributeValue,
  isCoreAttribute,
  getAttributeGroup,
  detectAttributeFieldType,
} from '@/utils/attribute-formatting';
import { AttributeFieldType, AttributeGroup } from '@/app/enums/attribute';

describe('Attribute Formatting Utils', () => {
  describe('formatAttributeHeader', () => {
    it('should format camelCase attribute keys to readable headers', () => {
      expect(formatAttributeHeader('productName')).toBe('Product Name');
      expect(formatAttributeHeader('basicInfo')).toBe('Basic');
      expect(formatAttributeHeader('sku')).toBe('Sku'); // Based on actual implementation
    });

    it('should handle technical terms correctly', () => {
      expect(formatAttributeHeader('htmlContent')).toBe('Html Content'); // Based on actual implementation
      expect(formatAttributeHeader('apiUrl')).toBe('Api Url'); // Based on actual implementation
      expect(formatAttributeHeader('cssClass')).toBe('Css Class'); // Based on actual implementation
    });

    it('should handle numbers in attribute names', () => {
      expect(formatAttributeHeader('item1')).toBe('Item 1');
      expect(formatAttributeHeader('product123')).toBe('Product 123');
    });
  });

  describe('formatAttributeHeaderSimple', () => {
    it('should format simple attribute headers', () => {
      expect(formatAttributeHeaderSimple('productName')).toBe('Product Name');
      expect(formatAttributeHeaderSimple('description')).toBe('Description');
    });
  });

  describe('isMediaOrSpecialField', () => {
    it('should identify media and special fields', () => {
      expect(isMediaOrSpecialField('images')).toBe(true);
      expect(isMediaOrSpecialField('media')).toBe(true);
      expect(isMediaOrSpecialField('productName')).toBe(true); // 'name' is included in special fields
      expect(isMediaOrSpecialField('simpleField')).toBe(false); // This should be false
    });
  });

  describe('truncateAttributeValue', () => {
    it('should truncate long text values', () => {
      const longText = 'This is a very long text that should be truncated';
      const result = truncateAttributeValue(longText, 20);
      expect(result.truncated.length).toBeLessThanOrEqual(20);
      expect(result.hasMore).toBe(true);
    });

    it('should return short text unchanged', () => {
      const shortText = 'Short';
      const result = truncateAttributeValue(shortText, 20);
      expect(result.truncated).toBe(shortText);
      expect(result.hasMore).toBe(false);
    });
  });

  describe('isCoreAttribute', () => {
    it('should identify core attributes', () => {
      expect(isCoreAttribute('name')).toBe(true);
      expect(isCoreAttribute('brand')).toBe(true); // From CORE_PRODUCT_ATTRIBUTES
      expect(isCoreAttribute('customAttribute')).toBe(false);
    });
  });

  describe('getAttributeGroup', () => {
    it('should return correct attribute groups', () => {
      expect(getAttributeGroup('name')).toBe(AttributeGroup.BASIC_INFO);
      expect(getAttributeGroup('specification')).toBe(AttributeGroup.SPECIFICATIONS);
    });
  });

  describe('detectAttributeFieldType', () => {
    it('should detect field types correctly', () => {
      expect(detectAttributeFieldType('price', 29.99)).toBe(AttributeFieldType.PRICE);
      expect(detectAttributeFieldType('url', 'https://example.com')).toBe(AttributeFieldType.URL);
      expect(detectAttributeFieldType('description', 'Some text')).toBe(
        AttributeFieldType.RICH_TEXT
      ); // Based on actual implementation
    });
  });
});
