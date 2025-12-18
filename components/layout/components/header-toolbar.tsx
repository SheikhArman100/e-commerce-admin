
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
import { toAbsoluteUrl } from '@/lib/helpers';
import useUserInfo from '@/hooks/useUserInfo';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
} from '@/components/ui/avatar';
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
  const { data, isPending } = useUserInfo();
  const user = data?.data;
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
          <Button mode="icon" variant="outline">
            <Bell />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-80"
          side="bottom"
          align="end"
          sideOffset={11}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <span className="text-sm font-semibold">Notifications</span>
            <Button variant="ghost" size="sm">
              Mark all read
            </Button>
          </div>

          <DropdownMenuItem className="flex flex-col items-start p-3">
            <div className="flex items-start gap-3 w-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Notification 1</p>
                <p className="text-xs text-muted-foreground">
                  Description for notification 1.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  2 minutes ago
                </p>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start p-3">
            <div className="flex items-start gap-3 w-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Notification 2</p>
                <p className="text-xs text-muted-foreground">
                  Description for notification 2.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  5 minutes ago
                </p>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start p-3">
            <div className="flex items-start gap-3 w-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Notification 3</p>
                <p className="text-xs text-muted-foreground">
                  Description for notification 3.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  10 minutes ago
                </p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-center">
            <span className="text-sm text-muted-foreground">
              View all notifications
            </span>
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