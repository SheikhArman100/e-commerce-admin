'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Repeat, DollarSign, TrendingUp } from 'lucide-react';
import { CustomerInsightsResponse } from '@/types/dashboard.types';

interface CustomerInsightsKPIsProps {
  data: CustomerInsightsResponse | undefined;
  isLoading: boolean;
}

export default function CustomerInsightsKPIs({ data, isLoading }: CustomerInsightsKPIsProps) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Customers',
      value: data.customerAcquisition?.newCustomers || 0,
      icon: Users,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50'
    },
    {
      title: 'Repeat Purchase Rate',
      value: `${data.repeatPurchaseAnalysis?.repeatPercentage || 0}%`,
      icon: Repeat,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50'
    },
    {
      title: 'Average CLV',
      value: `$${(data.customerLifetimeValue?.[0]?.averageOrderValue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50'
    },
    {
      title: 'Customer Satisfaction',
      value: `${data.customerSatisfaction?.overallRating || 0}/5.0`,
      icon: TrendingUp,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{kpi.title}</CardTitle>
            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{kpi.value}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
