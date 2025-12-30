'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Package, Plus, Minus, Loader2, ImageIcon, Trash2, X } from 'lucide-react';
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

import { updateProductSchema } from '@/validation/product.validation';
import { useProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useFlavors } from '@/hooks/useFlavors';
import { useSizes } from '@/hooks/useSizes';
import type { UpdateProductRequest, ProductFlavorForm } from '@/types/product.types';
import Link from 'next/link';
import { ScreenLoader } from '@/components/screen-loader';

type UpdateProductFormData = {
  title: string;
  description: string;
  categoryId: string;
  isActive?: string;
  flavors: ProductFlavorForm[];
};

type ImageToRemove = {
  flavorIndex: number;
  imagePath: string;
};

export default function UpdateProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flavorImages, setFlavorImages] = useState<File[][]>([[]]);
  const [originalProductData, setOriginalProductData] = useState<any>(null);
  const [imagesToRemove, setImagesToRemove] = useState<ImageToRemove[]>([]);

  const { data: productData, isLoading: isLoadingProduct, error: productError } = useProduct(productId);
  const updateProductMutation = useUpdateProduct();

  const form = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      isActive: 'true',
      flavors: [],
    },
  } as any);

  const { watch, setValue, reset } = form;
  const watchedFlavors = watch('flavors');

  // Combined change detection: form changes + image operations
  const hasChanges = form.formState.isDirty ||
    flavorImages.some(images => images.length > 0) ||
    imagesToRemove.length > 0;

  // Load product data and populate form
  useEffect(() => {
    if (productData) {
      const product = productData;

      // Store original product data for comparison
      setOriginalProductData(product);

      // Transform product data to form format
      const formData: UpdateProductFormData = {
        title: product.title,
        description: product.description,
        categoryId: product.category.id.toString(),
        isActive: product.isActive ? 'true' : 'false',
        flavors: product.flavors.map((flavor) => {
          // Check if this is a quantity-based product
          const quantitySize = flavor.sizes?.find(size => size.size === null && size.soldByQuantity === true);
          const isQuantityBased = !!quantitySize;

          if (isQuantityBased) {
            // Quantity-based product
            return {
              flavorId: flavor.flavor.id.toString(),
              soldByQuantity: true,
              stock: quantitySize.stock ? quantitySize.stock.toString() : '',
              price: quantitySize.price ? quantitySize.price.toString() : '',
              sizes: [], // No sizes for quantity-based
              images: [] // Will be handled separately
            };
          } else {
            // Size-based product
            return {
              flavorId: flavor.flavor.id.toString(),
              soldByQuantity: false,
              sizes: flavor.sizes?.filter(size => size.size !== null).map(size => ({
                sizeId: size.size?.id.toString() || '',
                stock: size.stock.toString(),
                price: size.price.toString()
              })) || [],
              images: [] // Will be handled separately
            };
          }
        })
      };

      reset(formData);

      // Initialize flavor images arrays
      const initialImages = product.flavors.map(() => []);
      setFlavorImages(initialImages);

      // Reset images to remove when product data changes
      setImagesToRemove([]);
    }
  }, [productData, reset]);

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

  const removeImage = (flavorIndex: number, imagePath: string) => {
    setImagesToRemove(prev => [...prev, { flavorIndex, imagePath }]);
  };

  const isImageMarkedForRemoval = (flavorIndex: number, imagePath: string) => {
    return imagesToRemove.some(img => img.flavorIndex === flavorIndex && img.imagePath === imagePath);
  };

  const onSubmit = async (data: UpdateProductFormData): Promise<void> => {
    // Prevent submission if no changes were made
    if (!hasChanges) {
      toast.info('No changes detected. Please modify something before updating.');
      return;
    }

    try {

      // Process flavors with granular operations
      const flavorsData = data.flavors.map((flavor, flavorIndex) => {
        const originalFlavor = originalProductData.flavors[flavorIndex];
        const isNewFlavor = !originalFlavor; // Flavor doesn't exist in original data

        if (isNewFlavor) {
          // NEW FLAVOR: Use direct sizes array approach
          const newFlavorData: any = {
            flavorId: flavor.flavorId
          };

          if (flavor.soldByQuantity) {
            // Quantity-based new flavor
            newFlavorData.soldByQuantity = true;
            newFlavorData.stock = flavor.stock;
            newFlavorData.price = flavor.price;
          } else {
            // Size-based new flavor: use sizes array directly
            newFlavorData.sizes = flavor.sizes?.map(size => ({
              sizeId: size.sizeId,
              stock: size.stock,
              price: size.price
            })) || [];
          }

          return newFlavorData;
        } else {
          // EXISTING FLAVOR: Check if original was quantity-based or size-based
          const originalQuantitySize = originalFlavor?.sizes?.find((s: any) => s.size === null && s.soldByQuantity === true);
          const wasOriginallyQuantityBased = !!originalQuantitySize;

          if (wasOriginallyQuantityBased) {
            // ORIGINAL WAS QUANTITY-BASED: Send direct properties
            const flavorOperations: any = {
              flavorId: flavor.flavorId,
              soldByQuantity: true
            };

            const trimmedStock = flavor.stock?.trim() || '';
            const trimmedPrice = flavor.price?.trim() || '';

            // Only include stock if it's not empty and different from original
            const originalStock = originalQuantitySize.stock?.toString().trim() || '';
            if (trimmedStock.length > 0 && trimmedStock !== originalStock) {
              flavorOperations.stock = trimmedStock;
            }

            // Only include price if it's not empty and different from original
            const originalPrice = originalQuantitySize.price?.toString().trim() || '';
            if (trimmedPrice.length > 0 && trimmedPrice !== originalPrice) {
              flavorOperations.price = trimmedPrice;
            }

            // Only include if there are changes
            if (Object.keys(flavorOperations).length > 2) { // More than flavorId and soldByQuantity
              return flavorOperations;
            } else {
              return null; // No changes
            }
          } else {
            // ORIGINAL WAS SIZE-BASED: Use sizeOperations
            const flavorOperations: any = {
              flavorId: flavor.flavorId
            };

            const sizeOperations: any = {};
            const currentSizes = flavor.sizes || [];
            const originalSizes = originalFlavor?.sizes?.filter((s: any) => s.size !== null) || [];

            // Find sizes to add (new sizes in form that don't exist in original)
            const sizesToAdd = currentSizes.filter(currentSize => {
              return currentSize.sizeId && !originalSizes.some((originalSize: any) =>
                originalSize.size?.id.toString() === currentSize.sizeId
              );
            });

            // Find sizes to update (existing sizes with changed values)
            const sizesToUpdate = currentSizes.filter((currentSize: any) => {
              if (!currentSize.sizeId) return false;
              const originalSize = originalSizes.find((os: any) => os.size?.id.toString() === currentSize.sizeId);
              return originalSize && (
                originalSize.stock.toString() !== currentSize.stock ||
                originalSize.price.toString() !== currentSize.price
              );
            });

            // Find sizes to remove (original sizes not in current form)
            const sizesToRemove = originalSizes.filter((originalSize: any) => {
              return originalSize.size?.id && !currentSizes.some(currentSize =>
                currentSize.sizeId === originalSize.size.id.toString()
              );
            });

            if (sizesToAdd.length > 0) {
              sizeOperations.add = sizesToAdd
                .filter(size => size.sizeId && size.sizeId.trim() !== '')
                .map(size => ({
                  sizeId: size.sizeId,
                  stock: size.stock,
                  price: size.price
                }));
            }

            if (sizesToUpdate.length > 0) {
              sizeOperations.update = sizesToUpdate
                .filter(size => size.sizeId && size.sizeId.trim() !== '')
                .map(size => ({
                  sizeId: size.sizeId,
                  stock: size.stock,
                  price: size.price
                }));
            }

            if (sizesToRemove.length > 0) {
              sizeOperations.remove = sizesToRemove.map((size: any) => size.size?.id.toString());
            }

            if (Object.keys(sizeOperations).length > 0) {
              flavorOperations.sizeOperations = sizeOperations;
            }

            // Only return if there are operations
            if (Object.keys(flavorOperations).length > 1) { // More than just flavorId
              return flavorOperations;
            } else {
              return null; // No changes
            }
          }
        }
      });

      // Filter out null results and add image operations
      const validFlavorsData = flavorsData.filter(flavor => flavor !== null).map((flavor, index) => {
        // Handle image operations for each flavor
        const originalFlavorIndex = data.flavors.findIndex(f => f.flavorId === flavor.flavorId);
        const imagesToRemoveForFlavor = imagesToRemove.filter(img => img.flavorIndex === originalFlavorIndex);
        const newImagesForFlavor = flavorImages[originalFlavorIndex] || [];

        const imageOperations: any = {};

        if (imagesToRemoveForFlavor.length > 0) {
          // TODO: Change to fileIds when backend provides them
          // For now using paths, but API docs show fileIds [123, 456]
          imageOperations.remove = imagesToRemoveForFlavor.map(img => img.imagePath);
        }

        if (newImagesForFlavor.length > 0) {
          imageOperations.add = [];
        }

        if (Object.keys(imageOperations).length > 0) {
          flavor.imageOperations = imageOperations;
        }

        return flavor;
      });

      // Prepare update request data for the hook
      const updateRequest: UpdateProductRequest = {};

      // Add basic product fields only if changed
      if (data.title !== originalProductData.title) {
        updateRequest.title = data.title;
      }
      if (data.description !== originalProductData.description) {
        updateRequest.description = data.description;
      }
      if (data.categoryId !== originalProductData.category.id.toString()) {
        updateRequest.categoryId = data.categoryId;
      }
      if (data.isActive && data.isActive !== (originalProductData.isActive ? 'true' : 'false')) {
        updateRequest.isActive = data.isActive;
      }

      // Add flavors if there are changes
      if (validFlavorsData.length > 0) {
        updateRequest.flavors = validFlavorsData;
      }

      // Add image files to the request (hook will handle FormData creation)
      if (flavorImages.some(images => images.length > 0)) {
        // The hook expects images in the flavors array with images property
        updateRequest.flavors = updateRequest.flavors || [];
        data.flavors.forEach((flavor, flavorIndex) => {
          const flavorInRequest = updateRequest.flavors?.find(f => f.flavorId === flavor.flavorId);
          if (flavorInRequest && flavorImages[flavorIndex]?.length > 0) {
            (flavorInRequest as any).images = flavorImages[flavorIndex];
          }
        });
      }

      // Use the hook for the API call (includes automatic invalidation)
      await updateProductMutation.mutateAsync({
        id: productId,
        data: updateRequest
      });

      toast.success('Product updated successfully!');
      router.push(`/products/${productId}`);
    } catch (error: any) {
      console.error('Update product error:', error);
      toast.error(error?.response?.data?.message || 'Failed to update product. Please try again.');
    }
  };

  if (isLoadingProduct) {
    return <ScreenLoader />;
  }

  if (productError || !productData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The product you're trying to update doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start gap-4">
        <Link href={`/products/${productId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Product
          </Button>
        </Link>
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            Update Product
          </h1>
          <p className="text-muted-foreground">
            Edit product information, variants, and images
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
            Update the product details below. Only changed fields will be updated.
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
                    label="Product Title"
                    placeholder="Enter product title"
                    name="title"
                    type="text"
                    register={form.register}
                    errors={form.formState.errors.title?.message}
                  />

                  {/* Category Field */}
                  <div className="flex flex-col gap-1">
                    <FormLabel>Category</FormLabel>
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
                  label="Description"
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
                          <FormLabel>Flavor</FormLabel>
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

                        {/* Current Images Display */}
                        {productData.flavors[flavorIndex]?.images && productData.flavors[flavorIndex].images.length > 0 && (
                          <div className="space-y-2">
                            <FormLabel>Current Images</FormLabel>
                            <div className="flex gap-2 overflow-x-auto">
                              {productData.flavors[flavorIndex].images.map((image, imageIndex) => {
                                const isMarkedForRemoval = isImageMarkedForRemoval(flavorIndex, image.path);
                                return (
                                  <div key={imageIndex} className="relative">
                                    <img
                                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${image.path}`}
                                      alt={`Current ${flavorIndex + 1}-${imageIndex + 1}`}
                                      className={`w-16 h-16 rounded-md object-cover flex-shrink-0 ${
                                        isMarkedForRemoval ? 'opacity-50 grayscale' : ''
                                      }`}
                                    />
                                    {!isMarkedForRemoval ? (
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                                        onClick={() => removeImage(flavorIndex, image.path)}
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    ) : (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 bg-green-500 hover:bg-green-600 text-white border-green-500"
                                        onClick={() => setImagesToRemove(prev => prev.filter(img => !(img.flavorIndex === flavorIndex && img.imagePath === image.path)))}
                                      >
                                        ✓
                                      </Button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Click X to mark images for removal, or ✓ to unmark. Upload new images below to add them.
                            </p>
                          </div>
                        )}

                        {/* Images Upload */}
                        <div className="space-y-2">
                          <FormLabel>Upload New Images</FormLabel>
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
                            placeholder="Upload new product images"
                          />
                          <p className="text-xs text-muted-foreground">
                            Upload new images to add to this flavor (optional). Leave empty to keep existing images.
                          </p>
                        </div>

                        {/* Conditional: Sizes or Quantity */}
                        {flavor.soldByQuantity ? (
                          // Quantity-based UI
                          <div className="space-y-4">
                            <h4 className="font-medium">Stock & Pricing</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                              <div className="flex-1">
                                <FormLabel>Stock</FormLabel>
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
                                <FormLabel>Price</FormLabel>
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
                                    <FormLabel>Size</FormLabel>
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
                                    <FormLabel>Stock</FormLabel>
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
                                    <FormLabel>Price</FormLabel>
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
                  disabled={isSubmitting || !hasChanges}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating Product...
                    </>
                  ) : (
                    <>
                      <Package className="w-4 h-4" />
                      Update Product
                    </>
                  )}
                </Button>

                <Link href={`/products/${productId}`}>
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
