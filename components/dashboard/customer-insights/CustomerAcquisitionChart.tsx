'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, TrendingUp, Globe, DollarSign } from 'lucide-react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface CustomerAcquisitionChartProps {
  data: any;
  isLoading: boolean;
}

export default function CustomerAcquisitionChart({ data, isLoading }: CustomerAcquisitionChartProps) {
  const acquisitionData = data;

  if (!acquisitionData || !acquisitionData.acquisitionChannels || acquisitionData.acquisitionChannels.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Acquisition Channels</h3>
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

  // Prepare data for funnel chart
  const funnelData = acquisitionData.acquisitionChannels.map((channel: any) => ({
    name: channel.channel,
    value: channel.customers
  }));

  const funnelOptions = {
    chart: {
      type: 'bar' as const,
      height: 350,
      fontFamily: 'inherit',
    },
    series: [{
      name: 'Customers',
      data: funnelData.map((item: any) => item.value)
    }],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        borderRadius: 4,
        distributed: true,
        dataLabels: {
          position: 'center',
        },
      },
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    dataLabels: {
      enabled: true,
      textAnchor: 'middle' as const,
      formatter: (val: number) => val.toLocaleString(),
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ['#ffffff'],
      },
    },
    xaxis: {
      categories: funnelData.map((item: any) => item.name),
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '13px',
        fontFamily: 'inherit',
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        const channel = acquisitionData.acquisitionChannels[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];

        return `
          <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[260px]">
            <div class="font-bold text-gray-800 mb-3 text-base">${channel.channel}</div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Customers:</span>
                <span class="font-semibold text-gray-800">${value.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Percentage:</span>
                <span class="font-semibold text-gray-800">${channel.percentage}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Cost:</span>
                <span class="font-semibold text-red-600">$${channel.cost.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">CPA:</span>
                <span class="font-semibold text-blue-600">$${channel.cpa.toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Conv. Rate:</span>
                <span class="font-semibold text-green-600">${channel.conversionRate}%</span>
              </div>
            </div>
          </div>
        `;
      },
    },
    grid: {
      show: false,
    },
    legend: {
      show: false,
    },
  };

  // Prepare data for cost efficiency scatter plot
  const scatterData = acquisitionData.acquisitionChannels.map((channel: any) => ({
    x: channel.conversionRate,
    y: channel.cpa,
    channel: channel.channel,
    customers: channel.customers
  }));

  const scatterOptions = {
    chart: {
      type: 'scatter' as const,
      height: 300,
      fontFamily: 'inherit',
    },
    series: [{
      name: 'Channels',
      data: scatterData
    }],
    xaxis: {
      title: {
        text: 'Conversion Rate (%)',
        style: {
          color: '#475569',
        },
      },
      labels: {
        style: {
          colors: '#475569',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Cost Per Acquisition ($)',
        style: {
          color: '#475569',
        },
      },
    },
    colors: ['#3b82f6'],
    markers: {
      size: 10,
      strokeWidth: 2,
      strokeColors: '#ffffff',
      hover: {
        size: 12
      }
    },
    tooltip: {
      theme: 'light',
      custom: function({ dataPointIndex }: { dataPointIndex: number }) {
        const channel = scatterData[dataPointIndex];
        return `
          <div class="p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div class="font-bold text-gray-800 mb-2">${channel.channel}</div>
            <div class="space-y-1 text-sm text-gray-600">
              <div>Conv. Rate: <span class="font-semibold">${channel.x}%</span></div>
              <div>CPA: <span class="font-semibold">$${channel.y.toFixed(2)}</span></div>
              <div>Customers: <span class="font-semibold">${channel.customers.toLocaleString()}</span></div>
            </div>
          </div>
        `;
      }
    },
    grid: {
      show: true,
      borderColor: '#e2e8f0',
    }
  };

  return (
    <div className="space-y-6">
      {/* Acquisition Channels Funnel */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Acquisition Channels</h3>
        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <ReactApexChart options={funnelOptions} series={funnelOptions.series} type="bar" height={350} />
        )}
      </div>

      {/* Cost Efficiency Analysis */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Efficiency Analysis</h3>
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <ReactApexChart options={scatterOptions} series={scatterOptions.series} type="scatter" height={300} />
        )}
      </div>

      {/* Channel Performance Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Channel Performance</h3>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customers</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPA</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {acquisitionData.acquisitionChannels.map((channel: any, index: number) => (
                    <tr key={channel.channel} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-blue-600">
                              {channel.channel.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{channel.channel}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {channel.customers.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {channel.percentage}%
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${channel.cost.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        ${channel.cpa.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {channel.conversionRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : acquisitionData.totalCustomers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total New Customers</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-600">
                {isLoading ? <Skeleton className="h-8 w-20" /> : `$${acquisitionData.totalAcquisitionCost.toLocaleString()}`}
              </div>
              <div className="text-sm text-gray-600">Total Acquisition Cost</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : `$${acquisitionData.averageCpa.toFixed(2)}`}
              </div>
              <div className="text-sm text-gray-600">Average CPA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}