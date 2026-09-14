import { describe, expect, it } from 'bun:test';
import { toServiceResponse } from './service.respone';

describe('toServiceResponse envelope compatibility', () => {
  it('identifies success when status is missing but success=true (backend envelope)', () => {
    // Envelope backend nyata dari simantikApi/pkg/utils/response.go:
    // { "success": true, "message": "login successful", "data": { ... }, "error": null }
    const backendResponse: any = {
      success: true,
      message: 'login successful',
      data: { user: { id: '123' }, accessToken: 'jwt-token' },
      error: null,
    };

    const res = toServiceResponse(backendResponse);

    expect(res.status).toBe('success');
    expect(res.message).toBe('login successful');
    expect(res.title).toBe('Berhasil');
    expect(res.data).toEqual(backendResponse.data);
  });

  it('keeps backend error message on failure', () => {
    const backendResponse: any = {
      success: false,
      message: 'invalid email or password',
      data: null,
      error: 'unauthorized',
    };

    const res = toServiceResponse(backendResponse, {
      message: 'default fallback',
    });

    expect(res.status).toBe('error');
    expect(res.message).toBe('invalid email or password');
    expect(res.title).toBe('Terjadi Kesalahan');
  });

  it('preserves custom title and fallback message when BE does not provide one', () => {
    const backendResponse: any = {
      success: true,
      data: { id: 1 },
    };

    const res = toServiceResponse(backendResponse, {
      title: 'Kustom Title',
      message: 'Pesan Kustom',
    });

    expect(res.status).toBe('success');
    expect(res.title).toBe('Kustom Title');
    expect(res.message).toBe('Pesan Kustom');
  });
});
