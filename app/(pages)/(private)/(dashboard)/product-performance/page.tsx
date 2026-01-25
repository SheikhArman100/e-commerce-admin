'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Filter,
  Download
} from 'lucide-react';
import { useProductPerformance } from '@/hooks/useDashboard';
import { DashboardFilters } from '@/types/dashboard.types';
import FilterControls from '@/components/dashboard/overview/FilterControls';
import PerformanceRankingsTable from '@/components/dashboard/product-performance/PerformanceRankingsTable';
import ProductPerformanceKPICards from '@/components/dashboard/product-performance/ProductPerformanceKPICards';
import ProductTrendsChart from '@/components/dashboard/product-performance/ProductTrendsChart';
import CategoryAnalysisChart from '@/components/dashboard/product-performance/CategoryAnalysisChart';
import StockAnalysisTable from '@/components/dashboard/product-performance/StockAnalysisTable';
import ReviewAnalyticsCards from '@/components/dashboard/product-performance/ReviewAnalyticsCards';
import ProfitabilityMetricsTable from '@/components/dashboard/product-performance/ProfitabilityMetricsTable';
import LifecycleAnalysisCards from '@/components/dashboard/product-performance/LifecycleAnalysisCards';
import ConversionRatesChart from '@/components/dashboard/product-performance/ConversionRatesChart';

export default function ProductPerformancePage() {
  const [filters, setFilters] = useState<DashboardFilters>({
    period: 'yearly',
  });

  const { data: performanceData, isLoading, error } = useProductPerformance(filters);

  // Fallback data for loading/error states
  const fallbackData = {
    performanceRankings: [],
    productTrends: [],
    categoryAnalysis: [],
    stockAnalysis: [],
    reviewAnalytics: [],
    profitabilityMetrics: [],
    lifecycleAnalysis: [],
    conversionRates: []
  };

  const currentData = performanceData || fallbackData;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className='flex flex-col sm:flex-row gap-2 justify-between'>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Product Performance
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Comprehensive product analytics and business intelligence
          </p>
        </div>
        <FilterControls
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      {/* KPI Cards */}
      <ProductPerformanceKPICards
        data={currentData}
        isLoading={isLoading}
      />

      {/* Performance Rankings - Full Width */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PerformanceRankingsTable
        data={currentData.performanceRankings}
        isLoading={isLoading}
      />
      <StockAnalysisTable
          data={currentData.stockAnalysis}
          isLoading={isLoading}
        />

      </div>
      

      {/* Product Trends & Category Analysis - 2 Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ProductTrendsChart
          data={currentData.productTrends}
          isLoading={isLoading}
        />
        <CategoryAnalysisChart
          data={currentData.categoryAnalysis}
          isLoading={isLoading}
        />
      </div>

      {/* Stock Analysis & Review Analytics - 2 Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        <ReviewAnalyticsCards
          data={currentData.reviewAnalytics}
          isLoading={isLoading}
        />
      </div>

      {/* Profitability Metrics & Lifecycle Analysis - 2 Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ProfitabilityMetricsTable
          data={currentData.profitabilityMetrics}
          isLoading={isLoading}
        />
        <LifecycleAnalysisCards
          data={currentData.lifecycleAnalysis}
          isLoading={isLoading}
        />
      </div>

      {/* Conversion Rates - Full Width */}
      <ConversionRatesChart
        data={currentData.conversionRates}
        isLoading={isLoading}
      />
    </div>
  );
}