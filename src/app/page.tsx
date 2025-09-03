import { Metadata } from 'next';
import { HomeDashboard } from '@/components/home';
import { generateStructuredData } from '@/utils/home';

// SEO Metadata for the home page
export const metadata: Metadata = {
  metadataBase: new URL('https://trustana-dashboard.com'),
  title: 'Trustana Product Dashboard - Advanced Data Filtering Platform',
  description:
    'Advanced product data filtering and exploration with complex query operators, shareable filters, and powerful analytics. Built for enterprise-grade requirements.',
  keywords: [
    'product dashboard',
    'data filtering',
    'advanced search',
    'query operators',
    'data visualization',
    'business intelligence',
    'enterprise software',
    'product analytics',
  ],
  authors: [{ name: 'Trustana Engineering Team' }],
  creator: 'Trustana',
  publisher: 'Trustana',
  openGraph: {
    title: 'Trustana Product Dashboard',
    description: 'Advanced product data filtering and exploration platform',
    type: 'website',
    siteName: 'Trustana Dashboard',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Trustana Product Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trustana Product Dashboard',
    description: 'Advanced product data filtering and exploration platform',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
};

/**
 * Home page server component
 * Optimized for SEO with comprehensive metadata
 */
export default function HomePage() {
  // Generate structured data for SEO
  const structuredData = generateStructuredData();

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Main Dashboard Component */}
      <HomeDashboard />
    </>
  );
}
