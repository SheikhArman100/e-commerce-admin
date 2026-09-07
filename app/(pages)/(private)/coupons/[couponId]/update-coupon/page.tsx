'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, ArrowLeft, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useCoupon, useUpdateCoupon } from '@/hooks/useCoupons';
import { updateCouponSchema } from '@/validation/coupon.validation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TextInput from '@/components/input/TextInput';
import DateInput from '@/components/input/DateInput';
import UserMultiSelect from '@/components/input/UserMultiSelect';
import { ScreenLoader } from '@/components/screen-loader';
import Link from 'next/link';

type UpdateCouponFormData = z.infer<typeof updateCouponSchema>;

export default function UpdateCouponPage() {
  const params = useParams();
  const router = useRouter();
  const couponId = params.couponId as string;

  const { data: coupon, isLoading: isLoadingCoupon } = useCoupon(couponId);
  const updateCouponMutation = useUpdateCoupon();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateCouponFormData>({
    resolver: zodResolver(updateCouponSchema) as any,
    defaultValues: {
      code: '',
      description: '',
      discountType: 'FIXED',
      discountValue: 0,
      isActive: true,
      isFeatured: false,
      targetType: 'ALL',
      expiryDate: '',
    },
  });

  React.useEffect(() => {
    if (coupon) {
      // `as any`: form fields hold raw string values (textarea IDs, etc.);
      // zod preprocessors convert them to the wire types at submit time.
      reset({
        code: coupon.code,
        description: coupon.description ?? '',
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        isActive: coupon.isActive,
        isFeatured: coupon.isFeatured ?? false,
        targetType: coupon.targetType ?? 'ALL',
        inactiveDays: coupon.inactiveDays ?? undefined,
        targetUserIds: coupon.targetUsers?.map((t) => t.userId) ?? [],
        minOrderAmount: coupon.minOrderAmount ?? undefined,
        maxDiscountAmount: coupon.maxDiscountAmount ?? undefined,
        usageLimit: coupon.usageLimit ?? undefined,
        limitPerUser: coupon.limitPerUser ?? undefined,
        expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
      } as any);
    }
  }, [coupon, reset]);

  const discountType = watch('discountType');
  const targetType = watch('targetType');

  const handleUpdateCoupon = async (data: UpdateCouponFormData) => {
    try {
      await updateCouponMutation.mutateAsync({ id: couponId, data });
      toast.success('Coupon updated successfully!');
      router.push(`/coupons/${couponId}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update coupon');
    }
  };

  if (isLoadingCoupon) return <ScreenLoader title="Loading coupon..." />;

  if (!coupon) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Coupon Not Found</h2>
          <Button asChild variant="outline">
            <Link href="/coupons"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Coupons</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Button asChild variant="outline">
            <Link href={`/coupons/${couponId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Details
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Update Coupon: {coupon.code}</h1>
            <p className="text-muted-foreground">Edit promotional code settings</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Update the details and logic for this coupon</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleUpdateCoupon)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  label="Coupon Code"
                  placeholder="e.g. SUMMER50"
                  name="code"
                  register={register}
                  errors={errors.code?.message}
                />

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="e.g. 10% off on all birthday cakes this month"
                    rows={3}
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Controller
                    name="discountType"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        key={field.value} // Force re-render when value changes via reset
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FIXED">Fixed Amount</SelectItem>
                          <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.discountType && <p className="text-sm text-destructive">{errors.discountType.message}</p>}
                </div>

                <TextInput
                  label={discountType === 'PERCENTAGE' ? 'Discount Percentage (%)' : 'Discount Value (৳)'}
                  type="number"
                  placeholder="0"
                  name="discountValue"
                  register={register}
                  errors={errors.discountValue?.message}
                />

                <DateInput
                  label="Expiry Date"
                  name="expiryDate"
                  control={control}
                  errors={errors.expiryDate?.message}
                />

                <TextInput
                  label="Minimum Order Amount (Optional) - ৳"
                  type="number"
                  placeholder="0"
                  name="minOrderAmount"
                  register={register}
                  errors={errors.minOrderAmount?.message}
                />

                {discountType === 'PERCENTAGE' && (
                  <TextInput
                    label="Max Discount Amount (Optional) - ৳"
                    type="number"
                    placeholder="0"
                    name="maxDiscountAmount"
                    register={register}
                    errors={errors.maxDiscountAmount?.message}
                  />
                )}

                <TextInput
                  label="Usage Limit (Optional)"
                  type="number"
                  placeholder="Unlimited"
                  name="usageLimit"
                  register={register}
                  errors={errors.usageLimit?.message}
                />

                <TextInput
                  label="Limit Per User (Optional)"
                  type="number"
                  placeholder="Unlimited per user"
                  name="limitPerUser"
                  register={register}
                  errors={errors.limitPerUser?.message}
                />

                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Controller
                    name="targetType"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Who can use this coupon?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All users</SelectItem>
                          <SelectItem value="NEW_USERS">New users (no orders yet)</SelectItem>
                          <SelectItem value="INACTIVE_USERS">Inactive users (no recent orders)</SelectItem>
                          <SelectItem value="SPECIFIC_USERS">Specific customers</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.targetType && <p className="text-xs text-red-500">{errors.targetType.message}</p>}
                </div>

                {targetType === 'INACTIVE_USERS' && (
                  <TextInput
                    label="Inactive Days (no order within N days)"
                    type="number"
                    placeholder="365"
                    name="inactiveDays"
                    register={register}
                    errors={errors.inactiveDays?.message}
                  />
                )}

                {targetType === 'SPECIFIC_USERS' && (
                  <div className="space-y-2 md:col-span-2">
                    <Label>
                      Target Customers <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="targetUserIds"
                      control={control}
                      render={({ field }) => (
                        <UserMultiSelect
                          value={(field.value as number[]) || []}
                          onChange={field.onChange}
                          placeholder="Select target customers"
                        />
                      )}
                    />
                    {errors.targetUserIds && (
                      <p className="text-xs text-red-500">{errors.targetUserIds.message}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                    <Label className="text-sm font-normal">Active</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Featured</Label>
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="isFeatured"
                      control={control}
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                    <Label className="text-sm font-normal">★ Highlight on storefront</Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t">
                <Button type="submit" disabled={updateCouponMutation.isPending || !isDirty}>
                  {updateCouponMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Coupon
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => reset()} disabled={!isDirty}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
