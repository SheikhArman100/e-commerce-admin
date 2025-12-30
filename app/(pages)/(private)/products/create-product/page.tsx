'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Package, Plus, Minus, Loader2, ImageIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

import TextInput from '@/components/input/TextInput';
import TextAreaInput from '@/components/input/TextAreaInput';
import FileUpload from '@/components/input/FileUpload';
import CategorySelect from '@/components/input/CategorySelect';
import FlavorSelect from '@/components/input/FlavorSelect';
import SizeSelect from '@/components/input/SizeSelect';

import { createProductSchema } from '@/validation/product.validation';
import { useCreateProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useFlavors } from '@/hooks/useFlavors';
import { useSizes } from '@/hooks/useSizes';
import type { CreateProductRequest, ProductFlavorForm } from '@/types/product.types';
import Link from 'next/link';

type CreateProductFormData = {
  title: string;
  description: string;
  categoryId: string;
  isActive?: string;
  flavors: ProductFlavorForm[];
};

export default function CreateProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flavorImages, setFlavorImages] = useState<File[][]>([[]]);

  const createProductMutation = useCreateProduct();

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      isActive: 'true',
      flavors: [{
        flavorId: '',
        soldByQuantity: false, // Default to size-based
        sizes: [{
          sizeId: '',
          stock: '',
          price: ''
        }],
        images: []
      }],
    },
  } as any);

  const { watch, setValue } = form;
  const watchedFlavors = watch('flavors');
  console.log("form errors:", form.formState.errors);

  const addFlavor = () => {
    const currentFlavors = form.getValues('flavors');
    setValue('flavors', [
      ...currentFlavors,
      {
        flavorId: '',
        soldByQuantity: false, // Default to size-based
        sizes: [{
          sizeId: '',
          stock: '',
          price: ''
        }],
        images: []
      }
    ]);
    // Also add empty images array for the new flavor
    setFlavorImages([...flavorImages, []]);
  };

  const removeFlavor = (flavorIndex: number) => {
    const currentFlavors = form.getValues('flavors');
    if (currentFlavors.length > 1) {
      setValue('flavors', currentFlavors.filter((_, index) => index !== flavorIndex));
      // Also remove the corresponding images array
      setFlavorImages(flavorImages.filter((_, index) => index !== flavorIndex));
    }
  };

  const addSize = (flavorIndex: number) => {
    const currentFlavors = form.getValues('flavors');
    const updatedFlavors = [...currentFlavors];
    if (updatedFlavors[flavorIndex].sizes) {
      updatedFlavors[flavorIndex].sizes.push({
        sizeId: '',
        stock: '',
        price: ''
      });
      setValue('flavors', updatedFlavors);
    }
  };

  const removeSize = (flavorIndex: number, sizeIndex: number) => {
    const currentFlavors = form.getValues('flavors');
    const updatedFlavors = [...currentFlavors];
    if (updatedFlavors[flavorIndex].sizes && updatedFlavors[flavorIndex].sizes.length > 1) {
      updatedFlavors[flavorIndex].sizes = updatedFlavors[flavorIndex].sizes.filter((_, index) => index !== sizeIndex);
      setValue('flavors', updatedFlavors);
    }
  };



  const onSubmit = async (data: CreateProductFormData): Promise<void> => {
    setIsSubmitting(true);

    try {
      console.log('Form data:', data);
      console.log('Flavor images:', flavorImages);

      // Validate that each flavor has at least one image
      for (let i = 0; i < data.flavors.length; i++) {
        const currentFlavorImages = flavorImages[i];
        const flavorImagesCount = currentFlavorImages ? currentFlavorImages.length : 0;
        console.log(`Flavor ${i + 1} images count:`, flavorImagesCount);
        if (flavorImagesCount === 0) {
          toast.error(`Flavor ${i + 1} must have at least one image.`);
          setIsSubmitting(false);
          return;
        }
      }

      // Transform data to match backend API expectations
      const createData: CreateProductRequest = {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        isActive: data.isActive,
        flavors: data.flavors.map((flavor, flavorIndex) => {
          console.log(`Processing flavor ${flavorIndex}:`, flavor);
          return {
            flavorId: flavor.flavorId,
            soldByQuantity: flavor.soldByQuantity,
            // Include sizes for size-based products, stock/price for quantity-based
            ...(flavor.soldByQuantity ? {
              stock: flavor.stock || '',
              price: flavor.price || ''
            } : {
              sizes: flavor.sizes?.map(size => ({
                sizeId: size.sizeId,
                stock: size.stock,
                price: size.price,
              })) || []
            }),
            images: flavorImages[flavorIndex] || []
          };
        }),
      };

      console.log('Transformed create data:', createData);

      await createProductMutation.mutateAsync(createData);

      toast.success('Product created successfully!');
      router.push('/products');
    } catch (error: any) {
      console.error('Create product error:', error);
      console.error('Error response:', error?.response);
      console.error('Error data:', error?.response?.data);
      console.error('Error status:', error?.response?.status);
      toast.error(error?.response?.data?.message || 'Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start gap-4">
        <Link href="/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            Create New Product
          </h1>
          <p className="text-muted-foreground">
            Add a new product with variants, sizes, and images
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="max-w-6xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Product Information
          </CardTitle>
          <CardDescription>
            Fill in the details below to create a new product. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Product Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title Field */}
                  <TextInput
                    label="Product Title *"
                    placeholder="Enter product title"
                    name="title"
                    type="text"
                    register={form.register}
                    errors={form.formState.errors.title?.message}
                  />

                  {/* Category Field */}
                  <div className="flex flex-col gap-1">
                    <FormLabel>Category *</FormLabel>
                    <Controller
                      name="categoryId"
                      control={form.control}
                      render={({ field }) => (
                        <CategorySelect
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select a category"
                        />
                      )}
                    />
                    <p className="text-xs text-muted-foreground">
                      Choose the product category.
                    </p>
                    {form.formState.errors.categoryId && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.categoryId.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description Field */}
                <TextAreaInput
                  label="Description *"
                  placeholder="Enter product description"
                  name="description"
                  register={form.register}
                  errors={form.formState.errors.description?.message}
                  rows={6}
                />

                {/* Active Status */}
                <div className="flex flex-col items-start justify-between gap-y-2">
                  <div className="flex flex-col gap-1">
                    <FormLabel>Active Status</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Toggle to make the product active or inactive.
                    </p>
                  </div>
                  <Controller
                    name="isActive"
                    control={form.control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value === 'true'}
                        onCheckedChange={(checked) => field.onChange(checked ? 'true' : 'false')}
                      />
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Product Variants */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Product Variants</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFlavor}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Flavor
                  </Button>
                </div>

                <div className="space-y-6">
                  {watchedFlavors?.map((flavor, flavorIndex) => (
                    <Card key={flavorIndex} className="border-2">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between gap-4">
                          <CardTitle className="text-base">Flavor {flavorIndex + 1}</CardTitle>
                          {watchedFlavors.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeFlavor(flavorIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Flavor Selection */}
                        <div className="flex flex-col gap-1">
                          <FormLabel>Flavor *</FormLabel>
                          <Controller
                            name={`flavors.${flavorIndex}.flavorId`}
                            control={form.control}
                            render={({ field }) => (
                              <FlavorSelect
                                value={field.value}
                                onChange={(value) => {
                                  // Check if this flavor is already selected in other flavor cards
                                  const currentFlavors = form.getValues('flavors');
                                  const isDuplicate = currentFlavors.some((flavor, index) =>
                                    index !== flavorIndex && flavor.flavorId === value && value !== ''
                                  );

                                  if (isDuplicate) {
                                    toast.error('This flavor is already selected. Please choose a different flavor.');
                                    return;
                                  }

                                  field.onChange(value);
                                }}
                                placeholder="Select a flavor"
                              />
                            )}
                          />
                          {form.formState.errors.flavors?.[flavorIndex]?.flavorId && (
                            <p className="text-sm text-destructive">
                              {form.formState.errors.flavors[flavorIndex].flavorId?.message}
                            </p>
                          )}
                        </div>

                        {/* Sold By Quantity Toggle */}
                        <div className="flex flex-col items-start justify-between gap-y-2">
                          <div className="flex flex-col gap-1">
                            <FormLabel>Sold by Quantity</FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Toggle ON for quantity-based products (single stock/price), OFF for size-based products (multiple sizes)
                            </p>
                          </div>
                          <Controller
                            name={`flavors.${flavorIndex}.soldByQuantity`}
                            control={form.control}
                            render={({ field }) => (
                              <Switch
                                checked={field.value || false}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);

                                  // Reset sizes when switching to quantity mode
                                  if (checked) {
                                    setValue(`flavors.${flavorIndex}.sizes`, undefined);
                                  } else {
                                    // Reset quantity fields when switching to size mode
                                    setValue(`flavors.${flavorIndex}.stock`, undefined);
                                    setValue(`flavors.${flavorIndex}.price`, undefined);
                                    setValue(`flavors.${flavorIndex}.sizes`, [{
                                      sizeId: '',
                                      stock: '',
                                      price: ''
                                    }]);
                                  }
                                }}
                              />
                            )}
                          />
                        </div>
                        {/* Images */}
                        <div className="space-y-2">
                          <FormLabel>Product Images</FormLabel>
                          <FileUpload
                            value={flavorImages[flavorIndex] || []}
                            onChange={(files) => {
                              const newFlavorImages = [...flavorImages];
                              newFlavorImages[flavorIndex] = Array.isArray(files) ? files : [];
                              setFlavorImages(newFlavorImages);
                            }}
                            isMultiple={true}
                            accept="image/*"
                            maxSize={5}
                            placeholder="Upload product images"
                          />
                          <p className="text-xs text-muted-foreground">
                            Upload multiple images(max 5) for this flavor variant (JPG, PNG, WebP up to 5MB each)
                          </p>
                        </div>

                        {/* Conditional: Sizes or Quantity */}
                        {flavor.soldByQuantity ? (
                          // Quantity-based UI
                          <div className="space-y-4">
                            <h4 className="font-medium">Stock & Pricing</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                              <div className="flex-1">
                                <FormLabel>Stock *</FormLabel>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  min="0"
                                  {...form.register(`flavors.${flavorIndex}.stock`)}
                                />
                                {form.formState.errors.flavors?.[flavorIndex]?.stock && (
                                  <p className="text-sm text-destructive mt-1">
                                    {form.formState.errors.flavors[flavorIndex].stock?.message}
                                  </p>
                                )}
                              </div>

                              <div className="flex-1">
                                <FormLabel>Price *</FormLabel>
                                <Input
                                  type="number"
                                  placeholder="0.00"
                                  step="0.01"
                                  min="0"
                                  {...form.register(`flavors.${flavorIndex}.price`)}
                                />
                                {form.formState.errors.flavors?.[flavorIndex]?.price && (
                                  <p className="text-sm text-destructive mt-1">
                                    {form.formState.errors.flavors[flavorIndex].price?.message}
                                  </p>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              This product is sold by quantity (e.g., cupcakes, cookies). Customers can buy 1, 2, 3+ units.
                            </p>
                          </div>
                        ) : (
                          // Size-based UI
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Sizes & Pricing</h4>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addSize(flavorIndex)}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Size
                              </Button>
                            </div>

                            <div className="grid gap-4">
                              {flavor.sizes?.map((size, sizeIndex) => (
                                <div key={sizeIndex} className="flex items-start gap-4 p-4 border rounded-lg">
                                  <div className="flex-1">
                                    <FormLabel>Size *</FormLabel>
                                    <Controller
                                      name={`flavors.${flavorIndex}.sizes.${sizeIndex}.sizeId`}
                                      control={form.control}
                                      render={({ field }) => (
                                        <SizeSelect
                                          value={field.value}
                                          onChange={(value) => {
                                            // Check if this size is already selected in the same flavor
                                            const currentSizes = form.getValues(`flavors.${flavorIndex}.sizes`);
                                            const isDuplicate = currentSizes?.some((size, index) =>
                                              index !== sizeIndex && size.sizeId === value && value !== ''
                                            );

                                            if (isDuplicate) {
                                              toast.error('This size is already selected for this flavor. Please choose a different size.');
                                              return;
                                            }

                                            field.onChange(value);
                                          }}
                                          placeholder="Select size"
                                        />
                                      )}
                                    />
                                    {form.formState.errors.flavors?.[flavorIndex]?.sizes?.[sizeIndex]?.sizeId && (
                                      <p className="text-sm text-destructive mt-1">
                                        {form.formState.errors.flavors[flavorIndex].sizes[sizeIndex].sizeId?.message}
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex-1">
                                    <FormLabel>Stock *</FormLabel>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      min="0"
                                      {...form.register(`flavors.${flavorIndex}.sizes.${sizeIndex}.stock`)}
                                    />
                                    {form.formState.errors.flavors?.[flavorIndex]?.sizes?.[sizeIndex]?.stock && (
                                      <p className="text-sm text-destructive mt-1">
                                        {form.formState.errors.flavors[flavorIndex].sizes[sizeIndex].stock?.message}
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex-1">
                                    <FormLabel>Price *</FormLabel>
                                    <Input
                                      type="number"
                                      placeholder="0.00"
                                      step="0.01"
                                      min="0"
                                      {...form.register(`flavors.${flavorIndex}.sizes.${sizeIndex}.price`)}
                                    />
                                    {form.formState.errors.flavors?.[flavorIndex]?.sizes?.[sizeIndex]?.price && (
                                      <p className="text-sm text-destructive mt-1">
                                        {form.formState.errors.flavors[flavorIndex].sizes[sizeIndex].price?.message}
                                      </p>
                                    )}
                                  </div>

                                  {flavor.sizes && flavor.sizes.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeSize(flavorIndex, sizeIndex)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              This product has multiple sizes (e.g., S, M, L t-shirts). Customers choose a size and quantity.
                            </p>
                          </div>
                        )}

                        
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-4 pt-6 border-t">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <Package className="w-4 h-4" />
                      Create Product
                    </>
                  )}
                </Button>

                <Link href="/products">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
