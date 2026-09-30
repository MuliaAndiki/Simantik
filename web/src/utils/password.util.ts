/** Validasi form ganti kata sandi. Kembalikan pesan error atau null bila valid. */
export function validateChangePassword(form: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): string | null {
  if (!form.currentPassword) {
    return 'Password saat ini harus diisi.';
  }
  if (form.newPassword.length < 8) {
    return 'Password baru minimal harus 8 karakter.';
  }
  if (!(/[a-zA-Z]/.test(form.newPassword) && /\d/.test(form.newPassword))) {
    return 'Password baru harus mengandung kombinasi huruf dan angka.';
  }
  if (form.newPassword !== form.confirmPassword) {
    return 'Konfirmasi password tidak cocok dengan password baru.';
  }
  return null;
}

export const EMPTY_PASSWORD_FORM = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};
