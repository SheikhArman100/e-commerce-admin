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
      if (filters.orderNumber) params.append('orderNumber', filters.orderNumber);
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
      // Manual PAID overrides also complete the related order (items, stock,
      // status timeline) — refresh order data so the UI stays in sync.
      queryClient.invalidateQueries({ queryKey: ['orders'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['order'], refetchType: 'all' });
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'], refetchType: 'all' });
      // Refund flips payment + order paymentStatus to REFUNDED — refresh the
      // detail view and order data too. The refund response (incl. refund_ref_id)
      // replaces gatewayResponse, so the payment detail must refetch.
      queryClient.invalidateQueries({ queryKey: ['payment'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['orders'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['order'], refetchType: 'all' });
      toast.success('Refund initiated successfully via SSLCommerz!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to process refund');
    },
  });
};

export interface RefundStatusResponse {
  data: {
    transactionId: string;
    paymentStatus: string;
    gatewayRefundStatus: any;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

/**
 * Query the gateway for the live status of a previously initiated refund.
 * Backend: GET /payment/refund-status/:transactionId — reads refund_ref_id from
 * the payment's gatewayResponse and asks SSLCommerz (op=val_ref).
 */
export const useRefundStatus = (transactionId: string | undefined) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['refund-status', transactionId],
    queryFn: async () => {
      const response = await axiosPrivate.get<RefundStatusResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/refund-status/${transactionId}`
      );
      return response.data.data;
    },
    enabled: !!transactionId,
    // Refund status is a live gateway call — fetch on demand, don't auto-refetch
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
