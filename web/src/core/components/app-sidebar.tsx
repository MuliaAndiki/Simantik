"use client";

import { ChevronDown, DoorOpen, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Button,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/atoms";
import {
  isItemActive,
  isMenuActive,
  type NavItem,
  ROLE_SIDEBAR_MENU,
  SIDEBAR_MENU,
} from "@/configs/app.config";
import { useApi } from "@/hooks/useApi";
import useAppNameSpace from "@/hooks/useAppNameSpace";
import { cn } from "@/utils/classname";
import { clearSessionCookies, getRefreshToken } from "@/utils/session-cookie";

export function AppSidebar() {
  const ns = useAppNameSpace();
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const api = useApi();

  const isCollapsed = state === "collapsed";

  const userRole = api.auth.query.me().data?.role?.toUpperCase();
  const isContentManager =
    userRole === "CONTENT_MANAGER" || pathname.startsWith("/content_manager");
  const isAdmin = userRole === "ADMIN" || pathname.startsWith("/admin");
  const role = isContentManager
    ? "CONTENT_MANAGER"
    : isAdmin
      ? "ADMIN"
      : userRole;
  const menus = role ? (ROLE_SIDEBAR_MENU[role] ?? SIDEBAR_MENU) : SIDEBAR_MENU;

  const mainMenus = isContentManager || isAdmin ? menus : menus.slice(0, 5);
  const footerMenus: NavItem[] = isContentManager
    ? [
        {
          name: "Pengaturan",
          url: "/content_manager/settings",
          icon: Settings,
          subMenu: [],
        },
      ]
    : isAdmin
      ? [
          {
            name: "Pengaturan",
            url: "/admin/settings",
            icon: Settings,
            subMenu: [],
          },
        ]
      : menus.slice(5, 6);

  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  // Auto-expand sub-menus when active route is a child
  useEffect(() => {
    for (const item of mainMenus) {
      if (item.subMenu && item.subMenu.length > 0) {
        const isChildActive = item.subMenu.some((sub) =>
          isMenuActive(sub.url, pathname),
        );
        if (isChildActive) {
          setOpenSubMenus((prev) => ({ ...prev, [item.name]: true }));
        }
      }
    }
  }, [pathname, mainMenus]);

  const toggleSubMenu = (itemName: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const logoutMutation = api.auth.mutate.logout();

  const handleLogout = () => {
    const refreshToken = getRefreshToken();
    logoutMutation.mutate(refreshToken ? { refreshToken } : undefined, {
      onSettled: () => {
        clearSessionCookies();
        router.replace("/login");
      },
    });
  };

  const renderMenuItem = (item: NavItem) => {
    const hasSubMenu = item.subMenu && item.subMenu.length > 0;
    const isActive = isItemActive(item, pathname);
    const isOpen = openSubMenus[item.name] ?? isActive;
    const Icon = item.icon;

    if (hasSubMenu) {
      return (
        <SidebarMenuItem key={item.name} className="flex flex-col">
          <SidebarMenuButton
            onClick={() => toggleSubMenu(item.name)}
            tooltip={isCollapsed ? item.name : undefined}
            className={cn(
              "flex h-10 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 cursor-pointer",
              "transition-all hover:text-primary dark:text-foreground dark:hover:text-primary",
              isActive &&
                "bg-sky-50/70 text-sky-900 font-semibold dark:bg-primary-foreground/20 dark:text-primary-foreground",
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon className="size-5 shrink-0" />
              <span className="font-semibold truncate">{item.name}</span>
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 transition-transform duration-200 text-slate-400",
                  isOpen && "rotate-180 text-primary",
                )}
              />
            )}
          </SidebarMenuButton>

          {!isCollapsed && isOpen && item.subMenu && (
            <SidebarMenuSub className="mt-1 ml-4 border-l-2 border-slate-200 dark:border-slate-800 pl-2 space-y-1">
              {item.subMenu.map((sub) => {
                const isSubActive = isMenuActive(sub.url, pathname);
                const SubIcon = sub.icon;
                return (
                  <SidebarMenuSubItem key={sub.name}>
                    <SidebarMenuSubButton asChild isActive={isSubActive}>
                      <Link
                        href={sub.url}
                        className={cn(
                          "flex h-8 items-center gap-2.5 rounded-md px-2.5 text-xs font-medium transition-colors",
                          "hover:text-primary hover:bg-slate-100 dark:hover:bg-primary",
                          isSubActive &&
                            "bg-sky-100 text-primary font-bold dark:bg-primary-foreground/30 dark:text-primary-foreground",
                        )}
                      >
                        <SubIcon className="size-3.5 shrink-0" />
                        <span className="truncate">{sub.name}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={item.name}>
        <SidebarMenuButton
          asChild
          tooltip={isCollapsed ? item.name : undefined}
        >
          <Link
            href={item.url}
            className={cn(
              "flex h-10 items-center gap-3 rounded-lg px-3 py-2",
              "transition-all",
              "hover:text-primary",
              "dark:text-foreground dark:hover:text-primary",
              isActive &&
                "bg-sky-100 text-sky-900 font-semibold dark:bg-primary-foreground/30 dark:text-primary-foreground",
            )}
          >
            <Icon className="size-5 shrink-0" />

            <span className="font-semibold truncate">{item.name}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="flex h-20 justify-center border-b p-4">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logos.png"
            alt="SIMANTIK"
            width={40}
            height={40}
            priority
            className="shrink-0"
          />

          <div className="flex min-w-0 flex-col overflow-hidden whitespace-nowrap transition-opacity duration-300 ease-in-out group-data-[collapsible=icon]:opacity-0">
            <span className="text-xl font-semibold">SIMANTIK</span>

            <span className="truncate text-xs font-semibold text-primary-foreground/70 rounded-lg bg-primary-foreground/10 p-2 uppercase tracking-wider">
              {isAdmin
                ? "Admin Portal"
                : isContentManager
                  ? "Content Manager"
                  : "SMA / SMK TKA Portal"}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {isContentManager || isAdmin ? (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              {isAdmin ? "ADMINISTRASI" : "MAIN"}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>{mainMenus.map(renderMenuItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>{mainMenus.map(renderMenuItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />

        <SidebarMenu>{footerMenus.map(renderMenuItem)}</SidebarMenu>
        <Button
          className={`flex ${isCollapsed ? "justify-center" : "justify-start"} items-center`}
          variant={"quit"}
          onClick={() =>
            ns.alert.confirm({
              title: "Keluar Dari Akun?",
              deskripsi:
                "Apakah kamu yakin keluar dari SIMANTIK? sesi belajarmu saat ini akan tersimpan dengan aman",
              icon: "question",
              onConfirm: () => {
                handleLogout();
              },
            })
          }
        >
          <div className="flex justify-center items-center gap-2">
            <DoorOpen />
            <span
              className={`sr-only sm:not-sr-only ${isCollapsed ? "hidden" : "block"}`}
            >
              Keluar
            </span>
          </div>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
