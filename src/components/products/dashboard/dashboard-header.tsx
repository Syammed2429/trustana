'use client';

import { FC, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DashboardHeaderProps {
  onCreateProduct?: () => void;
  className?: string;
}

export const DashboardHeader: FC<DashboardHeaderProps> = memo(function DashboardHeader({
  onCreateProduct,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-baseline justify-between space-y-2 md:flex-row md:items-center md:space-y-0 ${className}`}
    >
      <div>
        <h1 className='text-2xl font-bold'>Advanced Product Dashboard</h1>
        <p className='text-muted-foreground'>
          Powerful filtering and data exploration for product catalogs
        </p>
      </div>
      <div className='flex items-center gap-2'>
        <Button variant='default' size='sm' onClick={onCreateProduct} className='h-8'>
          <Plus className='mr-2 h-4 w-4' />
          Create Product
        </Button>
      </div>
    </div>
  );
});
