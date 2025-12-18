import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters,
  UserListResponse,
  UserSingleResponse,
  ChangePasswordRequest,
  UserRolesResponse,
  UserStats,
} from '@/types/user.types';

export const useUsers = (filters: UserFilters = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters.isEmailVerified !== undefined) params.append('isEmailVerified', filters.isEmailVerified.toString());
      if (filters.roleId) params.append('roleId', filters.roleId);
      if (filters.pointId) params.append('pointId', filters.pointId);
      if (filters.regionId) params.append('regionId', filters.regionId);
      if (filters.areaId) params.append('areaId', filters.areaId);
      if (filters.distributionHouseId) params.append('distributionHouseId', filters.distributionHouseId);
      if (filters.territoryId) params.append('territoryId', filters.territoryId);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axiosPrivate.get<UserListResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users?${params.toString()}`
      );
      return response.data;
    },
    enabled: true,
  });
};

export const useUser = (id: string) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await axiosPrivate.get<UserSingleResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const response = await axiosPrivate.post<UserSingleResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/create-user`,
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'], refetchType: 'all' });
    },
  });
};

export const useUpdateUser = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserRequest }) => {
      const response = await axiosPrivate.patch<UserSingleResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['profile'], refetchType: 'all' });
    },
  });
};

export const useDeleteUser = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosPrivate.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'], refetchType: 'all' });
    },
  });
};

export const useChangePassword = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/change-password`,
        data
      );
      return response.data;
    },
  });
};

// Hook for exporting users as CSV
export const useExportUsers = () => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation({
    mutationFn: async (params: Record<string, any> = {}): Promise<Blob> => {
      const queryParams = new URLSearchParams();

      // Add all filter parameters plus limit=0 for all records
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      queryParams.set('limit', '0'); // Always export all records

      const response = await axiosPrivate.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/export-csv?${queryParams.toString()}`, {
        responseType: 'blob',
      });
      return response.data;
    },
  });
};

// Hook for user roles
export const useUserRoles = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const response = await axiosPrivate.get<UserRolesResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/roles`
      );
      return response.data;
    },
  });
};

// Hook for user statistics
export const useUserStats = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['user-stats'],
    queryFn: async (): Promise<UserStats> => {
      const response = await axiosPrivate.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/stats`
      );
      return response.data.data;
    },
  });
};

// Hook for bulk user operations
export const useBulkUpdateUsers = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userIds, data }: { userIds: string[]; data: Partial<UpdateUserRequest> }) => {
      const response = await axiosPrivate.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/bulk-update`,
        { userIds, data }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'], refetchType: 'all' });
    },
  });
};

export const useBulkDeleteUsers = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userIds: string[]) => {
      const response = await axiosPrivate.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/bulk-delete`,
        { data: { userIds } }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'], refetchType: 'all' });
    },
  });
};
