import { BASE_URL } from './config';

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  category: string;
  imageUrl: string;
  linkUrl: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export async function fetchBanners(isActive?: boolean): Promise<Banner[]> {
  const query = isActive !== undefined ? `?isActive=${isActive}` : '';
  const res = await fetch(`${BASE_URL}/banners${query}`);
  if (!res.ok) return [];
  return res.json();
}

export async function createBanner(formData: FormData, token: string): Promise<Banner> {
  const res = await fetch(`${BASE_URL}/banners`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal membuat banner');
  }
  return res.json();
}

export async function updateBanner(id: string, formData: FormData, token: string): Promise<Banner> {
  const res = await fetch(`${BASE_URL}/banners/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update banner');
  }
  return res.json();
}

export async function deleteBanner(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/banners/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus banner');
  }
}
