/**
 * Home page data constants and configurations
 * Centralized data management for better maintainability
 */

import { Filter, Database, Share2, LucideIcon } from 'lucide-react';

export interface FeatureCard {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  badges: string[];
}

export interface DemoLink {
  id: string;
  href: string;
  title: string;
  variant: 'default' | 'outline';
  icon: LucideIcon;
}

export interface FeatureList {
  title: string;
  items: string[];
}

export interface ApiExample {
  title: string;
  description: string;
  code: string;
}

export const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'advanced-filtering',
    icon: Filter,
    title: 'Advanced Filtering',
    description: 'Complex query operators including $eq, $ne, $gt, $lt, $regex, $exists, and more',
    badges: ['String Operators', 'Numeric Comparisons', 'Boolean Logic', 'Date Ranges'],
  },
  {
    id: 'shareable-filters',
    icon: Share2,
    title: 'Shareable Filters',
    description: 'Save, share, and collaborate on filter configurations',
    badges: ['Save Filters', 'Export/Import', 'Team Sharing', 'Filter History'],
  },
  {
    id: 'performance',
    icon: Database,
    title: 'Performance',
    description: 'Optimized for handling large datasets with fast render times',
    badges: ['Infinite Scroll', 'Virtual Rendering', 'Debounced Search', 'Query Optimization'],
  },
];

export const DEMO_LINKS: DemoLink[] = [
  {
    id: 'advanced-dashboard',
    href: '/products',
    title: 'Try Advanced Dashboard',
    variant: 'default',
    icon: Filter,
  },
  {
    id: 'simple-dashboard',
    href: '/simple',
    title: 'Simple Dashboard',
    variant: 'outline',
    icon: Database,
  },
];

export const ADVANCED_FEATURES: FeatureList[] = [
  {
    title: 'Query Engine',
    items: [
      'Complex filter composition with AND/OR logic',
      'Multiple filter groups with nested conditions',
      'Type-aware operators (string, number, boolean, date)',
      'Real-time filter preview and validation',
    ],
  },
  {
    title: 'User Experience',
    items: [
      'Intuitive drag-and-drop interface',
      'Quick search with autocomplete',
      'Column customization and sorting',
      'Rich content rendering with HTML support',
    ],
  },
];

export const API_EXAMPLES: ApiExample[] = [
  {
    title: 'Filter by Attribute Value',
    description: 'Basic attribute filtering with numeric comparison',
    code: `{
  "filter": {
    "attributes": {
      "netWeightPerUnitValue": {
        "value": { "$gt": 10 }
      }
    }
  }
}`,
  },
  {
    title: 'Complex Search with Multiple Conditions',
    description: 'Advanced filtering with AND/OR logic and regex matching',
    code: `{
  "filter": {
    "$and": [
      {
        "$or": [
          { "id": { "$regex": "search-term" } },
          { "skuId": { "$regex": "search-term" } }
        ]
      },
      {
        "attributes": {
          "brand": { "value": { "$eq": "Apple" } }
        }
      }
    ]
  }
}`,
  },
];

export const PAGE_CONFIG = {
  title: 'Trustana Product Dashboard',
  subtitle:
    'Advanced product data filtering and exploration with complex query operators, shareable filters, and powerful analytics.',
  advancedFeaturesTitle: 'Advanced Features',
  advancedFeaturesDescription:
    'Built for senior frontend engineers with enterprise-grade requirements',
  apiExamplesTitle: 'API Examples',
  apiExamplesDescription: 'Examples of complex queries supported by the advanced filter system',
} as const;
