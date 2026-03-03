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
import { Loader2, ChevronUp, ChevronDown, Eye } from 'lucide-react';

import { formatDateTime } from '@/lib/helpers';
import { usePayments } from '@/hooks/usePayments';
import { IPayment, PaymentFilters, PaymentStatus } from '@/types/payment.types';
import PaginationTable from '@/components/PaginationTable';
import { Badge } from '@/components/ui/badge';

export default function PaymentsTable() {
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
  const orderId = searchParams.get('orderId') || '';
  const paymentStatusParam = searchParams.get('paymentStatus');
  const paymentStatus = (paymentStatusParam || '') as PaymentStatus | '';
  const minAmount = searchParams.get('minAmount') ? parseFloat(searchParams.get('minAmount')!) : undefined;
  const maxAmount = searchParams.get('maxAmount') ? parseFloat(searchParams.get('maxAmount')!) : undefined;

  // Update currentLimit when limit changes
  React.useEffect(() => {
    setCurrentLimit(limit);
  }, [limit]);

  // Build filters object matching API expectations
  const filters: PaymentFilters = React.useMemo(() => ({
    page,
    limit,
    ...(searchTerm && { searchTerm }),
    ...(orderId && { orderId }),
    ...(paymentStatus && { paymentStatus }),
    ...(minAmount !== undefined && { minAmount }),
    ...(maxAmount !== undefined && { maxAmount }),
    sortBy,
    sortOrder,
  }), [page, limit, searchTerm, orderId, paymentStatus, minAmount, maxAmount, sortBy, sortOrder]);

  const { data: paymentsData, isLoading, error } = usePayments(filters);

  const renderSkeletonRow = (index: number) => (
    <TableRow key={`skeleton-${index}`}>
      <TableCell><div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div></TableCell>
      <TableCell><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></TableCell>
      <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></TableCell>
      <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></TableCell>
      <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></TableCell>
      <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></TableCell>
      <TableCell><div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div></TableCell>
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

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">PAID</Badge>;
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">PENDING</Badge>;
      case 'FAILED':
        return <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">FAILED</Badge>;
      case 'CANCELLED':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200">CANCELLED</Badge>;
      case 'REFUNDED':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">REFUNDED</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Error Loading Payments</h2>
          <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
        </div>
      </div>
    );
  }

  const payments: IPayment[] = paymentsData?.data || [];
  const totalCount = paymentsData?.meta?.count || 0;

  return (
    <div>
      <div className="rounded-md border overflow-hidden">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[220px]"
                onClick={() => handleSort('transactionId')}
              >
                <div className="flex items-center justify-between">
                  <span>Transaction ID</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'transactionId' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'transactionId' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>

              <TableHead className="w-[100px]">Order ID</TableHead>

              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[150px]"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center justify-between">
                  <span>Amount</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'amount' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'amount' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>

              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead className="w-[150px]">Method</TableHead>

              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[220px]"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center justify-between">
                  <span>Date</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'createdAt' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'createdAt' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>

              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: limit }, (_, index) => renderSkeletonRow(index))
              : payments.length > 0
              ? payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-xs truncate">
                      {payment.transactionId}
                    </TableCell>
                    <TableCell className="font-medium">
                      #{payment.orderId}
                    </TableCell>
                    <TableCell className="font-semibold text-blue-600">
                      ৳{payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payment.paymentStatus)}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-muted-foreground uppercase">
                      {payment.paymentMethod || 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(payment.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={`/payments/${payment.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground h-64">No payments found</TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>

      {payments.length > 0 && (
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
