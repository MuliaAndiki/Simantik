import type { ApiResponse, TResponse } from '@/api/types/response.types';
import { ResponseTitles } from '@/utils/response-titles';

/**
 * Memetakan envelope mentah backend ({ success, status, title, message, data, meta, error })
 * menjadi `TResponse` standar frontend
 * ({ statusCode, code, status, title, message, data, meta, errors }).
 *
 * `status: 'success' | 'error'` dipakai `WrapApi` (fe/src/utils/wrapApi.ts)
 * untuk melempar Error ketika respons backend bukan sukses.
 */

export interface ToServiceResponseOptions {
  title?: string;
  message?: string;
  statusCode?: number;
}

export function toServiceResponse<T>(
  res: ApiResponse<T>,
  options?: ToServiceResponseOptions
): TResponse<T> {
  const isSuccess =
    res?.success !== undefined
      ? res.success === true
      : typeof res?.status === 'number'
        ? res.status >= 200 && res.status < 300
        : true;

  // Extract title from response or fallback to ResponseTitles
  let title = '';
  if (typeof res?.title === 'string' && res.title.trim() !== '') {
    title = res.title;
  } else if (options?.title && options.title.trim() !== '') {
    title = options.title;
  } else if (isSuccess) {
    title = ResponseTitles.success;
  } else {
    title = ResponseTitles.error;
  }

  // Message selalu diutamakan dari respons backend (res.message, res.error, res.summary)
  // Fallback hanya bila backend tidak mengirimkan pesan.
  let message = '';
  if (typeof res?.message === 'string' && res.message.trim() !== '') {
    message = res.message;
  } else if (
    !isSuccess &&
    typeof (res as any)?.error === 'string' &&
    (res as any).error.trim() !== ''
  ) {
    message = (res as any).error;
  } else if (
    !isSuccess &&
    typeof (res as any)?.summary === 'string' &&
    (res as any).summary.trim() !== ''
  ) {
    message = (res as any).summary;
  } else if (options?.message && options.message.trim() !== '') {
    message = options.message;
  } else if (isSuccess) {
    message = 'Operasi berhasil diproses.';
  } else {
    message = 'Terjadi kesalahan saat memproses permintaan.';
  }

  const statusCode =
    typeof res?.status === 'number' && res.status > 0
      ? res.status
      : (options?.statusCode ?? (isSuccess ? 200 : 400));

  return {
    statusCode,
    code: statusCode,
    status: isSuccess ? 'success' : 'error',
    title,
    message,
    data: res?.data ?? null,
    meta: res?.meta ?? null,
    errors: null,
  };
}
