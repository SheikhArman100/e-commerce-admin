'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useCategory, useUpdateCategory } from '@/hooks/useCategories';
import { updateCategorySchema } from '@/validation/category.validation';
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
import { ScreenLoader } from '@/components/screen-loader';
import Link from 'next/link';

type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;

export default function UpdateCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as string;
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  // Get category data
  const { data: category, isLoading: isLoadingCategory } = useCategory(categoryId);

  // Update category mutation
  const updateCategoryMutation = useUpdateCategory();

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<UpdateCategoryFormData>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      isActive: category?.isActive ?? true,
      displayOrder: category?.displayOrder ?? 0,
    },
  });

  // Update form values when category data loads
  React.useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        isActive: category.isActive ?? true,
        displayOrder: category.displayOrder ?? 0,
      });
    }
  }, [category, reset]);

  const handleUpdateCategory = async (data: UpdateCategoryFormData) => {
    try {
      const updateData = {
        ...data,
        file: selectedFile || undefined, // Include selected file
      };
      await updateCategoryMutation.mutateAsync({ id: categoryId, data: updateData });
      toast.success('Category updated successfully!');
      router.push(`/categories/${categoryId}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update category');
    }
  };

  if (isLoadingCategory) {
    return <ScreenLoader title="Loading category..." />;
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Category Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load category information.
          </p>
          <Button asChild variant="outline">
            <Link href={`/categories/${categoryId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Category Details
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
            <Link href={`/categories/${categoryId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Category Details
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Update Category
            </h1>
            <p className="text-muted-foreground">
              Update category information and settings
            </p>
          </div>
        </div>

      </div>

      <div className="w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
            <CardDescription>
              Update the category's basic information and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleUpdateCategory)} className="space-y-6">
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
                    label="Slug (Optional)"
                    placeholder="e.g., electronics, mens-clothing, home-decor"
                    name="slug"
                    register={register}
                    errors={errors.slug?.message}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <TextAreaInput
                  label="Description (Optional)"
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
                  placeholder="Upload new category image"
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Upload a new category image (JPG, PNG, GIF up to 5MB)
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={updateCategoryMutation.isPending || (!isDirty && !selectedFile)}
                  className=""
                >
                  {updateCategoryMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Category
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
