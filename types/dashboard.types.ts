export interface DashboardFilters {
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  filterType?: 'dateFilter' | 'weekFilter' | 'monthFilter' | 'yearFilter';
  date?: string;
  week?: string;
  month?: string;
  year?: string;
  startDate?: string;
  endDate?: string;
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

// Sales Analytics Types
export interface HourlyDistribution {
  hour: number;
  revenue: number;
  orders: number;
}

export interface CategoryPerformance {
  categoryId: number;
  categoryName: string;
  revenue: number;
  orders: number;
  percentage: number;
}

export interface TopVariant {
  productId: number;
  productName: string;
  variant: string;
  revenue: number;
  orders: number;
}

export interface DailyTrend {
  date: string;
  revenue: number;
  orders: number;
}

export interface PeakHour {
  hour: number;
  revenue: number;
  orders: number;
}

export interface CategoryRevenueTrendData {
  month: string;
  revenue: number;
  orders: number;
  growth: number;
}

export interface CategoryRevenueTrend {
  categoryId: number;
  categoryName: string;
  monthlyData: CategoryRevenueTrendData[];
  totalRevenue: number;
  totalOrders: number;
  averageMonthlyRevenue: number;
  trend: string;
  growthRate: number;
}

export interface SalesAnalyticsResponse {
  averageOrderValue: number;
  salesVelocity: number;
  hourlyDistribution: HourlyDistribution[];
  categoryPerformance: CategoryPerformance[];
  topVariants: TopVariant[];
  dailyTrend: DailyTrend[];
  growthRate: number;
  peakHours: PeakHour[];
  categoryRevenueTrend: CategoryRevenueTrend[];
}

// Product Performance Types
export interface ProductRanking {
  productId: number;
  productName: string;
  revenue: number;
  orders: number;
  ranking: number;
  category: string;
  growthRate?: number;
}

export interface ProductTrend {
  productId: number;
  productName: string;
  currentPeriod: {
    revenue: number;
    orders: number;
  };
  previousPeriod: {
    revenue: number;
    orders: number;
  };
  growthRate: number;
}

export interface CategoryProductAnalysis {
  categoryId: number;
  categoryName: string;
  totalProducts: number;
  topProduct: {
    id: number;
    name: string;
    revenue: number;
  };
  averageRevenue: number;
  totalRevenue: number;
}

export interface ProductStockAnalysis {
  productId: number;
  productName: string;
  currentStock: number;
  stockValue: number;
  turnoverRate: number;
  outOfStockDays: number;
  reorderPoint: number;
}

export interface ProductReviewAnalytics {
  productId: number;
  productName: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recentRatingTrend: number;
}

export interface ProductProfitability {
  productId: number;
  productName: string;
  revenue: number;
  costOfGoods: number;
  profit: number;
  profitMargin: number;
  breakEvenPoint: number;
}

export interface ProductLifecycle {
  productId: number;
  productName: string;
  ageInDays: number;
  lifecycleStage: 'new' | 'growing' | 'mature' | 'declining';
  firstSaleDate: string;
  lastSaleDate: string;
  consistencyScore: number;
}

export interface ProductConversion {
  productId: number;
  productName: string;
  views: number | null;
  cartAdditions: number;
  purchases: number;
  conversionRate: number;
  abandonmentRate: number;
}

export interface ProductPerformanceResponse {
  performanceRankings: ProductRanking[];
  productTrends: ProductTrend[];
  categoryAnalysis: CategoryProductAnalysis[];
  stockAnalysis: ProductStockAnalysis[];
  reviewAnalytics: ProductReviewAnalytics[];
  profitabilityMetrics: ProductProfitability[];
  lifecycleAnalysis: ProductLifecycle[];
  conversionRates: ProductConversion[];
}

// Customer Insights Types
export interface CustomerDemographics {
  ageGroup: string;
  count: number;
  percentage: number;
  averageOrderValue: number;
}

export interface CustomerLifetimeValue {
  customerId: number;
  customerName: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
  customerSegment: string;
}

export interface RepeatPurchaseAnalysis {
  totalCustomers: number;
  oneTimeCustomers: number;
  repeatCustomers: number;
  oneTimePercentage: number;
  repeatPercentage: number;
  averageOrdersPerRepeatCustomer: number;
  averageDaysBetweenPurchases: number;
}

export interface CustomerRetention {
  cohortAnalysis: Array<{
    cohort: string;
    month0: number;
    month1: number;
    month2: number;
    month3: number;
    retentionRate: number;
  }>;
  retentionRate: number;
  churnRate: number;
  averageCustomerLifespan: number;
}

export interface CustomerSegmentation {
  segment: string;
  customerCount: number;
  percentage: number;
  averageOrderValue: number;
  totalRevenue: number;
  averageOrdersPerCustomer: number;
}

export interface CustomerAcquisition {
  newCustomers: number;
  returningCustomers: number;
  acquisitionRate: number;
  customerAcquisitionTrend: Array<{
    period: string;
    newCustomers: number;
    returningCustomers: number;
    totalCustomers: number;
  }>;
}

export interface CustomerSatisfaction {
  overallRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  customerSatisfactionTrend: Array<{
    period: string;
    averageRating: number;
    reviewCount: number;
    trend: string;
  }>;
}

export interface CustomerBehavior {
  averageTimeBetweenPurchases: number;
  preferredPurchaseDay: string;
  preferredPurchaseHour: number;
  averageCartSize: number;
  averageOrderFrequency: number;
  topCategories: string[];
  cartAbandonmentRate: number;
}

export interface CustomerInsightsResponse {
  customerDemographics: CustomerDemographics[];
  customerLifetimeValue: CustomerLifetimeValue[];
  repeatPurchaseAnalysis: RepeatPurchaseAnalysis;
  customerRetention: CustomerRetention;
  customerSegmentation: CustomerSegmentation[];
  customerAcquisition: CustomerAcquisition;
  customerSatisfaction: CustomerSatisfaction;
  customerBehavior: CustomerBehavior;
}
