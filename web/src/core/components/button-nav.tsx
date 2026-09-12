'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';
import { isItemActive, isMenuActive, ROLE_SIDEBAR_MENU, SIDEBAR_MENU } from '@/configs/app.config';
import { useApi } from '@/hooks/useApi';
import { cn } from '@/utils/classname';

/**
 * Bottom navigation khusus mobile (md:hidden).
 *
 * Menyediakan akses cepat ke modul utama SIMANTIK di layar kecil —
 * melengkapi sidebar desktop pada AppShell.
 * Mendukung Popover / Dropdown untuk menu yang memiliki subMenu.
 */
export function BottomNav() {
  const pathname = usePathname();
  const api = useApi();

  const role = api.auth.query.me().data?.role?.toUpperCase();
  const roleMenus = (role && ROLE_SIDEBAR_MENU[role]) || SIDEBAR_MENU;

  return (
    <nav
      aria-label="Navigasi bawah"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {roleMenus.map((item) => {
          const hasSubMenu = Boolean(item.subMenu && item.subMenu.length > 0);
          const isActive = isItemActive(item, pathname);
          const Icon = item.icon;

          if (hasSubMenu && item.subMenu) {
            return (
              <li key={item.name} className="flex-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'flex w-full flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors cursor-pointer outline-none',
                        isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Icon className="size-5" strokeWidth={isActive ? 2.2 : 1.8} />
                      <span className="truncate max-w-[56px] text-center">{item.name}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    align="center"
                    sideOffset={10}
                    className="w-48 p-1.5 shadow-xl border-border/80 rounded-xl bg-background/98 backdrop-blur-md"
                  >
                    <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2 py-1">
                      {item.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1" />
                    {item.subMenu.map((subItem) => {
                      const isSubActive = isMenuActive(subItem.url, pathname);
                      const SubIcon = subItem.icon;
                      return (
                        <DropdownMenuItem key={subItem.url} asChild>
                          <Link
                            href={subItem.url}
                            className={cn(
                              'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer',
                              isSubActive
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'text-foreground/80 hover:bg-accent hover:text-foreground'
                            )}
                          >
                            {SubIcon && <SubIcon className="size-4 shrink-0" />}
                            <span>{subItem.name}</span>
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            );
          }

          return (
            <li key={item.name} className="flex-1">
              <Link
                href={item.url}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="size-5" strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="truncate max-w-[56px] text-center">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
