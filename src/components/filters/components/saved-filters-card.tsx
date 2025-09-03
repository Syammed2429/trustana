'use client';

import { ChangeEvent, FC, memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, Download, Upload, ChevronDown, ChevronUp, Trash2, Share2 } from 'lucide-react';
import { SavedFilter } from '@/utils/filters/filter-utils';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface SavedFiltersCardProps {
  savedFilters: SavedFilter[];
  onSaveFilter: (name: string, description?: string, isShared?: boolean) => void;
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

export const SavedFiltersCard: FC<SavedFiltersCardProps> = memo(function SavedFiltersCard({
  savedFilters,
  onSaveFilter,
  onLoadFilter,
  onDeleteFilter,
  onExportFilters,
  onImportFilters,
}) {
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveFormData, setSaveFormData] = useState<SaveFormData>({
    name: '',
    description: '',
    isShared: false,
  });

  const handleShareFilter = async (filter: SavedFilter) => {
    try {
      // Generate a shareable URL with filter parameters
      const filterParams = new URLSearchParams();
      filterParams.set('shared_filter', filter.id);
      filterParams.set('filter_name', filter.name);

      const shareableUrl = `${window.location.origin}/products?${filterParams.toString()}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(shareableUrl);

      toast.success('🔗 Shared filter link copied!', {
        description: `Link for "${filter.name}" has been copied to your clipboard.`,
        duration: 4000,
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);

      // Fallback for browsers that don't support clipboard API
      toast.error('❌ Failed to copy link', {
        description: "Your browser doesn't support clipboard access. Please copy manually.",
        duration: 5000,
      });
    }
  };

  const handleSaveFilter = () => {
    if (!saveFormData.name.trim()) return;

    onSaveFilter(saveFormData.name, saveFormData.description || undefined, saveFormData.isShared);

    setShowSaveDialog(false);
    setSaveFormData({ name: '', description: '', isShared: false });
  };

  const handleCancelSave = () => {
    setShowSaveDialog(false);
    setSaveFormData({ name: '', description: '', isShared: false });
  };

  const handleImportFilters = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await onImportFilters(file);
      // Reset the input
      event.target.value = '';
    } catch (error) {
      console.error('Import failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to import filters');
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
              <Button size='sm' variant='outline' onClick={() => setShowSaveDialog(true)}>
                <Save className='mr-1 h-4 w-4' />
                Save
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={onExportFilters}
                disabled={savedFilters.length === 0}
              >
                <Download className='mr-1 h-4 w-4' />
                Export
              </Button>
              <label>
                <Button size='sm' variant='outline' asChild>
                  <span>
                    <Upload className='mr-1 h-4 w-4' />
                    Import
                  </span>
                </Button>
                <Input
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
                <div className='text-muted-foreground py-8 text-center'>
                  No saved filters yet. Create and save your first filter!
                </div>
              ) : (
                <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3'>
                  {savedFilters.map((filter) => (
                    <div
                      key={filter.id}
                      className='group hover:bg-muted/50 relative rounded-lg border p-3'
                    >
                      <div className='cursor-pointer' onClick={() => onLoadFilter(filter)}>
                        <div className='text-sm font-medium'>{filter.name}</div>
                        {filter.description && (
                          <div className='text-muted-foreground mt-1 text-xs'>
                            {filter.description}
                          </div>
                        )}
                        <div className='text-muted-foreground mt-2 flex items-center gap-2 text-xs'>
                          <span>
                            {filter.filterGroups.reduce((acc, g) => acc + g.conditions.length, 0)}{' '}
                            conditions
                          </span>
                          {filter.isShared && (
                            <Badge variant='outline' className='text-xs'>
                              Shared
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Action buttons that appear on hover */}
                      <div className='absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100'>
                        {/* Share button - only show for shared filters */}
                        {filter.isShared && (
                          <Button
                            size='sm'
                            variant='ghost'
                            className='h-6 w-6 p-0 text-blue-500 hover:bg-blue-100 hover:text-blue-600'
                            onClick={(e: { stopPropagation: () => void }) => {
                              e.stopPropagation();
                              handleShareFilter(filter);
                            }}
                            title='Copy shared filter link'
                          >
                            <Share2 className='h-3 w-3' />
                          </Button>
                        )}

                        {/* Delete button */}
                        <Button
                          size='sm'
                          variant='ghost'
                          className='h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600'
                          onClick={(e: { stopPropagation: () => void }) => {
                            e.stopPropagation();
                            onDeleteFilter(filter.id);
                          }}
                          title='Delete filter'
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
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
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setSaveFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder='Optional description for this filter'
                className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                rows={3}
              />
            </div>

            <div className='flex items-center space-x-2'>
              <Checkbox
                id='filter-shared'
                checked={saveFormData.isShared}
                onCheckedChange={(checked: boolean) =>
                  setSaveFormData((prev) => ({
                    ...prev,
                    isShared: checked,
                  }))
                }
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
            <Button onClick={handleSaveFilter} disabled={!saveFormData.name.trim()}>
              Save Filter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});
