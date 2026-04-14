import { BASE_URL } from './config';

export interface Podcast {
  id: string;
  judul: string;
  subjudul: string | null;
  link: string | null;
  host: string | null;
  narasumber: string | null;
  thumbnailUrl: string | null;
  audioUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PodcastListResponse {
  data: Podcast[];
  total: number;
  page: number;
}

export async function fetchPodcasts(params?: {
  limit?: number;
  page?: number;
  search?: string;
}): Promise<PodcastListResponse> {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.page) query.set('page', String(params.page));
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`${BASE_URL}/podcast?${query.toString()}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal mengambil daftar podcast');
  }
  return res.json();
}

export async function fetchPodcastById(id: string): Promise<Podcast> {
  const res = await fetch(`${BASE_URL}/podcast/${id}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Podcast tidak ditemukan');
  }
  return res.json();
}

export async function createPodcast(formData: FormData, token: string): Promise<Podcast> {
  const res = await fetch(`${BASE_URL}/podcast`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal membuat podcast');
  }
  return res.json();
}

export async function updatePodcast(id: string, formData: FormData, token: string): Promise<Podcast> {
  const res = await fetch(`${BASE_URL}/podcast/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update podcast');
  }
  return res.json();
}

export async function deletePodcast(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/podcast/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus podcast');
  }
}
