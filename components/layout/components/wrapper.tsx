'use client';

import { useLayout } from './context';
import { Sidebar } from './sidebar';
import { Header } from './header';
// import { Toolbar, ToolbarActions, ToolbarHeading } from './toolbar';
// import { Button } from '@/components/ui/button';
// import { Eye, Funnel, MessageSquareCode, Search } from 'lucide-react';
// import { ToolbarMenu } from './toolbar-menu';
// import { ToolbarMenuMobile } from './toolbar-menu-mobile';
import { HeaderBreadcrumbs } from './header-breadcrumbs';

export function Wrapper({ children }: { children: React.ReactNode }) {
  const {isMobile} = useLayout();

  return (
    <>
      <Header />
      {!isMobile && <Sidebar />}      

      {/* CSS Change: Removed toolbar height from padding-top calculation */}
      {/* Before: lg:pt-[calc(var(--header-height)+var(--toolbar-height))] */}
      {/* After: lg:pt-(--header-height) */}
      <div className="grow overflow-y-auto pt-(--header-height-mobile) lg:pt-(--header-height) lg:ps-(--sidebar-width) lg:in-data-[sidebar-open=false]:ps-(--sidebar-collapsed-width) transition-all duration-300">
        {/* Commented out toolbar */}
        {/*
        <Toolbar>
          <ToolbarHeading>
            {isMobile ? <ToolbarMenuMobile /> : <ToolbarMenu />}
          </ToolbarHeading>
          <ToolbarActions>
            <Button size="sm" variant="outline"><Funnel />Sort</Button>
            <Button size="sm" variant="outline"><Eye />View</Button>
            <Button size="sm" variant="outline"><MessageSquareCode />Filter</Button>
            <Button size="sm" variant="outline" mode="icon"><Search /></Button>
          </ToolbarActions>
        </Toolbar>
        */}

        <main className="grow p-5" role="content">
          {isMobile && <HeaderBreadcrumbs />}
          {children}
        </main>
      </div>
    </>
  );
}
