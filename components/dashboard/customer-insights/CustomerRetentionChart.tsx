'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Users, Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';
import { CustomerRetention as CustomerRetentionType } from '@/types/dashboard.types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface CustomerRetentionChartProps {
  data: CustomerRetentionType | undefined;
  isLoading: boolean;
}

export default function CustomerRetentionChart({ data, isLoading }: CustomerRetentionChartProps) {
  const retentionData = data;

  if (!retentionData) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cohort Analysis</h3>
          <Skeleton className="h-96 w-full" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Retention Rate Trend</h3>
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Prepare data for cohort analysis heatmap
  const cohortData = retentionData.cohortAnalysis.map((cohort: any) => [
    cohort.month0,
    cohort.month1,
    cohort.month2,
    cohort.month3
  ]);

  const heatmapOptions = {
    chart: {
      type: 'heatmap' as const,
      height: 350,
      fontFamily: 'inherit',
    },
    series: retentionData.cohortAnalysis.map(cohort => ({
      name: cohort.cohort,
      data: [
        { x: 'Month 0', y: cohort.month0 },
        { x: 'Month 1', y: cohort.month1 },
        { x: 'Month 2', y: cohort.month2 },
        { x: 'Month 3', y: cohort.month3 }
      ]
    })),
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: 'category' as const,
      categories: ['Month 0', 'Month 1', 'Month 2', 'Month 3'],
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
        },
      },
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '13px',
        fontFamily: 'inherit',
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        const cohort = retentionData.cohortAnalysis[seriesIndex];
        const month = ['Month 0', 'Month 1', 'Month 2', 'Month 3'][dataPointIndex];
        const value = w.globals.series[seriesIndex][dataPointIndex];

        return `
          <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[260px]">
            <div class="font-bold text-gray-800 mb-3 text-base">${cohort.cohort} Cohort</div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Month:</span>
                <span class="font-semibold text-gray-800">${month}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Retained Customers:</span>
                <span class="font-semibold text-gray-800">${value}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Retention Rate:</span>
                <span class="font-semibold text-green-600">${((value / cohort.month0) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        `;
      },
    },
    grid: {
      show: true,
      borderColor: '#e2e8f0',
    },
    legend: {
      show: false,
    },
  };

  // Prepare data for retention trend line chart
  const trendData = retentionData.cohortAnalysis.map(cohort => ({
    x: cohort.cohort,
    y: cohort.retentionRate
  }));

  const trendOptions = {
    chart: {
      type: 'line' as const,
      height: 200,
      fontFamily: 'inherit',
    },
    series: [{
      name: 'Retention Rate',
      data: trendData
    }],
    xaxis: {
      type: 'category' as const,
      categories: retentionData.cohortAnalysis.map(cohort => cohort.cohort),
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Retention Rate (%)',
        style: {
          color: '#475569',
        },
      },
      min: 0,
      max: 100,
    },
    colors: ['#3b82f6'],
    stroke: {
      curve: 'smooth' as const,
      width: 3,
    },
    markers: {
      size: 4,
      colors: ['#3b82f6'],
      strokeColors: '#ffffff',
      strokeWidth: 2,
    },
    grid: {
      show: true,
      borderColor: '#e2e8f0',
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '13px',
        fontFamily: 'inherit',
      },
      y: {
        formatter: (val: number) => `${val}%`
      }
    },
  };

  return (
    <div className="space-y-6">
      {/* Cohort Analysis Heatmap */}
      <div>
        {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Cohort Analysis</h3> */}
        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <ReactApexChart options={heatmapOptions} series={heatmapOptions.series} type="heatmap" height={350} />
        )}
      </div>

      {/* Retention Trend */}
      {/* <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Retention Rate Trend</h3>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ReactApexChart options={trendOptions} series={trendOptions.series} type="line" height={200} />
        )}
      </div> */}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : `${retentionData.retentionRate}%`}
              </div>
              <div className="text-sm text-gray-600">Overall Retention Rate</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : `${retentionData.churnRate}%`}
              </div>
              <div className="text-sm text-gray-600">Churn Rate</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : retentionData.averageCustomerLifespan}
              </div>
              <div className="text-sm text-gray-600">Avg Customer Lifespan (Days)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {/* <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">Retention Insights</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div>• Average retention rate across cohorts: {retentionData.retentionRate}%</div>
          <div>• Customer churn rate: {retentionData.churnRate}%</div>
          <div>• Average customer lifespan: {retentionData.averageCustomerLifespan} days</div>
          <div>• Best performing cohort: {retentionData.cohortAnalysis.reduce((best, current) => 
            current.retentionRate > best.retentionRate ? current : best, retentionData.cohortAnalysis[0]
          ).cohort}</div>
        </div>
      </div> */}
    </div>
  );
}
