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
  ShoppingBag,
  User,
} from 'lucide-react';
import { IOrder, OrderStatus } from '@/types/order.types';
import { formatDateTime } from '@/lib/helpers';
import { useOrders } from '@/hooks/useOrders';
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

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case OrderStatus.SHIPPED:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case OrderStatus.DELIVERED:
      return 'bg-green-100 text-green-800 border-green-200';
    case OrderStatus.CANCELLED:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function OrdersTable() {
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentLimit, setCurrentLimit] = useState<number>(10);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const searchTerm = searchParams.get('searchTerm') || '';
  const status = searchParams.get('status') || '';
  const productId = searchParams.get('productId') || '';
  const minAmount = searchParams.get('minAmount') || '';
  const maxAmount = searchParams.get('maxAmount') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  // Update currentLimit when limit changes
  React.useEffect(() => {
    setCurrentLimit(limit);
  }, [limit]);

  // Build filters object matching API expectations
  const filters = {
    page,
    limit,
    ...(searchTerm && { searchTerm }),
    ...(status && { status: status as OrderStatus }),
    ...(productId && { productId }),
    ...(minAmount && { minAmount }),
    ...(maxAmount && { maxAmount }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    sortBy,
    sortOrder,
  };

  const { data: ordersData, isLoading, error } = useOrders(filters);

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
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
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
    console.error('Orders fetch error:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Error Loading Orders
          </h2>
          <p className="text-gray-600 mb-4">
            An error occurred while fetching orders.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const orders: IOrder[] = ordersData?.data || [];
  const totalCount = ordersData?.meta?.count || 0;

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
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[120px]"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`w-3 h-3 ${sortBy === 'status' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${sortBy === 'status' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[150px]"
                onClick={() => handleSort('totalAmount')}
              >
                <div className="flex items-center justify-between">
                  <span>Total Amount</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`w-3 h-3 ${sortBy === 'totalAmount' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${sortBy === 'totalAmount' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                  </div>
                </div>
              </TableHead>
              <TableHead className="w-[120px]">Items</TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[180px]"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center justify-between">
                  <span>Order Date</span>
                  <div className="flex flex-col">
                    <ChevronUp
                      className={`w-3 h-3 ${sortBy === 'createdAt' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${sortBy === 'createdAt' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}
                    />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[180px]"
                onClick={() => handleSort('updatedAt')}
              >
                <div className="flex items-center justify-between">
                  <span>Modified Date</span>
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
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 rounded-full">
                        <ProfileImage
                          image={
                            order.user.detail?.image ||
                            order.user.detail?.profileImage
                          }
                        />
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {order.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(order.status)} border`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                  <TableCell>{formatDateTime(order.updatedAt)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/orders/${order.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground h-80"
                >
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No orders found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {orders.length > 0 && (
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
