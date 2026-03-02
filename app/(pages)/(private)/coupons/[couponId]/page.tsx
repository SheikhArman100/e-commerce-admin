'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCoupon, useDeleteCoupon } from '@/hooks/useCoupons';
import { ScreenLoader } from '@/components/screen-loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2, Calendar, Ticket, DollarSign, Percent, User, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatDateTime } from '@/lib/helpers';
import { toast } from 'sonner';

export default function CouponDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const couponId = params.couponId as string;

  const { data: coupon, isLoading, error } = useCoupon(couponId);
  const deleteCouponMutation = useDeleteCoupon();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCouponMutation.mutateAsync(couponId);
        toast.success('Coupon deleted successfully');
        router.push('/coupons');
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to delete coupon');
      }
    }
  };

  if (isLoading) return <ScreenLoader title="Loading coupon details..." />;

  if (error || !coupon) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Coupon Not Found</h2>
        <Button asChild variant="outline">
          <Link href="/coupons"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Coupons</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col items-start gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/coupons"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Coupons</Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Ticket className="w-8 h-8 text-blue-600" />
              Coupon: <span className="font-mono text-blue-700">{coupon.code}</span>
            </h1>
            <p className="text-muted-foreground">Detailed overview of promotional code settings</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/coupons/${couponId}/update-coupon`}><Edit className="w-4 h-4 mr-2" /> Edit Coupon</Link>
          </Button>
          {/* <Button variant="destructive" onClick={handleDelete} disabled={deleteCouponMutation.isPending}>
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Main parameters and logic for this discount</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Discount Type</p>
                <div className="flex items-center gap-2">
                  {coupon.discountType === 'PERCENTAGE' ? <Percent className="w-5 h-5 text-purple-600" /> : <span className="text-xl font-bold text-green-600">৳</span>}
                  <span className="font-semibold text-lg">{coupon.discountType}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Discount Value</p>
                <p className="font-semibold text-lg">
                  {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `৳${coupon.discountValue}`}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Minimum Order Amount</p>
                <p className="font-semibold text-lg">{coupon.minOrderAmount ? `৳${coupon.minOrderAmount}` : 'No minimum'}</p>
              </div>

              {coupon.discountType === 'PERCENTAGE' && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Maximum Discount</p>
                  <p className="font-semibold text-lg">{coupon.maxDiscountAmount ? `৳${coupon.maxDiscountAmount}` : 'No maximum'}</p>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Used Count</p>
                <p className="font-semibold text-lg">{coupon.usedCount}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Usage Limit</p>
                <p className="font-semibold text-lg">{coupon.usageLimit === 0 || !coupon.usageLimit ? 'Unlimited' : coupon.usageLimit}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline & Expiry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-red-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                <p className="font-semibold">{formatDateTime(coupon.expiryDate)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                <p className="text-sm">{formatDateTime(coupon.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-sm">{formatDateTime(coupon.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
