export interface ICoupon {
  id: number;
  code: string;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponRequest {
  code: string;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  usageLimit?: number;
  isActive?: boolean;
}

export type UpdateCouponRequest = Partial<CreateCouponRequest>;

export interface CouponListResponse {
  data: ICoupon[];
  meta: {
    count: number;
    page: number;
    limit: number;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export interface CouponResponse {
  data: ICoupon;
  message: string;
  statusCode: number;
  success: boolean;
}

export interface CouponFilters {
  searchTerm?: string;
  code?: string;
  discountType?: 'FIXED' | 'PERCENTAGE';
  isActive?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
