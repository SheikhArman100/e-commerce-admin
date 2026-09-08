export type NotificationType =
  | 'ORDER'
  | 'PAYMENT'
  | 'STOCK'
  | 'REVIEW'
  | 'CAMPAIGN'
  | 'COUPON'
  | 'SYSTEM';

export interface INotification {
  id: number;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  link: string | null;
  image: string | null;
  userId: number | null;
  createdAt: string;
  updatedAt: string;
  user?: { id: number; name: string; email: string } | null;
}

export interface INotificationFilters {
  searchTerm?: string;
  type?: NotificationType;
  isRead?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface INotificationListResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    count: number;
  };
  data: INotification[];
}

export interface INotificationResponse {
  success: boolean;
  message: string;
  data: INotification;
}

export interface IUnreadCountResponse {
  success: boolean;
  message: string;
  data: number;
}

export interface ICreateNotificationRequest {
  title: string;
  body: string;
  type?: NotificationType;
  link?: string | null;
  image?: string | null;
}
