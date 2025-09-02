import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AttributeFieldType, AttributeGroup } from "@/app/enums/attribute";
import { SupplierAttribute } from "@/app/types/attribute";
import {
  groupAttributesByGroup,
  getFieldTypeDisplayName,
} from "@/utils/attribute-utils";

interface AttributeEnumFilterProps {
  availableAttributes: SupplierAttribute[];
  onFilterByType?: (fieldType: AttributeFieldType | null) => void;
  onFilterByGroup?: (group: AttributeGroup | null) => void;
  selectedFieldType?: AttributeFieldType | null;
  selectedGroup?: AttributeGroup | null;
  className?: string;
}

/**
 * Component that demonstrates proper usage of AttributeFieldType and AttributeGroup enums
 * for filtering and organizing attributes as required by README.md
 */
export function AttributeEnumFilter({
  availableAttributes,
  onFilterByType,
  onFilterByGroup,
  selectedFieldType,
  selectedGroup,
  className = "",
}: AttributeEnumFilterProps) {
  // Group attributes using the enum utility
  const groupedAttributes = groupAttributesByGroup(availableAttributes);

  // Get unique field types present in the data
  const availableFieldTypes = Array.from(
    new Set(availableAttributes.map((attr) => attr.type))
  ).sort();

  // Get available groups (those that have attributes)
  const availableGroups = Object.keys(groupedAttributes)
    .filter((group) => group !== "Other") // Show enum groups first
    .sort();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Filter className='h-4 w-4' />
          Attribute Filters (Using Enums)
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Field Type Filter */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Filter by Field Type</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='w-full justify-between'>
                {selectedFieldType
                  ? getFieldTypeDisplayName(selectedFieldType)
                  : "All Field Types"}
                <ChevronDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-full'>
              <DropdownMenuItem
                onClick={() => onFilterByType?.(null)}
                className={selectedFieldType === null ? "bg-accent" : ""}
              >
                All Field Types
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {availableFieldTypes.map((fieldType) => (
                <DropdownMenuItem
                  key={fieldType}
                  onClick={() => onFilterByType?.(fieldType)}
                  className={selectedFieldType === fieldType ? "bg-accent" : ""}
                >
                  <span className='flex items-center gap-2'>
                    {getFieldTypeDisplayName(fieldType)}
                    <Badge variant='secondary' className='text-xs'>
                      {
                        availableAttributes.filter(
                          (attr) => attr.type === fieldType
                        ).length
                      }
                    </Badge>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Group Filter */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Filter by Group</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='w-full justify-between'>
                {selectedGroup || "All Groups"}
                <ChevronDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-full'>
              <DropdownMenuItem
                onClick={() => onFilterByGroup?.(null)}
                className={selectedGroup === null ? "bg-accent" : ""}
              >
                All Groups
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {availableGroups.map((group) => (
                <DropdownMenuItem
                  key={group}
                  onClick={() => onFilterByGroup?.(group as AttributeGroup)}
                  className={selectedGroup === group ? "bg-accent" : ""}
                >
                  <span className='flex items-center gap-2'>
                    {group}
                    <Badge variant='secondary' className='text-xs'>
                      {groupedAttributes[group]?.length || 0}
                    </Badge>
                  </span>
                </DropdownMenuItem>
              ))}
              {/* Show "Other" group if it exists */}
              {groupedAttributes["Other"] && (
                <DropdownMenuItem
                  onClick={() => onFilterByGroup?.(null)} // Other items don't have enum value
                  className={selectedGroup === null ? "" : ""}
                >
                  <span className='flex items-center gap-2'>
                    Other (Non-enum)
                    <Badge variant='secondary' className='text-xs'>
                      {groupedAttributes["Other"].length}
                    </Badge>
                  </span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Summary */}
        <div className='text-sm text-muted-foreground space-y-1'>
          <p>
            <strong>Total Attributes:</strong> {availableAttributes.length}
          </p>
          <p>
            <strong>Field Types:</strong> {availableFieldTypes.length}
          </p>
          <p>
            <strong>Groups:</strong> {Object.keys(groupedAttributes).length}
          </p>
        </div>

        {/* Current Filters */}
        {(selectedFieldType || selectedGroup) && (
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Active Filters:</label>
            <div className='flex flex-wrap gap-2'>
              {selectedFieldType && (
                <Badge variant='secondary' className='flex items-center gap-1'>
                  Type: {getFieldTypeDisplayName(selectedFieldType)}
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-4 w-4 p-0'
                    onClick={() => onFilterByType?.(null)}
                  >
                    ×
                  </Button>
                </Badge>
              )}
              {selectedGroup && (
                <Badge variant='secondary' className='flex items-center gap-1'>
                  Group: {selectedGroup}
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-4 w-4 p-0'
                    onClick={() => onFilterByGroup?.(null)}
                  >
                    ×
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
