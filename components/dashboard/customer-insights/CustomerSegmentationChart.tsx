'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, DollarSign, TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';
import { CustomerSegmentation as CustomerSegmentationType } from '@/types/dashboard.types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface CustomerSegmentationChartProps {
  data: CustomerSegmentationType[];
  isLoading: boolean;
}

export default function CustomerSegmentationChart({ data, isLoading }: CustomerSegmentationChartProps) {
  const chartData = data;

  if (!chartData) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Segments</h3>
          <Skeleton className="h-80 w-full" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Segment Performance</h3>
          <Skeleton className="h-80 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Prepare data for pie chart
  const pieData = chartData.map(item => item.percentage);
  const pieLabels = chartData.map(item => item.segment);

  const pieOptions = {
    chart: {
      type: 'pie' as const,
      height: 300,
      fontFamily: 'inherit',
    },
    series: pieData,
    labels: pieLabels,
    colors: ['#10b981', '#3b82f6', '#f59e0b'],
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
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '13px',
        fontFamily: 'inherit',
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        const segment = chartData[dataPointIndex];
        return `
          <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[260px]">
            <div class="font-bold text-gray-800 mb-3 text-base">${segment.segment}</div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Customer Count:</span>
                <span class="font-semibold text-gray-800">${segment.customerCount.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Percentage:</span>
                <span class="font-semibold text-gray-800">${segment.percentage}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Avg Order Value:</span>
                <span class="font-semibold text-green-600">$${segment.averageOrderValue.toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total Revenue:</span>
                <span class="font-semibold text-blue-600">$${segment.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        `;
      },
    }
  };

  // Prepare data for stacked bar chart (Revenue contribution)
  const barOptions = {
    chart: {
      type: 'bar' as const,
      height: 300,
      fontFamily: 'inherit',
    },
    series: [{
      name: 'Revenue Contribution',
      data: chartData.map(item => item.totalRevenue)
    }],
    plotOptions: {
      bar: {
        borderRadius: 4,
        distributed: true,
      }
    },
    xaxis: {
      categories: chartData.map(item => item.segment),
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Revenue ($)',
        style: {
          color: '#475569',
        },
      },
    },
    colors: ['#10b981', '#3b82f6', '#f59e0b'],
    dataLabels: {
      enabled: false,
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
        formatter: (val: number) => `$${val.toLocaleString()}`
      }
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'High Value': return 'bg-green-100 text-green-800';
      case 'Medium Value': return 'bg-blue-100 text-blue-800';
      case 'Low Value': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Customer Segments Pie Chart */}
      <div>
        {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Segments</h3> */}
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <ReactApexChart options={pieOptions} series={pieOptions.series} type="pie" height={350} />
        )}
      </div>

      {/* Revenue Contribution */}
      {/* <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Contribution by Segment</h3>
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <ReactApexChart options={barOptions} series={barOptions.series} type="bar" height={300} />
        )}
      </div> */}

      {/* Segment Details Table */}
      {/* <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Segment Analysis</h3>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customers</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders/Customer</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {chartData.map((segment, index) => (
                    <tr key={segment.segment} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(segment.segment)}`}>
                          {segment.segment}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {segment.customerCount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {segment.percentage}%
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ${segment.averageOrderValue.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${segment.totalRevenue.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {segment.averageOrdersPerCustomer.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div> */}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? <Skeleton className="h-8 w-20" /> : chartData.reduce((sum, item) => sum + item.customerCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? <Skeleton className="h-8 w-20" /> : `$${chartData.reduce((sum, item) => sum + item.totalRevenue, 0).toLocaleString()}`}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {isLoading ? <Skeleton className="h-8 w-20" /> : (chartData.reduce((sum, item) => sum + (item.averageOrderValue * item.percentage), 0) / 100).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Weighted Avg Order Value</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
