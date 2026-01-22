'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { PeakHour } from '@/types/dashboard.types';

interface PeakHoursTableProps {
  data: PeakHour[];
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

export default function PeakHoursTable({ data, isLoading }: PeakHoursTableProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Clock className="h-5 w-5 text-slate-600" />
            Peak Sales Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg bg-white/60 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
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
          <Clock className="h-5 w-5 text-slate-600" />
          Peak Sales Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/40 rounded-b-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((hour, index) => (
            <div
              key={hour.hour}
              className="p-4 border border-slate-200 rounded-lg bg-white/60 hover:bg-slate-100/80 transition-colors text-center"
            >
              <div className="text-2xl font-bold text-slate-800 mb-1">
                {hour.hour}:00
              </div>
              <div className="text-sm font-medium text-slate-700 mb-1">
                {formatCurrency(hour.revenue)}
              </div>
              <div className="text-xs text-slate-600">
                {formatNumber(hour.orders)} orders
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
