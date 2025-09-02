import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Filter, X, Search } from "lucide-react";
import { AttributeFieldType, AttributeGroup } from "@/app/enums/attribute";
import { SupplierAttribute } from "@/app/types/attribute";
import { Product } from "@/app/types/product";
import {
  getFieldTypeDisplayName,
  groupAttributesByGroup,
  getOperatorsForFieldType,
} from "@/utils/attribute-utils";

interface EnhancedProductFiltersProps {
  products: Product[];
  availableAttributes: SupplierAttribute[]; // Pass these separately
  onFiltersChange: (filteredProducts: Product[]) => void;
  className?: string;
}

interface AttributeFilter {
  id: string;
  attributeKey: string;
  operator: string;
  value: string;
  fieldType: AttributeFieldType;
}

/**
 * Enhanced product filters that properly utilize AttributeFieldType and AttributeGroup enums
 * for type-aware filtering and validation as required by README.md
 */
export function EnhancedProductFilters({
  products,
  availableAttributes,
  onFiltersChange,
  className = "",
}: EnhancedProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<AttributeGroup | "all">(
    "all"
  );
  const [selectedFieldType, setSelectedFieldType] = useState<
    AttributeFieldType | "all"
  >("all");
  const [attributeFilters, setAttributeFilters] = useState<AttributeFilter[]>(
    []
  );

  // Group attributes using enum-based utility
  const groupedAttributes = groupAttributesByGroup(availableAttributes);

  // Get available field types and groups
  const availableFieldTypes = Array.from(
    new Set(availableAttributes.map((attr) => attr.type))
  ).sort();

  const availableGroups = Object.keys(groupedAttributes).filter(
    (group) => groupedAttributes[group].length > 0
  );

  // Filter attributes based on selected group and field type
  const filteredAttributes = React.useMemo(() => {
    let filtered = availableAttributes;

    if (selectedGroup !== "all") {
      const groupAttrs = groupedAttributes[selectedGroup] || [];
      filtered = filtered.filter((attr) =>
        groupAttrs.some((groupAttr) => groupAttr.id === attr.id)
      );
    }

    if (selectedFieldType !== "all") {
      filtered = filtered.filter((attr) => attr.type === selectedFieldType);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (attr) =>
          attr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          attr.key.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [
    availableAttributes,
    groupedAttributes,
    selectedGroup,
    selectedFieldType,
    searchTerm,
  ]);

  // Simple validation function for field values
  const validateFieldValue = (
    value: string,
    fieldType: AttributeFieldType,
    operator: string,
    filterValue: string
  ): boolean => {
    if (!value || !filterValue) return false;

    const stringValue = String(value).toLowerCase();
    const filterString = filterValue.toLowerCase();

    switch (operator) {
      case "$eq":
        return stringValue === filterString;
      case "$ne":
        return stringValue !== filterString;
      case "$regex":
        return stringValue.includes(filterString);
      case "$gt":
        if (
          fieldType === AttributeFieldType.NUMBER ||
          fieldType === AttributeFieldType.PRICE
        ) {
          return parseFloat(String(value)) > parseFloat(filterValue);
        }
        return stringValue > filterString;
      case "$lt":
        if (
          fieldType === AttributeFieldType.NUMBER ||
          fieldType === AttributeFieldType.PRICE
        ) {
          return parseFloat(String(value)) < parseFloat(filterValue);
        }
        return stringValue < filterString;
      case "$exists":
        return Boolean(value);
      default:
        return true;
    }
  };

  // Apply all filters to products
  const applyFilters = React.useCallback(() => {
    let filtered = products;

    // Apply attribute filters
    attributeFilters.forEach((filter) => {
      filtered = filtered.filter((product) => {
        const attr = product.attributes.find(
          (a) => a.key === filter.attributeKey
        );
        if (!attr || attr.value === null) return false;

        // Use our validation function
        return validateFieldValue(
          String(attr.value),
          filter.fieldType,
          filter.operator,
          filter.value
        );
      });
    });

    onFiltersChange(filtered);
  }, [products, attributeFilters, onFiltersChange]);

  // Apply filters whenever they change
  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const addAttributeFilter = () => {
    if (filteredAttributes.length === 0) return;

    const firstAttribute = filteredAttributes[0];
    const operators = getOperatorsForFieldType(firstAttribute.type);

    const newFilter: AttributeFilter = {
      id: Math.random().toString(36).substr(2, 9),
      attributeKey: firstAttribute.key,
      operator: operators[0].value,
      value: "",
      fieldType: firstAttribute.type,
    };

    setAttributeFilters((prev) => [...prev, newFilter]);
  };

  const updateAttributeFilter = (
    id: string,
    updates: Partial<AttributeFilter>
  ) => {
    setAttributeFilters((prev) =>
      prev.map((filter) => {
        if (filter.id === id) {
          const updated = { ...filter, ...updates };

          // If attribute changed, update field type and reset operator
          if (updates.attributeKey) {
            const attr = availableAttributes.find(
              (a) => a.key === updates.attributeKey
            );
            if (attr) {
              const operators = getOperatorsForFieldType(attr.type);
              updated.fieldType = attr.type;
              updated.operator = operators[0].value;
              updated.value = "";
            }
          }

          return updated;
        }
        return filter;
      })
    );
  };

  const removeAttributeFilter = (id: string) => {
    setAttributeFilters((prev) => prev.filter((filter) => filter.id !== id));
  };

  const clearAllFilters = () => {
    setAttributeFilters([]);
    setSearchTerm("");
    setSelectedGroup("all");
    setSelectedFieldType("all");
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Filter className='h-4 w-4' />
            Enhanced Filters (Enum-Based)
          </div>
          {(attributeFilters.length > 0 ||
            searchTerm ||
            selectedGroup !== "all" ||
            selectedFieldType !== "all") && (
            <Button variant='outline' size='sm' onClick={clearAllFilters}>
              <X className='h-4 w-4 mr-1' />
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Search */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Search Attributes</label>
          <div className='relative'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search by attribute name...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-8'
            />
          </div>
        </div>

        {/* Group and Type Filters */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Group</label>
            <Select
              value={selectedGroup}
              onValueChange={(value) =>
                setSelectedGroup(value as AttributeGroup | "all")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Groups</SelectItem>
                {availableGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group} ({groupedAttributes[group].length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Field Type</label>
            <Select
              value={selectedFieldType}
              onValueChange={(value) =>
                setSelectedFieldType(value as AttributeFieldType | "all")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Types</SelectItem>
                {availableFieldTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {getFieldTypeDisplayName(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Attribute Filters */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <label className='text-sm font-medium'>Attribute Filters</label>
            <Button
              variant='outline'
              size='sm'
              onClick={addAttributeFilter}
              disabled={filteredAttributes.length === 0}
            >
              Add Filter
            </Button>
          </div>

          {attributeFilters.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              No attribute filters applied
            </p>
          ) : (
            <div className='space-y-3'>
              {attributeFilters.map((filter) => {
                const operators = getOperatorsForFieldType(filter.fieldType);

                return (
                  <Card key={filter.id} className='p-3'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <Select
                        value={filter.attributeKey}
                        onValueChange={(value) =>
                          updateAttributeFilter(filter.id, {
                            attributeKey: value,
                          })
                        }
                      >
                        <SelectTrigger className='w-[200px]'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredAttributes.map((attr) => (
                            <SelectItem key={attr.id} value={attr.key}>
                              <div className='flex items-center gap-2'>
                                {attr.name}
                                <Badge variant='outline' className='text-xs'>
                                  {getFieldTypeDisplayName(attr.type)}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={filter.operator}
                        onValueChange={(value) =>
                          updateAttributeFilter(filter.id, { operator: value })
                        }
                      >
                        <SelectTrigger className='w-[120px]'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {operators.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder={`Enter ${getFieldTypeDisplayName(
                          filter.fieldType
                        ).toLowerCase()} value...`}
                        value={filter.value}
                        onChange={(e) =>
                          updateAttributeFilter(filter.id, {
                            value: e.target.value,
                          })
                        }
                        className='flex-1 min-w-[150px]'
                      />

                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => removeAttributeFilter(filter.id)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary */}
        <Separator />
        <div className='text-sm text-muted-foreground'>
          <p>
            Showing {filteredAttributes.length} of {availableAttributes.length}{" "}
            attributes
          </p>
          <p>Active filters: {attributeFilters.length}</p>
        </div>
      </CardContent>
    </Card>
  );
}
