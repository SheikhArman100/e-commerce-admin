import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import {
  Category,
  ICategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryFilters,
  CategoryListResponse,
  CategorySingleResponse,
} from '@/types/category.types';

export const useCategories = (filters: CategoryFilters = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['categories', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.isActive !== undefined && filters.isActive !== 'all') params.append('isActive', filters.isActive);
      if (filters.displayOrder) params.append('displayOrder', filters.displayOrder);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axiosPrivate.get<CategoryListResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category?${params.toString()}`
      );
      return response.data;
    },
    enabled: true,
  });
};

export const useCategory = (id: string) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await axiosPrivate.get<CategorySingleResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryRequest) => {
      const formData = new FormData();

      // Add text fields
      formData.append('name', data.name);
      if (data.slug) formData.append('slug', data.slug);
      if (data.description) formData.append('description', data.description);
      if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
      if (data.displayOrder !== undefined) formData.append('displayOrder', data.displayOrder.toString());

      // Add file if provided
      if (data.file) {
        formData.append('file', data.file);
      }

      const response = await axiosPrivate.post<CategorySingleResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category`,
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
      queryClient.invalidateQueries({ queryKey: ['categories'], refetchType: 'all' });
    },
  });
};

export const useUpdateCategory = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCategoryRequest }) => {
      const formData = new FormData();

      // Add text fields
      if (data.name) formData.append('name', data.name);
      if (data.slug) formData.append('slug', data.slug);
      if (data.description) formData.append('description', data.description);
      if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
      if (data.displayOrder !== undefined) formData.append('displayOrder', data.displayOrder.toString());

      // Add file if provided
      if (data.file) {
        formData.append('file', data.file);
      }

      const response = await axiosPrivate.patch<CategorySingleResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/category/${id}`,
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
      queryClient.invalidateQueries({ queryKey: ['categories'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['category', variables.id], refetchType: 'all' });
    },
  });
};

export const useDeleteCategory = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosPrivate.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'], refetchType: 'all' });
    },
  });
};
