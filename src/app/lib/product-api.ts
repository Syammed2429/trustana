import { Product } from "@/app/types/product";

/**
 * Server-side product data fetching utilities
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Fetch a single product by ID (server-side)
 * @param id - Product ID
 * @returns Product data or null if not found
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { id: { $eq: id } },
        pagination: { offset: 0, limit: 1 },
      }),
      cache: "force-cache", // Enable caching for better performance
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const products = data?.data || [];

    return products.length > 0 ? products[0] : null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
