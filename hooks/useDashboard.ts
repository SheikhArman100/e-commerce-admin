import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import type {
  DashboardFilters,
  DashboardOverviewResponse,
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
