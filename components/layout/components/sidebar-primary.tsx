import { useEffect, useState } from 'react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/layoutStore';
import {
  BarChart3,
  Bell,
  CheckSquare,
  FolderCode,
  Grid,
  Mails,
  NotepadText,
  ScrollText,
  Settings,
  ShieldUser,
  UserCircle,
  Users,
  User,
  Clock,
  Shield,
  Building2,
  LogOut,
  Download,
  ExternalLink,
  Zap,
  Target,
  ClipboardList,
  Heart,
  FileText,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
} from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
  {
    icon: BarChart3,
    tooltip: 'Dashboard',
    path: '/',
    rootPath: '/'
  },
  {
    icon: Users,
    tooltip: 'User Management',
    path: '/users',
    rootPath: '/users'
  },
  {
    icon: Grid,
    tooltip: 'Category Management',
    path: '/categories',
    rootPath: '/categories'
  },
  {
    icon: FolderCode,
    tooltip: 'Variant Management',
    path: '/flavors',
    rootPath: '/flavors'
  },
  {
    icon: ClipboardList,
    tooltip: 'Product Management',
    path: '/products',
    rootPath: '/products'
  },
  {
    icon: Mails,
    tooltip: 'Review Management',
    path: '/reviews',
    rootPath: '/reviews'
  },
  {
    icon: Heart,
    tooltip: 'Wishlist Management',
    path: '/wishlists',
    rootPath: '/wishlists'
  },
  {
    icon: FileText,
    tooltip: 'Cart Management',
    path: '/carts',
    rootPath: '/carts'
  },
  {
    icon: Target,
    tooltip: 'Order Management',
    path: '/orders',
    rootPath: '/orders'
  },
  {
    icon: Settings,
    tooltip: 'Account',
    path: '#',
    rootPath: '#',
  },
];

export function SidebarPrimary() {
  const pathname = usePathname();
  const [selectedMenuItem, setSelectedMenuItem] = useState(menuItems[1]);
  const setSelectedPrimaryItem = useLayoutStore((state) => state.setSelectedPrimaryItem);

  useEffect(() => {
    menuItems.forEach((item) => {
      if (
        item.rootPath === pathname ||
        (item.rootPath && pathname.includes(item.rootPath)) ||
        // Special handling for variant management paths
        (item.tooltip === 'Variant Management' && (
          pathname.includes('/sizes') ||
          pathname.includes('/flavors')
        ))
      ) {
        setSelectedMenuItem(item);
        setSelectedPrimaryItem(item.tooltip);
      }
    });
  }, [pathname, setSelectedPrimaryItem]);

  return (
    <div className="flex flex-col items-center justify-center shrink-0 px-2.5 py-2.5 gap-5 lg:w-(--sidebar-collapsed-width) border-e border-input bg-muted">
      {/* Navigation */}
      <ScrollArea className="grow w-full h-[calc(100vh-13rem)] lg:h-[calc(100vh-5.5rem)]">
        <div className="grow gap-1 shrink-0 flex items-center flex-col">
          {menuItems.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="ghost"
                  mode="icon"
                  {...(item === selectedMenuItem
                    ? { 'data-state': 'open' }
                    : {})}
                  className={cn(
                    'shrink-0 rounded-md size-9',
                    'data-[state=open]:bg-primary data-[state=open]:text-primary-foreground',
                    'hover:text-foreground',
                  )}
                >
                  <Link href={item.path}>
                    <item.icon className="size-4.5!" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{item.tooltip}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      
    </div>
  );
}
