import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import {
  ICoupon,
  CreateCouponRequest,
  UpdateCouponRequest,
  CouponFilters,
  CouponListResponse,
  CouponResponse,
} from '@/types/coupon.types';

export const useCoupons = (filters: CouponFilters = {}, options?: { enabled?: boolean }) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['coupons', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.code) params.append('code', filters.code);
      if (filters.discountType) params.append('discountType', filters.discountType);
      if (filters.isActive !== undefined && filters.isActive !== 'all' && filters.isActive !== '') {
        params.append('isActive', filters.isActive);
      }
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axiosPrivate.get<CouponListResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/coupon?${params.toString()}`
      );
      return response.data;
    },
    enabled: options?.enabled ?? true,
  });
};

export const useCoupon = (id: string) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['coupon', id],
    queryFn: async () => {
      const response = await axiosPrivate.get<CouponResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/coupon/${id}`
      );
      return response.data.data;
    },
    enabled: !!id && id !== 'create-coupon',
  });
};

export const useCreateCoupon = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCouponRequest) => {
      const response = await axiosPrivate.post<CouponResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/coupon`,
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] ,refetchType:'all'});
    },
  });
};

export const useUpdateCoupon = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCouponRequest }) => {
      const response = await axiosPrivate.patch<CouponResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/coupon/${id}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      queryClient.invalidateQueries({ queryKey: ['coupon', variables.id],refetchType:'all' });
    },
  });
};

export const useDeleteCoupon = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosPrivate.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coupon/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};
