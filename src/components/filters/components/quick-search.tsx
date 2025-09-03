'use client';

import { ChangeEvent, FC, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface QuickSearchProps {
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const QuickSearch: FC<QuickSearchProps> = memo(function QuickSearch({
  value,
  onChange,
  isDisabled = false,
  placeholder = 'Quick search... (auto-debounced)',
  className = 'w-68',
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className='w-full pl-10'
        disabled={isDisabled}
      />
    </div>
  );
});
