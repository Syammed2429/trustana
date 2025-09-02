"use client";

import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface QuickSearchProps {
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const QuickSearch = memo(function QuickSearch({
  value,
  onChange,
  isDisabled = false,
  placeholder = "Quick search... (auto-debounced)",
  className = "w-64",
}: QuickSearchProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='pl-10'
        disabled={isDisabled}
      />
    </div>
  );
});
