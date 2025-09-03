/**
 * Utility functions for home page functionality
 * Reusable business logic and data processing
 */

import { FeatureCard, DemoLink, ApiExample } from './home-data';

/**
 * Formats code examples with proper indentation and syntax highlighting
 */
export const formatCodeExample = (code: string): string => {
  return code.trim();
};

/**
 * Generates accessible props for feature cards
 */
export const getFeatureCardProps = (feature: FeatureCard) => ({
  'aria-label': `${feature.title}: ${feature.description}`,
  role: 'article',
});

/**
 * Generates accessible props for demo links
 */
export const getDemoLinkProps = (demo: DemoLink) => ({
  'aria-label': `Navigate to ${demo.title}`,
  role: 'button',
});

/**
 * Generates structured data for SEO
 */
export const generateStructuredData = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Trustana Product Dashboard',
  description: 'Advanced product data filtering and exploration platform',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Advanced filtering with complex operators',
    'Shareable filter configurations',
    'Real-time data visualization',
    'Enterprise-grade performance',
  ],
});

/**
 * Validates feature card data structure
 */
export const validateFeatureCard = (card: FeatureCard): boolean => {
  return !!(
    card.id &&
    card.title &&
    card.description &&
    Array.isArray(card.badges) &&
    card.badges.length > 0
  );
};

/**
 * Validates demo link data structure
 */
export const validateDemoLink = (link: DemoLink): boolean => {
  return !!(link.id && link.href && link.title && ['default', 'outline'].includes(link.variant));
};

/**
 * Validates API example data structure
 */
export const validateApiExample = (example: ApiExample): boolean => {
  return !!(example.title && example.description && example.code);
};

/**
 * Safely parses JSON code examples for validation
 */
export const validateJsonExample = (code: string): boolean => {
  try {
    JSON.parse(code);
    return true;
  } catch {
    return false;
  }
};

/**
 * Creates analytics event data for tracking user interactions
 */
export const createAnalyticsEvent = (
  action: string,
  category: string = 'home_page',
  label?: string
) => ({
  event: 'user_interaction',
  action,
  category,
  label,
  timestamp: new Date().toISOString(),
});

/**
 * Formats feature badges for display
 */
export const formatBadges = (badges: string[]): string[] => {
  return badges.map((badge) => badge.trim()).filter(Boolean);
};

/**
 * Gets responsive grid classes based on item count
 */
export const getGridClasses = (itemCount: number): string => {
  if (itemCount === 1) return 'grid-cols-1';
  if (itemCount === 2) return 'grid-cols-1 md:grid-cols-2';
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
};
