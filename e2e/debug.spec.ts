import { test } from '@playwright/test';

test.describe('Debug Tests', () => {
  test('should load the products page', async ({ page }) => {
    await page.goto('http://localhost:3000/products');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check for products table specifically
    const productsTable = page.locator('[data-testid="products-table"]');
    const isVisible = await productsTable.isVisible().catch(() => false);
    console.log(`Products table visible: ${isVisible}`);

    // Find all input elements
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    console.log(`Found ${inputCount} input elements`);

    // Check each input for placeholder text
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const placeholder = await input.getAttribute('placeholder');
      const type = await input.getAttribute('type');
      console.log(`Input ${i}: placeholder="${placeholder}", type="${type}"`);
    }

    // Look for search-related elements
    const searchElements = page.locator('*[placeholder*="search" i]');
    const searchCount = await searchElements.count();
    console.log(`Found ${searchCount} elements with search in placeholder`);

    // Look for any elements containing "search" text
    const searchText = page.locator('text=/.*search.*/i');
    const searchTextCount = await searchText.count();
    console.log(`Found ${searchTextCount} elements with search text`);
  });
});
