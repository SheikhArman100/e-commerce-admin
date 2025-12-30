import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import {
  Size,
  ISize,
  CreateSizeRequest,
  UpdateSizeRequest,
  SizeFilters,
  SizeListResponse,
  SizeSingleResponse,
} from '@/types/size.types';

export const useSizes = (filters: SizeFilters = {}, options?: { enabled?: boolean }) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['sizes', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.name) params.append('name', filters.name);
      if (filters.isActive !== undefined && filters.isActive !== 'all') params.append('isActive', filters.isActive);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axiosPrivate.get<SizeListResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/size?${params.toString()}`
      );
      return response.data;
    },
    enabled: options?.enabled ?? true,
  });
};

export const useSize = (id: string) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['size', id],
    queryFn: async () => {
      const response = await axiosPrivate.get<SizeSingleResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/size/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateSize = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSizeRequest) => {
      const response = await axiosPrivate.post<SizeSingleResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/size`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'], refetchType: 'all' });
    },
  });
};

export const useUpdateSize = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSizeRequest }) => {
      const response = await axiosPrivate.patch<SizeSingleResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/size/${id}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sizes'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['size', variables.id], refetchType: 'all' });
    },
  });
};

export const useDeleteSize = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosPrivate.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/size/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'], refetchType: 'all' });
    },
  });
};
