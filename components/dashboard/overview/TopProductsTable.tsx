'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Package } from 'lucide-react';
import { TopProduct } from '@/types/dashboard.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TopProductsTableProps {
  data: TopProduct[];
  isLoading?: boolean;
}

export default function TopProductsTable({ data, isLoading }: TopProductsTableProps) {
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

  // const getRankIcon = (rank: number) => {
  //   switch (rank) {
  //     case 1:
  //       return <Trophy className="h-4 w-4 text-yellow-500" />;
  //     case 2:
  //       return <Trophy className="h-4 w-4 text-gray-400" />;
  //     case 3:
  //       return <Trophy className="h-4 w-4 text-amber-600" />;
  //     default:
  //       return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
  //   }
  // };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 3:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4 h-full">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
  console.log("Top Products", data);

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top Products
        </CardTitle>
        {data.length > 0 && (
          <div className="">
            <Link
              href="/products"
              className="text-sm  hover:underline text-blue-500 flex items-center gap-1"
            >
              View all products
              
            </Link>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-full">
          {data.length > 0 ? (
            data.map((product, index) => {
              const rank = index + 1;
              return (
                <div
                  key={product.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8 h-8">
                    <Badge
                      variant="outline"
                      className={`flex items-center justify-center w-8 h-8 p-0 ${getRankBadgeColor(rank)}`}
                    >
                      #{rank}
                    </Badge>
                  </div>

                  {/* Product Image */}
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Avatar className="w-full h-full">
                                              {product.image? (
                                                <AvatarImage
                                                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.image.path}`}
                                                  alt={product.title}
                                                />
                                              ) : (
                                                <AvatarFallback className="rounded-md">
                                                  <Package className="w-4 h-4" />
                                                </AvatarFallback>
                                              )}
                                            </Avatar>
                    
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${product.id}`}
                      className="font-medium text-sm hover:text-primary hover:underline line-clamp-1"
                    >
                      {product.title}
                    </Link>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span>{formatNumber(product.orders)} orders</span>
                    </div>
                  </div>

                  {/* Revenue */}
                  <div className="text-right">
                    <div className="font-semibold text-sm">
                      {formatCurrency(product.revenue)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Revenue
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground h-full flex flex-col items-center justify-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No product data available</p>
            </div>
          )}
        </div>

        
      </CardContent>
    </Card>
  );
}
