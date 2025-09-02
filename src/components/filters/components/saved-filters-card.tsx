"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Save,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import { SavedFilter } from "@/utils/filters/filter-utils";
import { Textarea } from "@/components/ui/textarea";

interface SavedFiltersCardProps {
  savedFilters: SavedFilter[];
  onSaveFilter: (
    name: string,
    description?: string,
    isShared?: boolean
  ) => void;
  onLoadFilter: (filter: SavedFilter) => void;
  onDeleteFilter: (filterId: string) => void;
  onExportFilters: () => void;
  onImportFilters: (file: File) => Promise<void>;
}

interface SaveFormData {
  name: string;
  description: string;
  isShared: boolean;
}

export const SavedFiltersCard = memo(function SavedFiltersCard({
  savedFilters,
  onSaveFilter,
  onLoadFilter,
  onDeleteFilter,
  onExportFilters,
  onImportFilters,
}: SavedFiltersCardProps) {
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveFormData, setSaveFormData] = useState<SaveFormData>({
    name: "",
    description: "",
    isShared: false,
  });

  const handleSaveFilter = () => {
    if (!saveFormData.name.trim()) return;

    onSaveFilter(
      saveFormData.name,
      saveFormData.description || undefined,
      saveFormData.isShared
    );

    setShowSaveDialog(false);
    setSaveFormData({ name: "", description: "", isShared: false });
  };

  const handleCancelSave = () => {
    setShowSaveDialog(false);
    setSaveFormData({ name: "", description: "", isShared: false });
  };

  const handleImportFilters = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await onImportFilters(file);
      // Reset the input
      event.target.value = "";
    } catch (error) {
      console.error("Import failed:", error);
      alert(
        error instanceof Error ? error.message : "Failed to import filters"
      );
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-sm'>Saved Filters</CardTitle>
            <div className='flex gap-2'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => setShowSavedFilters(!showSavedFilters)}
              >
                {showSavedFilters ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => setShowSaveDialog(true)}
              >
                <Save className='h-4 w-4 mr-1' />
                Save
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={onExportFilters}
                disabled={savedFilters.length === 0}
              >
                <Download className='h-4 w-4 mr-1' />
                Export
              </Button>
              <label>
                <Button size='sm' variant='outline' asChild>
                  <span>
                    <Upload className='h-4 w-4 mr-1' />
                    Import
                  </span>
                </Button>
                <input
                  type='file'
                  accept='.json'
                  onChange={handleImportFilters}
                  className='hidden'
                />
              </label>
            </div>
          </div>
        </CardHeader>
        {showSavedFilters && (
          <CardContent>
            <ScrollArea className='max-h-72'>
              {savedFilters.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground'>
                  No saved filters yet. Create and save your first filter!
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                  {savedFilters.map((filter) => (
                    <div
                      key={filter.id}
                      className='p-3 border rounded-lg group hover:bg-muted/50 relative'
                    >
                      <div
                        className='cursor-pointer'
                        onClick={() => onLoadFilter(filter)}
                      >
                        <div className='font-medium text-sm'>{filter.name}</div>
                        {filter.description && (
                          <div className='text-xs text-muted-foreground mt-1'>
                            {filter.description}
                          </div>
                        )}
                        <div className='text-xs text-muted-foreground mt-2 flex items-center gap-2'>
                          <span>
                            {filter.filterGroups.reduce(
                              (acc, g) => acc + g.conditions.length,
                              0
                            )}{" "}
                            conditions
                          </span>
                          {filter.isShared && (
                            <Badge variant='outline' className='text-xs'>
                              Shared
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 h-6 w-6 p-0'
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteFilter(filter.id);
                        }}
                      >
                        <Trash2 className='h-3 w-3' />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        )}
      </Card>

      {/* Save Filter Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Save Filter</DialogTitle>
            <DialogDescription>
              Save your current filter configuration for future use
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <Label htmlFor='filter-name'>Filter Name *</Label>
              <Input
                id='filter-name'
                value={saveFormData.name}
                onChange={(e) =>
                  setSaveFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder='Enter a name for this filter'
                className='mt-1'
              />
            </div>

            <div>
              <Label htmlFor='filter-description'>Description</Label>
              <Textarea
                id='filter-description'
                value={saveFormData.description}
                onChange={(e) =>
                  setSaveFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder='Optional description for this filter'
                className='mt-1 w-full min-h-[80px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md'
                rows={3}
              />
            </div>

            <div className='flex items-center space-x-2'>
              <Input
                type='checkbox'
                id='filter-shared'
                checked={saveFormData.isShared}
                onChange={(e) =>
                  setSaveFormData((prev) => ({
                    ...prev,
                    isShared: e.target.checked,
                  }))
                }
                className='rounded border-border'
              />
              <Label htmlFor='filter-shared' className='text-sm'>
                Make this filter shareable with team members
              </Label>
            </div>
          </div>

          <div className='flex justify-end gap-2 pt-4'>
            <Button variant='outline' onClick={handleCancelSave}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveFilter}
              disabled={!saveFormData.name.trim()}
            >
              Save Filter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});
