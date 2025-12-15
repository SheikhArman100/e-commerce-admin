import { useEffect, useState } from 'react';
import { Menu, PanelRight, Zap } from 'lucide-react';
import { useLayout } from './context';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SidebarPrimary } from './sidebar-primary';
import { SidebarSecondary } from './sidebar-secondary';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export function HeaderLogo() {
  const pathname = usePathname();
  const { isMobile, sidebarToggle } = useLayout();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Single team configuration
  const team = {
    icon: Zap,
    name: " Dashboard",
    color: "bg-teal-600 text-white"
  };

  // Close sheet when route changes
  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  return (
    <div className="flex border-e border-border items-center gap-2 lg:w-(--sidebar-width)">
      {/* Brand */}
      <div className="flex items-center w-full">
        {/* Logo */}
        <div className="flex items-center justify-center shrink-0 border-e border-border w-(--sidebar-collapsed-width) h-(--header-height) bg-muted">
          <Link href="/layout-14">
            <Image
              src={toAbsoluteUrl('/media/mini-logo-gray.svg')}
              className="dark:hidden h-[30px]"
              alt="Thunder AI Logo"
              width={100}
              height={30}
            />
            <Image
              src={toAbsoluteUrl('/media/mini-logo-gray-dark.svg')}
              className="hidden dark:block h-[30px]"
              alt="Thunder AI Logo"
              width={100}
              height={30}
            />
          </Link>
        </div>

        {/* Mobile sidebar toggle */}
        {isMobile && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" mode="icon" size="sm" className="ms-5.5">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="p-0 gap-0 w-[280px] lg:w-(--sidebar-width)"
              side="left"
              close={false}
            >
              <SheetHeader className="p-0 space-y-0" />
              <SheetBody className="flex grow p-0">
                <SidebarPrimary />
                <SidebarSecondary />
              </SheetBody>
            </SheetContent>
          </Sheet>
        )}

        {/* Sidebar header */}
        <div className="flex w-full grow items-center justify-between px-5 gap-2.5">
          {/* Single team display */}
          <div className="inline-flex text-muted-foreground px-1.5 -ms-1.5">
            <div className={cn("size-6 flex items-center justify-center rounded-md", team.color)}>
              <team.icon className="size-4" />
            </div>
            <span className="text-mono text-sm font-medium hidden lg:block ml-2">
              {team.name}
            </span>
          </div>

          {/* Sidebar toggle */}
          <Button
            mode="icon"
            variant="ghost"
            onClick={sidebarToggle}
            className="hidden lg:inline-flex text-muted-foreground hover:text-foreground"
          >
            <PanelRight className="-rotate-180 in-data-[sidebar-open=false]:rotate-0 opacity-100" />
          </Button>
        </div>
      </div>
    </div>
  );
}
