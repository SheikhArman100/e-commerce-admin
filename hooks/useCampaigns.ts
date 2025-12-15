import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { campaignApi } from '@/api/campaigns';
import { Campaign } from '@/types/campaign.types';

// Query keys
export const campaignKeys = {
  all: ['campaigns'] as const,
  detail: (id: string) => ['campaigns', id] as const,
};

// Fetch all campaigns
export function useCampaigns() {
  return useQuery({
    queryKey: campaignKeys.all,
    queryFn: campaignApi.getCampaigns,
  });
}

// Fetch single campaign
export function useCampaign(id: string) {
  return useQuery({
    queryKey: campaignKeys.detail(id),
    queryFn: () => campaignApi.getCampaign(id),
    enabled: !!id,
  });
}

// Create campaign mutation
export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaign: Omit<Campaign, 'id' | 'lastModified'>) =>
      campaignApi.createCampaign(campaign),
    onSuccess: (newCampaign) => {
      // Invalidate and refetch campaigns list
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
      // Force immediate refetch
      queryClient.refetchQueries({ queryKey: campaignKeys.all });
      // Add to cache
      queryClient.setQueryData(campaignKeys.detail(newCampaign.id), newCampaign);
      console.log("New Campaign", newCampaign)
    },
  });
}

// Update campaign mutation
export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Campaign> }) =>
      campaignApi.updateCampaign(id, updates),
    onSuccess: (updatedCampaign) => {
      // Update the campaigns list and force refetch
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
      queryClient.refetchQueries({ queryKey: campaignKeys.all });
      // Update the specific campaign cache
      queryClient.setQueryData(
        campaignKeys.detail(updatedCampaign.id),
        updatedCampaign
      );
    },
  });
}

// Delete campaign mutation
export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: campaignApi.deleteCampaign,
    onSuccess: (_, deletedId) => {
      // Remove from campaigns list
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
      // Remove from cache
      queryClient.removeQueries({ queryKey: campaignKeys.detail(deletedId) });
    },
  });
}

// Update campaign status mutation
export function useUpdateCampaignStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'inactive' }) =>
      campaignApi.updateCampaignStatus(id, status),
    onSuccess: (updatedCampaign) => {
      // Update the campaigns list and force refetch
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
      queryClient.refetchQueries({ queryKey: campaignKeys.all });
      // Update the specific campaign cache
      queryClient.setQueryData(
        campaignKeys.detail(updatedCampaign.id),
        updatedCampaign
      );
    },
  });
}
