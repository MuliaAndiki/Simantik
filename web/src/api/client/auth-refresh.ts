import { baseUrl } from '@/configs/app.config';
import { EndpointEntry } from '@/configs/endpoints/EndpointEntry';
import { getRefreshToken, setSessionCookies, shouldPersistSession } from '@/utils/session-cookie';

let _refreshInFlight: Promise<boolean> | null = null;

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
      },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
      cache: 'no-store',
    });

    if (!res.ok) {
      return false;
    }

    const json: {
      data?: { accessToken?: string; refreshToken?: string | null; expiresIn?: number };
    } = await res.json();

    if (!json.data?.accessToken) {
      return false;
    }

    setSessionCookies({
      accessToken: json.data.accessToken,
      refreshToken: json.data.refreshToken ?? undefined,
      expiresIn: json.data.expiresIn,
      // Pertahankan mode sesi: refresh tidak boleh mengubah cookie sesi
      // menjadi persisten bila user tak mencentang "Ingat saya".
      persistent: shouldPersistSession(),
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
