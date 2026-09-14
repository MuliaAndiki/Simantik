'use client';

import { DoorOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  SidebarSeparator,
  useSidebar,
} from '@/components/atoms';
import { isItemActive, ROLE_SIDEBAR_MENU, SIDEBAR_MENU } from '@/configs/app.config';
import { useApi } from '@/hooks/useApi';
import useAppNameSpace from '@/hooks/useAppNameSpace';
import { cn } from '@/utils/classname';
import { clearSessionCookies, getRefreshToken } from '@/utils/session-cookie';

export function AppSidebar() {
  const ns = useAppNameSpace();
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const api = useApi();

  const isCollapsed = state === 'collapsed';

  const role = api.auth.query.me().data?.role?.toUpperCase();
  const menus = role ? (ROLE_SIDEBAR_MENU[role] ?? SIDEBAR_MENU) : SIDEBAR_MENU;

  const mainMenus = menus.slice(0, 5);
  const footerMenus = menus.slice(5, 6);
  const logoutMutation = api.auth.mutate.logout();

  const handleLogout = () => {
    const refreshToken = getRefreshToken();
    logoutMutation.mutate(refreshToken ? { refreshToken } : undefined, {
      onSettled: () => {
        clearSessionCookies();
        router.replace('/login');
      },
    });
  };

  const renderMenuItem = (item: (typeof menus)[number]) => {
    const isActive = isItemActive(item, pathname);
    const Icon = item.icon;

    return (
      <SidebarMenuItem key={item.name}>
        <SidebarMenuButton asChild tooltip={isCollapsed ? item.name : undefined}>
          <Link
            href={item.url}
            className={cn(
              'flex h-10 items-center gap-3 rounded-lg px-3 py-2',
              'transition-all',
              'hover:text-primary',
              'dark:text-foreground dark:hover:text-primary',
              isActive &&
                'bg-background text-primary dark:bg-primary-foreground/30 dark:text-primary-foreground'
            )}
          >
            <Icon className="size-6 shrink-0" />

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

            <span className="truncate text-xs font-semibold text-primary-foreground/70  rounded-lg bg-primary-foreground/10 p-2">
              SMA / SMK TKA Portal
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>{mainMenus.map(renderMenuItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {footerMenus.length > 0 && (
        <SidebarFooter>
          <SidebarSeparator />

          <SidebarMenu>{footerMenus.map(renderMenuItem)}</SidebarMenu>
          <Button
            className={`flex ${isCollapsed ? 'justify-center' : 'justify-start'}  items-center`}
            variant={'quit'}
            onClick={() =>
              ns.alert.confirm({
                title: 'Keluar Dari Akun?',
                deskripsi:
                  'Apaah kamu yakin keluar dari SIMANTIK? sesi belajarmu saat ini akan tersimpan dengan aman',
                icon: 'question',
                onConfirm: () => {
                  handleLogout();
                },
              })
            }
          >
            <div className="flex justify-center items-center gap-2">
              <DoorOpen />
              <span className={`sr-only sm:not-sr-only ${isCollapsed ? 'hidden' : 'block'}`}>
                Keluar
              </span>
            </div>
          </Button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
