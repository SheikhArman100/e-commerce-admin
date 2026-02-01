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

  // Prepare donut chart data for one-time vs repeat customers
  const donutData = [
    { name: 'One-time Customers', value: analysisData.oneTimeCustomers, percentage: analysisData.oneTimePercentage },
    { name: 'Repeat Customers', value: analysisData.repeatCustomers, percentage: analysisData.repeatPercentage }
  ];

  const donutOptions = {
    chart: {
      type: 'donut' as const,
      height: 350,
      fontFamily: 'inherit',
    },
    series: donutData.map(item => item.value),
    labels: donutData.map(item => item.name),
    colors: ['#ef4444', '#22c55e'], // Red for one-time, Green for repeat
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    legend: {
      position: 'top' as const,
      horizontalAlign: 'center' as const,
      labels: {
        colors: '#475569',
        useSeriesColors: false
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts: any) => {
        const dataPointIndex = opts?.dataPointIndex ?? 0;
        const percentage = donutData[dataPointIndex]?.percentage ?? Math.round(val);
        return `${percentage}%`;
      },
      style: {
        fontSize: '14px',
        fontWeight: 600,
        colors: ['#ffffff'],
      },
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '13px',
        fontFamily: 'inherit',
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        const customerType = donutData[dataPointIndex];
        const value = series[seriesIndex];
        const percentage = customerType.percentage;

        return `
          <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[260px]">
            <div class="font-bold text-gray-800 mb-3 text-base">${customerType.name}</div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Customers:</span>
                <span class="font-semibold text-gray-800">${value.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Percentage:</span>
                <span class="font-semibold text-gray-800">${percentage}%</span>
              </div>
              ${seriesIndex === 1 ? `
                <div class="flex justify-between">
                  <span class="text-gray-600">Avg Orders:</span>
                  <span class="font-semibold text-green-600">${analysisData.averageOrdersPerRepeatCustomer.toFixed(1)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Avg Days Between:</span>
                  <span class="font-semibold text-blue-600">${analysisData.averageDaysBetweenPurchases} days</span>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px',
              fontWeight: 600,
              color: '#475569',
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 700,
              color: '#1f2937',
              offsetY: 10,
              formatter: (val: string) => val
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total Customers',
              fontSize: '14px',
              fontWeight: 600,
              color: '#6b7280',
              formatter: () => analysisData?.totalCustomers?.toLocaleString() || '0'
            }
          }
        }
      }
    },
    stroke: {
      width: 0
    }
  };

  return (
    <div className="space-y-6">
      {/* Repeat Purchase Donut Chart */}
      <div>
        {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Purchase Behavior</h3> */}
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <ReactApexChart options={donutOptions} series={donutOptions.series} type="donut" height={350} />
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        
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

      
    </div>
  );
}