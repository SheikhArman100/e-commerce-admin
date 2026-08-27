import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/layoutStore';
import { MENU_SIDEBAR_MAIN } from '@/config/layout-14.config';
import { MenuConfig, MenuItem } from '@/config/types';
import {
  BarChart3,
  FolderCode,
  ShoppingCart,
  Heart,
  Users,
  UserCircle,
  Megaphone,
  SlidersHorizontal,
  Bell,
  type LucideIcon,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Representational icon shown on the primary (rail) sidebar for each top-level group.
const GROUP_ICONS: Record<string, LucideIcon> = {
  Overview: BarChart3,
  Catalog: FolderCode,
  Variant: SlidersHorizontal,
  Sales: ShoppingCart,
  Marketing: Megaphone,
  Engagement: Heart,
  Notifications: Bell,
  'User Management': Users,
  'Your Account': UserCircle,
};

type PrimaryItem = {
  heading: string;
  icon: LucideIcon;
  children: MenuConfig;
};

function buildPrimaryItems(): PrimaryItem[] {
  return MENU_SIDEBAR_MAIN.map((group) => {
    const heading = group.heading || group.title || '';
    const icon = GROUP_ICONS[heading] || (group.children?.[0]?.icon as LucideIcon | undefined);
    return {
      heading,
      icon: icon || FolderCode,
      children: group.children || [],
    };
  });
}

// Static config-derived items; kept at module scope so the auto-select effect
// has a stable identity and doesn't re-run on every render.
const PRIMARY_ITEMS = buildPrimaryItems();

function isChildActive(child: MenuItem, pathname: string): boolean {
  if (child.path) {
    if (child.path === '/') return child.path === pathname;
    return pathname.startsWith(child.path);
  }
  if (child.children) return child.children.some((c) => isChildActive(c, pathname));
  return false;
}

export function SidebarPrimary() {
  const pathname = usePathname();
  const [selectedItem, setSelectedItem] = useState<PrimaryItem>(PRIMARY_ITEMS[0]);
  const setSelectedPrimaryItem = useLayoutStore((state) => state.setSelectedPrimaryItem);

  // Auto-select the group whose child matches the current route.
  useEffect(() => {
    const match = PRIMARY_ITEMS.find((group) =>
      group.children.some((child) => isChildActive(child, pathname)),
    );
    if (match) {
      setSelectedItem(match);
      setSelectedPrimaryItem(match.heading);
    }
  }, [pathname, setSelectedPrimaryItem]);

  return (
    <div className="flex flex-col items-center justify-center shrink-0 px-2.5 py-2.5 gap-5 lg:w-(--sidebar-collapsed-width) border-e border-input bg-muted">
      {/* Navigation */}
      <ScrollArea className="grow w-full h-[calc(100vh-13rem)] lg:h-[calc(100vh-5.5rem)]">
        <div className="grow gap-1 shrink-0 flex items-center flex-col">
          {PRIMARY_ITEMS.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  href={item.children[0]?.path || '#'}
                  onClick={() => {
                    setSelectedItem(item);
                    setSelectedPrimaryItem(item.heading);
                  }}
                  className={cn(
                    'flex items-center justify-center rounded-md px-2 py-2.5 w-full',
                    'shrink-0',
                    item === selectedItem
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                  )}
                >
                  <item.icon className="size-4.5! shrink-0" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.heading}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
