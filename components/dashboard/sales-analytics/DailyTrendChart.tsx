'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { DailyTrend } from '@/types/dashboard.types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface DailyTrendChartProps {
  data: DailyTrend[];
  isLoading?: boolean;
}

export default function DailyTrendChart({ data, isLoading }: DailyTrendChartProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Calendar className="h-5 w-5 text-slate-600" />
            Daily Sales Trend (Last 7 Days)
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

  const categories = data.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  });

  const revenueData = data.map(item => item.revenue);
  const ordersData = data.map(item => item.orders);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      height: 320,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      background: 'transparent',
    },
    colors: ['#059669', '#4f46e5'], // emerald-600, indigo-600
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: [3, 2],
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.4,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    markers: {
      size: 0,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: [
      {
        title: {
          text: 'Revenue ($)',
          style: {
            color: '#475569',
            fontSize: '14px',
            fontWeight: 600,
          },
        },
        labels: {
          style: {
            colors: '#475569',
          },
          formatter: (value) => {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value);
          },
        },
      },
      {
        opposite: true,
        title: {
          text: 'Orders',
          style: {
            color: '#475569',
            fontSize: '14px',
            fontWeight: 600,
          },
        },
        labels: {
          style: {
            colors: '#475569',
          },
          formatter: (value) => {
            return Math.round(value).toString();
          },
        },
      },
    ],
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '14px',
        fontFamily: 'inherit',
      },
      y: [
        {
          formatter: (value) => {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value);
          },
        },
        {
          formatter: (value) => {
            return `${value} orders`;
          },
        },
      ],
    },
    grid: {
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
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
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
            height: 280,
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
          },
        },
      },
    ],
  };

  const series = [
    {
      name: 'Revenue',
      type: 'area',
      data: revenueData,
    },
    {
      name: 'Orders',
      type: 'area',
      data: ordersData,
    },
  ];

  return (
    <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
      <CardHeader className="bg-white/60 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Calendar className="h-5 w-5 text-slate-600" />
          Daily Sales Trend (Last 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/40 rounded-b-lg">
        <div className="h-80">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height="100%"
            width="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
}
