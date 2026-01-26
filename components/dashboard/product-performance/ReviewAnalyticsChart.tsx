'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquare } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProductReviewAnalytics } from '@/types/dashboard.types';
import { useMemo } from 'react';

// Custom tooltip component to show product breakdown
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || payload.length === 0) return null;

  const rating = label;
  const count = payload[0].value;
  const products: Array<{ name: string; count: number }> = [];

  // Find which products have reviews for this rating
  payload[0].payload.products.forEach((product: any) => {
    if (product.ratingCount > 0) {
      products.push({
        name: product.productName,
        count: product.ratingCount
      });
    }
  });

  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
      <p className="font-semibold text-sm mb-2">{rating}: {count} reviews</p>
      <div className="space-y-1">
        {products.map((product, index) => (
          <div key={index} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{product.name}</span>
            <span className="font-medium">{product.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ReviewAnalyticsCardsProps {
  data: ProductReviewAnalytics[];
  isLoading?: boolean;
}

export default function ReviewAnalyticsChart({ data, isLoading }: ReviewAnalyticsCardsProps) {

  // Calculate aggregated rating distribution across all products
  const aggregatedRatings = useMemo(() => {
    if (isLoading || data.length === 0) return null;
    
    const totals: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalReviews = 0;
    let totalRatingSum = 0;
    const totalProducts = data.length;
    
    data.forEach((product: any) => {
      Object.keys(product.ratingDistribution).forEach(rating => {
        const ratingNum = parseInt(rating);
        totals[ratingNum] += product.ratingDistribution[ratingNum] || 0;
      });
      totalReviews += product.totalReviews;
      totalRatingSum += product.averageRating * product.totalReviews;
    });
    
    const overallAverage = totalReviews > 0 ? totalRatingSum / totalReviews : 0;
    
    return {
      totals,
      totalReviews,
      overallAverage,
      totalProducts
    };
  }, [data, isLoading]);

  // Prepare chart data for rating distribution with product breakdown
  const chartData = useMemo(() => {
    if (!aggregatedRatings) return [];
    
    const ratings = [1, 2, 3, 4, 5];
    return ratings.map(rating => {
      const products = data.map((product: any) => ({
        productName: product.productName,
        ratingCount: product.ratingDistribution[rating] || 0
      }));
      
      return {
        rating: `${rating}★`,
        count: aggregatedRatings.totals[rating as keyof typeof aggregatedRatings.totals],
        fill: rating === 1 ? 'hsl(var(--destructive))' :
               rating === 2 ? 'hsl(var(--destructive-foreground))' :
               rating === 3 ? 'hsl(var(--muted-foreground))' :
               rating === 4 ? 'hsl(var(--primary-foreground))' :
               'hsl(var(--primary))',
        products
      };
    });
  }, [aggregatedRatings, data]);

  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Star className="h-5 w-5 text-slate-600" />
            Customer Satisfaction Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg">
          <div className="space-y-4">
            {/* Loading skeleton for dropdown */}
            <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
            {/* Loading skeleton for chart */}
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
            {/* Loading skeleton for summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg bg-white/60 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Star className="h-5 w-5 text-slate-600" />
            Customer Satisfaction Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg">
          <div className="text-center py-8 text-slate-500">
            <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No review analytics data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
      <CardHeader className="bg-white/60 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Star className="h-5 w-5 text-slate-600" />
          Customer Satisfaction Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/40 rounded-b-lg">
        <div className="space-y-6">
          {/* Rating Distribution Bar Chart */}
          <div className="h-80 mt-12">
            <ChartContainer config={{}} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="rating" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
                  />
                  <Bar 
                    dataKey="count" 
                    radius={[4, 4, 0, 0]}
                    className="transition-all hover:opacity-80"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Summary Cards */}
          {aggregatedRatings && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-slate-200 rounded-lg bg-white/60">
                <div className="text-sm text-slate-600 mb-1 whitespace-nowrap">Overall Average Rating</div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.floor(aggregatedRatings.overallAverage)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-bold text-slate-800">
                    {aggregatedRatings.overallAverage.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="p-4 border border-slate-200 rounded-lg bg-white/60">
                <div className="text-sm text-slate-600 mb-1">Total Reviews</div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-slate-600" />
                  <span className="text-lg font-bold text-slate-800">
                    {aggregatedRatings.totalReviews}
                  </span>
                </div>
              </div>

              <div className="p-4 border border-slate-200 rounded-lg bg-white/60">
                <div className="text-sm text-slate-600 mb-1">Total Products</div>
                <div className="font-medium text-slate-800">
                  {aggregatedRatings.totalProducts}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
