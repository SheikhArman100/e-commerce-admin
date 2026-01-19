export interface DashboardFilters {
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  filterType?: 'dateFilter' | 'weekFilter' | 'monthFilter' | 'yearFilter';
  date?: string;
  week?: string;
  month?: string;
  year?: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  orderGrowth: number;
  productGrowth: number;
  customerGrowth: number;
}

export interface RevenueTrend {
  month: string;
  revenue: number;
  orders: number;
}

export interface OrderStatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface TopProduct {
  id: number;
  title: string;
  revenue: number;
  orders: number;
  image?: string|any;
}

export interface RecentOrder {
  id: number;
  orderId: string;
  customerName: string;
  amount: number;
  status: string;
  date: string;
}

export interface LowStockItem {
  productId: number;
  productName: string;
  currentStock: number;
  threshold: number;
  category: string;
}

export interface DashboardOverviewResponse {
  metrics: DashboardMetrics;
  revenueTrend: RevenueTrend[];
  orderStatusDistribution: OrderStatusDistribution[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  lowStockItems: LowStockItem[];
}
