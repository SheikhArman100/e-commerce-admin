'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useAuthStore } from '@/stores/authStore';
import {
  INotification,
  INotificationFilters,
  INotificationListResponse,
  INotificationResponse,
  IUnreadCountResponse,
  ICreateNotificationRequest,
} from '@/types/notification.types';

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/notification`;
const SOCKET_EVENT = 'notification:new';

// ---------------------------------------------------------------------------
// REST hooks
// ---------------------------------------------------------------------------

export const useNotifications = (filters: INotificationFilters = {}) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['notifications', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.type) params.append('type', filters.type);
      if (filters.isRead !== undefined)
        params.append('isRead', String(filters.isRead));
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axiosPrivate.get<INotificationListResponse>(
        `${BASE_URL}?${params.toString()}`
      );
      return response.data;
    },
  });
};

export const useUnreadNotificationCount = () => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await axiosPrivate.get<IUnreadCountResponse>(
        `${BASE_URL}/unread-count`
      );
      return response.data.data;
    },
    // Keep the badge fresh even without a socket connection
    refetchInterval: 60 * 1000,
  });
};

export const useMarkNotificationAsRead = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosPrivate.patch<INotificationResponse>(
        `${BASE_URL}/${id}/read`
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'], refetchType: 'all' });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosPrivate.patch(`${BASE_URL}/read-all`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'], refetchType: 'all' });
      toast.success('All notifications marked as read');
    },
  });
};

export const useDeleteNotification = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosPrivate.delete(`${BASE_URL}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'], refetchType: 'all' });
      toast.success('Notification deleted');
    },
  });
};

export const useCreateNotification = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreateNotificationRequest) => {
      const response = await axiosPrivate.post<INotificationResponse>(BASE_URL, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'], refetchType: 'all' });
      toast.success('Notification created successfully');
    },
  });
};

// ---------------------------------------------------------------------------
// Realtime socket hook — listens for admin notifications pushed by the API
// ---------------------------------------------------------------------------

let sharedSocket: Socket | null = null;

const getSocket = (token: string | null): Socket => {
  if (sharedSocket?.connected) return sharedSocket;

  sharedSocket?.disconnect();

  sharedSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3200', {
    auth: { token },
    query: { token: token || '' },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 2000,
  });

  return sharedSocket;
};

/**
 * Connects to the API's socket server as an admin and invokes `onNew`
 * for every realtime notification. Reconnects automatically when the
 * access token changes.
 */
export const useNotificationSocket = (onNew: (notification: INotification) => void) => {
  const accessToken = useAuthStore((state: any) => state.accessToken);
  const onNewRef = useRef(onNew);
  onNewRef.current = onNew;

  useEffect(() => {
    if (!accessToken) return;

    const socket = getSocket(accessToken);

    const handler = (notification: INotification) => onNewRef.current(notification);
    socket.on(SOCKET_EVENT, handler);

    return () => {
      socket.off(SOCKET_EVENT, handler);
    };
  }, [accessToken]);
};
