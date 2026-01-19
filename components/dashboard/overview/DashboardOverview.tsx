'use client';

import { useState } from 'react';
import { useDashboardOverview } from '@/hooks/useDashboard';
import { DashboardFilters } from '@/types/dashboard.types';
import FilterControls from './FilterControls';
import KPICards from './KPICards';
import RevenueChart from './RevenueChart';
import OrderStatusChart from './OrderStatusChart';
import TopProductsTable from './TopProductsTable';
import RecentOrdersTable from './RecentOrdersTable';
import LowStockAlertsTable from './LowStockAlertsTable';

export default function DashboardOverview() {
  const [filters, setFilters] = useState<DashboardFilters>({
    period: 'yearly',
  });

  const { data, isLoading, error } = useDashboardOverview(filters);

 

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            Failed to load dashboard data. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className='flex justify-between'>
        <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Monitor your e-commerce performance and key metrics
        </p>
        </div>
        <FilterControls
        filters={filters}
        onFiltersChange={setFilters}
      />
      </div>

      {/* Filter Controls */}
      

      {/* KPI Cards */}
      <KPICards
        metrics={data?.metrics || {
          totalRevenue: 0,
          totalOrders: 0,
          totalProducts: 0,
          totalCustomers: 0,
          revenueGrowth: 0,
          orderGrowth: 0,
          productGrowth: 0,
          customerGrowth: 0,
        }}
        isLoading={isLoading}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Revenue Chart - Full Width */}
        <div className="lg:col-span-2 flex">
          <div className="w-full">
          <RevenueChart
            data={data?.revenueTrend || []}
            isLoading={isLoading}
            period={filters.period || 'yearly'}
          />
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="lg:col-span-1 flex">
          <div className="w-full h-full">
            <OrderStatusChart
              data={data?.orderStatusDistribution || []}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Top Products */}
        <div className="lg:col-span-1 flex">
          <div className="w-full">
            <TopProductsTable
              data={data?.topProducts || []}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-1 flex">
          <div className="w-full">
            <RecentOrdersTable
              data={data?.recentOrders || []}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-1 flex">
          <div className="w-full">
            <LowStockAlertsTable
              data={data?.lowStockItems || []}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
