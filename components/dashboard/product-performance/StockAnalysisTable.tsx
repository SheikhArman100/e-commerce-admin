'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, AlertTriangle } from 'lucide-react';
import { ProductStockAnalysis } from '@/types/dashboard.types';

interface StockAnalysisTableProps {
  data: ProductStockAnalysis[];
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

const getReorderStatus = (currentStock: number, reorderPoint: number) => {
  if (currentStock === 0) {
    return {
      text: '🚨 OUT OF STOCK',
      color: 'bg-red-100 text-red-800 border-red-200',
      action: 'Restock Immediately',
      urgency: 'critical'
    };
  }

  const ratio = currentStock / reorderPoint;

  if (ratio <= 1) {
    return {
      text: '⚠️ CRITICAL',
      color: 'bg-red-100 text-red-800 border-red-200',
      action: 'Order Today',
      urgency: 'high'
    };
  }

  if (ratio <= 1.5) {
    return {
      text: '🟡 LOW',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      action: 'Order Soon',
      urgency: 'medium'
    };
  }

  return {
    text: '✅ SAFE',
    color: 'bg-green-100 text-green-800 border-green-200',
    action: 'Monitor',
    urgency: 'low'
  };
};

const getSalesVelocity = (turnoverRate: number) => {
  if (turnoverRate === 0) {
    return {
      text: '💤 NOT SELLING',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      insight: 'Consider promotion or removal',
      performance: 'poor'
    };
  }

  if (turnoverRate < 0.5) {
    return {
      text: '🐌 SLOW',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      insight: 'Needs marketing boost',
      performance: 'low'
    };
  }

  if (turnoverRate < 1.2) {
    return {
      text: '✅ NORMAL',
      color: 'bg-green-100 text-green-800 border-green-200',
      insight: 'Performing well',
      performance: 'good'
    };
  }

  if (turnoverRate < 2.5) {
    return {
      text: '🚀 FAST',
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      insight: 'High demand - ensure stock',
      performance: 'high'
    };
  }

  return {
    text: '🔥 HOT',
    color: 'bg-red-100 text-red-800 border-red-200',
    insight: 'Bestseller - prioritize restocking',
    performance: 'excellent'
  };
};

export default function StockAnalysisTable({ data, isLoading }: StockAnalysisTableProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Package className="h-5 w-5 text-slate-600" />
            Inventory Health Check
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Reorder Status</TableHead>
                <TableHead>Sales Velocity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  // Sort by stock level (lowest first to show critical items)
  const sortedData = [...data].sort((a, b) => a.currentStock - b.currentStock);

  return (
    <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
      <CardHeader className="bg-white/60 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Package className="h-5 w-5 text-slate-600" />
          Inventory Health Check
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/40 rounded-b-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Stock</TableHead>
              {/* <TableHead>Value</TableHead> */}
              <TableHead>Reorder Status</TableHead>
              <TableHead>Sales Velocity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((product) => {
              const reorderStatus = getReorderStatus(product.currentStock, product.reorderPoint);
              const salesVelocity = getSalesVelocity(product.turnoverRate);

              return (
                <TableRow key={product.productId}>
                  <TableCell>
                    <div className="font-medium text-slate-800">
                      {product.productName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-slate-800">
                      {formatNumber(product.currentStock)}
                    </span>
                  </TableCell>
                  {/* <TableCell className="font-semibold text-slate-800">
                    {formatCurrency(product.stockValue)}
                  </TableCell> */}
                  <TableCell>
                    <Badge className={`text-xs ${reorderStatus.color}`}>
                      {reorderStatus.text}
                    </Badge>
                    {/* <div className="text-xs text-slate-600 mt-1">
                      {reorderStatus.action}
                    </div> */}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${salesVelocity.color}`}>
                      {salesVelocity.text}
                    </Badge>
                    {/* <div className="text-xs text-slate-600 mt-1">
                      {salesVelocity.insight}
                    </div> */}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {data.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No stock analysis data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
