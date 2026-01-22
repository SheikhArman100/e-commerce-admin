'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Zap,
  TrendingUp,
  Clock
} from 'lucide-react';
import { SalesAnalyticsResponse } from '@/types/dashboard.types';

interface SalesKPICardsProps {
  data: SalesAnalyticsResponse;
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

export default function SalesKPICards({ data, isLoading }: SalesKPICardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-20 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Get the peak hour from the API data (first item in peakHours array)
  const peakHour = data.peakHours && data.peakHours.length > 0 ? data.peakHours[0] : null;

  // Calculate growth rate percentage (assuming growthRate is a raw number)
  const growthRatePercent = data.growthRate ? (data.growthRate / 100).toFixed(1) : '0.0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700">
            Average Order Value
          </CardTitle>
          <div className="p-2.5 rounded-xl bg-emerald-100 shadow-sm">
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent className="bg-white/60 rounded-lg p-3">
          <div className="text-2xl font-bold text-slate-800">
            {formatCurrency(data.averageOrderValue)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700">
            Sales Velocity
          </CardTitle>
          <div className="p-2.5 rounded-xl bg-blue-100 shadow-sm">
            <Zap className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent className="bg-white/60 rounded-lg p-3">
          <div className="text-2xl font-bold text-slate-800">
            {formatNumber(data.salesVelocity)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700">
            Growth Rate
          </CardTitle>
          <div className="p-2.5 rounded-xl bg-amber-100 shadow-sm">
            <TrendingUp className="h-4 w-4 text-amber-700" />
          </div>
        </CardHeader>
        <CardContent className="bg-white/60 rounded-lg p-3">
          <div className="text-2xl font-bold text-slate-800">
            {growthRatePercent}%
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700">
            Peak Sales Hour
          </CardTitle>
          <div className="p-2.5 rounded-xl bg-violet-100 shadow-sm">
            <Clock className="h-4 w-4 text-violet-700" />
          </div>
        </CardHeader>
        <CardContent className="bg-white/60 rounded-lg p-3">
          <div className="text-2xl font-bold text-slate-800">
            {peakHour ? `${peakHour.hour}:00` : 'N/A'}
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-600 mt-1">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>{peakHour ? formatCurrency(peakHour.revenue) : '$0'}</span>
            </Badge>
            <span>revenue</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
