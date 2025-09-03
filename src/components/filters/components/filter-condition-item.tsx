"use client";

import { ChangeEvent, FC, memo } from "react";
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
import {
  getDataTypeOptions,
  getOperatorDataType,
  getInputType,
  isBooleanType,
} from "@/utils/filters/filter-helpers";
import { InternalFilterValue } from "@/app/types/query-engine/common";

interface FilterConditionItemProps {
  condition: FilterCondition;
  availableAttributes: string[];
  showLogicalOperator?: boolean;
  logicalOperator?: "AND" | "OR";
  onAttributeChange: (attribute: string) => void;
  onDataTypeChange: (
    dataType: "string" | "number" | "boolean" | "date" | "price" | "url"
  ) => void;
  onOperatorChange: (operator: keyof InternalFilterValue) => void;
  onValueChange: (value: string | boolean) => void;
  onRemove: () => void;
}

export const FilterConditionItem: FC<FilterConditionItemProps> = memo(
  function FilterConditionItem({
    condition,
    availableAttributes,
    showLogicalOperator = false,
    logicalOperator = "AND",
    onAttributeChange,
    onDataTypeChange,
    onOperatorChange,
    onValueChange,
    onRemove,
  }) {
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
            {getDataTypeOptions().map((option) => (
              <SelectItem key={option.enumType} value={option.value}>
                <div className='flex items-center justify-between w-full'>
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={condition.operator} onValueChange={onOperatorChange}>
          <SelectTrigger className='w-40'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OPERATORS[getOperatorDataType(condition.dataType)].map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {condition.operator !== "$exists" && (
          <>
            {isBooleanType(condition.dataType) ? (
              <Select
                value={condition.value.toString()}
                onValueChange={(value: string) =>
                  onValueChange(value === "true")
                }
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
                type={getInputType(condition.dataType)}
                value={condition.value.toString()}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onValueChange(e.target.value)
                }
                placeholder='Enter value'
                className='w-40'
              />
            )}
          </>
        )}

        {condition.operator === "$exists" && (
          <Select
            value={condition.value.toString()}
            onValueChange={(value: string) => onValueChange(value === "true")}
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
  }
);
