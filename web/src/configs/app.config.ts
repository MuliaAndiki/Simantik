import {
  BarChart3,
  BookOpen,
  FileQuestion,
  FileText,
  LayoutDashboard,
  MessageSquareQuote,
  Newspaper,
  School,
  Settings,
  Trophy,
  User,
  UserCheck,
  Users,
  Video,
} from 'lucide-react';
import React from 'react';

interface AppConfig {
  name: string;
  description: string;
  logo: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    author: string;
    image: string;
  };
  social_media: {
    twitter: {
      url: string;
      icon: string;
    };
    instagram: {
      url: string;
      icon: string;
    };
    linkedin: {
      url: string;
      icon: string;
    };
    youtube: {
      url: string;
      icon: string;
    };
    tiktok: {
      url: string;
      icon: string;
    };
  };
}

export type PropsParams = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  id: Promise<string>;
};

export const appConfig: AppConfig = {
  name: 'App',
  description: 'App',
  logo: '/images/logo.png',
  metadata: {
    title: 'App',
    description: 'App',
    keywords: ['App'],
    author: 'App',
    image: 'App',
  },
  social_media: {
    twitter: {
      url: 'https://twitter.com/app',
      icon: 'hugeicons:new-twitter-rectangle',
    },
    instagram: {
      url: 'https://instagram.com/app',
      icon: 'basil:instagram-outline',
    },
    linkedin: {
      url: 'https://linkedin.com/app',
      icon: 'tabler:brand-linkedin',
    },
    youtube: {
      url: 'https://youtube.com/app',
      icon: 'mingcute:youtube-line',
    },
    tiktok: {
      url: 'https://tiktok.com/app',
      icon: 'hugeicons:tiktok',
    },
  },
};

interface NavigationMenuConfig {
  items: {
    title: string;
    href: string;
    icon?: React.ReactNode;
    description?: string;
    children?: NavigationMenuConfig['items'];
  }[];
}

export const navigationMenuConfig: NavigationMenuConfig = {
  items: [
    {
      title: 'Home',
      href: '/',
      description: 'Home',
    },
    {
      title: 'masuk',
      href: '/login',
      description: 'masuk',
    },
  ],
};

export type UserRole = 'student' | 'admin' | 'content_manager';

export interface NavItem {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  subMenu?: NavItem[];
}

export const SIDEBAR_MENU: NavItem[] = [
  {
    name: 'Dashboard',
    url: '/student/dashboard',
    icon: LayoutDashboard,
    subMenu: [],
  },
  { name: 'Belajar', url: '/student/learning', icon: BookOpen, subMenu: [] },
  {
    name: 'Latihan',
    url: '/student/practice',
    icon: FileQuestion,
    subMenu: [],
  },
  { name: 'Tryout', url: '/student/tryout', icon: Trophy, subMenu: [] },
  { name: 'Berita', url: '/student/news', icon: User, subMenu: [] },
  {
    name: 'Evaluasi',
    url: '/student/evaluation',
    icon: BarChart3,
    subMenu: [],
  },
  { name: 'Pengaturan', url: '/student/setting', icon: Settings, subMenu: [] },
];

export const ROLE_SIDEBAR_MENU: Record<string, NavItem[]> = {
  STUDENT: SIDEBAR_MENU,
  ADMIN: [
    {
      name: 'Dashboard',
      url: '/admin/dashboard',
      icon: LayoutDashboard,
      subMenu: [],
    },
    {
      name: 'Materi',
      url: '/admin/materials',
      icon: BookOpen,
      subMenu: [],
    },
    {
      name: 'Paket Latihan',
      url: '/admin/practice',
      icon: FileQuestion,
      subMenu: [],
    },
    {
      name: 'Paket Tryout',
      url: '/admin/tryouts',
      icon: Trophy,
      subMenu: [],
    },
    {
      name: 'Konten',
      url: '/admin/news',
      icon: Newspaper,
      subMenu: [
        {
          name: 'News',
          url: '/admin/news',
          icon: Newspaper,
        },
        {
          name: 'Dokumentasi',
          url: '/admin/docs',
          icon: FileText,
        },
        {
          name: 'Testimoni',
          url: '/admin/testimonials',
          icon: MessageSquareQuote,
        },
        {
          name: 'Tutorial',
          url: '/admin/tutorials',
          icon: Video,
        },
      ],
    },
    {
      name: 'Manajemen Data',
      url: '/admin/schools',
      icon: Users,
      subMenu: [
        {
          name: 'Kelola Sekolah',
          url: '/admin/schools',
          icon: School,
        },
        {
          name: 'Kelola Siswa',
          url: '/admin/students',
          icon: Users,
        },
        {
          name: 'Kelola Content Manager',
          url: '/admin/content-managers',
          icon: UserCheck,
        },
      ],
    },
  ],
  CONTENT_MANAGER: [
    {
      name: 'Dashboard',
      url: '/content_manager/dashboard',
      icon: LayoutDashboard,
      subMenu: [],
    },
    {
      name: 'Materi',
      url: '/content_manager/materials',
      icon: BookOpen,
      subMenu: [],
    },
    {
      name: 'Paket Latihan',
      url: '/content_manager/practice',
      icon: FileQuestion,
      subMenu: [],
    },
    {
      name: 'Paket Tryout',
      url: '/content_manager/tryouts',
      icon: Trophy,
      subMenu: [],
    },
    {
      name: 'Konten',
      url: '/content_manager/news',
      icon: Newspaper,
      subMenu: [
        {
          name: 'News',
          url: '/content_manager/news',
          icon: Newspaper,
        },
        {
          name: 'Dokumentasi',
          url: '/content_manager/docs',
          icon: FileText,
        },
        {
          name: 'Testimoni',
          url: '/content_manager/testimonials',
          icon: MessageSquareQuote,
        },
        {
          name: 'Tutorial',
          url: '/content_manager/tutorials',
          icon: Video,
        },
      ],
    },
  ],
};

export function getRoleDashboardPath(role?: string | null): string {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'content_manager') return '/content_manager/dashboard';
  return '/student/dashboard';
}

// ─── Sidebar reusable per-role ─────────────────────────────────────────────
// Satu section = satu grup berlabel; tiap item (NavItem) boleh punya subMenu.

export type SidebarRoleKey = 'STUDENT' | 'ADMIN' | 'CONTENT_MANAGER';

export interface NavSection {
  label?: string;
  items: NavItem[];
}

/** Samakan dengan logika lama AppSidebar (role query + fallback prefix path). */
export function resolveSidebarRole(
  userRole?: string | null,
  pathname?: string
): SidebarRoleKey | undefined {
  const upper = userRole?.toUpperCase();
  if (upper === 'CONTENT_MANAGER' || pathname?.startsWith('/content_manager')) {
    return 'CONTENT_MANAGER';
  }
  if (upper === 'ADMIN' || pathname?.startsWith('/admin')) {
    return 'ADMIN';
  }
  if (upper === 'STUDENT') return 'STUDENT';
  return undefined;
}

export function getSidebarMenus(roleKey?: SidebarRoleKey): NavItem[] {
  if (roleKey && ROLE_SIDEBAR_MENU[roleKey]) return ROLE_SIDEBAR_MENU[roleKey];
  return SIDEBAR_MENU;
}

/** Menu utama (tanpa footer). Student hanya 6 item pertama. */
export function getSidebarMainMenus(roleKey?: SidebarRoleKey): NavItem[] {
  const menus = getSidebarMenus(roleKey);
  if (roleKey === 'ADMIN' || roleKey === 'CONTENT_MANAGER') return menus;
  return menus.slice(0, 6);
}

/** Item footer per role — tambah item baru cukup di sini. */
export const ROLE_SIDEBAR_FOOTER: Record<SidebarRoleKey, NavItem[]> = {
  ADMIN: [{ name: 'Pengaturan', url: '/admin/settings', icon: Settings, subMenu: [] }],
  CONTENT_MANAGER: [
    {
      name: 'Pengaturan',
      url: '/content_manager/settings',
      icon: Settings,
      subMenu: [],
    },
  ],
  STUDENT: SIDEBAR_MENU.slice(6),
};

export function getSidebarFooterMenus(roleKey?: SidebarRoleKey): NavItem[] {
  if (roleKey && ROLE_SIDEBAR_FOOTER[roleKey]) return ROLE_SIDEBAR_FOOTER[roleKey];
  return [];
}

export function getPortalLabel(roleKey?: SidebarRoleKey): string {
  if (roleKey === 'ADMIN') return 'Admin Portal';
  if (roleKey === 'CONTENT_MANAGER') return 'Content Manager';
  return 'SMA / SMK TKA Portal';
}

export function getSidebarGroupLabel(roleKey?: SidebarRoleKey): string {
  if (roleKey === 'ADMIN') return 'ADMINISTRASI';
  if (roleKey === 'CONTENT_MANAGER') return 'MAIN';
  return 'Menu';
}

export function isMenuActive(url: string, pathname: string): boolean {
  return pathname === url || pathname.startsWith(`${url}/`);
}

export function isItemActive(item: NavItem, pathname: string): boolean {
  if (item.subMenu && item.subMenu.length > 0) {
    return item.subMenu.some((sub) => isMenuActive(sub.url, pathname));
  }
  return isMenuActive(item.url, pathname);
}

/**
 * Browser client calls always traverse the same-origin Next.js BFF proxy (`/bff/v1/*`)
 * so internal API secrets (`NEXT_INTERNAL_API_SECRET`) never touch client bundles.
 */
export const baseUrl = '/bff/v1';

/**
 * Resolves the upstream Go backend origin strictly for Next.js server contexts
 * (`bff/[...path]/route.ts` & `server-fetch.ts`).
 */
export function getServerBackendOrigin(): string {
  const raw =
    process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8080';
  return raw
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/api(\/v1)?$/, '');
}
