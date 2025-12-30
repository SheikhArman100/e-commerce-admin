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

export const useProducts = (filters: ProductFilters = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['products', filters],
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
    enabled: true,
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
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductRequest }) => {
      const formData = new FormData();

      // Add basic fields (only if provided)
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.categoryId) formData.append('categoryId', data.categoryId);
      if (data.isActive !== undefined) {
        formData.append('isActive', data.isActive);
      }

      // Add flavors with complex nested structure (only if provided)
      if (data.flavors) {
        const flavorsData = data.flavors.map(flavor => ({
          flavorId: flavor.flavorId,
          soldByQuantity: flavor.soldByQuantity,
          // Include sizes for size-based products, stock/price for quantity-based
          ...(flavor.soldByQuantity ? {
            ...(flavor.stock !== undefined && { stock: flavor.stock }),
            ...(flavor.price !== undefined && { price: flavor.price })
          } : {
            sizes: flavor.sizes?.map(size => ({
              sizeId: size.sizeId,
              stock: size.stock,
              price: size.price,
            })) || []
          }),
          // Only include images if provided
          ...(flavor.images && flavor.images.length > 0 && {
            images: flavor.images
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
