import { Metadata } from 'next';
import { ProductsProviderAdvanced } from '@/contexts/products-context-advanced';
import { ErrorBoundary } from '@/components/error-boundary';
import { ProductsClient } from './prodcuts-client';

export const metadata: Metadata = {
  title: 'Products Dashboard | Trustana',
  description:
    'Advanced filtering with complex query operators, shareable filters, and powerful data exploration capabilities.',
  keywords: ['products', 'dashboard', 'filtering', 'data exploration', 'trustana'],
  openGraph: {
    title: 'Products Dashboard | Trustana',
    description:
      'Advanced filtering with complex query operators, shareable filters, and powerful data exploration capabilities.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <ErrorBoundary>
      <ProductsProviderAdvanced>
        <ProductsClient />
      </ProductsProviderAdvanced>
    </ErrorBoundary>
  );
}
