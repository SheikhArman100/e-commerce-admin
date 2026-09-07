'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCoupon, useCouponRedemptions, useDeleteCoupon } from '@/hooks/useCoupons';
import { ScreenLoader } from '@/components/screen-loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2, Calendar, Ticket, DollarSign, Percent, User, Clock, AlertTriangle, Hourglass, ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDateTime } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { CouponUserInfo } from '@/types/coupon.types';

/** Avatar (profile image or fallback icon) linking to the user's profile */
function CustomerCell({ user }: { user?: CouponUserInfo }) {
  const imagePath = user?.detail?.image?.path;
  return (
    <Link href={`/users/${user?.id ?? ''}`} className="flex items-center gap-3 min-w-0 group">
      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-muted shrink-0">
        {imagePath ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${imagePath}`}
            alt={user?.name || 'User'}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <User className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate group-hover:text-blue-600 transition-colors">
          {user?.name ?? `User #${user?.id ?? '?'}`}
        </p>
        <p className="text-xs text-muted-foreground truncate">{user?.email ?? '—'}</p>
      </div>
    </Link>
  );
}

export default function CouponDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const couponId = params.couponId as string;

  const { data: coupon, isLoading, error } = useCoupon(couponId);
  const { data: redemptions, isLoading: isLoadingRedemptions } = useCouponRedemptions(couponId);
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
            {/* Description — full width above the grid */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm leading-relaxed">{coupon.description || '—'}</p>
            </div>

            {/* Usage progress — how much of the total quota is consumed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <p className="font-medium text-muted-foreground">Usage Progress</p>
                <span className="font-semibold">
                  {coupon.usedCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''} used
                </span>
              </div>
              {coupon.usageLimit ? (
                <>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        coupon.usedCount >= coupon.usageLimit ? 'bg-red-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {coupon.usedCount >= coupon.usageLimit
                      ? 'Usage limit reached — coupon can no longer be redeemed'
                      : `${coupon.usageLimit - coupon.usedCount} redemptions remaining`}
                  </p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">No total usage limit</p>
              )}
            </div>

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
                <p className="text-sm font-medium text-muted-foreground">Limit Per User</p>
                <p className="font-semibold text-lg">{coupon.limitPerUser === 0 || !coupon.limitPerUser ? 'Unlimited' : coupon.limitPerUser}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Target Audience</p>
                <p className="font-semibold text-lg">
                  {coupon.targetType === 'NEW_USERS' && 'New users only'}
                  {coupon.targetType === 'INACTIVE_USERS' && `Inactive users (${coupon.inactiveDays ?? 365}+ days)`}
                  {coupon.targetType === 'SPECIFIC_USERS' && `Specific customers (${coupon.targetUsers?.length ?? 0})`}
                  {(!coupon.targetType || coupon.targetType === 'ALL') && 'All users'}
                </p>
              </div>

              {/* Allow-list for SPECIFIC_USERS coupons — with profile data */}
              {coupon.targetType === 'SPECIFIC_USERS' && (coupon.targetUsers?.length ?? 0) > 0 && (
                <div className="space-y-2 sm:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Targeted Customers</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {coupon.targetUsers!.map((t) => (
                      <div key={t.userId} className="rounded-md border p-2 hover:bg-muted/50 transition-colors">
                        <CustomerCell user={t.user} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Featured</p>
                {coupon.isFeatured ? (
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                    ★ FEATURED
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Not featured</span>
                )}
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
                {/* Live expiry state */}
                {(() => {
                  const daysLeft = Math.ceil((new Date(coupon.expiryDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
                  if (daysLeft < 0) {
                    return (
                      <Badge className="mt-1 gap-1 bg-red-100 text-red-700 border border-red-200">
                        <AlertTriangle className="w-3 h-3" /> Expired
                      </Badge>
                    );
                  }
                  if (daysLeft <= 7) {
                    return (
                      <Badge className="mt-1 gap-1 bg-amber-100 text-amber-700 border border-amber-200">
                        <Hourglass className="w-3 h-3" /> Expires in {daysLeft} day{daysLeft === 1 ? '' : 's'}
                      </Badge>
                    );
                  }
                  return (
                    <Badge className="mt-1 gap-1 bg-green-100 text-green-700 border border-green-200">
                      Valid · {daysLeft} days left
                    </Badge>
                  );
                })()}
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

      {/* Redemption History — who used this coupon and when */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gray-500" />
              Redemption History
            </CardTitle>
            <CardDescription>
              Customers who have used this coupon
              {redemptions && redemptions.length > 0 ? ` (${redemptions.length})` : ''}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoadingRedemptions ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading redemptions...
            </div>
          ) : !redemptions || redemptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No redemptions yet — this coupon hasn&apos;t been used by any customer.
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Customer</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Redeemed At</TableHead>
                    <TableHead className="text-right">Order</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redemptions.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <CustomerCell user={r.user} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">
                        #{r.userId}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDateTime(r.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/orders/${r.orderId}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Order #{r.orderId}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
