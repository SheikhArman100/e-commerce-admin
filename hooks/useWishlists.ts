import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import {
  Wishlist,
  IWishlist,
  CreateWishlistRequest,
  UpdateWishlistRequest,
  WishlistFilters,
  WishlistListResponse,
  WishlistResponse,
} from '@/types/wishlist.types';

export const useWishlists = (filters: WishlistFilters = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['wishlists', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Add all filter parameters
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.productId) params.append('productId', filters.productId);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axiosPrivate.get<WishlistListResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlist?${params.toString()}`
      );
      return response.data;
    },
  });
};

export const useWishlist = (id: string) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['wishlist', id],
    queryFn: async () => {
      const response = await axiosPrivate.get<WishlistResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlist/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateWishlist = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateWishlistRequest) => {
      const response = await axiosPrivate.post<WishlistResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlist`,
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'], refetchType: 'all' });
    },
  });
};

export const useUpdateWishlist = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateWishlistRequest }) => {
      const response = await axiosPrivate.patch<WishlistResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlist/${id}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'], exact: false, refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['wishlist', variables.id], refetchType: 'all' });
    },
  });
};

export const useDeleteWishlist = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosPrivate.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/wishlist/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'], refetchType: 'all' });
    },
  });
};
