"use client";

import * as React from "react";
import {
  IconEye,
  IconEyeOff,
  IconRefresh,
  IconSettings,
  IconX,
  IconCheck,
  IconColumns,
} from "@tabler/icons-react";
import { Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Product } from "@/app/types/product";

interface ColumnCustomizationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: any; // Table instance from react-table
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
}

interface ColumnState {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  resizable: boolean;
  dataType: "string" | "number" | "date" | "boolean" | "object";
}

interface ColumnItemProps {
  column: ColumnState;
  onToggleVisibility: (id: string) => void;
}

function ColumnItem({ column, onToggleVisibility }: ColumnItemProps) {
  return (
    <div
      className={`
        flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors
        ${column.visible ? "border-border" : "border-muted"}
      `}
    >
      <div className='flex items-center space-x-3 min-w-0 flex-1'>
        <Checkbox
          checked={column.visible}
          onCheckedChange={() => onToggleVisibility(column.id)}
          className='shrink-0'
        />
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <Label className='font-medium text-sm truncate'>
              {column.label}
            </Label>
          </div>
          <div className='flex items-center gap-2 mt-1'>
            <Badge variant='outline' className='text-xs'>
              {column.dataType}
            </Badge>
          </div>
        </div>
      </div>

      <div className='flex items-center space-x-2 shrink-0'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onToggleVisibility(column.id)}
                className='h-8 w-8 p-0'
              >
                {column.visible ? (
                  <IconEye className='h-4 w-4' />
                ) : (
                  <IconEyeOff className='h-4 w-4' />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {column.visible ? "Hide column" : "Show column"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

function formatColumnName(columnId: string): string {
  // Enhanced column name formatting
  return columnId
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace(/\bid\b/gi, "ID")
    .replace(/\bsku\b/gi, "SKU")
    .replace(/\burl\b/gi, "URL")
    .replace(/\bapi\b/gi, "API");
}

function getColumnDataType(
  column: Column<Product, unknown>
): ColumnState["dataType"] {
  // Determine data type based on column ID and sample data
  if (column.id.includes("date") || column.id.includes("time")) return "date";
  if (
    column.id.includes("count") ||
    column.id.includes("amount") ||
    column.id.includes("price")
  )
    return "number";
  if (column.id.includes("active") || column.id.includes("enabled"))
    return "boolean";
  if (column.id.includes("attributes") || column.id.includes("media"))
    return "object";
  return "string";
}

export function ColumnCustomization({
  table,
  onColumnVisibilityChange,
}: ColumnCustomizationProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [columns, setColumns] = React.useState<ColumnState[]>([]);
  const [originalColumns, setOriginalColumns] = React.useState<ColumnState[]>(
    []
  );
  const [hasChanges, setHasChanges] = React.useState(false);

  // Initialize columns state
  React.useEffect(() => {
    const tableColumns = table
      .getAllColumns()
      .filter((column: Column<Product, unknown>) => column.getCanHide())
      .map((column: Column<Product, unknown>) => ({
        id: column.id,
        label: formatColumnName(column.id),
        visible: column.getIsVisible(),
        sortable: column.getCanSort ? column.getCanSort() : false,
        resizable: true,
        dataType: getColumnDataType(column),
      }));

    setColumns(tableColumns);
    setOriginalColumns(tableColumns);
  }, [table]);

  const filteredColumns = columns.filter(
    (column) =>
      column.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      column.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleCount = columns.filter((col) => col.visible).length;
  const totalCount = columns.length;

  const handleToggleVisibility = (columnId: string) => {
    setColumns((prev) => {
      const updated = prev.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      );
      setHasChanges(true);
      return updated;
    });
  };

  const handleApplyChanges = () => {
    // Apply column visibility
    const visibility = columns.reduce(
      (acc, col) => ({
        ...acc,
        [col.id]: col.visible,
      }),
      {}
    );
    onColumnVisibilityChange?.(visibility);

    // Apply to table
    columns.forEach((col) => {
      const tableColumn = table.getColumn(col.id);
      if (tableColumn) {
        tableColumn.toggleVisibility(col.visible);
      }
    });

    setHasChanges(false);
    setOriginalColumns([...columns]);
    setIsOpen(false); // Close dialog after applying changes
  };

  const handleClearChanges = () => {
    setColumns([...originalColumns]);
    setHasChanges(false);
  };

  const handleShowAll = () => {
    setColumns((prev) => prev.map((col) => ({ ...col, visible: true })));
    setHasChanges(true);
  };

  const handleHideAll = () => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === "id" || col.id === "drag" || col.id === "select"
          ? col
          : { ...col, visible: false }
      )
    );
    setHasChanges(true);
  };

  const handleReset = () => {
    setColumns([...originalColumns]);
    setSearchTerm("");
    setHasChanges(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='gap-2'>
          <IconSettings className='h-4 w-4' />
          <span className='hidden lg:inline'>Customize Columns</span>
          <span className='lg:hidden'>Columns</span>
          <Badge variant='secondary' className='ml-1'>
            {visibleCount}/{totalCount}
          </Badge>
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-4xl max-h-[85vh] overflow-hidden flex flex-col'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <IconColumns className='h-5 w-5' />
            Customize Table Columns
          </DialogTitle>
          <DialogDescription>
            Toggle visibility, pin columns, and adjust widths. Click Apply to
            save your changes.
          </DialogDescription>
        </DialogHeader>

        <div className='flex-1 flex flex-col space-y-4 min-h-0'>
          {/* Quick Actions */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Input
                placeholder='Search columns...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-64'
              />
              <Badge variant='outline'>
                {filteredColumns.length} of {totalCount} columns
              </Badge>
            </div>

            <div className='flex items-center gap-2'>
              <Button variant='outline' size='sm' onClick={handleShowAll}>
                <IconEye className='h-4 w-4 mr-1' />
                Show All
              </Button>

              <Button variant='outline' size='sm' onClick={handleHideAll}>
                <IconEyeOff className='h-4 w-4 mr-1' />
                Hide All
              </Button>

              <Button variant='outline' size='sm' onClick={handleReset}>
                <IconRefresh className='h-4 w-4 mr-1' />
                Reset
              </Button>
            </div>
          </div>

          <Separator />

          {/* Column List */}
          <div className='flex-1 overflow-y-auto space-y-2 min-h-0'>
            {filteredColumns.map((column) => (
              <ColumnItem
                key={column.id}
                column={column}
                onToggleVisibility={handleToggleVisibility}
              />
            ))}
          </div>

          {/* Summary */}
          <div className='flex items-center justify-between p-3 bg-muted/50 rounded-lg'>
            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
              <span>
                <strong>{visibleCount}</strong> visible columns
              </span>
            </div>

            <div className='flex items-center gap-2'>
              {hasChanges ? (
                <>
                  <IconRefresh className='h-4 w-4 text-orange-600' />
                  <span className='text-sm text-orange-600'>
                    Changes pending
                  </span>
                </>
              ) : (
                <>
                  <IconCheck className='h-4 w-4 text-green-600' />
                  <span className='text-sm text-green-600'>
                    Changes applied
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className='flex-row justify-end gap-2'>
          <Button
            variant='outline'
            onClick={handleClearChanges}
            disabled={!hasChanges}
          >
            <IconX className='h-4 w-4 mr-1' />
            Clear Changes
          </Button>
          <Button onClick={handleApplyChanges} disabled={!hasChanges}>
            <IconCheck className='h-4 w-4 mr-1' />
            Apply Changes
          </Button>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
