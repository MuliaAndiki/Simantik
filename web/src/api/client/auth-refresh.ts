import { baseUrl } from '@/configs/app.config';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import { getRefreshToken, setSessionCookies } from '@/utils/session-cookie';

let _refreshInFlight: Promise<boolean> | null = null;

function buildInternalApiKey(): string {
  return (
    process.env.NEXT_PUBLIC_INTERNAL_API_SECRET ||
    process.env.NEXT_INTERNAL_API_SECRET ||
    process.env.INTERNAL_API_SECRET ||
    process.env.INTERNAL_API_KEY ||
    ''
  );
}

async function refreshAccessTokenOnce(): Promise<boolean> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  try {
    const res = await fetch(`${baseUrl}${EndpointEntry.auth.refreshToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-api-key': buildInternalApiKey(),
      },
      body: JSON.stringify({ refreshToken }),
      credentials: 'same-origin',
      cache: 'no-store',
    });

    if (!res.ok) {
      return false;
    }

    const json: { data?: { accessToken?: string; expiresIn?: number } } = await res.json();

    if (!json.data?.accessToken) {
      return false;
    }

    setSessionCookies({
      accessToken: json.data.accessToken,
      expiresIn: json.data.expiresIn,
    });

    return true;
  } catch {
    return false;
  }
}

/** Tukar refresh token dengan access token baru; mengembalikan true bila berhasil. */
export function refreshAccessToken(): Promise<boolean> {
  if (_refreshInFlight) {
    return _refreshInFlight;
  }

  _refreshInFlight = refreshAccessTokenOnce().finally(() => {
    _refreshInFlight = null;
  });

  return _refreshInFlight;
}
