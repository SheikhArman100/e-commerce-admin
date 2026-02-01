'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Repeat, TrendingUp, Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';
import { RepeatPurchaseAnalysis as RepeatPurchaseAnalysisType } from '@/types/dashboard.types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface RepeatPurchaseAnalysisProps {
  data: RepeatPurchaseAnalysisType | undefined;
  isLoading: boolean;
}

export default function RepeatPurchaseAnalysis({ data, isLoading }: RepeatPurchaseAnalysisProps) {
  const analysisData = data;

  if (!analysisData) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Purchase Behavior</h3>
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

  // Prepare funnel data
  const funnelData = [
    { name: 'Total Customers', value: analysisData.totalCustomers },
    { name: 'One-time Customers', value: analysisData.oneTimeCustomers },
    { name: 'Repeat Customers', value: analysisData.repeatCustomers }
  ];

  const funnelOptions = {
    chart: {
      type: 'bar' as const,
      height: 300,
      fontFamily: 'inherit',
    },
    series: [{
      name: 'Customers',
      data: funnelData.map(item => item.value)
    }],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        borderRadius: 4,
        distributed: true,
        dataLabels: {
          position: 'center',
        },
      },
    },
    colors: ['#3b82f6', '#ef4444', '#10b981'],
    dataLabels: {
      enabled: true,
      textAnchor: 'middle' as const,
      formatter: (val: number) => val.toLocaleString(),
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ['#ffffff'],
      },
    },
    xaxis: {
      categories: funnelData.map(item => item.name),
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '13px',
        fontFamily: 'inherit',
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        const stage = funnelData[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];
        const percentage = dataPointIndex === 0 ? 100 : 
                          dataPointIndex === 1 ? analysisData.oneTimePercentage :
                          analysisData.repeatPercentage;

        return `
          <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[260px]">
            <div class="font-bold text-gray-800 mb-3 text-base">${stage.name}</div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Volume:</span>
                <span class="font-semibold text-gray-800">${value.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Percentage:</span>
                <span class="font-semibold text-gray-800">${percentage}%</span>
              </div>
              ${dataPointIndex > 0 ? `
                <div class="flex justify-between text-red-600">
                  <span>Drop-off Rate:</span>
                  <span class="font-semibold">${(100 - percentage)}%</span>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      },
    },
    grid: {
      show: false,
    },
    legend: {
      show: false,
    },
  };

  return (
    <div className="space-y-6">
      {/* Repeat Purchase Funnel */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Purchase Behavior</h3>
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <ReactApexChart options={funnelOptions} series={funnelOptions.series} type="bar" height={300} />
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : analysisData.totalCustomers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Repeat className="h-6 w-6 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : `${analysisData.repeatPercentage}%`}
              </div>
              <div className="text-sm text-gray-600">Repeat Customers</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : analysisData.averageOrdersPerRepeatCustomer.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Avg Orders per Repeat Customer</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-orange-600" />
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : analysisData.averageDaysBetweenPurchases}
              </div>
              <div className="text-sm text-gray-600">Avg Days Between Purchases</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">Analysis Summary</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div>• {analysisData.repeatPercentage}% of customers make repeat purchases</div>
          <div>• Repeat customers place an average of {analysisData.averageOrdersPerRepeatCustomer.toFixed(1)} orders</div>
          <div>• Average time between purchases is {analysisData.averageDaysBetweenPurchases} days</div>
          <div>• {analysisData.oneTimePercentage}% of customers are one-time buyers</div>
        </div>
      </div>
    </div>
  );
}
