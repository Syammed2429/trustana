import { SavedFilter } from './filter-utils';

/**
 * Export filters as JSON file
 */
export const exportFiltersToJSON = (
  filters: SavedFilter[],
  filename = 'trustana-filters.json'
): void => {
  try {
    const dataStr = JSON.stringify(filters, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
  } catch (error) {
    console.error('Failed to export filters:', error);
    throw new Error('Failed to export filters');
  }
};

/**
 * Import filters from JSON file
 */
export const importFiltersFromJSON = (file: File): Promise<SavedFilter[]> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (!file.name.endsWith('.json')) {
      reject(new Error('Invalid file format. Please select a JSON file.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content);

        // Validate the imported data structure
        if (!Array.isArray(imported)) {
          throw new Error('Invalid file format. Expected an array of filters.');
        }

        // Basic validation for each filter
        const validatedFilters = imported.map((filter, index) => {
          if (!filter.id || !filter.name || !filter.filterGroups) {
            throw new Error(`Invalid filter at index ${index}. Missing required fields.`);
          }

          return {
            ...filter,
            createdAt: filter.createdAt ? new Date(filter.createdAt) : new Date(),
          };
        });

        resolve(validatedFilters);
      } catch (error) {
        reject(
          new Error(
            `Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`
          )
        );
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

/**
 * Download data as file with proper error handling
 */
export const downloadAsFile = (data: string, filename: string, mimeType = 'text/plain'): void => {
  try {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.download = filename;
    linkElement.click();

    // Cleanup
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download file:', error);
    throw new Error('Failed to download file');
  }
};
