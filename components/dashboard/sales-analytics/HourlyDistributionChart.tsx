'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { HourlyDistribution } from '@/types/dashboard.types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface HourlyDistributionChartProps {
  data: HourlyDistribution[];
  isLoading?: boolean;
}

export default function HourlyDistributionChart({ data, isLoading }: HourlyDistributionChartProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Clock className="h-5 w-5 text-slate-600" />
            Hourly Sales Distribution
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

  // Normalize data to 0-100 scale for better visualization
  const revenueData = data.map(item => item.revenue);
  const ordersData = data.map(item => item.orders);

  const maxRevenue = Math.max(...revenueData);
  const maxOrders = Math.max(...ordersData);

  const normalizedRevenue = revenueData.map(value => (value / maxRevenue) * 100);
  const normalizedOrders = ordersData.map(value => (value / maxOrders) * 100);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'radar',
      height: 450,
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
      dropShadow: {
        enabled: true,
        blur: 1,
        left: 1,
        top: 1,
        opacity: 0.2,
      },
    },
    colors: ['#10b981', '#6366f1'], // emerald-300, indigo-300
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    fill: {
      opacity: 0.15,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      radar: {
        size: 180, // Increased from 120
        offsetX: 0,
        offsetY: 0,
        polygons: {
          strokeColors: '#e2e8f0',
          // strokeWidth: 1,
          connectorColors: '#e2e8f0',
          fill: {
            colors: ['#f8fafc', '#f1f5f9']
          }
        }
      }
    },
    markers: {
      size: 3,
      colors: ['#059669', '#4f46e5'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 6,
      }
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '14px',
        fontFamily: 'inherit',
      },
      y: {
        formatter: undefined,
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const item = data[dataPointIndex];
        const isRevenue = seriesIndex === 0;
        const normalizedValue = series[seriesIndex][dataPointIndex];
        
        return `
          <div class="p-3 bg-white border border-slate-200 rounded shadow-lg min-w-[160px]">
            <div class="font-semibold text-slate-800 mb-2">${item.hour}:00</div>
            <div class="space-y-1">
              <div class="text-sm flex justify-between gap-3">
                <span class="text-emerald-600 font-medium">Revenue:</span> 
                <span class="text-slate-700">$${item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div class="text-sm flex justify-between gap-3">
                <span class="text-indigo-600 font-medium">Orders:</span> 
                <span class="text-slate-700">${item.orders}</span>
              </div>
              <div class="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                ${isRevenue ? 'Revenue' : 'Orders'} normalized: ${normalizedValue.toFixed(1)}%
              </div>
            </div>
          </div>
        `;
      }
    },
    xaxis: {
      categories: data.map(item => `${item.hour}:00`),
      labels: {
        show: true,
        formatter: (value, timestamp, opts) => {
          const hour = parseInt(value.split(':')[0]);
          // Show every other hour for cleaner labels
          return hour % 2 === 0 ? value : '';
        },
        style: {
          colors: '#475569',
          fontSize: '11px',
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      show: true,
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (value) => {
          return `${Math.round(value)}%`;
        },
        style: {
          colors: '#64748b',
          fontSize: '11px',
        },
      },
    },
    grid: {
      show: true,
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '13px',
      fontWeight: 500,
      offsetY: 10,
      itemMargin: {
        horizontal: 24,
        vertical: 8,
      },

    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 380,
          },
          plotOptions: {
            radar: {
              size: 140,
            }
          },
        },
      },
    ],
  };

  const series = [
    {
      name: 'Revenue',
      data: normalizedRevenue,
    },
    {
      name: 'Orders',
      data: normalizedOrders,
    },
  ];

  return (
    <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
      <CardHeader className="bg-white/60 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Clock className="h-5 w-5 text-slate-600" />
          Hourly Sales Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/40 rounded-b-lg pt-4">
        <ReactApexChart
          options={options}
          series={series}
          type="radar"
          height={450}
          width="100%"
        />
      </CardContent>
    </Card>
  );
}
