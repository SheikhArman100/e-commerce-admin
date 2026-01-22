'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { CategoryPerformance } from '@/types/dashboard.types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface CategoryPerformanceChartProps {
  data: CategoryPerformance[];
  isLoading?: boolean;
}

export default function CategoryPerformanceChart({ data, isLoading }: CategoryPerformanceChartProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Package className="h-5 w-5 text-slate-600" />
            Category Performance
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

  // Sort by revenue descending
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);

  // Calculate total revenue and orders for percentage calculation
  const totalRevenue = sortedData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = sortedData.reduce((sum, item) => sum + item.orders, 0);

  // Calculate max percentage for y-axis
  const maxRevenuePercent = Math.max(...sortedData.map(item => (item.revenue / totalRevenue) * 100));
  const maxOrdersPercent = Math.max(...sortedData.map(item => (item.orders / totalOrders) * 100));
  const maxPercent = Math.max(maxRevenuePercent, maxOrdersPercent);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 420,
      fontFamily: 'inherit',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true,
        },
      },
      background: 'transparent',
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    colors: ['#10b981', '#6366f1'], // emerald-300, indigo-300 (matching overview)
    plotOptions: {
      bar: {
        horizontal: false, // Vertical grouped bars
        columnWidth: '90%',
        borderRadius: 2,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: false,
      textAnchor: 'middle',
      formatter: function (val: number, opts: any) {
        const seriesIndex = opts.seriesIndex;
        const dataPointIndex = opts.dataPointIndex;
        const item = sortedData[dataPointIndex];

        if (seriesIndex === 0) {
          return `$${(item.revenue / 1000).toFixed(0)}K`;
        } else {
          return `${item.orders}`;
        }
      },
      style: {
        fontSize: '10px',
        fontWeight: 600,
        colors: ['#059669', '#4f46e5'],
      },
      offsetY: -5,
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.6,
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: sortedData.map(item => item.categoryName),
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
          fontWeight: 500,
        },
        rotate: -45,
        rotateAlways: true,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: 'Percentage (%)',
        style: {
          color: '#475569',
          fontSize: '12px',
          fontWeight: 600,
        },
      },
      min: 0,
      max: maxPercent * 1.1, // Set max to 110% of highest percentage value
      labels: {
        style: {
          colors: '#475569',
          fontSize: '11px',
        },
        formatter: (value) => {
          const numValue = typeof value === 'number' ? value : parseFloat(value);
          return isNaN(numValue) ? '0.0%' : numValue.toFixed(1) + '%';
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
      y: {
        formatter: function (val: number, opts: any) {
          const dataPointIndex = opts.dataPointIndex;
          const seriesIndex = opts.seriesIndex;
          const item = sortedData[dataPointIndex];
          
          if (seriesIndex === 0) {
            return `$${item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${val.toFixed(1)}%)`;
          } else {
            return `${item.orders} orders (${val.toFixed(1)}%)`;
          }
        },
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const item = sortedData[dataPointIndex];
        const avgOrderValue = item.revenue / item.orders;
        const revenuePercent = series[0][dataPointIndex];
        const ordersPercent = series[1][dataPointIndex];

        return `
          <div class="p-4 bg-white border border-slate-200 rounded-lg shadow-xl min-w-[260px]">
            <div class="font-bold text-slate-800 mb-3 pb-2 border-b border-slate-200 text-base">${item.categoryName}</div>
            <div class="space-y-2.5">
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-emerald-600 rounded flex-shrink-0 mt-0.5"></div>
                  <span class="text-sm text-slate-600">Revenue:</span>
                </div>
                <div class="text-right">
                  <div class="text-slate-800 font-semibold">$${item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div class="text-xs text-slate-500">${revenuePercent.toFixed(1)}% of total</div>
                </div>
              </div>
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-indigo-600 rounded flex-shrink-0 mt-0.5"></div>
                  <span class="text-sm text-slate-600">Orders:</span>
                </div>
                <div class="text-right">
                  <div class="text-slate-800 font-semibold">${item.orders}</div>
                  <div class="text-xs text-slate-500">${ordersPercent.toFixed(1)}% of total</div>
                </div>
              </div>
              <div class="pt-2 mt-2 border-t border-slate-100 space-y-1.5">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-600">Market Share:</span>
                  <span class="font-semibold text-slate-800">${item.percentage}%</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-600">Avg Order Value:</span>
                  <span class="font-semibold text-emerald-700">$${avgOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      },
    },
    grid: {
      show: true,
      borderColor: '#e2e8f0',
      strokeDashArray: 3,
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
        top: 20,
        right: 10,
        bottom: 0,
        left: 10,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '13px',
      fontWeight: 600,
      markers: {},
      itemMargin: {
        horizontal: 20,
        vertical: 8,
      },
    },
    fill: {
      opacity: 1,
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
        },
      },
      active: {
        filter: {
          type: 'none',
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
          plotOptions: {
            bar: {
              columnWidth: '75%',
            },
          },
          xaxis: {
            labels: {
              rotate: -90,
              fontSize: '10px',
            },
          },
          dataLabels: {
            enabled: false,
          },
        },
      },
    ],
  };

  const series = [
    {
      name: 'Revenue Share',
      data: sortedData.map(item => {
        const percentage = (item.revenue / totalRevenue) * 100;
        return Number(percentage.toFixed(1));
      }),
    },
    {
      name: 'Order Share',
      data: sortedData.map(item => {
        const percentage = (item.orders / totalOrders) * 100;
        return Number(percentage.toFixed(1));
      }),
    },
  ];

  return (
    <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
      <CardHeader className="bg-white/60 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Package className="h-5 w-5 text-slate-600" />
          Category Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/40 rounded-b-lg pt-4">
        <div className="h-[450px]">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height="100%"
            width="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
}
