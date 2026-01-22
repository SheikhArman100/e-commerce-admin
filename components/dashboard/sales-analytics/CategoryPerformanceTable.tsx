'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { CategoryPerformance } from '@/types/dashboard.types';

interface CategoryPerformanceTableProps {
  data: CategoryPerformance[];
  isLoading?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export default function CategoryPerformanceTable({ data, isLoading }: CategoryPerformanceTableProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Package className="h-5 w-5 text-slate-600" />
            Category Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg">
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white/60 animate-pulse">
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-8"></div>
                </div>
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
          <Package className="h-5 w-5 text-slate-600" />
          Category Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/40 rounded-b-lg">
        <div className="space-y-3">
          {data.map((category) => (
            <div
              key={category.categoryId}
              className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white/60 hover:bg-slate-100/80 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-slate-800 mb-1">
                  {category.categoryName}
                </div>
                <div className="text-xs text-slate-600">
                  {formatNumber(category.orders)} orders
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm text-slate-800">
                  {formatCurrency(category.revenue)}
                </div>
                <div className="text-xs text-slate-600">
                  {category.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
