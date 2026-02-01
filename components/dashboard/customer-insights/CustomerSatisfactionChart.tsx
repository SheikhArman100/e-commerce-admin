'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, MessageCircle, TrendingUp, Users } from 'lucide-react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface CustomerSatisfactionChartProps {
  data: any;
  isLoading: boolean;
}

export default function CustomerSatisfactionChart({ data, isLoading }: CustomerSatisfactionChartProps) {
  const satisfactionData = data;

  if (!satisfactionData || !satisfactionData.satisfactionMetrics) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Satisfaction Trends</h3>
          <Skeleton className="h-80 w-full" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Feedback Analysis</h3>
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

  // Prepare data for satisfaction metrics bar chart
  const metricsData = satisfactionData.satisfactionMetrics.map((metric: any) => metric.value);
  const metricsLabels = satisfactionData.satisfactionMetrics.map((metric: any) => metric.metric);

  const metricsOptions = {
    chart: {
      type: 'bar' as const,
      height: 300,
      fontFamily: 'inherit',
    },
    series: [{
      name: 'Rating',
      data: metricsData
    }],
    plotOptions: {
      bar: {
        borderRadius: 4,
        distributed: true,
        dataLabels: {
          position: 'top',
        },
      },
    },
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(1),
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#374151'],
      },
    },
    xaxis: {
      categories: metricsLabels,
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Rating',
        style: {
          color: '#475569',
        },
      },
      min: 0,
      max: 5,
      tickAmount: 5,
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
        formatter: (val: number) => `${val.toFixed(1)}/5.0`
      }
    }
  };

  // Prepare data for rating distribution pie chart
  const pieData = satisfactionData.ratingDistribution.map((item: any) => item.percentage);
  const pieLabels = satisfactionData.ratingDistribution.map((item: any) => `${item.rating} Star`);

  const pieOptions = {
    chart: {
      type: 'pie' as const,
      height: 300,
      fontFamily: 'inherit',
    },
    series: pieData,
    labels: pieLabels,
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
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
        const rating = satisfactionData.ratingDistribution[dataPointIndex];
        return `
          <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[260px]">
            <div class="font-bold text-gray-800 mb-3 text-base">${rating.rating} Star Rating</div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Percentage:</span>
                <span class="font-semibold text-gray-800">${rating.percentage}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Review Count:</span>
                <span class="font-semibold text-gray-800">${rating.count.toLocaleString()}</span>
              </div>
            </div>
          </div>
        `;
      },
    }
  };

  return (
    <div className="space-y-6">
      {/* Satisfaction Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Satisfaction Metrics</h3>
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <ReactApexChart options={metricsOptions} series={metricsOptions.series} type="bar" height={300} />
        )}
      </div>

      {/* Rating Distribution */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Rating Distribution</h3>
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <ReactApexChart options={pieOptions} series={pieOptions.series} type="pie" height={300} />
        )}
      </div>

      {/* Satisfaction Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {isLoading ? <Skeleton className="h-8 w-12" /> : satisfactionData.averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : satisfactionData.totalReviews.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : `${satisfactionData.responseRate}%`}
              </div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {isLoading ? <Skeleton className="h-8 w-16" /> : satisfactionData.ratingDistribution[0].count.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">5-Star Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Metrics</h3>
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Improvement</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {satisfactionData.satisfactionMetrics.map((metric: any, index: number) => (
                    <tr key={metric.metric} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {metric.metric}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{metric.value.toFixed(1)}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(metric.value)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {metric.previous.toFixed(1)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          metric.trend === 'up'
                            ? 'bg-green-100 text-green-800'
                            : metric.trend === 'down'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                          {metric.trend === 'up' ? ' Improved' : metric.trend === 'down' ? ' Declined' : ' Stable'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {metric.trend === 'up' ? '+' : ''}{(metric.value - metric.previous).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}