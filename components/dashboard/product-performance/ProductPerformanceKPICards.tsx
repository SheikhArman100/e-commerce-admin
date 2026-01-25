'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  Award
} from 'lucide-react';
import { ProductPerformanceResponse } from '@/types/dashboard.types';

interface ProductPerformanceKPICardsProps {
  data: ProductPerformanceResponse;
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

export default function ProductPerformanceKPICards({ data, isLoading }: ProductPerformanceKPICardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="border-slate-200 bg-slate-50/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="bg-white/60 rounded-lg p-3">
              <div className="h-8 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate metrics from the data
  const totalRevenue = data.performanceRankings.reduce((sum, product) => sum + product.revenue, 0);
  const totalOrders = data.performanceRankings.reduce((sum, product) => sum + product.orders, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const topProduct = data.performanceRankings.length > 0
    ? data.performanceRankings.reduce((top, current) =>
        current.revenue > top.revenue ? current : top
      )
    : null;

  const bestCategory = data.categoryAnalysis.length > 0
    ? data.categoryAnalysis.reduce((best, current) =>
        current.totalRevenue > best.totalRevenue ? current : best
      )
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {/* Total Revenue */}
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700">
            Total Revenue
          </CardTitle>
          <div className="p-2.5 rounded-xl bg-emerald-100 shadow-sm">
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent className="bg-white/60 rounded-lg p-3">
          <div className="text-2xl font-bold text-slate-800">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Across all products
          </p>
        </CardContent>
      </Card>

      {/* Total Orders */}
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700">
            Total Orders
          </CardTitle>
          <div className="p-2.5 rounded-xl bg-blue-100 shadow-sm">
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent className="bg-white/60 rounded-lg p-3">
          <div className="text-2xl font-bold text-slate-800">
            {formatNumber(totalOrders)}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Order volume
          </p>
        </CardContent>
      </Card>

      {/* Average Order Value */}
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700">
            Avg Order Value
          </CardTitle>
          <div className="p-2.5 rounded-xl bg-purple-100 shadow-sm">
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent className="bg-white/60 rounded-lg p-3">
          <div className="text-2xl font-bold text-slate-800">
            {formatCurrency(averageOrderValue)}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Per order average
          </p>
        </CardContent>
      </Card>

      {/* Top Performing Product */}
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700">
            Top Product
          </CardTitle>
          <div className="p-2.5 rounded-xl bg-yellow-100 shadow-sm">
            <Award className="h-4 w-4 text-yellow-600" />
          </div>
        </CardHeader>
        <CardContent className="bg-white/60 rounded-lg p-3">
          <div className="text-lg font-bold text-slate-800 truncate">
            {topProduct?.productName || 'N/A'}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {topProduct ? formatCurrency(topProduct.revenue) : 'No data'}
          </p>
        </CardContent>
      </Card>

      {/* Best Category */}
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700">
            Best Category
          </CardTitle>
          <div className="p-2.5 rounded-xl bg-green-100 shadow-sm">
            <Package className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent className="bg-white/60 rounded-lg p-3">
          <div className="text-lg font-bold text-slate-800 truncate">
            {bestCategory?.categoryName || 'N/A'}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {bestCategory ? formatCurrency(bestCategory.totalRevenue) : 'No data'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}