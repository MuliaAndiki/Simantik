import type { MetadataRoute } from 'next';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://simantik.educourse.id';

export default function robots(): MetadataRoute.Robots {
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
  ];

  return {
    rules: [
      {
        // General search engine web crawlers (Google, Bing, Yahoo, DuckDuckGo)
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
          'anthropic-ai',
          'Google-Extended',
          'PerplexityBot',
          'Applebot-Extended',
          'CCBot',
        ],
        allow: publicAllowedPaths,
        disallow: privateDisallowedPaths,
      },
    ],
    sitemap: [`${appUrl}/sitemap.xml`, `${appUrl}/sitemap-general.xml`],
    host: appUrl,
  };
}
