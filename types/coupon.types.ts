export type CouponTargetType = 'ALL' | 'NEW_USERS' | 'INACTIVE_USERS' | 'SPECIFIC_USERS';

/** Customer info embedded in target users / redemptions */
export interface CouponUserInfo {
  id: number;
  name: string;
  email: string;
  detail?: {
    image?: { path?: string } | null;
  } | null;
}

/** Allow-list entry for SPECIFIC_USERS coupons — with resolved profile */
export interface CouponTargetUser {
  userId: number;
  user?: CouponUserInfo;
}

/** A recorded use of a coupon (one per order) — with resolved profile */
export interface CouponRedemption {
  id: number;
  couponId: number;
  userId: number;
  orderId: number;
  createdAt: string;
  user?: CouponUserInfo;
}

export interface ICoupon {
  id: number;
  code: string;
  description: string;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  targetType: CouponTargetType;
  inactiveDays?: number;
  targetUsers?: CouponTargetUser[];
  usageLimit?: number;
  limitPerUser?: number;
  usedCount: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  targetType: CouponTargetType;
  inactiveDays?: number;
  targetUsers?: CouponTargetUser[];
  usageLimit?: number;
  limitPerUser?: number;
  usedCount: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponRequest {
  code: string;
  description: string;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  targetType?: CouponTargetType;
  inactiveDays?: number;
  targetUserIds?: number[];
  usageLimit?: number;
  limitPerUser?: number;
  isActive?: boolean;
  isFeatured?: boolean;
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

export interface CouponRedemptionsResponse {
  data: CouponRedemption[];
  message: string;
  statusCode: number;
  success: boolean;
}

export interface CouponFilters {
  searchTerm?: string;
  code?: string;
  discountType?: 'FIXED' | 'PERCENTAGE';
  isActive?: string;
  isFeatured?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
