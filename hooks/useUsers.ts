import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import {
  User,
  IUser,
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
      if (filters.isVerified !== undefined && filters.isVerified !== 'all') params.append('isVerified', filters.isVerified);
      if (filters.role && filters.role !== 'all') params.append('role', filters.role);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axiosPrivate.get<UserListResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user?${params.toString()}`
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Hook for getting current user's own profile
export const useUserProfile = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async (): Promise<User> => {
      const response = await axiosPrivate.get<{ data: User; message: string; statusCode: number; success: boolean }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`
      );
      return response.data.data;
    },
  });
};

// Hook for updating current user's own profile
export const useUpdateUserProfile = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UpdateUserRequest>) => {
      const formData = new FormData();

      // Add text fields
      if (data.name) formData.append('name', data.name);
      if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);

      // Add file if provided
      if (data.file) {
        formData.append('file', data.file);
      }

      const response = await axiosPrivate.patch<UserSingleResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['profile'], refetchType: 'all' });
    },
  });
};

export const useCreateUser = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const formData = new FormData();

      // Add text fields
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('password', data.password);
      if (data.role) formData.append('role', data.role);

      // Add file if provided
      if (data.file) {
        formData.append('file', data.file);
      }

      const response = await axiosPrivate.post<UserSingleResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
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
      const formData = new FormData();

      // Add text fields
      if (data.name) formData.append('name', data.name);
      if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
      if (data.role) formData.append('role', data.role);

      // Add file if provided
      if (data.file) {
        formData.append('file', data.file);
      }

      const response = await axiosPrivate.patch<UserSingleResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
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
      await axiosPrivate.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`);
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

      const response = await axiosPrivate.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/export-csv?${queryParams.toString()}`, {
        responseType: 'blob',
      });
      return response.data;
    },
  });
};
