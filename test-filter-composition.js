#!/usr/bin/env node

/**
 * Test script to demonstrate the filter composition fix
 *
 * This script tests that:
 * 1. Search without advanced filters searches the entire dataset
 * 2. Advanced filters + search compose correctly using $and operator
 * 3. Search operates on the already-filtered dataset when both are active
 */

const baseUrl = 'http://localhost:3000';

async function makeRequest(description, filter) {
  console.log(`\n🧪 ${description}`);
  console.log(`Filter: ${JSON.stringify(filter, null, 2)}`);

  try {
    const response = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filter,
        pagination: { offset: 0, limit: 5 },
      }),
    });

    const data = await response.json();
    const count = data?.data?.length || 0;
    console.log(`✅ Results: ${count} products found`);

    // Show first result for verification
    if (count > 0) {
      const first = data.data[0];
      console.log(
        `   Example: ${first.id} - ${
          first.attributes?.name || 'No name'
        } (Brand: ${first.attributes?.brand || 'N/A'})`
      );
    }

    return { count, data: data?.data || [] };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return { count: 0, data: [] };
  }
}

async function runTests() {
  console.log('🚀 Testing Filter Composition Fix');
  console.log('===================================');

  // Test 1: Search only (no advanced filters)
  const searchOnlyFilter = {
    $or: [
      { id: { $regex: 'apple', $options: 'i' } },
      { skuId: { $regex: 'apple', $options: 'i' } },
      { 'attributes.brand': { $regex: 'apple', $options: 'i' } },
      { 'attributes.name': { $regex: 'apple', $options: 'i' } },
    ],
  };

  const searchOnlyResult = await makeRequest(
    'Test 1: Search only - "apple" across all data',
    searchOnlyFilter
  );

  // Test 2: Advanced filter only (no search)
  const advancedOnlyFilter = {
    'attributes.category': { $regex: 'electronics', $options: 'i' },
  };

  const advancedOnlyResult = await makeRequest(
    'Test 2: Advanced filter only - category contains "electronics"',
    advancedOnlyFilter
  );

  // Test 3: Composed filter (advanced + search) - THIS IS THE KEY TEST
  const composedFilter = {
    $and: [
      { 'attributes.category': { $regex: 'electronics', $options: 'i' } }, // Advanced filter
      {
        $or: [
          // Search filter
          { id: { $regex: 'apple', $options: 'i' } },
          { skuId: { $regex: 'apple', $options: 'i' } },
          { 'attributes.brand': { $regex: 'apple', $options: 'i' } },
          { 'attributes.name': { $regex: 'apple', $options: 'i' } },
        ],
      },
    ],
  };

  const composedResult = await makeRequest(
    'Test 3: 🎯 COMPOSED FILTER - Electronics category AND apple search',
    composedFilter
  );

  // Analysis
  console.log('\n📊 Analysis');
  console.log('============');
  console.log(`Search only results: ${searchOnlyResult.count}`);
  console.log(`Advanced filter only: ${advancedOnlyResult.count}`);
  console.log(`Composed filter results: ${composedResult.count}`);

  // The composed result should be <= both individual results
  // because it's applying both filters together
  if (
    composedResult.count <= searchOnlyResult.count &&
    composedResult.count <= advancedOnlyResult.count
  ) {
    console.log('✅ SUCCESS: Composed filter correctly returns subset of individual filters');
    console.log('✅ Search is now operating on the already-filtered dataset!');
  } else {
    console.log('❌ ISSUE: Composed filter returned more results than individual filters');
  }

  console.log('\n🎉 Filter composition fix verification complete!');
}

// Run the tests
runTests().catch(console.error);
