import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import {
  Cart,
  ICart,
  CreateCartRequest,
  UpdateCartItemRequest,
  CartFilters,
  CartListResponse,
  CartResponse,
  CartItemResponse,
} from '@/types/cart.types';
import { updateCartItemFormSchema } from '@/validation/cart.validation';

export const useCarts = (filters: CartFilters = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['carts', filters],
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

      const response = await axiosPrivate.get<CartListResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart?${params.toString()}`
      );
      return response.data;
    },
  });
};

export const useCart = (id: string) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['cart', id],
    queryFn: async () => {
      const response = await axiosPrivate.get<CartResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Hook for getting current user's own cart
export const useSingleCart = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['single-cart'],
    queryFn: async (): Promise<ICart> => {
      const response = await axiosPrivate.get<{ data: ICart; message: string; statusCode: number; success: boolean }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/single-cart`
      );
      return response.data.data;
    },
  });
};

export const useCreateCartItem = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCartRequest) => {
      const response = await axiosPrivate.post<CartResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`,
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carts'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['single-cart'], refetchType: 'all' });
    },
  });
};

export const useUpdateCartItem = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cartItemId, data }: { cartItemId: string; data: UpdateCartItemRequest }) => {
      // Validate input data with Zod schema
      const validatedData = updateCartItemFormSchema.parse(data);

      // Validate quantity is positive
      if (validatedData.quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      // Note: Ownership and stock validation handled by backend
      const response = await axiosPrivate.patch<CartItemResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${cartItemId}`,
        validatedData
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries (cart-specific invalidation handled in component)
      queryClient.invalidateQueries({ queryKey: ['carts'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['single-cart'], refetchType: 'all' });
    },
  });
};

export const useDeleteCartItem = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartItemId: string) => {
      // Note: Ownership validation handled by backend
      const response = await axiosPrivate.delete<CartItemResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${cartItemId}`
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries (cart-specific invalidation handled in component)
      queryClient.invalidateQueries({ queryKey: ['carts'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['single-cart'], refetchType: 'all' });
    },
  });
};
