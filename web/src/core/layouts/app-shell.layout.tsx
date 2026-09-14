'use client';

import type * as React from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/atoms';
import { AppSidebar } from '@/core/components/app-sidebar';
import { BottomNav } from '@/core/components/button-nav';
import NotificationDropdown from '../components/notification.dropdown';
import ProfileDropdown from '../components/profile.dropdown';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * Shell utama area privat: sidebar (desktop) + bottom navigation (mobile).
 * Dipakai oleh seluruh halaman dashboard role (student/admin/content_manager).
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-full flex-col w-full">
            <div className="flex p-4 items-center gap-2 border-b w-full h-20">
              <div className="flex items-center justify-between max-w-full mx-auto w-full">
                <SidebarTrigger />
                <div className="flex items-center gap-4">
                  <NotificationDropdown />
                  <ProfileDropdown />
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-auto w-full pb-16 md:pb-0">
              <div className="container h-full max-w-full w-full mx-auto p-[1rem]">{children}</div>
            </div>
          </div>
        </SidebarInset>

        <BottomNav />
      </div>
    </SidebarProvider>
  );
}
