'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { ProductProfitability } from '@/types/dashboard.types';

interface ProfitabilityMetricsTableProps {
  data: ProductProfitability[];
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

export default function ProfitabilityMetricsTable({ data, isLoading }: ProfitabilityMetricsTableProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <DollarSign className="h-5 w-5 text-slate-600" />
            Financial Performance
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

  // Sort by profit margin (highest first)
  const sortedData = [...data].sort((a, b) => b.profitMargin - a.profitMargin);

  return (
    <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
      <CardHeader className="bg-white/60 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <DollarSign className="h-5 w-5 text-slate-600" />
          Financial Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/40 rounded-b-lg">
        <div className="space-y-3">
          {sortedData.map((product) => (
            <div
              key={product.productId}
              className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white/60 hover:bg-slate-100/80 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-800 mb-1 truncate">
                  {product.productName}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={product.profit >= 0 ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {product.profit >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {product.profitMargin.toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-slate-800">
                  {formatCurrency(product.profit)}
                </div>
                <div className="text-xs text-slate-600">
                  {formatCurrency(product.revenue)} revenue
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No profitability data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}