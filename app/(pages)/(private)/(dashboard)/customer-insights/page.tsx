'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardFilters } from '@/types/dashboard.types';
import { useCustomerInsights } from '@/hooks/useDashboard';
import FilterControls from '@/components/dashboard/overview/FilterControls';
import CustomerInsightsKPIs from '@/components/dashboard/customer-insights/CustomerInsightsKPIs';
import CustomerLifetimeValue from '@/components/dashboard/customer-insights/CustomerLifetimeValue';
import RepeatPurchaseAnalysis from '@/components/dashboard/customer-insights/RepeatPurchaseAnalysis';
import CustomerRetentionChart from '@/components/dashboard/customer-insights/CustomerRetentionChart';
import CustomerSegmentationChart from '@/components/dashboard/customer-insights/CustomerSegmentationChart';
import CustomerAcquisitionChart from '@/components/dashboard/customer-insights/CustomerAcquisitionChart';
import CustomerSatisfactionChart from '@/components/dashboard/customer-insights/CustomerSatisfactionChart';
import CustomerBehaviorChart from '@/components/dashboard/customer-insights/CustomerBehaviorChart';

export default function CustomerInsightsPage() {
  const [filters, setFilters] = useState<DashboardFilters>({
    period: 'yearly',
  });

  const { data, isLoading, error } = useCustomerInsights(filters);

  
  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Error Loading Data</h2>
            <p className="text-gray-600">Unable to fetch customer insights data. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Insights</h1>
          <p className="text-gray-600 mt-1">Comprehensive analysis of customer behavior and trends</p>
        </div>
        {/* Filters */}
      <FilterControls
                filters={filters}
                onFiltersChange={setFilters}
              />
      </div>

      

      {/* KPI Cards */}
      <CustomerInsightsKPIs data={data} isLoading={isLoading} />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Demographics */}
        {/* <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customer Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerDemographicsChart 
              data={data?.customerDemographics || []} 
              isLoading={isLoading} 
            />
          </CardContent>
        </Card> */}

        {/* Customer Lifetime Value */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customer Lifetime Value</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerLifetimeValue 
              data={data?.customerLifetimeValue || []} 
              isLoading={isLoading} 
            />
          </CardContent>
        </Card>

        {/* Repeat Purchase Analysis */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Repeat Purchase Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <RepeatPurchaseAnalysis 
              data={data?.repeatPurchaseAnalysis} 
              isLoading={isLoading} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Retention */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customer Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerRetentionChart 
              data={data?.customerRetention} 
              isLoading={isLoading} 
            />
          </CardContent>
        </Card>

        {/* Customer Segmentation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customer Segmentation</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerSegmentationChart 
              data={data?.customerSegmentation || []} 
              isLoading={isLoading} 
            />
          </CardContent>
        </Card>

        
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Acquisition */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customer Acquisition</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerAcquisitionChart 
              data={data?.customerAcquisition} 
              isLoading={isLoading} 
            />
          </CardContent>
        </Card>
        {/* Customer Satisfaction */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerSatisfactionChart 
              data={data?.customerSatisfaction} 
              isLoading={isLoading} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1  gap-6">
        {/* Customer Satisfaction */}
        

        {/* Customer Behavior */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customer Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerBehaviorChart 
              data={data?.customerBehavior} 
              isLoading={isLoading} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}