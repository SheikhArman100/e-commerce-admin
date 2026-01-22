'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Package, ShoppingCart } from 'lucide-react';
import { LowStockItem } from '@/types/dashboard.types';

interface LowStockAlertsTableProps {
  data: LowStockItem[];
  isLoading?: boolean;
}

export default function LowStockAlertsTable({ data, isLoading }: LowStockAlertsTableProps) {
  const getStockLevel = (current: number, threshold: number) => {
    const percentage = (current / threshold) * 100;
    if (percentage <= 25) return 'critical';
    if (percentage <= 50) return 'warning';
    return 'normal';
  };

  const getStockColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const getStockIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return '🔴';
      case 'warning':
        return '🟡';
      default:
        return '🟢';
    }
  };

  const getCardBorderColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'border-red-200 bg-gradient-to-r from-red-50/50 to-pink-50/30';
      case 'warning':
        return 'border-amber-200 bg-gradient-to-r from-amber-50/50 to-yellow-50/30';
      default:
        return 'border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-teal-50/30';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-3 h-full">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
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
          <AlertTriangle className="h-5 w-5 text-slate-600" />
          Low Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/40 rounded-b-lg">
        <div className="space-y-3 h-full">
          {data.length > 0 ? (
            data.map((item) => {
              const stockLevel = getStockLevel(item.currentStock, item.threshold);
              return (
                <div
                  key={item.productId}
                  className={`flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-100/80 transition-colors bg-white/60 ${getCardBorderColor(stockLevel)}`}
                >
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/products/${item.productId}`}
                        className="font-medium text-sm text-slate-800 hover:text-slate-900 hover:underline"
                      >
                        {item.productName}
                      </Link>
                      <Badge className={`text-xs ${getStockColor(stockLevel)}`}>
                        {getStockIcon(stockLevel)} {stockLevel}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600">
                      {item.category}
                    </div>
                  </div>

                  {/* Stock Info */}
                  <div className="text-right mr-3">
                    <div className="font-semibold text-sm text-slate-800">
                      {item.currentStock} / {item.threshold}
                    </div>
                    <div className="text-xs text-slate-600">
                      Current / Threshold
                    </div>
                  </div>

                  {/* Actions */}
                  {/* <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8 px-2"
                    >
                      <Link href={`/products/${item.productId}`}>
                        <Package className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2"
                      title="Restock"
                    >
                      <ShoppingCart className="h-3 w-3" />
                    </Button>
                  </div> */}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-500 h-full flex flex-col items-center justify-center">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50 text-slate-400" />
              <p>All products are well stocked</p>
            </div>
          )}
        </div>

        {/* {data.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Link
              href="/product-performance"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Manage inventory
              <Package className="h-3 w-3" />
            </Link>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}
