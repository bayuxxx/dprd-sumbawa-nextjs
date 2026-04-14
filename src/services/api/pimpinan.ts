import { BASE_URL } from './config';

export interface Pimpinan {
  id: string;
  name: string;
  position: string;
  faction: string | null;
  period: string;
  masaJabatanId: string | null;
  isPast: boolean;
  imageUrl: string | null;
  bio: string | null;
  order: number;
  createdAt: string;
  masaJabatan?: {
    id: string;
    periode: string;
    tahunMulai: number;
    tahunSelesai: number;
    isAktif: boolean;
  } | null;
}

export async function fetchPimpinan(params?: { isPast?: boolean; masaJabatanId?: string }): Promise<Pimpinan[]> {
  const query = new URLSearchParams();
  if (params?.isPast !== undefined) query.set('isPast', String(params.isPast));
  if (params?.masaJabatanId) query.set('masaJabatanId', params.masaJabatanId);
  const queryStr = query.toString();
  const res = await fetch(`${BASE_URL}/pimpinan${queryStr ? `?${queryStr}` : ''}`);
  if (!res.ok) return [];
  return res.json();
}

export async function createPimpinan(formData: FormData, token: string): Promise<Pimpinan> {
  const res = await fetch(`${BASE_URL}/pimpinan`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal membuat data pimpinan');
  }
  return res.json();
}

export async function updatePimpinan(id: string, formData: FormData, token: string): Promise<Pimpinan> {
  const res = await fetch(`${BASE_URL}/pimpinan/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update pimpinan');
  }
  return res.json();
}

export async function deletePimpinan(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/pimpinan/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus pimpinan');
  }
}
