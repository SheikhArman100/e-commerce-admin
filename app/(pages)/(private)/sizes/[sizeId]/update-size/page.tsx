'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useSize, useUpdateSize } from '@/hooks/useSizes';
import { updateSizeSchema } from '@/validation/size.validation';
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
import TextInput from '@/components/input/TextInput';
import TextAreaInput from '@/components/input/TextAreaInput';
import { ScreenLoader } from '@/components/screen-loader';
import Link from 'next/link';

type UpdateSizeFormData = z.infer<typeof updateSizeSchema>;

export default function UpdateSizePage() {
  const params = useParams();
  const router = useRouter();
  const sizeId = params.sizeId as string;

  // Get size data
  const { data: size, isLoading: isLoadingSize } = useSize(sizeId);

  // Update size mutation
  const updateSizeMutation = useUpdateSize();

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<UpdateSizeFormData>({
    resolver: zodResolver(updateSizeSchema),
    defaultValues: {
      name: size?.name || '',
      description: size?.description || '',
      isActive: size?.isActive ?? true,
    },
  });

  // Update form values when size data loads
  React.useEffect(() => {
    if (size) {
      reset({
        name: size.name,
        description: size.description,
        isActive: size.isActive ?? true,
      });
    }
  }, [size, reset]);

  const handleUpdateSize = async (data: UpdateSizeFormData) => {
    try {
      await updateSizeMutation.mutateAsync({ id: sizeId, data });
      toast.success('Size updated successfully!');
      router.push(`/sizes/${sizeId}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update size');
    }
  };

  if (isLoadingSize) {
    return <ScreenLoader title="Loading size..." />;
  }

  if (!size) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Size Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load size information.
          </p>
          <Button asChild variant="outline">
            <Link href={`/sizes/${sizeId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Size Details
            </Link>
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
            <Link href={`/sizes/${sizeId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Size Details
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Update Size
            </h1>
            <p className="text-muted-foreground">
              Update size information and settings
            </p>
          </div>
        </div>

      </div>

      <div className="w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Size Information</CardTitle>
            <CardDescription>
              Update the size's basic information and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleUpdateSize)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <TextInput
                    label="Size Name"
                    placeholder="Enter size name"
                    name="name"
                    register={register}
                    errors={errors.name?.message}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <TextAreaInput
                  label="Description (Optional)"
                  placeholder="Enter size description"
                  name="description"
                  register={register}
                  errors={errors.description?.message}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Size Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Size Status
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label className="text-sm text-muted-foreground">
                      Active Size
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Toggle to activate or deactivate this size
                  </p>
                </div>
              </div>



              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={updateSizeMutation.isPending || !isDirty}
                  className=""
                >
                  {updateSizeMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Size
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={!isDirty}
                >
                  Reset Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
