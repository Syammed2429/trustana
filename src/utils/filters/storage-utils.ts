import { SavedFilter } from './filter-utils';

const STORAGE_KEY = 'trustana-saved-filters';

/**
 * Save filters to local storage
 */
export const saveFiltersToStorage = (filters: SavedFilter[]): void => {
  try {
    const serialized = JSON.stringify(filters);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save filters to storage:', error);
    throw new Error('Failed to save filters to local storage');
  }
};

/**
 * Load filters from local storage
 */
export const loadFiltersFromStorage = (): SavedFilter[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);

    // Validate and convert dates
    return Array.isArray(parsed)
      ? parsed.map((filter) => ({
          ...filter,
          createdAt: new Date(filter.createdAt),
        }))
      : [];
  } catch (error) {
    console.error('Failed to load filters from storage:', error);
    return [];
  }
};

/**
 * Clear all saved filters from storage
 */
export const clearFiltersFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear filters from storage:', error);
    throw new Error('Failed to clear filters from local storage');
  }
};

/**
 * Add a new filter to storage
 */
export const addFilterToStorage = (filter: SavedFilter): SavedFilter[] => {
  const existingFilters = loadFiltersFromStorage();
  const updatedFilters = [...existingFilters, filter];
  saveFiltersToStorage(updatedFilters);
  return updatedFilters;
};

/**
 * Remove a filter from storage by ID
 */
export const removeFilterFromStorage = (filterId: string): SavedFilter[] => {
  const existingFilters = loadFiltersFromStorage();
  const updatedFilters = existingFilters.filter((f) => f.id !== filterId);
  saveFiltersToStorage(updatedFilters);
  return updatedFilters;
};

/**
 * Update a filter in storage
 */
export const updateFilterInStorage = (updatedFilter: SavedFilter): SavedFilter[] => {
  const existingFilters = loadFiltersFromStorage();
  const updatedFilters = existingFilters.map((f) =>
    f.id === updatedFilter.id ? updatedFilter : f
  );
  saveFiltersToStorage(updatedFilters);
  return updatedFilters;
};
