'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { DashboardFilters } from '@/types/dashboard.types';

interface FilterControlsProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
}

export default function FilterControls({ filters, onFiltersChange }: FilterControlsProps) {
  const periodOptions = [
    { value: 'daily', label: 'Last 24 Hours' },
    { value: 'weekly', label: 'Last 7 Days' },
    { value: 'monthly', label: 'Last 30 Days' },
    { value: 'yearly', label: 'Last Year' },
  ];

  const handlePeriodChange = (period: string) => {
    onFiltersChange({
      period: period as DashboardFilters['period'],
      filterType: undefined,
      date: undefined,
      week: undefined,
      month: undefined,
      year: undefined,
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Period Filter */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Period:</span>
            </div>
            <Select value={filters.period || 'yearly'} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
