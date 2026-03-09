import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import {
  CampaignFilters,
  CampaignListResponse,
  CampaignResponse,
  AddProductToCampaignRequest,
} from '@/types/campaign.types';

export const useCampaigns = (filters: CampaignFilters = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['campaigns', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.isActive !== undefined && filters.isActive !== '') params.append('isActive', filters.isActive.toString());
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axiosPrivate.get<CampaignListResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/campaigns?${params.toString()}`
      );
      return response.data;
    },
  });
};

export const useCampaign = (id: string) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      const response = await axiosPrivate.get<CampaignResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/campaigns/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateCampaign = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axiosPrivate.post<CampaignResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/campaigns`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'], refetchType: 'all' });
      toast.success('Campaign created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create campaign');
    },
  });
};

export const useUpdateCampaign = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      const response = await axiosPrivate.patch<CampaignResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/campaigns/${id}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.id], refetchType: 'all' });
      toast.success('Campaign updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update campaign');
    },
  });
};

export const useDeleteCampaign = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosPrivate.delete<CampaignResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/campaigns/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'], refetchType: 'all' });
      toast.success('Campaign deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete campaign');
    },
  });
};

export const useAddProductToCampaign = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, data }: { campaignId: string; data: AddProductToCampaignRequest }) => {
      const response = await axiosPrivate.post<CampaignResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/campaigns/${campaignId}/products`,
        data
      );
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaignId], refetchType: 'all' });
      toast.success('Product added to campaign!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to add product');
    },
  });
};

export const useRemoveProductFromCampaign = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, productId }: { campaignId: string; productId: number }) => {
      const response = await axiosPrivate.delete<CampaignResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/campaigns/${campaignId}/products/${productId}`
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaignId], refetchType: 'all' });
      toast.success('Product removed from campaign!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to remove product');
    },
  });
};
