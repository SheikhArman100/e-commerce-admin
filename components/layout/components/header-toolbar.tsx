
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ChevronDown,
  ClipboardList,
  Coffee,
  LockKeyhole,
  LogOut,
  MessageSquareCode,
  Moon,
  Pin,
  Plus,
  Search,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import { toAbsoluteUrl, formatDateTime } from '@/lib/helpers';
import useUserInfo from '@/hooks/useUserInfo';
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
  useNotificationSocket,
  useUnreadNotificationCount,
} from '@/hooks/useNotifications';
import { INotification } from '@/types/notification.types';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input, InputWrapper } from '@/components/ui/input';

import { useLayout } from './context';
import { ScreenLoader } from '@/components/screen-loader';
import SignOutButton from '@/components/auth/SignoutButton';
import ProfileImage from '@/components/ProfileImage';

// import { useTheme } from "next-themes";

export function HeaderToolbar() {
  const { isMobile } = useLayout();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isPending } = useUserInfo();
  const user = data?.data;

  // Realtime notifications (admin-only)
  const { data: recentData } = useNotifications({ page: 1, limit: 5 });
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const markAsReadMutation = useMarkNotificationAsRead();
  const recentNotifications: INotification[] = recentData?.data || [];

  // Socket: on a new push, refresh counts/lists and show a toast
  useNotificationSocket((notification) => {
    queryClient.invalidateQueries({ queryKey: ['notifications'], refetchType: 'all' });
    toast.info(notification.title, { description: notification.body });
  });
  // const { theme, setTheme } = useTheme();

  const handleInputChange = () => {};
  // const toggleTheme = () => {
  //   setTheme(theme === "light" ? "dark" : "light");
  // };

 if (isPending) {
     return (
       <ScreenLoader title="Checking authentication..." />
     );
   }

  return (
    <nav className="flex items-center gap-2.5">
      {/* <Button mode="icon" variant="outline"><Coffee /></Button>
      <Button mode="icon" variant="outline"><MessageSquareCode /></Button> */}

      {/* Notifications Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button mode="icon" variant="outline" className="relative">
            <Bell />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -end-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-80"
          side="bottom"
          align="end"
          sideOffset={11}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <span className="text-sm font-semibold">
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={markAllAsReadMutation.isPending || unreadCount === 0}
              onClick={() => markAllAsReadMutation.mutate()}
            >
              Mark all read
            </Button>
          </div>

          {recentNotifications.length > 0 ? (
            recentNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-3 cursor-pointer"
                onClick={() => {
                  if (!notification.isRead) {
                    markAsReadMutation.mutate(notification.id);
                  }
                  if (notification.link) {
                    router.push(notification.link);
                  }
                }}
              >
                <div className="flex items-start gap-3 w-full">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      notification.isRead ? 'bg-gray-300' : 'bg-blue-500'
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.body}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDateTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-center" asChild>
            <Link href="/notifications" className="cursor-pointer">
              <span className="text-sm text-muted-foreground">
                View all notifications
              </span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* {!isMobile && (
        <InputWrapper className="w-full lg:w-40">
          <Search />
          <Input type="search" placeholder="Search" onChange={handleInputChange} />
        </InputWrapper>
      )} */}

      {/* {isMobile ? (
        <>
          <Button variant="outline" mode="icon"><ClipboardList /></Button>
          <Button variant="mono" mode="icon"><Plus /></Button>
        </>
      ) : (
        <>
          <Button variant="outline"><ClipboardList /> Reports</Button>
          <Button variant="mono"><Plus /> Add</Button>
        </>
      )} */}

      {/* User Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer flex items-center gap-1">
          <Avatar className="size-7">
            <ProfileImage image={user?.detail?.profileImage || user?.detail?.image} height={100} width={100} />
            
            <AvatarIndicator className="-end-2 -top-2">
              <AvatarStatus variant="online" className="size-2.5" />
            </AvatarIndicator>
          </Avatar>
          <ChevronDown className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          side="bottom"
          align="end"
          sideOffset={11}
        >
          {/* User Information Section */}
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar>
              <ProfileImage image={user?.detail?.profileImage || user?.detail?.image} height={100} width={100} />
              <AvatarIndicator className="-end-1.5 -top-1.5">
                <AvatarStatus variant="online" className="size-2.5" />
              </AvatarIndicator>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-foreground">
                {user?.name}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {user?.role.split('_').join(' ')}
              </span>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* User Actions */}
          <DropdownMenuItem asChild>
            <Link href="/auth/profile" className='cursor-pointer'>
              <User />
              <span>User profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/auth/change-password" className='cursor-pointer'>
              <LockKeyhole />
              <span>Change password</span>
            </Link>
          </DropdownMenuItem>

          {/* <DropdownMenuSeparator /> */}

          {/* Theme Toggle */}
          {/* <DropdownMenuItem onClick={toggleTheme}>
            {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
            <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
          </DropdownMenuItem> */}

          <DropdownMenuSeparator />

          {/* Action Items */}
          <SignOutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}