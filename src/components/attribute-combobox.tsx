"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AttributeComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  availableAttributes: string[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// Helper function to format attribute keys into readable headers
function formatAttributeHeader(key: string): string {
  return key
    .replace(/^_+/, "")
    .replace(/basicInfo/g, "Basic Info ")
    .replace(/addNew/g, "Add New ")
    .replace(/templateAttribute/g, "Template Attribute")
    .replace(/fromVariant/g, "From Variant ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([a-zA-Z])(\d)/g, "$1 $2")
    .replace(/(\d)([a-zA-Z])/g, "$1 $2")
    .replace(/\bsku\b/gi, "SKU")
    .replace(/\bid\b/gi, "ID")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

interface AttributeOption {
  value: string;
  label: string;
  group: string;
  originalKey?: string;
}

export function AttributeCombobox({
  value,
  onValueChange,
  availableAttributes,
  placeholder = "Select attribute...",
  className,
  disabled = false,
}: AttributeComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // Create attribute options with system attributes and custom attributes
  const attributeOptions = React.useMemo((): AttributeOption[] => {
    const systemAttributes: AttributeOption[] = [
      { value: "id", label: "ID", group: "System" },
      { value: "skuId", label: "SKU ID", group: "System" },
      { value: "createdAt", label: "Created At", group: "System" },
      { value: "updatedAt", label: "Updated At", group: "System" },
    ];

    // Core product attributes that are most commonly used
    const coreAttributes: AttributeOption[] = [
      {
        value: "attributes.name",
        label: "Product Name",
        group: "Core Attributes",
      },
      { value: "attributes.brand", label: "Brand", group: "Core Attributes" },
      {
        value: "attributes.category",
        label: "Category",
        group: "Core Attributes",
      },
      { value: "attributes.price", label: "Price", group: "Core Attributes" },
      {
        value: "attributes.description",
        label: "Description",
        group: "Core Attributes",
      },
      { value: "attributes.sku", label: "SKU", group: "Core Attributes" },
      { value: "attributes.status", label: "Status", group: "Core Attributes" },
      { value: "attributes.type", label: "Type", group: "Core Attributes" },
    ];

    const customAttributes: AttributeOption[] = availableAttributes
      .filter(
        (attr) =>
          ![
            "name",
            "brand",
            "category",
            "price",
            "description",
            "sku",
            "status",
            "type",
          ].includes(attr)
      )
      .map((attr) => ({
        value: `attributes.${attr}`,
        label: formatAttributeHeader(attr),
        group: "Other Attributes",
        originalKey: attr,
      }));

    return [...systemAttributes, ...coreAttributes, ...customAttributes];
  }, [availableAttributes]);

  // Group attributes by category
  const groupedAttributes = React.useMemo(() => {
    const groups: Record<string, AttributeOption[]> = {};
    attributeOptions.forEach((attr) => {
      if (!groups[attr.group]) {
        groups[attr.group] = [];
      }
      groups[attr.group].push(attr);
    });
    return groups;
  }, [attributeOptions]);

  const selectedAttribute = attributeOptions.find(
    (attr) => attr.value === value
  );

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn("w-48 justify-between", className)}
          disabled={disabled}
        >
          {selectedAttribute ? selectedAttribute.label : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80 p-0' align='start'>
        <Command
          className='rounded-lg border shadow-md'
          filter={(value, search) => {
            const searchLower = search.toLowerCase();
            const valueLower = value.toLowerCase();
            if (valueLower.includes(searchLower)) return 1;
            return 0;
          }}
        >
          <CommandInput placeholder='Search attributes...' />
          <CommandEmpty>No attribute found.</CommandEmpty>
          <CommandList className='max-h-72 overflow-y-auto'>
            {Object.entries(groupedAttributes).map(
              ([groupName, attributes]) => (
                <CommandGroup key={groupName} heading={groupName}>
                  {attributes.map((attribute) => (
                    <CommandItem
                      key={attribute.value}
                      value={`${attribute.label} ${
                        attribute.originalKey || ""
                      }`}
                      onSelect={() => {
                        onValueChange(
                          value === attribute.value ? "" : attribute.value
                        );
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === attribute.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className='flex flex-col'>
                        <span className='font-medium'>{attribute.label}</span>
                        {/* {attribute.originalKey && (
                            <span className='text-xs text-muted-foreground'>
                              {attribute.originalKey}
                            </span>
                          )} */}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
