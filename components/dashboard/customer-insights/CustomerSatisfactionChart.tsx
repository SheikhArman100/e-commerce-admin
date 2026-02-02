'use client';

import dynamic from 'next/dynamic';
import { MessageCircle, Star, TrendingUp, Users } from 'lucide-react';
import { CustomerSatisfaction as CustomerSatisfactionType } from '@/types/dashboard.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface CustomerSatisfactionChartProps {
  data: CustomerSatisfactionType | undefined;
  isLoading: boolean;
}

export default function CustomerSatisfactionChart({
  data,
  isLoading,
}: CustomerSatisfactionChartProps) {
  const satisfactionData = data;

  if (!satisfactionData) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Customer Satisfaction Trends
          </h3>
          <Skeleton className="h-80 w-full" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Rating Distribution
          </h3>
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

  // Prepare data for satisfaction trend line chart
  const trendData = satisfactionData.customerSatisfactionTrend.map((trend) => ({
    period: trend.period,
    averageRating: trend.averageRating,
    reviewCount: trend.reviewCount,
  }));

  

  // Prepare data for rating distribution horizontal bar chart
  const distributionData = [
    {
      rating: 5,
      count: satisfactionData.ratingDistribution['5'],
      color: '#10b981',
    },
    {
      rating: 4,
      count: satisfactionData.ratingDistribution['4'],
      color: '#3b82f6',
    },
    {
      rating: 3,
      count: satisfactionData.ratingDistribution['3'],
      color: '#f59e0b',
    },
    {
      rating: 2,
      count: satisfactionData.ratingDistribution['2'],
      color: '#ef4444',
    },
    {
      rating: 1,
      count: satisfactionData.ratingDistribution['1'],
      color: '#8b5cf6',
    },
  ];

  const barOptions = {
    chart: {
      type: 'bar' as const,
      height: 350,
      fontFamily: 'inherit',
    },
    series: [{
      name: 'Review Count',
      data: distributionData.map((item) => item.count)
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
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#64748b'],
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
      categories: distributionData.map((item) => `${item.rating}`),
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
        },
      },
      title: {
        text: 'Number of Reviews',
        style: {
          color: '#475569',
          fontSize: '14px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#475569',
          fontSize: '12px',
        },
        formatter: (val: number) => `${val} Star`,
      },
      title: {
        text: 'Rating',
        style: {
          color: '#475569',
          fontSize: '14px',
        },
      },
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '13px',
        fontFamily: 'inherit',
      },
      custom: function({ series, seriesIndex, dataPointIndex }: any) {
        const rating = distributionData[dataPointIndex];
        const total = distributionData.reduce((sum, item) => sum + item.count, 0);
        const percentage = total > 0 ? ((rating.count || 0) / total * 100) : 0;
        
        return `
          <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[260px]">
            <div class="font-bold text-gray-800 mb-3 text-base">${rating.rating} Star Rating</div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Count:</span>
                <span class="font-semibold text-gray-800">${rating.count.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Percentage:</span>
                <span class="font-semibold text-gray-800">${percentage.toFixed(1)}%</span>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <div class="flex gap-1">
                  ${[...Array(5)]
                    .map(
                      (_, i) => `
                    <svg 
                      class="h-4 w-4 ${i < rating.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="${i < rating.rating ? 'currentColor' : 'none'}" 
                      stroke="currentColor" 
                      stroke-width="2"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  `,
                    )
                    .join('')}
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
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      }
    },
    legend: {
      show: false,
    },
  };

  return (
    <div className="space-y-6">
      {/* Customer Satisfaction Trend */}
      {/* <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Customer Satisfaction Trends
        </h3>
        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <ReactApexChart
            options={trendOptions}
            series={trendOptions.series}
            type="line"
            height={350}
          />
        )}
      </div> */}

      {/* Rating Distribution */}
      <div>
        {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Rating Distribution
        </h3> */}
        {isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <ReactApexChart
            options={barOptions}
            series={barOptions.series}
            type="bar"
            height={350}
          />
        )}
      </div>

      {/* Satisfaction Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {isLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  satisfactionData.overallRating.toFixed(2)
                )}
              </div>
              <div className="text-sm text-gray-600">Overall Rating</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  satisfactionData.totalReviews.toLocaleString()
                )}
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
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  `${((satisfactionData.ratingDistribution['5'] / satisfactionData.totalReviews) * 100).toFixed(1)}%`
                )}
              </div>
              <div className="text-sm text-gray-600">5-Star Rating</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  satisfactionData.ratingDistribution['3'] +
                  satisfactionData.ratingDistribution['4'] +
                  satisfactionData.ratingDistribution['5']
                )}
              </div>
              <div className="text-sm text-gray-600">Positive Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend Table */}
      {/* <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Monthly Satisfaction Details
        </h3>
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average Rating
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review Count
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {satisfactionData.customerSatisfactionTrend.map(
                    (trend, index) => (
                      <tr key={trend.period} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {trend.period}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {trend.averageRating > 0
                            ? trend.averageRating.toFixed(2)
                            : '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trend.reviewCount.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              trend.trend === 'improving'
                                ? 'bg-green-100 text-green-800'
                                : trend.trend === 'declining'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {trend.trend === 'improving'
                              ? '↗ Improving'
                              : trend.trend === 'declining'
                                ? '↘ Declining'
                                : '→ Stable'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {trend.averageRating >= 4.0 ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Excellent
                            </span>
                          ) : trend.averageRating >= 3.5 ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              Good
                            </span>
                          ) : trend.averageRating >= 2.5 ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                              Average
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                              Poor
                            </span>
                          )}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
}
