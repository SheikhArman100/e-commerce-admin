import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import {
  IPayment,
  PaymentFilters,
  PaymentListResponse,
  PaymentResponse,
  UpdatePaymentRequest,
  RefundRequest,
} from '@/types/payment.types';

export const usePayments = (filters: PaymentFilters = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['payments', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters.orderId) params.append('orderId', filters.orderId);
      if (filters.minAmount !== undefined) params.append('minAmount', filters.minAmount.toString());
      if (filters.maxAmount !== undefined) params.append('maxAmount', filters.maxAmount.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axiosPrivate.get<PaymentListResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment?${params.toString()}`
      );
      return response.data;
    },
  });
};

export const usePayment = (id: string) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['payment', id],
    queryFn: async () => {
      const response = await axiosPrivate.get<PaymentResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useUpdatePayment = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePaymentRequest }) => {
      const response = await axiosPrivate.patch<PaymentResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/${id}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['payment', variables.id], refetchType: 'all' });
      toast.success('Payment updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update payment');
    },
  });
};

export const useInitiateRefund = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RefundRequest) => {
      const response = await axiosPrivate.post<PaymentResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/refund`,
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'], refetchType: 'all' });
      toast.success('Refund processed successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to process refund');
    },
  });
};
