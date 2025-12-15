import { Fragment, ReactNode } from 'react';
import { MENU_SIDEBAR_MAIN } from '@/config/layout-14.config';
import { useMenu } from '@/hooks/use-menu';
import { MenuItem } from '@/config/types';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export interface ToolbarHeadingProps {
  title?: string | ReactNode;
  description?: string | ReactNode;
}

function Toolbar({ children }: { children?: ReactNode }) {
  return (
    <div className="py-2.5 lg:py-0 lg:fixed top-(--header-height) start-[calc(var(--sidebar-width))] lg:in-data-[sidebar-open=false]:start-[calc(var(--sidebar-collapsed-width))] transition-all duration-300 end-0 z-10 px-5 flex flex-wrap items-center justify-between gap-2.5 min-h-(--toolbar-height) bg-background border-b border-border shrink-0">
      {children}
    </div>
  );
}

function ToolbarActions({ children }: { children?: ReactNode }) {
  return <div className="flex items-center gap-2.5">{children}</div>;
}

function ToolbarBreadcrumbs() {
  const pathname = usePathname();
  const { getBreadcrumb } = useMenu(pathname);
  const items: MenuItem[] = getBreadcrumb(MENU_SIDEBAR_MAIN);

  // Fallback breadcrumb for current page
  if (items.length === 0) {
    const getPageTitle = () => {
      if (pathname === '/campaign') return 'Dashboard';
      if (pathname === '/') return 'Dashboard';
      if (pathname === '/ivr') return 'Dashboard';
      if (pathname === '/whatsapp') return 'Dashboard';
      return 'Dashboard';
    };

    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Only show the last item in the breadcrumb path
  const lastItem = items[items.length - 1];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {lastItem?.path ? (
            <BreadcrumbLink asChild>
              <Link href={lastItem.path}>{lastItem.title}</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{lastItem?.title || 'Page'}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function ToolbarHeading ({ children }: { children: ReactNode }) {
  return <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-1 lg:gap-5">{children}</div>;
}

function ToolbarPageTitle ({ children }: { children?: string }) {
  const pathname = usePathname();
  const { getCurrentItem } = useMenu(pathname);
  const item = getCurrentItem(MENU_SIDEBAR_MAIN);

  return (
    <h1 className="text-base font-medium leading-none text-foreground">
      {children ? children : item?.title || 'Untitled'}
    </h1>
  );
};

function ToolbarDescription ({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
      {children}
    </div>
  );
};

export {
  Toolbar,
  ToolbarActions,
  ToolbarBreadcrumbs,
  ToolbarHeading,
  ToolbarPageTitle,
  ToolbarDescription
};
