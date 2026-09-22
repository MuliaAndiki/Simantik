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
  {
    name: 'Evaluasi',
    url: '/student/evaluation',
    icon: BarChart3,
    subMenu: [],
  },
  { name: 'Pengaturan', url: '/student/setting', icon: Settings, subMenu: [] },
  { name: 'Bantuan & Panduan', url: '/student/help', icon: User, subMenu: [] },
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
    { name: 'Siswa', url: '/admin/students', icon: Users, subMenu: [] },
    { name: 'Sekolah', url: '/admin/schools', icon: School, subMenu: [] },
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
      name: 'News',
      url: '/content_manager/news',
      icon: Newspaper,
      subMenu: [],
    },
  ],
};

export function getRoleDashboardPath(role?: string | null): string {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'content_manager') return '/content_manager/dashboard';
  return '/student/dashboard';
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

export const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8080'}${process.env.NEXT_PUBLIC_GATE_API || '/api'}${process.env.NEXT_PUBLIC_VERSION_API || '/v1'}`;
