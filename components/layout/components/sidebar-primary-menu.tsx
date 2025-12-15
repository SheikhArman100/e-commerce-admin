import { useCallback } from "react";
import { MENU_SIDEBAR_MAIN } from "@/config/layout-14.config";
import {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuItem,
  AccordionMenuLabel
} from '@/components/ui/accordion-menu';
import { Badge } from '@/components/ui/badge';
import { usePathname } from 'next/navigation';
import { useLayoutStore } from '@/stores/layoutStore';
import Link from 'next/link';

export function SidebarPrimaryMenu() {
  const pathname = usePathname();
  const selectedPrimaryItem = useLayoutStore((state) => state.selectedPrimaryItem);

  // Memoize matchPath to prevent unnecessary re-renders
  const matchPath = useCallback(
    (path: string): boolean =>
      path === pathname || (path.length > 1 && pathname.startsWith(path) && path !== '/layout-14'),
    [pathname],
  );

  // Find the menu group for the selected primary item
  const selectedGroup = MENU_SIDEBAR_MAIN.find(item => item.title === selectedPrimaryItem);

  if (!selectedGroup) return null;

  return (
    <AccordionMenu
      selectedValue={pathname}
      matchPath={matchPath}
      type="multiple"
      className="space-y-7.5 px-2.5"
      classNames={{
        label: 'text-xs font-normal text-muted-foreground mb-2',
        item: 'h-8.5 px-2.5 text-sm font-normal text-foreground hover:text-primary data-[selected=true]:bg-muted data-[selected=true]:text-foreground [&[data-selected=true]_svg]:opacity-100',
        group: '',
      }}
    >
      <AccordionMenuGroup>
        <AccordionMenuLabel>
          {selectedGroup.title}
        </AccordionMenuLabel>
        {selectedGroup.children?.map((child, index) => {
          return (
            <AccordionMenuItem key={index} value={child.path || '#'}>
              <Link href={child.path || '#'}>
                {child.icon && <child.icon />}
                <span>{child.title}</span>
                {child.badge == 'Beta' && <Badge size="sm" variant="destructive" appearance="light">{child.badge}</Badge>}
              </Link>
            </AccordionMenuItem>
          )
        })}
      </AccordionMenuGroup>
    </AccordionMenu>
  );
}
