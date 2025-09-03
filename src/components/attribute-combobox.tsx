'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatAttributeHeaderSimple } from '@/utils/attribute-formatting';
import { useMemo, useState, FC } from 'react';
import { AttributeOption, coreAttributes, systemAttributes } from '@/utils/attribute-options';

interface AttributeComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  availableAttributes: string[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const AttributeCombobox: FC<AttributeComboboxProps> = ({
  value,
  onValueChange,
  availableAttributes,
  placeholder = 'Select attribute...',
  className,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);

  const attrs = ['name', 'brand', 'category', 'price', 'description', 'sku', 'status', 'type'];

  // Create attribute options with system attributes and custom attributes
  const attributeOptions = useMemo((): AttributeOption[] => {
    const customAttributes: AttributeOption[] = availableAttributes
      .filter((attr) => !attrs.includes(attr))
      .map((attr) => ({
        value: `attributes.${attr}`,
        label: formatAttributeHeaderSimple(attr),
        group: 'Other Attributes',
        originalKey: attr,
      }));

    return [...systemAttributes, ...coreAttributes, ...customAttributes];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableAttributes]);

  // Group attributes by category
  const groupedAttributes = useMemo(() => {
    const groups: Record<string, AttributeOption[]> = {};
    attributeOptions.forEach((attr) => {
      if (!groups[attr.group]) {
        groups[attr.group] = [];
      }
      groups[attr.group].push(attr);
    });
    return groups;
  }, [attributeOptions]);

  const selectedAttribute = attributeOptions.find((attr) => attr.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-48 justify-between', className)}
          disabled={disabled}
        >
          {selectedAttribute ? selectedAttribute.label : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80 p-0' align='start'>
        <Command
          className='rounded-lg border shadow-md'
          filter={(value: string, search: string) => {
            const searchLower = search.toLowerCase();
            const valueLower = value.toLowerCase();
            if (valueLower.includes(searchLower)) return 1;
            return 0;
          }}
        >
          <CommandInput placeholder='Search attributes...' />
          <CommandEmpty>No attribute found.</CommandEmpty>
          <CommandList className='max-h-72 overflow-y-auto'>
            {Object.entries(groupedAttributes).map(([groupName, attributes]) => (
              <CommandGroup key={groupName} heading={groupName}>
                {attributes.map((attribute) => (
                  <CommandItem
                    key={attribute.value}
                    value={`${attribute.label} ${attribute.originalKey || ''}`}
                    onSelect={() => {
                      onValueChange(value === attribute.value ? '' : attribute.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === attribute.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className='flex flex-col'>
                      <span className='font-medium'>{attribute.label}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
