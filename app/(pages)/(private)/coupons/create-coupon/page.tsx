'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateCoupon } from '@/hooks/useCoupons';
import { createCouponSchema } from '@/validation/coupon.validation';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TextInput from '@/components/input/TextInput';
import DateInput from '@/components/input/DateInput';
import Link from 'next/link';

type CreateCouponFormData = z.infer<typeof createCouponSchema>;

export default function CreateCouponPage() {
  const router = useRouter();
  const createCouponMutation = useCreateCoupon();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<CreateCouponFormData>({
    resolver: zodResolver(createCouponSchema) as any,
    defaultValues: {
      code: '',
      discountType: 'FIXED',
      discountValue: 0,
      isActive: true,
      expiryDate: new Date().toISOString().split('T')[0],
    },
  });

  const discountType = watch('discountType');

  const handleCreateCoupon = async (data: CreateCouponFormData) => {
    try {
      await createCouponMutation.mutateAsync(data);
      toast.success('Coupon created successfully!');
      router.push('/coupons');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create coupon');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Button asChild variant="outline">
            <Link href="/coupons">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Coupons
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Coupon</h1>
            <p className="text-muted-foreground">Add a new discount code for your customers</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Coupon Details</CardTitle>
            <CardDescription>Fill in the configuration for the promotional code</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleCreateCoupon)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  label="Coupon Code"
                  placeholder="e.g. SUMMER50"
                  name="code"
                  register={register}
                  errors={errors.code?.message}
                />

                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Controller
                    name="discountType"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
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
                  {errors.discountType && <p className="text-xs text-red-500">{errors.discountType.message}</p>}
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
              </div>

              <div className="flex items-center gap-4 pt-4 border-t">
                <Button type="submit" disabled={createCouponMutation.isPending || !isDirty}>
                  {createCouponMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Coupon
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push('/coupons')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
