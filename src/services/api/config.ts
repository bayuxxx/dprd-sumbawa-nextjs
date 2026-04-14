export const BASE_URL = '/api';

/**
 * Mengubah path gambar relatif dari backend (e.g. "/uploads/banners/foto.jpg")
 * menjadi URL lengkap yang bisa diakses oleh browser.
 */
export function getImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (/^(https?:\/\/|data:|blob:)/i.test(url)) return url;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  return `${backendUrl}${url}`;
}
