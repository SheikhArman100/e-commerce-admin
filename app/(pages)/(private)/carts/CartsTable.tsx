'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Loader2,
  Package,
  ShoppingCart,
  User,
} from 'lucide-react';
import { ICart } from '@/types/cart.types';
import { formatDateTime } from '@/lib/helpers';
import { useCarts } from '@/hooks/useCarts';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PaginationTable from '@/components/PaginationTable';
import ProfileImage from '@/components/ProfileImage';
import { ScreenLoader } from '@/components/screen-loader';

export default function CartsTable() {
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentLimit, setCurrentLimit] = useState<number>(10);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const searchTerm = searchParams.get('searchTerm') || '';
  const productId = searchParams.get('productId') || '';

  // Update currentLimit when limit changes
  React.useEffect(() => {
    setCurrentLimit(limit);
  }, [limit]);

  // Build filters object matching API expectations
  const filters = {
    page,
    limit,
    ...(searchTerm && { searchTerm }),
    ...(productId && { productId }),
    sortBy,
    sortOrder,
  };

  const { data: cartsData, isLoading, error } = useCarts(filters);

  const renderSkeletonRow = (index: number) => (
    <TableRow key={`skeleton-${index}`}>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
    </TableRow>
  );

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams);
    if (newLimit !== 10) {
      params.set('limit', newLimit.toString());
    } else {
      params.delete('limit');
    }
    // Reset to page 1 when changing limit
    params.delete('page');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (error) {
    console.error('Carts fetch error:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Error Loading Carts
          </h2>
          <p className="text-gray-600 mb-4">
            An error occurred while fetching carts.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const carts: ICart[] = cartsData?.data || [];
  const totalCount = cartsData?.meta?.count || 0;

  // Calculate total amount for a cart by summing item prices
  const calculateCartTotal = (cart: ICart): number => {
    return cart.items.reduce((total, item) => {
      return total + (item.productFlavorSize.price * item.quantity);
    }, 0);
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[200px]"
                onClick={() => handleSort('user.name')}
              >
                <div className="flex items-center justify-between">
                  <span>Customer</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`w-3 h-3 ${sortBy === 'user.name' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${sortBy === 'user.name' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                  </div>
                </div>
              </TableHead>
              <TableHead className="w-[180px]">Items</TableHead>
              <TableHead className="w-[150px]">Total Amount</TableHead>

              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[180px]"
                onClick={() => handleSort('updatedAt')}
              >
                <div className="flex items-center justify-between">
                  <span>Updated Date</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`w-3 h-3 ${sortBy === 'updatedAt' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${sortBy === 'updatedAt' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                  </div>
                </div>
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }, (_, index) =>
                renderSkeletonRow(index),
              )
            ) : carts.length > 0 ? (
              carts.map((cart) => (
                <TableRow key={cart.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 rounded-full">
                        <ProfileImage
                          image={
                            cart.user.detail?.image ||
                            cart.user.detail?.profileImage
                          }
                        />
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {cart.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {cart.user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {cart.totals?.totalItems || cart.items.length} items
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      ${calculateCartTotal(cart).toFixed(2)}
                    </span>
                  </TableCell>

                  <TableCell>{formatDateTime(cart.updatedAt)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/carts/${cart.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground h-80"
                >
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No carts found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {carts.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-3">
          <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
            Showing
            <input
              type="number"
              value={
                totalCount && currentLimit > totalCount
                  ? totalCount
                  : currentLimit
              }
              onChange={(e) => setCurrentLimit(parseInt(e.target.value) || 10)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value =
                    parseInt((e.target as HTMLInputElement).value) || 10;
                  handleLimitChange(value);
                }
              }}
              className="w-16 px-2 py-1 border rounded text-center"
              min="1"
              max="100"
            />
            of {totalCount} Records
          </div>
          <PaginationTable count={totalCount} limit={limit} />
        </div>
      )}
    </div>
  );
}
