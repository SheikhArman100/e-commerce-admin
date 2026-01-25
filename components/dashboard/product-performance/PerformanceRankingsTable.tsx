'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Package } from 'lucide-react';
import { ProductRanking } from '@/types/dashboard.types';

interface PerformanceRankingsTableProps {
  data: ProductRanking[];
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

const getRankingIcon = (ranking: number) => {
  switch (ranking) {
    case 1:
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    case 2:
      return <Trophy className="h-4 w-4 text-gray-400" />;
    case 3:
      return <Trophy className="h-4 w-4 text-amber-600" />;
    default:
      return <span className="text-sm font-bold text-slate-600">#{ranking}</span>;
  }
};

const getRankingBadgeColor = (ranking: number) => {
  switch (ranking) {
    case 1:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 2:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 3:
      return 'bg-amber-100 text-amber-800 border-amber-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

export default function PerformanceRankingsTable({ data, isLoading }: PerformanceRankingsTableProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
        <CardHeader className="bg-white/60 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Trophy className="h-5 w-5 text-slate-600" />
            Top Performing Products
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white/40 rounded-b-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="w-20">Orders</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 bg-slate-50/80 shadow-sm">
      <CardHeader className="bg-white/60 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Trophy className="h-5 w-5 text-slate-600" />
          Top Performing Products
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/40 rounded-b-lg py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead className="w-20">Orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice(0, 10).map((product) => (
              <TableRow key={product.productId}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* {getRankingIcon(product.ranking)} */}
                    <Badge className={`text-xs ${getRankingBadgeColor(product.ranking)}`}>
                      #{product.ranking}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-800">
                    {product.productName}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-slate-800">
                  {formatCurrency(product.revenue)}
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-medium text-slate-700">
                    {formatNumber(product.orders)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No product performance data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
