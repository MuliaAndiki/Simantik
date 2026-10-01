import type React from 'react';
import AppFooter from '../components/app-footer';
import AppHeader from '../components/app-header';

export interface NavLayoutProps {
  children: React.ReactNode;
  themeVariant?: 'dark' | 'light';
}

export default function NavLayout({ children, themeVariant = 'dark' }: NavLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white text-slate-800 selection:bg-teal-100 selection:text-teal-900">
      <AppHeader />
      <main className="flex-1 w-full pt-[68px]">{children}</main>
      <AppFooter themeVariant={themeVariant} />
    </div>
  );
}
