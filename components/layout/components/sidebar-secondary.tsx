import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarWorkspacesMenu } from "./sidebar-workspaces-menu";
import { SidebarCommunities } from "./sidebar-communities";
import { SidebarPrimaryMenu } from "./sidebar-primary-menu";
import { SidebarResourcesMenu } from "./sidebar-resources-menu";
import { SidebarSearch } from "./sidebar-search";
import { useLayoutStore } from "@/stores/layoutStore";

export function SidebarSecondary() {
  const selectedPrimaryItem = useLayoutStore((state) => state.selectedPrimaryItem);

  return (
    <ScrollArea className="grow shrink-0 h-[calc(100vh-1rem)] lg:h-[calc(100vh-4rem)] mt-0 mb-2.5">
      {/* <SidebarSearch /> */}
      {selectedPrimaryItem === 'Dashboard' && <SidebarPrimaryMenu />}
      {/* <Separator className="my-2.5" />
      <SidebarWorkspacesMenu />
      <Separator className="my-2.5" />
      <SidebarCommunities />
      <Separator className="my-2.5" />
      <SidebarResourcesMenu />
      <Separator className="my-2.5" /> */}
    </ScrollArea>
  );
}
