'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquare } from 'lucide-react';
import { ProductReviewAnalytics } from '@/types/dashboard.types';

interface ReviewAnalyticsCardsProps {
  data: ProductReviewAnalytics[];
  isLoading?: boolean;
}

export default function ReviewAnalyticsCards({ data, isLoading }: ReviewAnalyticsCardsProps) {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg bg-white/60 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="flex items-center gap-2 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-4 w-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.slice(0, 4).map((product) => (
            <div
              key={product.productId}
              className="p-4 border border-slate-200 rounded-lg bg-white/60 hover:bg-slate-100/80 transition-colors"
            >
              <div className="font-medium text-slate-800 mb-2 truncate">
                {product.productName}
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.floor(product.averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-medium text-slate-700">
                  {product.averageRating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <MessageSquare className="h-3 w-3" />
                {product.totalReviews} reviews
              </div>
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No review analytics data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}