import { Metadata } from "next";
import { ProductsProviderAdvanced } from "@/contexts/products-context-advanced";
import { ErrorBoundary } from "@/components/error-boundary";
import { AdvancedProductsDashboard } from "@/components/products/advanced-products-dashboard";

export const metadata: Metadata = {
  title: "Products Dashboard | Trustana",
  description:
    "Advanced filtering with complex query operators, shareable filters, and powerful data exploration capabilities.",
  keywords: [
    "products",
    "dashboard",
    "filtering",
    "data exploration",
    "trustana",
  ],
  openGraph: {
    title: "Products Dashboard | Trustana",
    description:
      "Advanced filtering with complex query operators, shareable filters, and powerful data exploration capabilities.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <ErrorBoundary>
      <ProductsProviderAdvanced>
        <div className='container mx-auto py-8'>
          <div className='space-y-6'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold tracking-tight'>
                Trustana Advanced Product Dashboard
              </h1>
              <p className='text-muted-foreground'>
                Advanced filtering with complex query operators, shareable
                filters, and powerful data exploration capabilities.
              </p>
            </div>
            <AdvancedProductsDashboard />
          </div>
        </div>
      </ProductsProviderAdvanced>
    </ErrorBoundary>
  );
}
