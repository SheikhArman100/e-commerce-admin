'use client';

import dynamic from 'next/dynamic';
import { formatTaka } from '@/lib/currency';
import CardInfo from '@/components/dashboard/CardInfo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, TrendingUp } from 'lucide-react';
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
        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              CLV Distribution
            </CardTitle>
            <CardInfo description="Scatter plot showing customer lifetime value distribution." />
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              CLV Trends
            </CardTitle>
            <CardInfo description="Historical trend of customer lifetime value." />
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-slate-200 bg-slate-50/80 shadow-sm">
              <CardHeader className="bg-white/60 rounded-t-lg pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">
                  <Skeleton className="h-8 w-16" />
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white/40 rounded-b-lg">
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
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
        text: 'Total Spent (৳)',
        style: {
          color: '#475569',
        },
      },
      labels: {
        style: {
          colors: '#475569',
        },
                formatter: (val: number) => formatTaka(val, 0)
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
                            <div>Total Spent: <span class="font-semibold">${formatTaka(customer.y, 2)}</span></div>
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
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            CLV Distribution
          </CardTitle>
          <CardInfo description="Scatter plot of customer lifetime value, showing total orders vs total spend, color-coded by customer segment." />
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg pt-4">
          {isLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <ReactApexChart options={scatterOptions} series={scatterOptions.series} type="scatter" height={350} />
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">Avg CLV</CardTitle>
              <div className="flex items-center gap-1.5">
                <CardInfo description="Average lifetime value - spend per customer." />
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? <Skeleton className="h-8 w-20" /> : formatTaka((chartData.reduce((sum, item) => sum + item.totalSpent, 0) / chartData.length), 2)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">Total Orders</CardTitle>
              <div className="flex items-center gap-1.5">
                <CardInfo description="Total number of orders placed across all customers." />
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <div className="text-2xl font-bold text-blue-600">
              {isLoading ? <Skeleton className="h-8 w-16" /> : chartData.reduce((sum, item) => sum + item.totalOrders, 0)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
