'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';
import { CustomerLifetimeValue as CustomerLifetimeValueType } from '@/types/dashboard.types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface CustomerLifetimeValueProps {
  data: CustomerLifetimeValueType[];
  isLoading: boolean;
}

export default function CustomerLifetimeValue({ data, isLoading }: CustomerLifetimeValueProps) {
  // Use the passed data instead of hook
  const chartData = data || [];

  if (!chartData.length) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">CLV Distribution</h3>
          <Skeleton className="h-80 w-full" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">CLV Trends</h3>
          <Skeleton className="h-80 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Prepare data for scatter plot using API-provided segment values
  const scatterData = chartData.map(customer => ({
    x: customer.totalOrders,
    y: customer.totalSpent,
    customerName: customer.customerName,
    segment: customer.customerSegment
  }));

  // Prepare data for scatter plot with colors based on segments
  const scatterSeries = [
    {
      name: 'High Value',
      data: scatterData.filter(item => item.segment === 'high').map(item => ({
        x: item.x,
        y: item.y,
        customerName: item.customerName,
        segment: item.segment
      }))
    },
    {
      name: 'Medium Value',
      data: scatterData.filter(item => item.segment === 'medium').map(item => ({
        x: item.x,
        y: item.y,
        customerName: item.customerName,
        segment: item.segment
      }))
    },
    {
      name: 'Low Value',
      data: scatterData.filter(item => item.segment === 'low').map(item => ({
        x: item.x,
        y: item.y,
        customerName: item.customerName,
        segment: item.segment
      }))
    },
    {
      name: 'New Customers',
      data: scatterData.filter(item => item.segment === 'new').map(item => ({
        x: item.x,
        y: item.y,
        customerName: item.customerName,
        segment: item.segment
      }))
    }
  ];

  const scatterOptions = {
    chart: {
      type: 'scatter' as const,
      height: 350,
      fontFamily: 'inherit',
    },
    series: scatterSeries,
    xaxis: {
      title: {
        text: 'Total Orders',
        style: {
          color: '#475569',
        },
      },
      labels: {
        style: {
          colors: '#475569',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Total Spent ($)',
        style: {
          color: '#475569',
        },
      },
      labels: {
        style: {
          colors: '#475569',
        },
        formatter: (val: number) => `$${val.toFixed(0)}`
      },
    },
    colors: ['#10b981', '#f59e0b', '#ef4444', '#64748b'], // Green for High, Amber for Medium, Red for Low, Slate for New
    markers: {
      size: 8,
      strokeWidth: 2,
      strokeColors: '#ffffff',
      hover: {
        size: 10
      }
    },
    tooltip: {
      theme: 'light',
      custom: function({ seriesIndex, dataPointIndex }: { seriesIndex: number; dataPointIndex: number }) {
        const series = scatterSeries[seriesIndex];
        const customer = series.data[dataPointIndex];
        return `
          <div class="p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div class="font-bold text-gray-800 mb-2">${customer.customerName}</div>
            <div class="space-y-1 text-sm text-gray-600">
              <div>Total Orders: <span class="font-semibold">${customer.x}</span></div>
              <div>Total Spent: <span class="font-semibold">$${customer.y.toFixed(2)}</span></div>
              <div>Segment: <span class="font-semibold capitalize">${customer.segment}</span></div>
            </div>
          </div>
        `;
      }
    },
    grid: {
      show: true,
      borderColor: '#e2e8f0',
    },
    legend: {
      show: false
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Custom Legend */}
      <div className="flex flex-wrap justify-center gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap">High Value</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Medium Value</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Low Value</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap">New Customers</span>
        </div>
      </div>
      {/* CLV Scatter Plot */}
      <div>
        {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Lifetime Value Analysis</h3> */}
        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <ReactApexChart options={scatterOptions} series={scatterOptions.series} type="scatter" height={350} />
        )}
      </div>

      

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? <Skeleton className="h-8 w-20" /> : `$${(chartData.reduce((sum, item) => sum + item.totalSpent, 0) / chartData.length).toFixed(2)}`}
              </div>
              <div className="text-sm text-gray-600">Avg CLV</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : chartData.reduce((sum, item) => sum + item.totalOrders, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
