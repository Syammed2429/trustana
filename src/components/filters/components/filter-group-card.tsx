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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { FilterGroup, FilterCondition } from "@/utils/filters/filter-utils";
import { FilterConditionItem } from "./filter-condition-item";
import { InternalFilterValue } from "@/app/types/query-engine/common";

interface FilterGroupCardProps {
  group: FilterGroup;
  availableAttributes: string[];
  canRemove: boolean;
  onNameChange: (name: string) => void;
  onLogicalOperatorChange: (operator: "AND" | "OR") => void;
  onAddCondition: () => void;
  onRemoveGroup: () => void;
  onConditionChange: (
    conditionId: string,
    updates: Partial<FilterCondition>
  ) => void;
  onRemoveCondition: (conditionId: string) => void;
  onAttributeChange: (conditionId: string, attribute: string) => void;
}

export const FilterGroupCard = memo(function FilterGroupCard({
  group,
  availableAttributes,
  canRemove,
  onNameChange,
  onLogicalOperatorChange,
  onAddCondition,
  onRemoveGroup,
  onConditionChange,
  onRemoveCondition,
  onAttributeChange,
}: FilterGroupCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Input
              value={group.name}
              onChange={(e) => onNameChange(e.target.value)}
              className='font-medium text-sm w-auto'
              placeholder='Group name'
            />
            <Select
              value={group.logicalOperator}
              onValueChange={onLogicalOperatorChange}
            >
              <SelectTrigger className='w-20'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='AND'>AND</SelectItem>
                <SelectItem value='OR'>OR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex gap-2'>
            <Button size='sm' variant='outline' onClick={onAddCondition}>
              <Plus className='h-4 w-4 mr-1' />
              Add Condition
            </Button>
            {canRemove && (
              <Button size='sm' variant='outline' onClick={onRemoveGroup}>
                <X className='h-4 w-4' />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {group.conditions.map((condition, conditionIndex) => (
            <FilterConditionItem
              key={condition.id}
              condition={condition}
              availableAttributes={availableAttributes}
              showLogicalOperator={conditionIndex > 0}
              logicalOperator={group.logicalOperator}
              onAttributeChange={(attribute) =>
                onAttributeChange(condition.id, attribute)
              }
              onDataTypeChange={(dataType) =>
                onConditionChange(condition.id, { dataType, operator: "$eq" })
              }
              onOperatorChange={(operator: keyof InternalFilterValue) =>
                onConditionChange(condition.id, { operator })
              }
              onValueChange={(value) =>
                onConditionChange(condition.id, { value })
              }
              onRemove={() => onRemoveCondition(condition.id)}
            />
          ))}

          {group.conditions.length === 0 && (
            <div className='text-center py-8 text-muted-foreground'>
              No conditions added. Click &ldquo;Add Condition&rdquo; to start
              building your filter.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
