import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/configs/site.config';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  const publicAllowedPaths = [
    '/',
    '/home',
    '/documentation',
    '/documentation/*',
    '/news',
    '/news/*',
    '/tutorials',
    '/testimonials',
    '/help',
    '/terms',
    '/privacy',
    '/pilih-sekolah',
    '/register',
    '/login',
    '/llms.txt',
    '/llms-full.txt',
    '/_next/static/',
  ];

  const privateDisallowedPaths = [
    '/admin/',
    '/admin/*',
    '/content_manager/',
    '/content_manager/*',
    '/student/',
    '/student/*',
    '/api/',
    '/api/*',
    '/dashboard/',
    '/dashboard/*',
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
  ];

  return {
    rules: [
      {
        // General search engine web crawlers (Google, Bing, Yahoo, DuckDuckGo, Brave)
        userAgent: '*',
        allow: publicAllowedPaths,
        disallow: privateDisallowedPaths,
      },
      {
        // AI Crawlers & Large Language Models (ChatGPT, Claude, Gemini, Perplexity, Apple Intelligence)
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'Claude-SearchBot',
          'Claude-User',
          'anthropic-ai',
          'Google-Extended',
          'PerplexityBot',
          'Applebot-Extended',
          'CCBot',
        ],
        allow: publicAllowedPaths,
        disallow: privateDisallowedPaths,
      },
      {
        userAgent: 'Bytespider',
        disallow: '/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
