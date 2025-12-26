import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import {
  Flavor,
  IFlavor,
  CreateFlavorRequest,
  UpdateFlavorRequest,
  FlavorFilters,
  FlavorListResponse,
  FlavorSingleResponse,
} from '@/types/flavor.types';

export const useFlavors = (filters: FlavorFilters = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['flavors', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.name) params.append('name', filters.name);
      if (filters.color) params.append('color', filters.color);
      if (filters.isActive !== undefined && filters.isActive !== 'all') params.append('isActive', filters.isActive);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axiosPrivate.get<FlavorListResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/flavor?${params.toString()}`
      );
      return response.data;
    },
    enabled: true,
  });
};

export const useFlavor = (id: string) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['flavor', id],
    queryFn: async () => {
      const response = await axiosPrivate.get<FlavorSingleResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/flavor/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateFlavor = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFlavorRequest) => {
      const response = await axiosPrivate.post<FlavorSingleResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/flavor`,
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
      queryClient.invalidateQueries({ queryKey: ['flavors'], refetchType: 'all' });
    },
  });
};

export const useUpdateFlavor = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFlavorRequest }) => {
      const response = await axiosPrivate.patch<FlavorSingleResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/flavor/${id}`,
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
      queryClient.invalidateQueries({ queryKey: ['flavors'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['flavor', variables.id], refetchType: 'all' });
    },
  });
};

export const useDeleteFlavor = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosPrivate.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/flavor/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flavors'], refetchType: 'all' });
    },
  });
};
