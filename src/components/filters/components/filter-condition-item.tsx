"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { AttributeCombobox } from "@/components/attribute-combobox";
import { FilterCondition, OPERATORS } from "@/utils/filters/filter-utils";
import { InternalFilterValue } from "@/app/types/query-engine/common";

interface FilterConditionItemProps {
  condition: FilterCondition;
  availableAttributes: string[];
  showLogicalOperator?: boolean;
  logicalOperator?: "AND" | "OR";
  onAttributeChange: (attribute: string) => void;
  onDataTypeChange: (
    dataType: "string" | "number" | "boolean" | "date"
  ) => void;
  onOperatorChange: (operator: keyof InternalFilterValue) => void;
  onValueChange: (value: string | boolean) => void;
  onRemove: () => void;
}

export const FilterConditionItem = memo(function FilterConditionItem({
  condition,
  availableAttributes,
  showLogicalOperator = false,
  logicalOperator = "AND",
  onAttributeChange,
  onDataTypeChange,
  onOperatorChange,
  onValueChange,
  onRemove,
}: FilterConditionItemProps) {
  return (
    <div className='flex items-center gap-2 p-3 border rounded-lg'>
      {showLogicalOperator && (
        <div className='text-xs font-medium text-muted-foreground min-w-[30px]'>
          {logicalOperator}
        </div>
      )}

      <AttributeCombobox
        value={condition.attribute}
        onValueChange={onAttributeChange}
        availableAttributes={availableAttributes}
      />

      <Select value={condition.dataType} onValueChange={onDataTypeChange}>
        <SelectTrigger className='w-24'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='string'>Text</SelectItem>
          <SelectItem value='number'>Number</SelectItem>
          <SelectItem value='boolean'>Boolean</SelectItem>
          <SelectItem value='date'>Date</SelectItem>
        </SelectContent>
      </Select>

      <Select value={condition.operator} onValueChange={onOperatorChange}>
        <SelectTrigger className='w-40'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPERATORS[condition.dataType].map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {condition.operator !== "$exists" && (
        <>
          {condition.dataType === "boolean" ? (
            <Select
              value={condition.value.toString()}
              onValueChange={(value) => onValueChange(value === "true")}
            >
              <SelectTrigger className='w-24'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='true'>True</SelectItem>
                <SelectItem value='false'>False</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              type={
                condition.dataType === "number"
                  ? "number"
                  : condition.dataType === "date"
                  ? "date"
                  : "text"
              }
              value={condition.value.toString()}
              onChange={(e) => onValueChange(e.target.value)}
              placeholder='Enter value'
              className='w-40'
            />
          )}
        </>
      )}

      {condition.operator === "$exists" && (
        <Select
          value={condition.value.toString()}
          onValueChange={(value) => onValueChange(value === "true")}
        >
          <SelectTrigger className='w-24'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='true'>Yes</SelectItem>
            <SelectItem value='false'>No</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Button
        size='sm'
        variant='outline'
        onClick={onRemove}
        className='shrink-0'
      >
        <X className='h-4 w-4' />
      </Button>
    </div>
  );
});
