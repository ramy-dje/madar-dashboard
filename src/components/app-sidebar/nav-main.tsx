"use client";

import { ChevronRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { IconType } from "react-icons/lib";
import useAccess from "@/hooks/use-access";
import { SystemPermissions } from "@/interfaces/permissions/permissions";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

interface NavItem {
  name: string;
  access?: SystemPermissions[];
  title: string;
  url: string;
  icon?: IconType;
}

interface NavMainItem extends NavItem {
  items?: NavItem[];
}

export interface NavMainProps {
  items: NavMainItem[];
}

export function NavMain({ items }: NavMainProps) {
  const { permissions } = useAccess();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Extract pathname segments once
  const pathSegments = useMemo(() => {
    if (!mounted) return [];
    return pathname.split("/").filter(Boolean);
  }, [pathname, mounted]);

  // Generate selected item identifier
  const selectedItem = useMemo(() => {
    return pathSegments.join("-");
  }, [pathSegments]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter items based on permissions
  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          !item.access ||
          item.access.some((permission) => permissions.includes(permission))
      ),
    [items, permissions]
  );

  // Check if item is selected
  const isItemSelected = (item: NavMainItem) => {
    if (!mounted) return false;

    return item.items
      ? pathSegments[0] === item.name
      : selectedItem === item.name;
  };

  // Check if sub-item is selected
  const isSubItemSelected = (parentItem: NavMainItem, subItem: NavItem) => {
    if (!mounted) return false;

    const expectedPattern = subItem.name
      ? `${parentItem.name}-${subItem.name}`
      : parentItem.name;

    return selectedItem === expectedPattern;
  };

  // Filter sub-items based on permissions
  const getFilteredSubItems = (subItems?: NavItem[]) => {
    if (!subItems) return [];

    return subItems.filter(
      (subItem) =>
        !subItem.access ||
        subItem.access.some((permission) => permissions.includes(permission))
    );
  };

  // Common button styles
  const getButtonStyles = (selected: boolean) =>
    cn(
      "w-full gap-2 justify-start",
      selected
        ? "overflow-visible relative text-primary/90 font-medium before:absolute before:-start-2 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary"
        : "text-foreground/70 hover:text-foreground/90 truncate"
    );

  // Render icon with selection state
  const renderIcon = (IconComponent: IconType, selected: boolean) => (
    <IconComponent
      data-selected={selected}
      className="!size-5 text-foreground/80 data-[selected=true]:text-primary"
    />
  );

  // Render collapsible menu item
  const renderCollapsibleItem = (item: NavMainItem) => {
    const selected = isItemSelected(item);
    const filteredSubItems = getFilteredSubItems(item.items);

    return (
      <Collapsible
        key={item.title}
        asChild
        defaultOpen={selected}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              variant={selected ? "empty" : "ghost"}
              className={getButtonStyles(selected)}
            >
              {item.icon && renderIcon(item.icon, selected)}
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {filteredSubItems.map((subItem) => {
                const isActive = isSubItemSelected(item, subItem);

                return (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild>
                      <Link href={subItem.url}>
                        <div className="size-4 flex justify-center items-center">
                          <span
                            data-selected={isActive}
                            className="size-[4px] data-[selected=true]:size-[6px] block rounded-full bg-foreground/20 data-[selected=true]:bg-primary transition-all duration-200"
                          />
                        </div>
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  };

  // Render simple menu item
  const renderSimpleItem = (item: NavMainItem) => {
    const selected = isItemSelected(item);

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          variant={selected ? "empty" : "ghost"}
          className={getButtonStyles(selected)}
        >
          <Link href={item.url}>
            {item.icon && renderIcon(item.icon, selected)}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  if (!mounted) {
    // Render skeleton during SSR to prevent hydration mismatch
    return (
      <SidebarGroup>
        <SidebarMenu>
          {filteredItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                variant="ghost"
                className="w-full gap-2 justify-start"
              >
                <Skeleton className="w-full h-6" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {filteredItems.map((item) =>
          item.items ? renderCollapsibleItem(item) : renderSimpleItem(item)
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
