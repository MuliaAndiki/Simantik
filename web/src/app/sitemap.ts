import type { MetadataRoute } from 'next';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://simantik.educourse.id';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  const publicRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  }> = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/home', priority: 1.0, changeFrequency: 'daily' },
    { path: '/documentation', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/news', priority: 0.9, changeFrequency: 'daily' },
    { path: '/tutorials', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/testimonials', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/help', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/register', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/login', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/pilih-sekolah', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/terms', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.5, changeFrequency: 'yearly' },
  ];

  return publicRoutes.map((route) => ({
    url: `${appUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
