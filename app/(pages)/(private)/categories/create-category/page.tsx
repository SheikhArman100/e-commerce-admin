'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateCategory } from '@/hooks/useCategories';
import { createCategorySchema } from '@/validation/category.validation';
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
import FileUpload from '@/components/input/FileUpload';
import Link from 'next/link';

type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

export default function CreateCategoryPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  // Create category mutation
  const createCategoryMutation = useCreateCategory();

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      isActive: true,
      displayOrder: 0,
    },
  });

  const handleCreateCategory = async (data: CreateCategoryFormData) => {
    // Validate that image is selected
    if (!selectedFile) {
      toast.error('Category image is required');
      return;
    }

    try {
      const createData = {
        ...data,
        file: selectedFile, // Image is now required
      };
      await createCategoryMutation.mutateAsync(createData);
      toast.success('Category created successfully!');
      router.push('/categories');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Button asChild variant="outline">
            <Link href="/categories">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Category
            </h1>
            <p className="text-muted-foreground">
              Add a new category to organize your products
            </p>
          </div>
        </div>

      </div>

      <div className="w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
            <CardDescription>
              Fill in the details for the new category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleCreateCategory)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <TextInput
                    label="Category Name"
                    placeholder="Enter category name"
                    name="name"
                    register={register}
                    errors={errors.name?.message}
                  />
                </div>

                <div className="space-y-2">
                  <TextInput
                    label="Slug"
                    placeholder="e.g., electronics, mens-clothing, home-decor"
                    name="slug"
                    register={register}
                    errors={errors.slug?.message}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <TextAreaInput
                  label="Description"
                  placeholder="Enter category description"
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
                    Category Status
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
                      Active Category
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Toggle to activate or deactivate this category
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Display Order
                  </label>
                  <Controller
                    name="displayOrder"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="0"
                        min="0"
                      />
                    )}
                  />
                  {errors.displayOrder && (
                    <p className="text-sm text-destructive">
                      {errors.displayOrder.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Category Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Category Image
                </label>
                <FileUpload
                  value={selectedFile}
                  onChange={setSelectedFile}
                  accept="image/*"
                  maxSize={5}
                  placeholder="Upload category image"
                />
                <p className="text-xs text-muted-foreground">
                  Upload a category image (JPG, PNG, GIF up to 5MB)
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={createCategoryMutation.isPending || (!isDirty && !selectedFile)}
                  className=""
                >
                  {createCategoryMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Category
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/categories')}
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
