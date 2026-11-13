import { type NextRequest, NextResponse } from 'next/server';
import { getServerBackendOrigin } from '@/configs/app.config';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const FORWARDED_REQUEST_HEADERS = [
  'accept',
  'accept-language',
  'authorization',
  'content-type',
  'cookie',
  'user-agent',
  'x-forwarded-for',
  'x-real-ip',
] as const;

const FORWARDED_RESPONSE_HEADERS = [
  'content-type',
  'content-disposition',
  'cache-control',
  'etag',
  'last-modified',
] as const;

function getServerInternalApiSecret(): string {
  return (
    process.env.NEXT_INTERNAL_API_SECRET ||
    process.env.INTERNAL_API_SECRET ||
    process.env.INTERNAL_API_KEY ||
    ''
  );
}

function buildUpstreamUrl(request: NextRequest, pathSegments: string[]): string | null {
  if (!pathSegments.length || pathSegments.some((seg) => !seg || seg === '..' || seg === '.')) {
    return null;
  }

  const normalizedPath = pathSegments.map((seg) => encodeURIComponent(seg)).join('/');
  const origin = getServerBackendOrigin();
  return `${origin}/api/${normalizedPath}${request.nextUrl.search}`;
}

function buildUpstreamHeaders(request: NextRequest): Headers {
  const headers = new Headers();

  for (const name of FORWARDED_REQUEST_HEADERS) {
    const val = request.headers.get(name);
    if (val) {
      headers.set(name, val);
    }
  }

  const secret = getServerInternalApiSecret();
  if (secret) {
    headers.set('x-internal-api-key', secret);
    headers.set('x-api-secret', secret);
  }

  return headers;
}

function rewriteCookiePath(cookieHeader: string): string {
  return cookieHeader.replace(/;\s*Path=\/api\/v1\b/gi, '; Path=/bff/v1');
}

function buildResponseHeaders(upstreamHeaders: Headers): Headers {
  const resHeaders = new Headers();

  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const val = upstreamHeaders.get(name);
    if (val) {
      resHeaders.set(name, val);
    }
  }

  const setCookies =
    typeof upstreamHeaders.getSetCookie === 'function'
      ? upstreamHeaders.getSetCookie()
      : upstreamHeaders.get('set-cookie')
        ? [upstreamHeaders.get('set-cookie') as string]
        : [];

  for (const cookie of setCookies) {
    resHeaders.append('set-cookie', rewriteCookiePath(cookie));
  }

  return resHeaders;
}

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxyRequest(request: NextRequest, context: RouteContext): Promise<Response> {
  const { path } = await context.params;
  const upstreamUrl = buildUpstreamUrl(request, path ?? []);

  if (!upstreamUrl) {
    return NextResponse.json(
      { success: false, status: 400, message: 'Invalid API proxy path' },
      { status: 400 }
    );
  }

  const method = request.method.toUpperCase();
  const hasBody = method !== 'GET' && method !== 'HEAD';
  let bodyBuffer: ArrayBuffer | undefined;

  if (hasBody) {
    const raw = await request.arrayBuffer();
    if (raw.byteLength > 0) {
      bodyBuffer = raw;
    }
  }

  try {
    const upstreamRes = await fetch(upstreamUrl, {
      method,
      headers: buildUpstreamHeaders(request),
      body: bodyBuffer,
      redirect: 'manual',
      cache: 'no-store',
    });

    const headers = buildResponseHeaders(upstreamRes.headers);
    return new Response(method === 'HEAD' ? null : upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        status: 502,
        message: 'Gagal terhubung ke server backend SIMANTIK.',
      },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function HEAD(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}
