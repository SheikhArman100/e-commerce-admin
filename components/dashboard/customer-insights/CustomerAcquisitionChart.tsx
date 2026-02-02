'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, TrendingUp, Globe, DollarSign } from 'lucide-react';
import dynamic from 'next/dynamic';
import { CustomerAcquisition as CustomerAcquisitionType } from '@/types/dashboard.types';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface CustomerAcquisitionChartProps {
  data: CustomerAcquisitionType | undefined;
  isLoading: boolean;
}

export default function CustomerAcquisitionChart({ data, isLoading }: CustomerAcquisitionChartProps) {
  const acquisitionData = data;

  if (!acquisitionData) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Acquisition Trends</h3>
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

  // Prepare data for trend chart
  const trendData = acquisitionData.customerAcquisitionTrend.map((trend) => ({
    period: trend.period,
    newCustomers: trend.newCustomers,
    returningCustomers: trend.returningCustomers,
    totalCustomers: trend.totalCustomers
  }));

  const trendOptions = {
    chart: {
      type: 'line' as const,
      height: 350,
      fontFamily: 'inherit',
    },
    series: [
      {
        name: 'New Customers',
        data: trendData.map(item => item.newCustomers)
      },
      {
        name: 'Returning Customers',
        data: trendData.map(item => item.returningCustomers)
      },
      {
        name: 'Total Customers',
        data: trendData.map(item => item.totalCustomers)
      }
    ],
    colors: ['#3b82f6', '#10b981', '#64748b'],
    stroke: {
      curve: 'smooth' as const,
      width: 3
    },
    xaxis: {
      categories: trendData.map(item => item.period),
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#475569',
        },
        formatter: (val: number) => val.toLocaleString()
      },
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '13px',
        fontFamily: 'inherit',
      },
      custom: function({ series, seriesIndex, dataPointIndex }: any) {
        const trend = trendData[dataPointIndex];
        const seriesNames = ['New Customers', 'Returning Customers', 'Total Customers'];
        const colors = ['#3b82f6', '#10b981', '#6366f1'];
        
        return `
          <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[260px]">
            <div class="font-bold text-gray-800 mb-3 text-base">${trend.period}</div>
            <div class="space-y-2 text-sm">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" style="background-color: ${colors[0]}"></div>
                <span class="text-gray-600">New Customers:</span>
                <span class="font-semibold text-gray-800">${trend.newCustomers.toLocaleString()}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" style="background-color: ${colors[1]}"></div>
                <span class="text-gray-600">Returning Customers:</span>
                <span class="font-semibold text-gray-800">${trend.returningCustomers.toLocaleString()}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" style="background-color: ${colors[2]}"></div>
                <span class="text-gray-600">Total Customers:</span>
                <span class="font-semibold text-gray-800">${trend.totalCustomers.toLocaleString()}</span>
              </div>
            </div>
          </div>
        `;
      },
    },
    grid: {
      show: true,
      borderColor: '#e2e8f0',
    },
    legend: {
      position: 'top' as const,
      horizontalAlign: 'center' as const,
      labels: {
        colors: '#475569',
      }
    },
    markers: {
      size: 4,
      hover: {
        size: 6
      }
    }
  };

  // Prepare data for customer type distribution pie chart
  const distributionData = [
    { name: 'New Customers', value: acquisitionData.newCustomers, color: '#3b82f6' },
    { name: 'Returning Customers', value: acquisitionData.returningCustomers, color: '#10b981' }
  ];

  
  return (
    <div className="space-y-6">
      {/* Customer Acquisition Trend */}
      <div>
        {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Acquisition Trends</h3> */}
        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <ReactApexChart options={trendOptions} series={trendOptions.series} type="line" height={350} />
        )}
      </div>

      {/* Customer Type Distribution */}
      {/* <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Type Distribution</h3>
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <ReactApexChart options={distributionOptions} series={distributionOptions.series} type="pie" height={300} />
        )}
      </div> */}

      {/* Customer Acquisition Trend Table */}
      {/* <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Acquisition Details</h3>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Customers</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returning Customers</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Customers</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {acquisitionData.customerAcquisitionTrend.map((trend, index) => {
                    const prevMonth = index > 0 ? acquisitionData.customerAcquisitionTrend[index - 1].totalCustomers : 0;
                    const growthRate = prevMonth > 0 ? ((trend.totalCustomers - prevMonth) / prevMonth * 100) : 0;
                    
                    return (
                      <tr key={trend.period} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{trend.period}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {trend.newCustomers.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trend.returningCustomers.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trend.totalCustomers.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          {trend.totalCustomers > 0 ? (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              growthRate >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div> */}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : acquisitionData.newCustomers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">New Customers</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : `${acquisitionData.acquisitionRate}%`}
              </div>
              <div className="text-sm text-gray-600">Acquisition Rate</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Globe className="h-6 w-6 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : acquisitionData.returningCustomers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Returning Customers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
