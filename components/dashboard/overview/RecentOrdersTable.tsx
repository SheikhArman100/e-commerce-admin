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
        return 'success';
      case 'shipped':
        return 'info';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
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
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Orders
        </CardTitle>
        {data.length > 0 && (
          <div className="">
            <Link
              href="/orders"
              className="text-sm text-blue-500 hover:underline flex items-center gap-1"
            >
              View all orders
              
            </Link>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.length > 0 ? (
            data.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-medium text-sm hover:text-primary hover:underline"
                    >
                      {order.orderId}
                    </Link>
                    <Badge variant={getStatusColor(order.status) as any} className="text-xs">
                      {getStatusIcon(order.status)} {order.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {order.customerName} • {formatDistanceToNow(new Date(order.date), { addSuffix: true })}
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right mr-3">
                  <div className="font-semibold text-sm">
                    {formatCurrency(order.amount)}
                  </div>
                </div>

                
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground h-full flex flex-col items-center justify-center">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent orders</p>
            </div>
          )}
        </div>

        
      </CardContent>
    </Card>
  );
}
