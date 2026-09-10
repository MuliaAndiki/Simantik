export function buildQueryString(path: string, params?: Record<string, unknown>): string {
  if (!params) return path;
  const searchParams = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '') {
      searchParams.append(key, String(val));
    }
  }
  const qs = searchParams.toString();
  return qs ? `${path}?${qs}` : path;
}
