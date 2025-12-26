'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateFlavor } from '@/hooks/useFlavors';
import { createFlavorSchema } from '@/validation/flavor.validation';
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
import Link from 'next/link';

type CreateFlavorFormData = z.infer<typeof createFlavorSchema>;

export default function CreateFlavorPage() {
  const router = useRouter();

  // Create flavor mutation
  const createFlavorMutation = useCreateFlavor();

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<CreateFlavorFormData>({
    resolver: zodResolver(createFlavorSchema),
    defaultValues: {
      name: '',
      color: '',
      description: '',
      isActive: true,
    },
  });

  const handleCreateFlavor = async (data: CreateFlavorFormData) => {
    try {
      await createFlavorMutation.mutateAsync(data);
      toast.success('Flavor created successfully!');
      router.push('/flavors');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create flavor');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Button asChild variant="outline">
            <Link href="/flavors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Flavors
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Flavor
            </h1>
            <p className="text-muted-foreground">
              Add a new flavor to organize your products
            </p>
          </div>
        </div>

      </div>

      <div className="w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Flavor Information</CardTitle>
            <CardDescription>
              Fill in the details for the new flavor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleCreateFlavor)} className="space-y-6">
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
                  label="Description"
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
                  disabled={createFlavorMutation.isPending || !isDirty}
                  className=""
                >
                  {createFlavorMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Flavor
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/flavors')}
                >
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
