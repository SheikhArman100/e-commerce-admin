import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import {
  Product,
  IProduct,
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilters,
  ProductListResponse,
  ProductResponse,
} from '@/types/product.types';

export const useProducts = (filters: ProductFilters = {}, options?: { enabled?: boolean }) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['products', filters],
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const params = new URLSearchParams();

      // Add all filter parameters
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.title) params.append('title', filters.title);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.categoryName) params.append('categoryName', filters.categoryName);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.flavorName) params.append('flavorName', filters.flavorName);
      if (filters.flavorColor) params.append('flavorColor', filters.flavorColor);
      if (filters.sizeName) params.append('sizeName', filters.sizeName);
      if (filters.minStock) params.append('minStock', filters.minStock);
      if (filters.maxStock) params.append('maxStock', filters.maxStock);
      if (filters.hasImages) params.append('hasImages', filters.hasImages);
      if (filters.inStock) params.append('inStock', filters.inStock);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axiosPrivate.get<ProductListResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product?${params.toString()}`
      );
      return response.data;
    },
  });
};

export const useProduct = (id: string) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await axiosPrivate.get<ProductResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/id/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useProductBySlug = (slug: string) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['product', 'slug', slug],
    queryFn: async () => {
      const response = await axiosPrivate.get<ProductResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${slug}`
      );
      return response.data.data;
    },
    enabled: !!slug,
  });
};

export const useCreateProduct = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductRequest) => {
      const formData = new FormData();

      // Add basic fields
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('categoryId', data.categoryId);
      if (data.isActive !== undefined) {
        formData.append('isActive', data.isActive);
      }

      // Add flavors array as JSON string
      const flavorsData = data.flavors.map(flavor => ({
        flavorId: flavor.flavorId,
        sizes: flavor.sizes ? flavor.sizes.map(size => ({
          sizeId: size.sizeId,
          stock: size.stock.toString(),
          price: size.price.toString(),
        })) : undefined,
        // For quantity-based products, add stock and price at flavor level
        ...(flavor.soldByQuantity && {
          stock: flavor.stock?.toString(),
          price: flavor.price?.toString(),
          soldByQuantity: true
        })
      }));

      formData.append('flavors', JSON.stringify(flavorsData));

      // Add images for each flavor with specific naming convention
      data.flavors.forEach((flavor, flavorIndex) => {
        if (flavor.images && flavor.images.length > 0) {
          flavor.images.forEach((image) => {
            formData.append(`flavors[${flavorIndex}][images]`, image);
          });
        }
      });

      const response = await axiosPrivate.post<ProductResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'], refetchType: 'all' });
    },
  });
};

export const useUpdateProduct = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const formData = new FormData();

      // Add basic product fields (only if provided)
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.categoryId) formData.append('categoryId', data.categoryId);
      if (data.isActive !== undefined) {
        formData.append('isActive', data.isActive.toString());
      }

      // Add flavor operations using bracket notation
      if (data.flavors?.add) {
        data.flavors.add.forEach((flavor: any, flavorIndex: number) => {
          formData.append(`flavors[add][${flavorIndex}][flavorId]`, flavor.flavorId);

          if (flavor.soldByQuantity) {
            formData.append(`flavors[add][${flavorIndex}][soldByQuantity]`, 'true');
            if (flavor.stock) formData.append(`flavors[add][${flavorIndex}][stock]`, flavor.stock);
            if (flavor.price) formData.append(`flavors[add][${flavorIndex}][price]`, flavor.price);
          } else if (flavor.sizes) {
            flavor.sizes.forEach((size: any, sizeIndex: number) => {
              formData.append(`flavors[add][${flavorIndex}][sizes][${sizeIndex}][sizeId]`, size.sizeId);
              formData.append(`flavors[add][${flavorIndex}][sizes][${sizeIndex}][stock]`, size.stock);
              formData.append(`flavors[add][${flavorIndex}][sizes][${sizeIndex}][price]`, size.price);
            });
          }

          // Add images for new flavors
          if (flavor.images) {
            flavor.images.forEach((image: File) => {
              formData.append(`flavors[add][${flavorIndex}][images]`, image);
            });
          }
        });
      }

      if (data.flavors?.update) {
        data.flavors.update.forEach((flavor: any, flavorIndex: number) => {
          formData.append(`flavors[update][${flavorIndex}][flavorId]`, flavor.flavorId);

          if (flavor.soldByQuantity !== undefined) {
            formData.append(`flavors[update][${flavorIndex}][soldByQuantity]`, flavor.soldByQuantity.toString());
          }

          // Add stock/price for quantity-based updates
          if (flavor.stock) formData.append(`flavors[update][${flavorIndex}][stock]`, flavor.stock);
          if (flavor.price) formData.append(`flavors[update][${flavorIndex}][price]`, flavor.price);

          // Size operations
          if (flavor.sizes?.add) {
            flavor.sizes.add.forEach((size: any, sizeIndex: number) => {
              formData.append(`flavors[update][${flavorIndex}][sizes][add][${sizeIndex}][sizeId]`, size.sizeId);
              formData.append(`flavors[update][${flavorIndex}][sizes][add][${sizeIndex}][stock]`, size.stock);
              formData.append(`flavors[update][${flavorIndex}][sizes][add][${sizeIndex}][price]`, size.price);
            });
          }

          if (flavor.sizes?.update) {
            flavor.sizes.update.forEach((size: any, sizeIndex: number) => {
              formData.append(`flavors[update][${flavorIndex}][sizes][update][${sizeIndex}][sizeId]`, size.sizeId);
              if (size.stock) formData.append(`flavors[update][${flavorIndex}][sizes][update][${sizeIndex}][stock]`, size.stock);
              if (size.price) formData.append(`flavors[update][${flavorIndex}][sizes][update][${sizeIndex}][price]`, size.price);
            });
          }

          if (flavor.sizes?.remove) {
            flavor.sizes.remove.forEach((sizeId: string, sizeIndex: number) => {
              formData.append(`flavors[update][${flavorIndex}][sizes][remove][${sizeIndex}]`, sizeId);
            });
          }

          // Image operations
          if (flavor.images?.add) {
            flavor.images.add.forEach((image: File) => {
              formData.append(`flavors[update][${flavorIndex}][images][add]`, image);
            });
          }

          if (flavor.images?.remove) {
            flavor.images.remove.forEach((fileId: string, imageIndex: number) => {
              formData.append(`flavors[update][${flavorIndex}][images][remove][${imageIndex}]`, fileId);
            });
          }
        });
      }

      if (data.flavors?.remove) {
        data.flavors.remove.forEach((flavorId: string, index: number) => {
          formData.append(`flavors[remove][${index}]`, flavorId);
        });
      }

      const response = await axiosPrivate.patch<ProductResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'], exact: false, refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['product', 'slug'], refetchType: 'all' });
    },
  });
};

export const useDeleteProduct = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosPrivate.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'], refetchType: 'all' });
    },
  });
};
