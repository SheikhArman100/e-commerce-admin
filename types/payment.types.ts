export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export interface IPayment {
  id: string;
  transactionId: string;
  bankTranId?: string;
  orderId: number;
  amount: number;
  paymentStatus: PaymentStatus;
  paymentGateway?: string;
  paymentMethod?: string;
  gatewayResponse?: any;
  createdAt: string;
  updatedAt: string;
  order?: {
    id: number;
    orderNumber: string; // Human-friendly: ORD-YYYYMMDD-XXXXXX
    totalAmount: number;
    status: string;
  };
}

export interface PaymentFilters {
  searchTerm?: string;
  paymentStatus?: PaymentStatus | '';
  orderId?: string;
  orderNumber?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdatePaymentRequest {
  paymentStatus?: PaymentStatus;
  bankTranId?: string;
}

export interface RefundRequest {
  orderId: number;
  refundAmount: number;
  refundRemark: string;
}

export interface PaymentListResponse {
  data: IPayment[];
  meta: {
    count: number;
    page: number;
    limit: number;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export interface PaymentResponse {
  data: IPayment;
  message: string;
  statusCode: number;
  success: boolean;
}
