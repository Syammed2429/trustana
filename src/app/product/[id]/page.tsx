import React, { Suspense } from "react";
import { Metadata } from "next";
import { fetchProductById } from "@/app/lib/product-api";
import { ProductNotFound } from "@/components/product/product-not-found";
import { ProductDetailSkeleton } from "@/components/product/product-detail-skeleton";
import { ProductDetailClient } from "@/components/product/product-detail-client";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Generate metadata for the product page (SEO optimization)
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return {
      title: "Product Not Found | Trustana",
      description: "The requested product could not be found.",
    };
  }

  const productName =
    product.attributes?.find((attr) => attr.key === "name")?.value || "Product";
  const productBrand = product.attributes?.find(
    (attr) => attr.key === "brand"
  )?.value;

  return {
    title: `${productName} ${
      productBrand ? `- ${productBrand}` : ""
    } | Trustana`,
    description: `View detailed information about ${productName}. Product ID: ${product.id}`,
    openGraph: {
      title: `${productName} ${productBrand ? `- ${productBrand}` : ""}`,
      description: `Product details for ${productName}`,
      type: "website",
    },
  };
}

/**
 * Server component for product detail page
 * Fetches data on the server for better performance and SEO
 */
export default async function ProductPage({ params }: ProductPageProps) {
  // Await params and fetch product data on the server
  const { id } = await params;
  const product = await fetchProductById(id);

  // Handle product not found
  if (!product) {
    return <ProductNotFound productId={id} />;
  }

  // Return the client component with the fetched data
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailClient product={product} />
    </Suspense>
  );
}
