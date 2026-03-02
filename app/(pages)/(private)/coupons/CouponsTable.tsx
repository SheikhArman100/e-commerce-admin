'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronUp, ChevronDown, Eye, Edit, Trash2 } from 'lucide-react';

import { formatDateTime } from '@/lib/helpers';
import { useCoupons, useDeleteCoupon } from '@/hooks/useCoupons';
import { ICoupon, CouponFilters } from '@/types/coupon.types';
import PaginationTable from '@/components/PaginationTable';
import { toast } from 'sonner';

export default function CouponsTable() {
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
  const isActive = searchParams.get('isActive') || '';
  const discountTypeParam = searchParams.get('discountType');
  
  // Explicitly type discountType to match CouponFilters
  const discountType = (discountTypeParam === 'FIXED' || discountTypeParam === 'PERCENTAGE' 
    ? discountTypeParam 
    : undefined) as 'FIXED' | 'PERCENTAGE' | undefined;

  const deleteCouponMutation = useDeleteCoupon();

  // Update currentLimit when limit changes
  React.useEffect(() => {
    setCurrentLimit(limit);
  }, [limit]);

  // Build filters object matching API expectations
  const filters: CouponFilters = React.useMemo(() => ({
    page,
    limit,
    ...(searchTerm && { searchTerm }),
    ...(isActive && isActive !== 'all' && { isActive }),
    ...(discountType && { discountType }),
    sortBy,
    sortOrder,
  }), [page, limit, searchTerm, isActive, discountType, sortBy, sortOrder]);

  const { data: couponsData, isLoading, error } = useCoupons(filters);

  const renderSkeletonRow = (index: number) => (
    <TableRow key={`skeleton-${index}`}>
      <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></TableCell>
      <TableCell><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></TableCell>
      <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></TableCell>
      <TableCell><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></TableCell>
      <TableCell><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></TableCell>
      <TableCell><div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div></TableCell>
      <TableCell><div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div></TableCell>
      <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></TableCell>
      <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></TableCell>
    </TableRow>
  );

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams);
    if (newLimit !== 10) {
      params.set('limit', newLimit.toString());
    } else {
      params.delete('limit');
    }
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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCouponMutation.mutateAsync(id);
        toast.success('Coupon deleted successfully');
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to delete coupon');
      }
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Error Loading Coupons</h2>
          <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
        </div>
      </div>
    );
  }

  const coupons: ICoupon[] = couponsData?.data || [];
  const totalCount = couponsData?.meta?.count || 0;

  return (
    <div>
      <div className="rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[180px]"
                onClick={() => handleSort('code')}
              >
                <div className="flex items-center justify-between">
                  <span>Coupon Code</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'code' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'code' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[120px]"
                onClick={() => handleSort('isActive')}
              >
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'isActive' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'isActive' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[120px]"
                onClick={() => handleSort('discountType')}
              >
                <div className="flex items-center justify-between">
                  <span>Type</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'discountType' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'discountType' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[120px]"
                onClick={() => handleSort('discountValue')}
              >
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'discountValue' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'discountValue' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>

              <TableHead className="w-[130px]">Min. Order</TableHead>

              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[110px]"
                onClick={() => handleSort('usedCount')}
              >
                <div className="flex items-center justify-between">
                  <span>Used Count</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'usedCount' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'usedCount' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[110px]"
                onClick={() => handleSort('usageLimit')}
              >
                <div className="flex items-center justify-between">
                  <span>Usage Limit</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'usageLimit' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'usageLimit' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[220px]"
                onClick={() => handleSort('expiryDate')}
              >
                <div className="flex items-center justify-between">
                  <span>Expiry Date</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'expiryDate' && sortOrder === 'asc' ? 'text-foreground' : 'text-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'expiryDate' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[220px]"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center justify-between">
                  <span>Created At</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'createdAt' && sortOrder === 'asc' ? 'text-foreground' : 'text-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'createdAt' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: limit }, (_, index) => renderSkeletonRow(index))
              : coupons.length > 0
              ? coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-bold font-mono truncate">
                      <Link
                        href={`/coupons/${coupon.id}`}
                        className="hover:text-blue-600 hover:underline transition-colors"
                      >
                        {coupon.code}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${coupon.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span className="text-sm font-medium">{coupon.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {coupon.discountType}
                    </TableCell>
                    <TableCell>
                      <span className={coupon.discountType === 'PERCENTAGE' ? 'text-purple-600 font-medium' : 'text-green-600 font-medium'}>
                        {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `৳${coupon.discountValue.toFixed(2)}`}
                      </span>
                    </TableCell>
                    <TableCell>৳{(coupon.minOrderAmount || 0).toFixed(2)}</TableCell>
                    <TableCell className="font-medium text-center">{coupon.usedCount}</TableCell>
                    <TableCell className="text-center">
                      {coupon.usageLimit === 0 || !coupon.usageLimit ? '∞' : coupon.usageLimit}
                    </TableCell>
                    <TableCell className="text-sm">{formatDateTime(coupon.expiryDate)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDateTime(coupon.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground h-80">No coupons found</TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>

      {coupons.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-3">
          <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
            Showing
            <input
              type="number"
              value={totalCount && (currentLimit > totalCount) ? totalCount : currentLimit}
              onChange={(e) => setCurrentLimit(parseInt(e.target.value) || 10)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = parseInt((e.target as HTMLInputElement).value) || 10;
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
