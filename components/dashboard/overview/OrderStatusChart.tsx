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
}

export default function OrderStatusChart({ data, isLoading }: OrderStatusChartProps) {
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
        return '#16a34a';
      case 'shipped':
        return '#2563eb';
      case 'pending':
        return '#f97316';
      case 'cancelled':
        return '#dc2626';
      case 'processing':
        return '#9333ea';
      default:
        return '#64748b';
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
      y: {
        formatter: (value) => {
          const percentage = ((value / totalOrders) * 100).toFixed(1);
          return `${value} orders (${percentage}%)`;
        },
      },
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
              color: '#111827',
              offsetY: 8,
              formatter: () => totalOrders.toString(),
            },
            total: {
              show: true,
              label: 'Total Orders',
              fontSize: '14px',
              fontWeight: 500,
              color: '#6b7280',
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
    <Card>
      <CardHeader >
        <CardTitle className="text-lg font-semibold text-gray-900">
          Order Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

        <div className="space-y-3  flex flex-wrap gap-4 justify-center items-center">
          {data.map((item, index) => {
            const percentage = ((item.count / totalOrders) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between ">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getStatusColor(item.status) }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {item.status}
                  </span>
                </div>
                {/* <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">
                    {item.count}
                  </span>
                  <span className="text-sm text-gray-500 w-14 text-right">
                    {percentage}%
                  </span>
                </div> */}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}