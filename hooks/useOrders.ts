import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import {
  Order,
  IOrder,
  UpdateOrderStatusRequest,
  OrderFilters,
  OrderListResponse,
  OrderResponse,
} from '@/types/order.types';
import { orderStatusFormSchema } from '@/validation/order.validation';

export const useOrders = (filters: OrderFilters = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['orders', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Add all filter parameters
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.status) params.append('status', filters.status);
      if (filters.productId) params.append('productId', filters.productId);
      if (filters.minAmount) params.append('minAmount', filters.minAmount);
      if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axiosPrivate.get<OrderListResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order?${params.toString()}`
      );
      return response.data;
    },
  });
};

export const useOrder = (id: string) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await axiosPrivate.get<OrderResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Hook for getting current user's own orders
export const useUserOrders = (filters: { page?: number; limit?: number } = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['user-orders', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await axiosPrivate.get<OrderListResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/my-orders?${params.toString()}`
      );
      return response.data;
    },
  });
};

export const useCreateOrder = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // No payload needed - creates from current cart
      const response = await axiosPrivate.post<OrderResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order`
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Invalidate cart-related queries since cart is cleared
      queryClient.invalidateQueries({ queryKey: ['carts'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['single-cart'], refetchType: 'all' });

      // Refresh orders list
      queryClient.invalidateQueries({ queryKey: ['orders'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['user-orders'], refetchType: 'all' });

      toast.success('Order created successfully!');
    },
    onError: (error: any) => {
      console.error('Create order error:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to create order. Please try again.'
      );
    },
  });
};

export const useUpdateOrderStatus = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, data }: { orderId: string; data: UpdateOrderStatusRequest }) => {
      // Validate input data with Zod schema
      const validatedData = orderStatusFormSchema.parse(data);

      const response = await axiosPrivate.patch<OrderResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${orderId}/status`,
        validatedData
      );
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['orders'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['user-orders'], refetchType: 'all' });

      toast.success('Order status updated successfully!');
    },
    onError: (error: any) => {
      console.error('Update order status error:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to update order status. Please try again.'
      );
    },
  });
};
