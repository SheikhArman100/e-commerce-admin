'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useFlavor, useUpdateFlavor } from '@/hooks/useFlavors';
import { updateFlavorSchema } from '@/validation/flavor.validation';
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
import ColorInput from '@/components/input/ColorInput';
import { ScreenLoader } from '@/components/screen-loader';
import Link from 'next/link';

type UpdateFlavorFormData = z.infer<typeof updateFlavorSchema>;

export default function UpdateFlavorPage() {
  const params = useParams();
  const router = useRouter();
  const flavorId = params.flavorId as string;

  // Get flavor data
  const { data: flavor, isLoading: isLoadingFlavor } = useFlavor(flavorId);

  // Update flavor mutation
  const updateFlavorMutation = useUpdateFlavor();

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateFlavorFormData>({
    resolver: zodResolver(updateFlavorSchema),
    defaultValues: {
      name: flavor?.name || '',
      color: flavor?.color || '',
      description: flavor?.description || '',
      isActive: flavor?.isActive ?? true,
    },
  });

  // Update form values when flavor data loads
  React.useEffect(() => {
    if (flavor) {
      reset({
        name: flavor.name,
        color: flavor.color,
        description: flavor.description || '',
        isActive: flavor.isActive ?? true,
      });
    }
  }, [flavor, reset]);

  const handleUpdateFlavor = async (data: UpdateFlavorFormData) => {
    try {
      await updateFlavorMutation.mutateAsync({ id: flavorId, data });
      toast.success('Flavor updated successfully!');
      router.push(`/flavors/${flavorId}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update flavor');
    }
  };

  if (isLoadingFlavor) {
    return <ScreenLoader title="Loading flavor..." />;
  }

  if (!flavor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Flavor Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load flavor information.
          </p>
          <Button asChild variant="outline">
            <Link href={`/flavors/${flavorId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Flavor Details
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
            <Link href={`/flavors/${flavorId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Flavor Details
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Update Flavor
            </h1>
            <p className="text-muted-foreground">
              Update flavor information and settings
            </p>
          </div>
        </div>

      </div>

      <div className="w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Flavor Information</CardTitle>
            <CardDescription>
              Update the flavor's basic information and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleUpdateFlavor)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <TextInput
                    label="Flavor Name"
                    placeholder="Enter flavor name"
                    name="name"
                    register={register}
                    errors={errors.name?.message}
                  />
                </div>

                <div className="space-y-2">
                  <ColorInput
                    label="Color"
                    placeholder="e.g., #FF0000, rgb(255,0,0), red"
                    name="color"
                    register={register}
                    setValue={setValue}
                    watch={watch}
                    errors={errors.color?.message}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <TextAreaInput
                  label="Description (Optional)"
                  placeholder="Enter flavor description"
                  name="description"
                  register={register}
                  errors={errors.description?.message}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Flavor Status
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
                      Active Flavor
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Toggle to activate or deactivate this flavor
                  </p>
                </div>
              </div>



              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={updateFlavorMutation.isPending || !isDirty}
                  className=""
                >
                  {updateFlavorMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Flavor
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
