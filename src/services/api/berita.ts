import { BASE_URL } from './config';

export interface Berita {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  imageUrl: string | null;
  category: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
}

export interface BeritaListResponse {
  data: Berita[];
  total: number;
  page: number;
}

export async function fetchBerita(params?: {
  limit?: number;
  page?: number;
  category?: string;
  isPublished?: boolean;
  search?: string;
}): Promise<BeritaListResponse> {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.page) query.set('page', String(params.page));
  if (params?.category) query.set('category', params.category);
  if (params?.isPublished !== undefined) query.set('isPublished', String(params.isPublished));
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`${BASE_URL}/berita?${query.toString()}`);
  if (!res.ok) return { data: [], total: 0, page: 1 };
  return res.json();
}

export async function fetchBeritaDetail(idOrSlug: string): Promise<Berita> {
  const res = await fetch(`${BASE_URL}/berita/${idOrSlug}`);
  if (!res.ok) throw new Error('Berita tidak ditemukan');
  return res.json();
}

export async function createBerita(formData: FormData, token: string): Promise<Berita> {
  const res = await fetch(`${BASE_URL}/berita`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal membuat berita');
  }
  return res.json();
}

export async function updateBerita(id: string, formData: FormData, token: string): Promise<Berita> {
  const res = await fetch(`${BASE_URL}/berita/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update berita');
  }
  return res.json();
}

export async function deleteBerita(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/berita/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus berita');
  }
}
