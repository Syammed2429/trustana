"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Filter, Plus } from "lucide-react";
import { useAdvancedFilters } from "./hooks/use-advanced-filters";
import { QuickSearch } from "./components/quick-search";
import { SavedFiltersCard } from "./components/saved-filters-card";
import { FilterGroupCard } from "./components/filter-group-card";
import { SavedFilter } from "@/utils/filters/filter-utils";

interface AdvancedFiltersProps {
  onFiltersChange: (filters: Record<string, unknown>) => void;
  availableAttributes: string[];
  isDisabled?: boolean;
  className?: string;
}

/**
 * Optimized Advanced Filters Component
 *
 * Features:
 * - Separated business logic into custom hooks
 * - Modular component architecture
 * - Reusable utilities for filter operations
 * - Type-safe interfaces throughout
 * - Performance optimized with memoization
 * - Clean separation of concerns
 */
export const AdvancedFilters = ({
  onFiltersChange,
  availableAttributes,
  isDisabled = false,
  className = "",
}: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const {
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
  } = useAdvancedFilters({
    onFiltersChange,
    availableAttributes,
  });

  const handleLoadFilter = (filter: SavedFilter) => {
    loadFilter(filter);
    setIsOpen(false);
  };

  const handleImportFilters = async (file: File): Promise<void> => {
    await importFilters(file);
  };

  const handleApplyFilters = () => {
    applyFilters();
    setIsOpen(false);
  };

  return (
    <div className={className}>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <QuickSearch
            value={quickSearchTerm}
            onChange={setQuickSearchTerm}
            isDisabled={isDisabled}
          />
        </div>

        <div className='flex items-center gap-2'>
          {hasActiveFilters && (
            <Badge variant='secondary'>
              {totalConditionsCount} filters active
            </Badge>
          )}

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant='outline' disabled={isDisabled}>
                <Filter className='h-4 w-4 mr-2' />
                Advanced Filters
              </Button>
            </DialogTrigger>

            <DialogContent className='sm:max-w-4xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Advanced Filter Builder</DialogTitle>
                <DialogDescription>
                  Create complex filters with multiple conditions and logical
                  operators
                </DialogDescription>
              </DialogHeader>

              <div className='space-y-6'>
                {/* Saved Filters Section */}
                <SavedFiltersCard
                  savedFilters={savedFilters}
                  onSaveFilter={saveFilter}
                  onLoadFilter={handleLoadFilter}
                  onDeleteFilter={deleteFilter}
                  onExportFilters={exportFilters}
                  onImportFilters={handleImportFilters}
                />

                {/* Filter Groups */}
                <div className='space-y-4'>
                  {filterGroups.map((group) => (
                    <FilterGroupCard
                      key={group.id}
                      group={group}
                      availableAttributes={availableAttributes}
                      canRemove={filterGroups.length > 1}
                      onNameChange={(name) => updateGroup(group.id, { name })}
                      onLogicalOperatorChange={(logicalOperator) =>
                        updateGroup(group.id, { logicalOperator })
                      }
                      onAddCondition={() => addCondition(group.id)}
                      onRemoveGroup={() => removeGroup(group.id)}
                      onConditionChange={(conditionId, updates) =>
                        updateCondition(group.id, conditionId, updates)
                      }
                      onRemoveCondition={(conditionId) =>
                        removeCondition(group.id, conditionId)
                      }
                      onAttributeChange={(conditionId, attribute) =>
                        handleAttributeChange(group.id, conditionId, attribute)
                      }
                    />
                  ))}

                  <div className='flex justify-center'>
                    <Button variant='outline' onClick={addGroup}>
                      <Plus className='h-4 w-4 mr-2' />
                      Add Filter Group
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex justify-between pt-4 border-t'>
                  <Button variant='outline' onClick={clearAllFilters}>
                    Clear All Filters
                  </Button>
                  <div className='flex gap-2'>
                    <Button variant='outline' onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleApplyFilters}>Apply Filters</Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
