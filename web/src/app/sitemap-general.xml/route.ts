const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://simantik.educourse.id';

interface SitemapEntry {
  path: string;
  priority: string;
  changeFreq: string;
}

const publicRoutes: SitemapEntry[] = [
  { path: '', priority: '1.0', changeFreq: 'daily' },
  { path: '/home', priority: '1.0', changeFreq: 'daily' },
  { path: '/documentation', priority: '0.9', changeFreq: 'weekly' },
  { path: '/news', priority: '0.9', changeFreq: 'daily' },
  { path: '/tutorials', priority: '0.8', changeFreq: 'weekly' },
  { path: '/testimonials', priority: '0.7', changeFreq: 'monthly' },
  { path: '/help', priority: '0.7', changeFreq: 'monthly' },
  { path: '/register', priority: '0.8', changeFreq: 'monthly' },
  { path: '/login', priority: '0.6', changeFreq: 'monthly' },
  { path: '/pilih-sekolah', priority: '0.6', changeFreq: 'monthly' },
  { path: '/terms', priority: '0.5', changeFreq: 'yearly' },
  { path: '/privacy', priority: '0.5', changeFreq: 'yearly' },
];

function generateSitemap(entries: SitemapEntry[]) {
  const currentDate = new Date().toISOString();
  const urlNodes = entries
    .map(
      (entry) => `
    <url>
      <loc>${appUrl}${entry.path}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>${entry.changeFreq}</changefreq>
      <priority>${entry.priority}</priority>
    </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes}
</urlset>`;
}

export async function GET() {
  const xmlResponse = generateSitemap(publicRoutes);

  return new Response(xmlResponse, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
