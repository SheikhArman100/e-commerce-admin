'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CardInfo from '@/components/dashboard/CardInfo';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface CustomerDemographicsChartProps {
  data: any[];
  isLoading: boolean;
}

export default function CustomerDemographicsChart({ data, isLoading }: CustomerDemographicsChartProps) {
  const chartData = data;

  if (!chartData) {
    return (
      <div className="space-y-6">
        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Users className="h-5 w-5 text-blue-600" />
              Age Group Distribution
            </CardTitle>
            <CardInfo description="Donut chart showing customer distribution across age groups." />
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
          <CardHeader className="bg-white/60 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              Average Order Value by Age Group
            </CardTitle>
            <CardInfo description="Bar chart comparing average order value across age groups." />
          </CardHeader>
          <CardContent className="bg-white/40 rounded-b-lg">
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const donutOptions = {
    chart: {
      type: 'donut' as const,
      height: 300,
      fontFamily: 'inherit',
    },
    series: chartData.map(item => item.percentage),
    labels: chartData.map(item => item.ageGroup),
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#64748b'],
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
      position: 'bottom' as const,
      horizontalAlign: 'center' as const,
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`
    }
  };

  const barOptions = {
    chart: {
      type: 'bar' as const,
      height: 300,
      fontFamily: 'inherit',
    },
    series: [{
      name: 'Average Order Value',
      data: chartData.map(item => item.averageOrderValue)
    }],
    xaxis: {
      categories: chartData.map(item => item.ageGroup),
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Average Order Value (৳)',
        style: {
          color: '#475569',
        },
      },
    },
    colors: ['#3b82f6'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        distributed: true,
      }
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: true,
      borderColor: '#e2e8f0',
    }
  };

  return (
    <div className="space-y-6">
      {/* Age Group Distribution */}
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Users className="h-5 w-5 text-blue-600" />
            Age Group Distribution
          </CardTitle>
          <CardInfo description="Donut chart showing customer distribution across age groups." />
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg">
          {isLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <ReactApexChart options={donutOptions} series={donutOptions.series} type="donut" height={300} />
          )}
        </CardContent>
      </Card>

      {/* Average Order Value by Age Group */}
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            Average Order Value by Age Group
          </CardTitle>
          <CardInfo description="Bar chart comparing average order value across age groups." />
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg">
          {isLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <ReactApexChart options={barOptions} series={barOptions.series} type="bar" height={300} />
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {isLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : chartData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">Total Customers</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {isLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : `${((chartData.find(item => item.ageGroup === '25-34')?.percentage || 40)).toFixed(1)}%`}
          </div>
          <div className="text-sm text-gray-600 mt-1">Largest Segment</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {isLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : `৳${(chartData.reduce((sum, item) => sum + (item.averageOrderValue * item.percentage), 0) / 100).toFixed(2)}`}
          </div>
          <div className="text-sm text-gray-600 mt-1">Weighted Avg AOV</div>
        </div>
      </div>
    </div>
  );
}
