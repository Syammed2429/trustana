/**
 * Utility functions for formatting text and names
 * Shared across the application for consistent formatting
 */

/**
 * Format column/attribute names for display
 * Enhanced formatting logic from column-customization.tsx
 */
export function formatDisplayName(name: string): string {
  // Enhanced name formatting
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace(/\bid\b/gi, 'ID')
    .replace(/\bsku\b/gi, 'SKU')
    .replace(/\burl\b/gi, 'URL')
    .replace(/\bapi\b/gi, 'API')
    .replace(/\buuid\b/gi, 'UUID')
    .replace(/\bhttp\b/gi, 'HTTP')
    .replace(/\bhttps\b/gi, 'HTTPS')
    .replace(/\bhtml\b/gi, 'HTML')
    .replace(/\bcss\b/gi, 'CSS')
    .replace(/\bjs\b/gi, 'JS')
    .replace(/\bts\b/gi, 'TS');
}

/**
 * Format attribute keys for better readability
 * Includes smart truncation for very long names
 */
export function formatAttributeKey(key: string): string {
  const formatted = formatDisplayName(key);

  // Truncate very long attribute names for better UI
  if (formatted.length > 50) {
    return formatted.substring(0, 47) + '...';
  }

  return formatted;
}

/**
 * Generate a user-friendly label from a technical identifier
 */
export function generateLabel(identifier: string): string {
  return formatDisplayName(identifier.replace(/^_+/, ''));
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(text: string): string {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
