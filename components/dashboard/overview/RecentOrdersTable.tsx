'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Eye, Truck } from 'lucide-react';
import { RecentOrder } from '@/types/dashboard.types';
import { formatDistanceToNow } from 'date-fns';

interface RecentOrdersTableProps {
  data: RecentOrder[];
  isLoading?: boolean;
}

export default function RecentOrdersTable({ data, isLoading }: RecentOrdersTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '✅';
      case 'shipped':
        return '🚚';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-3 h-full">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='h-full border-slate-200 bg-slate-50/80 shadow-sm'>
      <CardHeader className="bg-white/60 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Clock className="h-5 w-5 text-slate-600" />
          Recent Orders
        </CardTitle>
        {data.length > 0 && (
          <div className="">
            <Link
              href="/orders"
              className="text-sm text-slate-600 hover:underline flex items-center gap-1"
            >
              View all orders

            </Link>
          </div>
        )}
      </CardHeader>
      <CardContent className="bg-white/40 rounded-b-lg">
        <div className="space-y-3">
          {data.length > 0 ? (
            data.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-100/80 transition-colors bg-white/60"
              >
                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-medium text-sm text-slate-800 hover:text-slate-900 hover:underline"
                    >
                      {order.orderId}
                    </Link>
                    <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {order.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600">
                    {order.customerName} • {formatDistanceToNow(new Date(order.date), { addSuffix: true })}
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right mr-3">
                  <div className="font-semibold text-sm text-slate-800">
                    {formatCurrency(order.amount)}
                  </div>
                </div>


              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500 h-full flex flex-col items-center justify-center">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50 text-slate-400" />
              <p>No recent orders</p>
            </div>
          )}
        </div>


      </CardContent>
    </Card>
  );
}
