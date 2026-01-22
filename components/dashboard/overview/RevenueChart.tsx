'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueTrend } from '@/types/dashboard.types';

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface RevenueChartProps {
  data: RevenueTrend[];
  isLoading?: boolean;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export default function RevenueChart({ data, isLoading, period = 'yearly' }: RevenueChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80  flex items-center justify-center">
            <div className="animate-pulse">
              {/* <div className="h-4 bg-gray-200 rounded w-44 mb-4"></div> */}
              <div className="h-64 bg-gray-200 rounded w-80"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for ApexCharts - format X-axis labels based on period
  const categories = data.map(item => {
    const dateStr = item.month;

    switch (period) {
      case 'yearly':
        // Format: "YYYY-MM" → "Jan 2025", "Feb 2025", etc.
        const [year, month] = dateStr.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[parseInt(month) - 1]} ${year}`;

      case 'monthly':
      case 'weekly':
        // Format: "YYYY-MM-DD" → "15 Jan", "16 Jan", etc.
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short'
        });

      case 'daily':
        // Format: "YYYY-MM-DD HH:mm:ss" → "11:00", "13:00", etc.
        const timeStr = dateStr.split(' ')[1]; // Get "HH:mm:ss" part
        if (timeStr) {
          const [hours] = timeStr.split(':');
          return `${hours}:00`;
        }
        return dateStr;

      default:
        return dateStr;
    }
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
    colors: ['#10b981', '#6366f1'], // Emerald-300 for revenue, Indigo-300 for orders
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: [2, 2],
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
      size: 0, // Remove markers for cleaner area chart look
      hover: {
        size: 4,
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#000000',
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
            color: '#000000',
            fontSize: '14px',
            fontWeight: 600,
          },
        },
        labels: {
          style: {
            colors: '#000000',
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
            color: '#000000',
            fontSize: '14px',
            fontWeight: 600,
          },
        },
        labels: {
          style: {
            colors: '#000000',
          },
          formatter: (value) => {
            return Math.round(value).toString();
          },
        },
      },
    ],
    tooltip: {
      theme: 'light',
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
          Revenue Trend
          <span className="text-sm font-normal text-slate-600">
            ({data.length} {period === 'daily' ? 'hours' : period === 'weekly' || period === 'monthly' ? 'days' : 'months'})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 bg-white/40 rounded-b-lg">
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
