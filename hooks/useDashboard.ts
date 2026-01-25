import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import type {
  DashboardFilters,
  DashboardOverviewResponse,
  SalesAnalyticsResponse,
  ProductPerformanceResponse,
} from '@/types/dashboard.types';

export const useDashboardOverview = (filters: DashboardFilters = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['dashboard-overview', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Add filter parameters
      if (filters.period) params.append('period', filters.period);
      if (filters.filterType) params.append('filterType', filters.filterType);
      if (filters.date) params.append('date', filters.date);
      if (filters.week) params.append('week', filters.week);
      if (filters.month) params.append('month', filters.month);
      if (filters.year) params.append('year', filters.year);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axiosPrivate.get<{ data: DashboardOverviewResponse }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/overview?${params.toString()}`
      );
      return response.data.data;
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useSalesAnalytics = (filters: DashboardFilters = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['sales-analytics', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Add filter parameters
      if (filters.period) params.append('period', filters.period);
      if (filters.filterType) params.append('filterType', filters.filterType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.date) params.append('date', filters.date);
      if (filters.week) params.append('week', filters.week);
      if (filters.month) params.append('month', filters.month);
      if (filters.year) params.append('year', filters.year);

      const response = await axiosPrivate.get<{ data: SalesAnalyticsResponse }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/sales-analytics?${params.toString()}`
      );
      return response.data.data;
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useProductPerformance = (filters: DashboardFilters = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['product-performance', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Add filter parameters
      if (filters.period) params.append('period', filters.period);
      if (filters.filterType) params.append('filterType', filters.filterType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.date) params.append('date', filters.date);
      if (filters.week) params.append('week', filters.week);
      if (filters.month) params.append('month', filters.month);
      if (filters.year) params.append('year', filters.year);

      const response = await axiosPrivate.get<{ data: ProductPerformanceResponse }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/product-performance?${params.toString()}`
      );
      return response.data.data;
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
