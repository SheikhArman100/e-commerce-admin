'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { CategoryRevenueTrend, CategoryRevenueTrendData } from '@/types/dashboard.types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface CategoryRevenueTrendChartProps {
  data: CategoryRevenueTrend[];
  isLoading?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CategoryRevenueTrendChart({ data, isLoading }: CategoryRevenueTrendChartProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <BarChart3 className="h-5 w-5 text-slate-600" />
            Category Revenue Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg">
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded w-80"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for area chart
  // Get all unique months across all categories
  const allMonths = new Set<string>();
  data.forEach((category: CategoryRevenueTrend) => {
    category.monthlyData.forEach((monthData: CategoryRevenueTrendData) => {
      allMonths.add(monthData.month);
    });
  });

  const sortedMonths = Array.from(allMonths).sort();

  // Get top 5 categories by total revenue
  const topCategories = data
    .sort((a: CategoryRevenueTrend, b: CategoryRevenueTrend) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  const topSeries = topCategories.map((category: CategoryRevenueTrend) => ({
    name: category.categoryName,
    data: sortedMonths.map((month: string) => {
      const monthData = category.monthlyData.find((m: CategoryRevenueTrendData) => m.month === month);
      return monthData ? monthData.revenue : 0;
    }),
  }));

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      height: 420,
      fontFamily: 'inherit',
      stacked: false,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      background: 'transparent',
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
    },
    colors: ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      lineCap: 'round',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.2,
        gradientToColors: ['#10b981', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa'],
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: sortedMonths.map(month => {
        const date = new Date(month + '-01');
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      }),
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
          fontWeight: 500,
        },
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
      },
      axisBorder: {
        show: true,
        color: '#e2e8f0',
      },
      axisTicks: {
        show: true,
        color: '#e2e8f0',
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      title: {
        text: 'Revenue',
        style: {
          color: '#475569',
          fontSize: '13px',
          fontWeight: 600,
        },
      },
      min: 0,
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
          fontWeight: 500,
        },
        formatter: (value) => {
          if (value >= 1000000) {
            return '$' + (value / 1000000).toFixed(1) + 'M';
          } else if (value >= 1000) {
            return '$' + (value / 1000).toFixed(1) + 'K';
          }
          return '$' + value.toFixed(0);
        },
      },
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '13px',
        fontFamily: 'inherit',
      },
      shared: true,
      intersect: false,
      x: {
        formatter: function (val: any, opts: any) {
          const index = opts.dataPointIndex;
          const month = sortedMonths[index];
          if (month) {
            const date = new Date(month + '-01');
            return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          }
          return val.toString();
        },
      },
      y: {
        formatter: function (val: number) {
          return formatCurrency(val);
        },
      },
      marker: {
        show: true,
      },
    },
    grid: {
      show: true,
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
      position: 'back',
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 20,
        bottom: 10,
        left: 10,
      },
    },
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '13px',
      fontWeight: 600,
      fontFamily: 'inherit',
      offsetY: 0,
      // markers: {
      //   width: 10,
      //   height: 10,
      //   radius: 10,
      //   offsetX: -5,
      // },
      itemMargin: {
        horizontal: 12,
        vertical: 5,
      },
      labels: {
        colors: '#334155',
      },
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
          // value: 0.1,
        },
      },
      active: {
        filter: {
          type: 'darken',
          // value: 0.1,
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 360,
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
          },
          xaxis: {
            labels: {
              rotate: -45,
            },
          },
        },
      },
    ],
  };

  return (
    <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
      <CardHeader className="bg-white/60 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <BarChart3 className="h-5 w-5 text-slate-600" />
          Category Revenue Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/40 rounded-b-lg pt-6">
        {/* Custom Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-6 p-4 ">
          {topCategories.map((category, index) => (
            <div key={category.categoryId} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][index] }}
              ></div>
              <span className="text-sm font-medium text-slate-700">
                {category.categoryName}
              </span>
              
            </div>
          ))}
        </div>

        <div className="h-[450px]">
          <ReactApexChart
            options={options}
            series={topSeries}
            type="area"
            height="100%"
            width="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
}
