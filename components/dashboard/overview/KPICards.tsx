'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { DashboardMetrics } from '@/types/dashboard.types';

interface KPICardsProps {
  metrics: DashboardMetrics;
  isLoading?: boolean;
}

export default function KPICards({ metrics, isLoading }: KPICardsProps) {
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

  const cards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      growth: metrics.revenueGrowth,
      icon: DollarSign,
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-700',
    },
    {
      title: 'Total Orders',
      value: formatNumber(metrics.totalOrders),
      growth: metrics.orderGrowth,
      icon: ShoppingCart,
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-700',
    },
    {
      title: 'Total Products',
      value: formatNumber(metrics.totalProducts),
      growth: metrics.productGrowth,
      icon: Package,
      iconBg: 'bg-violet-100',
      iconText: 'text-violet-700',
    },
    {
      title: 'Total Customers',
      value: formatNumber(metrics.totalCustomers),
      growth: metrics.customerGrowth,
      icon: Users,
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-700',
    },
  ];

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.growth >= 0;

        return (
          <Card key={index} className="hover:shadow-md transition-shadow border-slate-200 bg-slate-50/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">
                {card.title}
              </CardTitle>
              <div className={`p-2.5 rounded-xl ${card.iconBg} shadow-sm`}>
                <Icon className={`h-4 w-4 ${card.iconText}`} />
              </div>
            </CardHeader>
            <CardContent className="bg-white/60 rounded-lg p-3">
              <div className="text-2xl font-bold text-slate-800">{card.value}</div>
              <div className="flex items-center space-x-2 text-xs text-slate-600">
                <Badge
                  variant={isPositive ? "success" : "destructive"}
                  appearance="light"
                  className="flex items-center space-x-1"
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{Math.abs(card.growth)}%</span>
                </Badge>
                <span>vs last period</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
