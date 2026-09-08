'use client';

import React, { useState } from 'react';
import {
  BellOff,
  CheckCheck,
  ExternalLink,
  ShoppingCart,
  Trash2,
  Wallet,
  TrendingDown,
  Star,
  Megaphone,
  Ticket,
  Info,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { INotification, NotificationType } from '@/types/notification.types';
import { formatDateTime } from '@/lib/helpers';
import {
  useDeleteNotification,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from '@/hooks/useNotifications';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PaginationTable from '@/components/PaginationTable';

const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; icon: React.ElementType; className: string }
> = {
  ORDER: { label: 'Order', icon: ShoppingCart, className: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
  PAYMENT: { label: 'Payment', icon: Wallet, className: 'bg-green-100 text-green-700 hover:bg-green-100' },
  STOCK: { label: 'Stock', icon: TrendingDown, className: 'bg-amber-100 text-amber-700 hover:bg-amber-100' },
  REVIEW: { label: 'Review', icon: Star, className: 'bg-purple-100 text-purple-700 hover:bg-purple-100' },
  CAMPAIGN: { label: 'Campaign', icon: Megaphone, className: 'bg-pink-100 text-pink-700 hover:bg-pink-100' },
  COUPON: { label: 'Coupon', icon: Ticket, className: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-100' },
  SYSTEM: { label: 'System', icon: Info, className: 'bg-gray-100 text-gray-700 hover:bg-gray-100' },
};

export default function NotificationsTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const searchTerm = searchParams.get('searchTerm') || '';
  const type = (searchParams.get('type') || '') as NotificationType | '';
  const isRead = searchParams.get('isRead');

  const [currentLimit, setCurrentLimit] = useState<number>(limit);
  React.useEffect(() => setCurrentLimit(limit), [limit]);

  const filters = {
    page,
    limit,
    ...(searchTerm && { searchTerm }),
    ...(type && { type }),
    ...(isRead !== null && isRead !== '' && { isRead: isRead === 'true' }),
    sortBy: 'createdAt',
    sortOrder: 'desc' as const,
  };

  const { data, isLoading, error } = useNotifications(filters);
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteMutation = useDeleteNotification();

  const notifications: INotification[] = data?.data || [];
  const totalCount = data?.meta?.count || 0;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams);
    if (newLimit !== 10) params.set('limit', newLimit.toString());
    else params.delete('limit');
    params.delete('page');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const setReadFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set('isRead', value);
    else params.delete('isRead');
    params.delete('page');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const renderSkeletonRow = (index: number) => (
    <TableRow key={`skeleton-${index}`}>
      <TableCell>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
    </TableRow>
  );

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Error Loading Notifications
          </h2>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Quick filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {[
          { label: 'All', value: '' },
          { label: 'Unread', value: 'false' },
          { label: 'Read', value: 'true' },
        ].map((f) => {
          const active = (isRead || '') === f.value;
          return (
            <Button
              key={f.label}
              variant={active ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setReadFilter(f.value)}
            >
              {f.label}
            </Button>
          );
        })}
        <div className="flex-1" />
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            disabled={markAllAsReadMutation.isPending}
            onClick={() => markAllAsReadMutation.mutate()}
          >
            <CheckCheck className="w-4 h-4 mr-1" />
            Mark all read ({unreadCount})
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[120px]">Type</TableHead>
              <TableHead>Notification</TableHead>
              <TableHead className="w-[170px]">Date</TableHead>
              <TableHead className="text-right w-[130px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }, (_, index) => renderSkeletonRow(index))
            ) : notifications.length > 0 ? (
              notifications.map((notification) => {
                const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.SYSTEM;
                const Icon = config.icon;
                return (
                  <TableRow
                    key={notification.id}
                    className={!notification.isRead ? 'bg-blue-50/40' : ''}
                  >
                    <TableCell>
                      <Badge className={`gap-1 font-medium ${config.className}`}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.body}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(notification.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Mark as read"
                            disabled={markAsReadMutation.isPending}
                            onClick={() => markAsReadMutation.mutate(notification.id)}
                          >
                            <CheckCheck className="w-4 h-4 text-green-600" />
                          </Button>
                        )}
                        {notification.link && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Open link"
                            onClick={() => router.push(notification.link!)}
                          >
                            <ExternalLink className="w-4 h-4 text-blue-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete"
                          disabled={deleteMutation.isPending}
                          onClick={() => deleteMutation.mutate(notification.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground h-80"
                >
                  <BellOff className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No notifications found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {notifications.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-3">
          <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
            Showing
            <input
              type="number"
              value={
                totalCount && currentLimit > totalCount ? totalCount : currentLimit
              }
              onChange={(e) => setCurrentLimit(parseInt(e.target.value) || 10)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = parseInt((e.target as HTMLInputElement).value) || 10;
                  handleLimitChange(value);
                }
              }}
              className="w-16 px-2 py-1 border rounded text-center"
              min="1"
              max="100"
            />
            of {totalCount} Records
          </div>
          <PaginationTable count={totalCount} limit={limit} />
        </div>
      )}
    </div>
  );
}

