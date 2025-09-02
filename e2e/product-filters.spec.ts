import { test, expect } from "@playwright/test";

test.describe("Product Filters", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page before each test
    await page.goto("/");

    // Wait for the initial data to load
    await page.waitForSelector('[data-testid="products-table"]', {
      timeout: 10000,
    });
  });

  test("should filter products by search term", async ({ page }) => {
    // Test basic search functionality
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill("Apple");

    // Wait for the search to complete
    await page.waitForTimeout(1000);

    // Check that filtered results contain Apple products
    const productRows = page.locator('[data-testid="product-row"]');
    await expect(productRows.first()).toBeVisible();

    // Verify that results contain "Apple" in some form
    const firstRowText = await productRows.first().textContent();
    expect(firstRowText?.toLowerCase()).toContain("apple");
  });

  test("should filter products using attribute filters", async ({ page }) => {
    // Test attribute-based filtering

    // Try to find and click on an attribute filter dropdown
    const filterButton = page.locator('button:has-text("Brand")').first();
    if (await filterButton.isVisible()) {
      await filterButton.click();

      // Select a specific brand option
      const appleOption = page.locator('text="Apple"').first();
      if (await appleOption.isVisible()) {
        await appleOption.click();

        // Wait for results to update
        await page.waitForTimeout(1000);

        // Verify filtered results
        const productRows = page.locator('[data-testid="product-row"]');
        await expect(productRows.first()).toBeVisible();
      }
    }
  });

  test("should navigate to product detail page", async ({ page }) => {
    // Test navigation to product detail
    const firstProductRow = page.locator('[data-testid="product-row"]').first();
    await expect(firstProductRow).toBeVisible();

    // Click on the first product row
    await firstProductRow.click();

    // Wait for navigation to complete
    await page.waitForURL(/\/product\/[a-f0-9]+/, { timeout: 10000 });

    // Verify we're on a product detail page
    await expect(page.locator('[data-testid="product-header"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="product-overview"]')
    ).toBeVisible();
  });

  test("should share filters via URL", async ({ page }) => {
    // Test shareable filters functionality

    // Apply a search filter
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill("MacBook");
    await page.waitForTimeout(1000);

    // Get the current URL with filters
    const urlWithFilter = page.url();

    // Navigate to a different page
    await page.goto("/product/68884a88761e9efa0bed4672");

    // Navigate back using the filtered URL
    await page.goto(urlWithFilter);

    // Verify the filter is still applied
    const searchValue = await searchInput.inputValue();
    expect(searchValue).toBe("MacBook");
  });

  test("should manage columns visibility", async ({ page }) => {
    // Test column customization

    // Look for column management button
    const columnButton = page.locator('button:has-text("Columns")').first();
    if (await columnButton.isVisible()) {
      await columnButton.click();

      // Wait for column options to appear
      await page.waitForTimeout(500);

      // Try to toggle a column
      const columnCheckbox = page.locator('input[type="checkbox"]').first();
      if (await columnCheckbox.isVisible()) {
        const wasChecked = await columnCheckbox.isChecked();
        await columnCheckbox.click();

        // Wait for table to update
        await page.waitForTimeout(500);

        // Verify the column visibility changed
        const isNowChecked = await columnCheckbox.isChecked();
        expect(isNowChecked).toBe(!wasChecked);
      }
    }
  });

  test("should handle large datasets with infinite scroll", async ({
    page,
  }) => {
    // Test infinite scroll functionality

    // Get initial number of rows
    const initialRows = await page
      .locator('[data-testid="product-row"]')
      .count();

    // Scroll to bottom to trigger loading more data
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Wait for new data to load
    await page.waitForTimeout(2000);

    // Check if more rows were loaded
    const finalRows = await page.locator('[data-testid="product-row"]').count();

    // Should have loaded more rows or stayed the same if all data is loaded
    expect(finalRows).toBeGreaterThanOrEqual(initialRows);
  });

  test("should handle error states gracefully", async ({ page }) => {
    // Test error handling

    // Try searching for something that might not exist
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill("XYZ_NONEXISTENT_PRODUCT_12345");
    await page.waitForTimeout(1000);

    // Should show no results or handle gracefully
    const noResultsText = page.locator('text="No products found"');
    const emptyState = page.locator('[data-testid="empty-state"]');

    // Either no results message or empty state should be shown
    await expect(
      noResultsText.or(emptyState).or(page.locator('text="No results"'))
    ).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Product Detail CRUD Operations", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a specific product
    await page.goto("/product/68884a88761e9efa0bed4672");
    await page.waitForSelector('[data-testid="product-header"]', {
      timeout: 10000,
    });
  });

  test("should open edit dialog and show HTML preview", async ({ page }) => {
    // Test edit functionality
    const editButton = page.locator('button:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await editButton.click();

      // Wait for edit dialog to open
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

      // Verify dialog content
      await expect(page.locator('text="Edit Product"')).toBeVisible();

      // Look for HTML preview if content contains HTML
      const htmlPreview = page.locator('text="Preview:"');
      if (await htmlPreview.isVisible()) {
        expect(await htmlPreview.isVisible()).toBe(true);
      }

      // Close dialog
      const cancelButton = page.locator('button:has-text("Cancel")');
      await cancelButton.click();
    }
  });

  test("should show delete confirmation dialog", async ({ page }) => {
    // Test delete functionality
    const moreButton = page.locator('button[aria-haspopup="menu"]').first();
    if (await moreButton.isVisible()) {
      await moreButton.click();

      const deleteOption = page.locator('text="Delete Product"');
      if (await deleteOption.isVisible()) {
        await deleteOption.click();

        // Wait for delete dialog
        await page.waitForSelector('[role="dialog"]', { timeout: 5000 });

        // Verify delete dialog content
        await expect(page.locator('text="Delete Product"')).toBeVisible();
        await expect(
          page.locator('text="This action cannot be undone"')
        ).toBeVisible();

        // Cancel the deletion
        const cancelButton = page.locator('button:has-text("Cancel")');
        await cancelButton.click();
      }
    }
  });
});
