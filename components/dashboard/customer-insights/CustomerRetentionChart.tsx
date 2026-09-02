'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Users, Calendar } from 'lucide-react';
import { CustomerRetention as CustomerRetentionType } from '@/types/dashboard.types';
import CardInfo from '@/components/dashboard/CardInfo';

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
        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              Cohort Analysis
            </CardTitle>
            <CardInfo description="Heatmap of customer retention rates across cohorts for their first four months." />
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              Retention Rate Trend
            </CardTitle>
            <CardInfo description="Historical retention rate trend over time." />
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            Cohort Analysis
          </CardTitle>
          <CardInfo description="Heatmap of customer retention rates across cohorts for their first four months." />
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg pt-4">
          {isLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <ReactApexChart options={heatmapOptions} series={heatmapOptions.series} type="heatmap" height={350} />
          )}
        </CardContent>
      </Card>

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
        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">Overall Retention Rate</CardTitle>
              <div className="flex items-center gap-1.5">
                <CardInfo description="Percentage of customers retained over the selected period." />
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? <Skeleton className="h-8 w-16" /> : `${retentionData.retentionRate}%`}
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">Churn Rate</CardTitle>
              <div className="flex items-center gap-1.5">
                <CardInfo description="Percentage of customers lost during the selected period." />
                <Users className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <div className="text-2xl font-bold text-red-600">
              {isLoading ? <Skeleton className="h-8 w-16" /> : `${retentionData.churnRate}%`}
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-700">Avg Customer Lifespan (Days)</CardTitle>
              <div className="flex items-center gap-1.5">
                <CardInfo description="Average number of days a customer remains active." />
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <div className="text-2xl font-bold text-blue-600">
              {isLoading ? <Skeleton className="h-8 w-16" /> : `${retentionData.averageCustomerLifespan} days`}
            </div>
          </CardContent>
        </Card>
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
