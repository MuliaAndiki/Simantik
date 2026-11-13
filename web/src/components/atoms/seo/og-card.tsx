import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import sharp from 'sharp';
import { SITE_BADGE, SITE_SHORT_NAME, SITE_SUBTITLE, SITE_TAGLINE } from '@/configs/site.config';
import { resolveAbsoluteUrl } from '@/utils/seo-sitemap.util';

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export interface OgCardOptions {
  title?: string;
  subtitle?: string;
  badge?: string;
  categoryLabel?: string;
  thumbnailUrl?: string | null;
}

let cachedAssetsPromise: Promise<{
  fontBold: Buffer;
  fontMedium: Buffer;
  logoDataUri: string;
}> | null = null;

async function loadOgAssets() {
  if (!cachedAssetsPromise) {
    cachedAssetsPromise = Promise.all([
      readFile(join(process.cwd(), 'src/assets/fonts/Poppins-Bold.ttf')),
      readFile(join(process.cwd(), 'src/assets/fonts/Poppins-Medium.ttf')),
      readFile(join(process.cwd(), 'public/images/logos.png')),
    ]).then(([fontBold, fontMedium, logoBuffer]) => ({
      fontBold,
      fontMedium,
      logoDataUri: `data:image/png;base64,${logoBuffer.toString('base64')}`,
    }));
  }

  return cachedAssetsPromise;
}

async function resolveSafeThumbnailDataUri(rawUrl?: string | null): Promise<string | null> {
  if (!rawUrl) return null;

  try {
    const resolved = rawUrl.startsWith('http') ? rawUrl : resolveAbsoluteUrl(rawUrl);
    if (!/^https?:\/\//i.test(resolved)) return null;

    const response = await fetch(resolved, {
      signal: AbortSignal.timeout(2500),
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;

    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength === 0 || arrayBuffer.byteLength > 5 * 1024 * 1024) {
      return null;
    }

    const pngBuffer = await sharp(Buffer.from(arrayBuffer))
      .resize(400, 400, { fit: 'cover', position: 'center' })
      .png({ quality: 85 })
      .toBuffer();

    return `data:image/png;base64,${pngBuffer.toString('base64')}`;
  } catch {
    return null;
  }
}

function clampDisplayText(text: string, maxLength: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 3).trimEnd()}...`;
}

export async function renderSimantikOgImage(options: OgCardOptions = {}): Promise<ImageResponse> {
  const [{ fontBold, fontMedium, logoDataUri }, thumbnailDataUri] = await Promise.all([
    loadOgAssets(),
    resolveSafeThumbnailDataUri(options.thumbnailUrl),
  ]);

  const isDefaultBrandCard = !options.title;
  const displayTitle = isDefaultBrandCard
    ? `${SITE_SHORT_NAME} – ${SITE_TAGLINE}`
    : clampDisplayText(options.title ?? SITE_TAGLINE, 92);
  const displaySubtitle = clampDisplayText(options.subtitle || SITE_SUBTITLE, 145);
  const displayBadge = options.badge || SITE_BADGE;
  const categoryLabel = options.categoryLabel;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '54px 64px',
        background: 'linear-gradient(135deg, #134653 0%, #0F6B70 55%, #0D9488 100%)',
        color: '#FFFFFF',
        fontFamily: 'Poppins',
        position: 'relative',
      }}
    >
      {/* Top Bar: Logo + Wordmark + UNP Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '20px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
            }}
          >
            {/* biome-ignore lint/performance/noImgElement: Satori ImageResponse requires native <img> elements */}
            <img src={logoDataUri} alt="Logo SIMANTIK" width={60} height={60} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontSize: '26px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: '#FFFFFF',
              }}
            >
              {SITE_SHORT_NAME}
            </span>
            <span style={{ fontSize: '16px', fontWeight: 500, color: '#99F6E4' }}>simantik.id</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.14)',
            border: '1.5px solid rgba(255, 255, 255, 0.28)',
            borderRadius: '999px',
            padding: '10px 22px',
            fontSize: '18px',
            fontWeight: 500,
            color: '#F0FDFA',
          }}
        >
          <span>{displayBadge}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '40px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            flex: 1,
          }}
        >
          {categoryLabel ? (
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                backgroundColor: '#F59E0B',
                color: '#0F172A',
                borderRadius: '999px',
                padding: '6px 18px',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              {categoryLabel}
            </div>
          ) : null}

          <div
            style={{
              display: 'flex',
              fontSize: isDefaultBrandCard ? '50px' : '44px',
              fontWeight: 700,
              lineHeight: 1.18,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}
          >
            {displayTitle}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '24px',
              fontWeight: 500,
              lineHeight: 1.45,
              color: '#CCFBF1',
            }}
          >
            {displaySubtitle}
          </div>
        </div>

        {thumbnailDataUri ? (
          <div
            style={{
              display: 'flex',
              width: '300px',
              height: '300px',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '3px solid rgba(255, 255, 255, 0.25)',
              backgroundColor: 'rgba(15, 23, 42, 0.2)',
              flexShrink: 0,
            }}
          >
            {/* biome-ignore lint/performance/noImgElement: Satori ImageResponse requires native <img> elements */}
            <img
              src={thumbnailDataUri}
              alt={displayTitle}
              width={300}
              height={300}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
        ) : null}
      </div>

      {/* Bottom Accent Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.22)',
          paddingTop: '20px',
          fontSize: '18px',
          fontWeight: 500,
          color: '#99F6E4',
        }}
      >
        <span>Asesmen Adaptif &amp; Literasi Membaca Kritis SMA/SMK</span>
        <span style={{ color: '#FDE68A', fontWeight: 700 }}>100% Gratis</span>
      </div>
    </div>,
    {
      ...OG_IMAGE_SIZE,
      fonts: [
        {
          name: 'Poppins',
          data: fontBold,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'Poppins',
          data: fontMedium,
          style: 'normal',
          weight: 500,
        },
      ],
    }
  );
}
