'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateSize } from '@/hooks/useSizes';
import { createSizeSchema } from '@/validation/size.validation';
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
import Link from 'next/link';

type CreateSizeFormData = z.infer<typeof createSizeSchema>;

export default function CreateSizePage() {
  const router = useRouter();

  // Create size mutation
  const createSizeMutation = useCreateSize();

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<CreateSizeFormData>({
    resolver: zodResolver(createSizeSchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
    },
  });

  const handleCreateSize = async (data: CreateSizeFormData) => {
    try {
      await createSizeMutation.mutateAsync(data);
      toast.success('Size created successfully!');
      router.push('/sizes');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create size');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Button asChild variant="outline">
            <Link href="/sizes">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sizes
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Size
            </h1>
            <p className="text-muted-foreground">
              Add a new size to organize your products
            </p>
          </div>
        </div>

      </div>

      <div className="w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Size Information</CardTitle>
            <CardDescription>
              Fill in the details for the new size
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleCreateSize)} className="space-y-6">
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
                  label="Description"
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
                  disabled={createSizeMutation.isPending || !isDirty}
                  className=""
                >
                  {createSizeMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Size
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/sizes')}
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
