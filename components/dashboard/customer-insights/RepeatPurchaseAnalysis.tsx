'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Calendar } from 'lucide-react';
import { RepeatPurchaseAnalysis as RepeatPurchaseAnalysisType } from '@/types/dashboard.types';
import CardInfo from '@/components/dashboard/CardInfo';

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
        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              Customer Purchase Behavior
            </CardTitle>
            <CardInfo description="Breakdown of one-time versus repeat customers with purchase behavior metrics." />
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

  // Calculate percentages correctly to ensure they add up to 100%
  const totalCustomers = analysisData.totalCustomers || (analysisData.oneTimeCustomers + analysisData.repeatCustomers);
  const oneTimePercentage = totalCustomers > 0 
    ? Math.round((analysisData.oneTimeCustomers / totalCustomers) * 100) 
    : 0;
  const repeatPercentage = totalCustomers > 0 
    ? Math.round((analysisData.repeatCustomers / totalCustomers) * 100) 
    : 0;

  // Prepare donut chart data for one-time vs repeat customers
  const donutData = [
    { 
      name: 'One-time Customers', 
      value: analysisData.oneTimeCustomers, 
      percentage: oneTimePercentage 
    },
    { 
      name: 'Repeat Customers', 
      value: analysisData.repeatCustomers, 
      percentage: repeatPercentage 
    }
  ];

  const donutOptions = {
    chart: {
      type: 'donut' as const,
      height: 350,
      fontFamily: 'inherit',
    },
    series: donutData.map(item => item.value),
    labels: donutData.map(item => item.name),
    colors: ['#ef4444', '#10b981'], // Red for one-time, Emerald for repeat
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
        // Use seriesIndex for donut charts
        const dataPointIndex = opts?.seriesIndex ?? opts?.dataPointIndex ?? 0;
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
        const customerType = donutData[seriesIndex];
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
                            ` : '-'}
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
              formatter: () => totalCustomers.toLocaleString()
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
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            Customer Purchase Behavior
          </CardTitle>
          <CardInfo description="Breakdown of one-time versus repeat customers with purchase behavior metrics." />
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg pt-4">
          {isLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <ReactApexChart options={donutOptions} series={donutOptions.series} type="donut" height={350} />
          )}
        </CardContent>
      </Card>

            {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">Avg Orders per Repeat Customer</CardTitle>
              <div className="flex items-center gap-1.5">
                <CardInfo description="Average number of orders placed by repeat customers." />
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <div className="text-2xl font-bold text-purple-600">
              {isLoading ? <Skeleton className="h-8 w-16" /> : analysisData.averageOrdersPerRepeatCustomer.toFixed(1)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">Avg Days Between Purchases</CardTitle>
              <div className="flex items-center gap-1.5">
                <CardInfo description="Average days between repeat purchases." />
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <div className="text-2xl font-bold text-orange-600">
              {isLoading ? <Skeleton className="h-8 w-16" /> : `${analysisData.averageDaysBetweenPurchases} days`}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}