"use client";

import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "use-debounce";
import {
  FilterGroup,
  SavedFilter,
  generateFilterId,
  getDefaultAttribute,
  convertToAPIFormat,
  composeFilters,
  detectDataType,
  FilterCondition,
} from "@/utils/filters/filter-utils";
import {
  loadFiltersFromStorage,
  addFilterToStorage,
  removeFilterFromStorage,
} from "@/utils/filters/storage-utils";
import {
  exportFiltersToJSON,
  importFiltersFromJSON,
} from "@/utils/filters/file-operations";

interface UseAdvancedFiltersProps {
  onFiltersChange: (filters: Record<string, unknown>) => void;
  availableAttributes: string[];
  debounceMs?: number;
}

/**
 * Custom hook for managing advanced filters logic
 * Separates all business logic from UI components
 */
export function useAdvancedFilters({
  onFiltersChange,
  availableAttributes,
  debounceMs = 500,
}: UseAdvancedFiltersProps) {
  // State management
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([
    {
      id: "default",
      name: "Default Group",
      conditions: [],
      logicalOperator: "AND",
    },
  ]);

  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [quickSearchTerm, setQuickSearchTerm] = useState("");
  const [lastAppliedAdvancedFilters, setLastAppliedAdvancedFilters] = useState<
    FilterGroup[]
  >([]);

  // Debounced search term
  const [debouncedSearchTerm] = useDebounce(quickSearchTerm, debounceMs);

  // Load saved filters from storage on mount
  useEffect(() => {
    const storedFilters = loadFiltersFromStorage();
    setSavedFilters(storedFilters);
  }, []);

  // Compose and apply filters
  const composeAndApplyFilters = useCallback(
    (advancedFilters: Record<string, unknown>, searchTerm: string) => {
      const composedFilters = composeFilters(advancedFilters, searchTerm);
      onFiltersChange(composedFilters);
    },
    [onFiltersChange]
  );

  // Apply filters manually when "Apply Filters" is clicked
  const applyFilters = useCallback(() => {
    const apiFilters = convertToAPIFormat(filterGroups);
    setLastAppliedAdvancedFilters(filterGroups);
    composeAndApplyFilters(apiFilters, debouncedSearchTerm);
  }, [filterGroups, debouncedSearchTerm, composeAndApplyFilters]);

  // Auto-apply search when debounced search term changes
  useEffect(() => {
    const lastAppliedAdvancedFiltersApi = convertToAPIFormat(
      lastAppliedAdvancedFilters
    );
    composeAndApplyFilters(lastAppliedAdvancedFiltersApi, debouncedSearchTerm);
  }, [debouncedSearchTerm, lastAppliedAdvancedFilters, composeAndApplyFilters]);

  // Filter management functions
  const addCondition = useCallback(
    (groupId: string) => {
      setFilterGroups((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? {
                ...group,
                conditions: [
                  ...group.conditions,
                  {
                    id: generateFilterId(),
                    attribute: getDefaultAttribute(availableAttributes),
                    operator: "$eq",
                    value: "",
                    dataType: "string",
                  },
                ],
              }
            : group
        )
      );
    },
    [availableAttributes]
  );

  const removeCondition = useCallback(
    (groupId: string, conditionId: string) => {
      setFilterGroups((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? {
                ...group,
                conditions: group.conditions.filter(
                  (c) => c.id !== conditionId
                ),
              }
            : group
        )
      );
    },
    []
  );

  const updateCondition = useCallback(
    (
      groupId: string,
      conditionId: string,
      updates: Partial<FilterCondition>
    ) => {
      setFilterGroups((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? {
                ...group,
                conditions: group.conditions.map((c) =>
                  c.id === conditionId ? { ...c, ...updates } : c
                ),
              }
            : group
        )
      );
    },
    []
  );

  const addGroup = useCallback(() => {
    setFilterGroups((prev) => [
      ...prev,
      {
        id: generateFilterId(),
        name: `Group ${prev.length + 1}`,
        conditions: [],
        logicalOperator: "AND",
      },
    ]);
  }, []);

  const removeGroup = useCallback((groupId: string) => {
    setFilterGroups((prev) => {
      if (prev.length > 1) {
        return prev.filter((g) => g.id !== groupId);
      }
      return prev;
    });
  }, []);

  const updateGroup = useCallback(
    (groupId: string, updates: Partial<FilterGroup>) => {
      setFilterGroups((prev) =>
        prev.map((group) =>
          group.id === groupId ? { ...group, ...updates } : group
        )
      );
    },
    []
  );

  // Saved filters management
  const saveFilter = useCallback(
    (name: string, description?: string, isShared = false) => {
      const newFilter: SavedFilter = {
        id: generateFilterId(),
        name: name.trim(),
        description: description?.trim() || undefined,
        filterGroups: [...filterGroups],
        createdAt: new Date(),
        isShared,
      };

      const updatedFilters = addFilterToStorage(newFilter);
      setSavedFilters(updatedFilters);
      return newFilter;
    },
    [filterGroups]
  );

  const loadFilter = useCallback(
    (savedFilter: SavedFilter) => {
      setFilterGroups([...savedFilter.filterGroups]);
      const apiFilters = convertToAPIFormat(savedFilter.filterGroups);
      composeAndApplyFilters(apiFilters, quickSearchTerm);
    },
    [quickSearchTerm, composeAndApplyFilters]
  );

  const deleteFilter = useCallback((filterId: string) => {
    const updatedFilters = removeFilterFromStorage(filterId);
    setSavedFilters(updatedFilters);
  }, []);

  // File operations
  const exportFilters = useCallback(() => {
    try {
      exportFiltersToJSON(savedFilters);
    } catch (error) {
      console.error("Export failed:", error);
      throw error;
    }
  }, [savedFilters]);

  const importFilters = useCallback(async (file: File) => {
    try {
      const importedFilters = await importFiltersFromJSON(file);
      setSavedFilters((prev) => [...prev, ...importedFilters]);
      return importedFilters;
    } catch (error) {
      console.error("Import failed:", error);
      throw error;
    }
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilterGroups([
      {
        id: "default",
        name: "Default Group",
        conditions: [],
        logicalOperator: "AND",
      },
    ]);
    setQuickSearchTerm("");
    onFiltersChange({});
    setLastAppliedAdvancedFilters([]);
  }, [onFiltersChange]);

  // Attribute change handler with auto data type detection
  const handleAttributeChange = useCallback(
    (groupId: string, conditionId: string, attribute: string) => {
      const detectedType = detectDataType(attribute);
      updateCondition(groupId, conditionId, {
        attribute,
        dataType: detectedType,
        operator: "$eq", // Reset operator when attribute changes
      });
    },
    [updateCondition]
  );

  // Computed values
  const hasActiveFilters =
    filterGroups.some((g) => g.conditions.length > 0) || quickSearchTerm;

  const totalConditionsCount = filterGroups.reduce(
    (acc, g) => acc + g.conditions.length,
    0
  );

  return {
    // State
    filterGroups,
    savedFilters,
    quickSearchTerm,
    hasActiveFilters,
    totalConditionsCount,

    // Search
    setQuickSearchTerm,

    // Filter management
    addCondition,
    removeCondition,
    updateCondition,
    addGroup,
    removeGroup,
    updateGroup,
    handleAttributeChange,

    // Apply filters
    applyFilters,
    clearAllFilters,

    // Saved filters
    saveFilter,
    loadFilter,
    deleteFilter,

    // File operations
    exportFilters,
    importFilters,
  };
}
