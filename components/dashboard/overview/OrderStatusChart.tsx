'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderStatusDistribution } from '@/types/dashboard.types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface OrderStatusChartProps {
  data: OrderStatusDistribution[];
  isLoading?: boolean;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export default function OrderStatusChart({ data, isLoading, period }: OrderStatusChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Order Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-40 w-40 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const labels = data.map(item => item.status);
  const series = data.map(item => item.count);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#10b981'; // emerald-400 - balanced brightness
      case 'shipped':
        return '#6366f1'; // indigo-400 - balanced brightness
      case 'pending':
        return '#f59e0b'; // amber-400 - balanced brightness
      case 'cancelled':
        return '#ef4444'; // red-400 - balanced brightness
      case 'processing':
        return '#8b5cf6'; // violet-400 - balanced brightness
      default:
        return '#64748b'; // slate-400 - balanced brightness
    }
  };

  const colors = data.map(item => getStatusColor(item.status));
  const totalOrders = series.reduce((sum, count) => sum + count, 0);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'inherit',
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
    },
    colors: colors,
    labels: labels,
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      style: {
        fontSize: '14px',
        fontFamily: 'inherit',
      },
      y: {
        formatter: (value) => {
          const percentage = ((value / totalOrders) * 100).toFixed(1);
          return `${value} orders (${percentage}%)`;
        },
      },
      marker: {
        show: true,
      },
      fillSeriesColor: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '55%',
          labels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: '36px',
              fontWeight: 700,
              color: '#1e293b', // slate-800
              offsetY: 8,
              formatter: () => totalOrders.toString(),
            },
            total: {
              show: true,
              label: 'Total Orders',
              fontSize: '14px',
              fontWeight: 500,
              color: '#64748b', // slate-500
              formatter: () => totalOrders.toString(),
            },
          },
        },
      },
    },
    stroke: {
      width: 0,
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
  };

  return (
    <Card className="border-slate-200 bg-slate-50/80 shadow-sm h-full">
      <CardHeader className="bg-white/60 rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Order Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 bg-white/40 rounded-b-lg">
        <div className="flex justify-center">
          <div style={{ width: '220px', height: '220px' }}>
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              height="100%"
              width="100%"
            />
          </div>
        </div>

        <div className="space-y-3 flex flex-wrap gap-4 justify-center items-center">
          {data.map((item, index) => {
            const percentage = ((item.count / totalOrders) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getStatusColor(item.status) }}
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
