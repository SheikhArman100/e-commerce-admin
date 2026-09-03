export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export interface IPayment {
  id: string;
  transactionId: string;
  bankTranId?: string;
  orderId: number;
  amount: number;
  paymentStatus: PaymentStatus;
  paymentGateway?: string;
  paymentMethod?: string; // From list API: SSLCommerz card_type (e.g. BKASH, VISA)
  gatewayResponse?: any;
  validationResponse?: any;
  gatewayAuditLog?: any;
  createdAt: string;
  updatedAt: string;
  order?: {
    id: number;
    orderNumber: string; // Human-friendly: ORD-YYYYMMDD-XXXXXX
    totalAmount: number;
    status: string;
  };
}

/**
 * Resolve how the customer actually paid. SSLCommerz returns `card_type` in its
 * validation response (e.g. VISA, BKASH, DBBLNAGAD) — stored in
 * `validationResponse` after a successful payment. In list responses the API
 * provides it pre-extracted as `paymentMethod`. Fall back to the gateway
 * name when neither is available (e.g. pending payments).
 */
export const getPaymentMethod = (payment: IPayment): string => {
  const cardType =
    payment.paymentMethod ||
    (payment.validationResponse as any)?.card_type ||
    (payment.gatewayResponse as any)?.card_type;
  return cardType || payment.paymentGateway || 'UNKNOWN';
};

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
