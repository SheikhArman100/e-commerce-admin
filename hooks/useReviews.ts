import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import {
  Review,
  IReview,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewFilters,
  ReviewListResponse,
  ReviewResponse,
} from '@/types/review.types';

export const useReviews = (filters: ReviewFilters = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['reviews', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Add all filter parameters
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.rating) params.append('rating', filters.rating);
      if (filters.isHidden !== undefined) params.append('isHidden', filters.isHidden);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.productId) params.append('productId', filters.productId);
      if (filters.orderId) params.append('orderId', filters.orderId);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axiosPrivate.get<ReviewListResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/review?${params.toString()}`
      );
      return response.data;
    },
  });
};

export const useReview = (id: string) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['review', id],
    queryFn: async () => {
      const response = await axiosPrivate.get<ReviewResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/review/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateReview = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReviewRequest) => {
      const formData = new FormData();

      // Add basic fields
      formData.append('rating', data.rating.toString());
      formData.append('comment', data.comment);
      formData.append('orderId', data.orderId);
      formData.append('productId', data.productId);

      // Add images if provided
      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await axiosPrivate.post<ReviewResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/review`,
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
      queryClient.invalidateQueries({ queryKey: ['reviews'], refetchType: 'all' });
    },
  });
};

export const useUpdateReview = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateReviewRequest }) => {
      const formData = new FormData();

      // Add fields only if provided
      if (data.rating !== undefined) formData.append('rating', data.rating.toString());
      if (data.comment) formData.append('comment', data.comment);
      if (data.isHide !== undefined) formData.append('isHidden', data.isHide.toString());

      const response = await axiosPrivate.patch<ReviewResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/review/${id}`,
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
      queryClient.invalidateQueries({ queryKey: ['reviews'], exact: false, refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['review', variables.id], refetchType: 'all' });
    },
  });
};

export const useDeleteReview = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosPrivate.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/review/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'], refetchType: 'all' });
    },
  });
};
