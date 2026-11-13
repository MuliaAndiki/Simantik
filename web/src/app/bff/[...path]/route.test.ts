import { afterEach, describe, expect, it } from 'bun:test';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

const ORIGINAL_FETCH = globalThis.fetch;
const ORIGINAL_SECRET = process.env.NEXT_INTERNAL_API_SECRET;
const ORIGINAL_BACKEND_URL = process.env.BACKEND_URL;

describe('/bff/[...path] route handler', () => {
  afterEach(() => {
    globalThis.fetch = ORIGINAL_FETCH;
    if (ORIGINAL_SECRET === undefined) {
      delete process.env.NEXT_INTERNAL_API_SECRET;
    } else {
      process.env.NEXT_INTERNAL_API_SECRET = ORIGINAL_SECRET;
    }
    if (ORIGINAL_BACKEND_URL === undefined) {
      delete process.env.BACKEND_URL;
    } else {
      process.env.BACKEND_URL = ORIGINAL_BACKEND_URL;
    }
  });

  it('forwards GET to /api/... with server-only secret headers and rewrites Set-Cookie Path', async () => {
    process.env.BACKEND_URL = 'https://api.example.test';
    process.env.NEXT_INTERNAL_API_SECRET = 'super-secret-value';

    let capturedUrl = '';
    let capturedHeaders: Headers | undefined;

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      capturedUrl = String(input);
      capturedHeaders = new Headers(init?.headers);

      const resHeaders = new Headers({ 'content-type': 'application/json' });
      resHeaders.append(
        'set-cookie',
        'refresh_token=abc123; Path=/api/v1/auth; HttpOnly; SameSite=Lax'
      );

      return new Response(JSON.stringify({ success: true, data: [] }), {
        status: 200,
        headers: resHeaders,
      });
    }) as typeof fetch;

    const req = new NextRequest('https://simantik.id/bff/v1/schools?limit=10', {
      headers: {
        authorization: 'Bearer user-jwt',
        cookie: 'refresh_token=old',
      },
    });

    const res = await GET(req, { params: Promise.resolve({ path: ['v1', 'schools'] }) });

    expect(res.status).toBe(200);
    expect(capturedUrl).toBe('https://api.example.test/api/v1/schools?limit=10');
    expect(capturedHeaders?.get('x-internal-api-key')).toBe('super-secret-value');
    expect(capturedHeaders?.get('x-api-secret')).toBe('super-secret-value');
    expect(capturedHeaders?.get('authorization')).toBe('Bearer user-jwt');
    expect(res.headers.get('set-cookie')).toContain('Path=/bff/v1/auth');
    expect(res.headers.get('set-cookie')).not.toContain('Path=/api/v1');
  });

  it('forwards POST request body and upstream 201 status', async () => {
    process.env.BACKEND_URL = 'https://api.example.test';
    process.env.NEXT_INTERNAL_API_SECRET = 'super-secret-value';

    let capturedMethod = '';
    let capturedBody = '';

    globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
      capturedMethod = init?.method ?? '';
      capturedBody = init?.body ? new TextDecoder().decode(init.body as ArrayBuffer) : '';
      return new Response(JSON.stringify({ success: true, status: 201 }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      });
    }) as typeof fetch;

    const payload = JSON.stringify({ npsn: '20219876', nama: 'SMAN 1 Uji' });
    const req = new NextRequest('https://simantik.id/bff/v1/schools/submissions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: payload,
    });

    const res = await POST(req, {
      params: Promise.resolve({ path: ['v1', 'schools', 'submissions'] }),
    });

    expect(res.status).toBe(201);
    expect(capturedMethod).toBe('POST');
    expect(capturedBody).toBe(payload);
  });

  it('rejects empty or dot-segment proxy paths with 400', async () => {
    const req = new NextRequest('https://simantik.id/bff/..');
    const res = await GET(req, { params: Promise.resolve({ path: ['..', 'etc'] }) });

    expect(res.status).toBe(400);
  });

  it('returns 502 when backend fetch throws a network error', async () => {
    process.env.BACKEND_URL = 'https://api.example.test';
    globalThis.fetch = (async () => {
      throw new Error('ECONNREFUSED');
    }) as unknown as typeof fetch;

    const req = new NextRequest('https://simantik.id/bff/v1/schools');
    const res = await GET(req, { params: Promise.resolve({ path: ['v1', 'schools'] }) });
    const json = (await res.json()) as { success: boolean; status: number };

    expect(res.status).toBe(502);
    expect(json.success).toBe(false);
    expect(json.status).toBe(502);
  });
});
