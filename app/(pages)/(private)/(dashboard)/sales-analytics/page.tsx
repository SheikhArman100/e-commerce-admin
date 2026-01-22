'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Filter,
  Download
} from 'lucide-react';
import { useSalesAnalytics } from '@/hooks/useDashboard';
import { DashboardFilters } from '@/types/dashboard.types';
import FilterControls from '@/components/dashboard/overview/FilterControls';
import SalesKPICards from '@/components/dashboard/sales-analytics/SalesKPICards';
import HourlyDistributionChart from '@/components/dashboard/sales-analytics/HourlyDistributionChart';
import CategoryPerformanceChart from '@/components/dashboard/sales-analytics/CategoryPerformanceChart';
import TopVariantsChart from '@/components/dashboard/sales-analytics/TopVariantsChart';
import CategoryRevenueTrendChart from '@/components/dashboard/sales-analytics/CategoryRevenueTrendChart';
import PeakHoursTable from '@/components/dashboard/sales-analytics/PeakHoursTable';

export default function SalesAnalyticsPage() {
  const [filters, setFilters] = useState<DashboardFilters>({
    period: 'yearly',
  });

  const { data: salesData, isLoading, error } = useSalesAnalytics(filters);

  // Fallback data for loading/error states
  const fallbackData = {
    averageOrderValue: 0,
    salesVelocity: 0,
    growthRate: 0,
    hourlyDistribution: [],
    categoryPerformance: [],
    topVariants: [],
    dailyTrend: [],
    peakHours: [],
    categoryRevenueTrend: []
  };

  const currentData = salesData || fallbackData;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className='flex flex-col sm:flex-row gap-2 justify-between'>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Sales Analytics
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Comprehensive sales performance analysis and insights
          </p>
        </div>
        <FilterControls
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      {/* KPI Cards Row */}
      <SalesKPICards data={currentData} isLoading={isLoading} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <HourlyDistributionChart data={currentData.hourlyDistribution} isLoading={isLoading} />
        <CategoryPerformanceChart data={currentData.categoryPerformance} isLoading={isLoading} />
      </div>

      {/* Category Revenue Trends Chart */}
      

      {/* Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TopVariantsChart data={currentData.topVariants} isLoading={isLoading} />
        <CategoryRevenueTrendChart data={currentData.categoryRevenueTrend} isLoading={isLoading} />
      </div>

      {/* Peak Hours Table */}
      <PeakHoursTable data={currentData.peakHours} isLoading={isLoading} />
    </div>
  );
}
