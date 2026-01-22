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
    { value: 'daily', label: 'Last 24 Hours', color: 'text-blue-600' },
    { value: 'weekly', label: 'Last 7 Days', color: 'text-indigo-600' },
    { value: 'monthly', label: 'Last 30 Days', color: 'text-purple-600' },
    { value: 'yearly', label: 'Last Year', color: 'text-emerald-600' },
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

  const selectedOption = periodOptions.find(option => option.value === (filters.period || 'yearly'));

  return (
    <Card className="border-slate-200 bg-slate-50/80 shadow-sm flex  items-end justify-end">
      <CardContent className="p-4 ">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Period Filter */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className={`h-4 w-4 text-slate-600`} />
              <span className="text-sm font-medium text-slate-700">Period:</span>
            </div>
            <Select value={filters.period || 'yearly'} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-40 border-slate-300 focus:border-slate-400 focus:ring-slate-400/20 bg-white">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent className="border-slate-200 bg-white">
                {periodOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="hover:bg-slate-100 focus:bg-slate-100 text-slate-700"
                  >
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
