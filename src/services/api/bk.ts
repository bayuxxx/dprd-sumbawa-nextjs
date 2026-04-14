import { BASE_URL } from './config';

// ── Types ──

export interface BKInfo {
  id: string;
  masaJabatan: string;
  deskripsi: string | null;
  isAktif: boolean;
  createdAt: string;
  updatedAt: string;
  anggota: AnggotaBK[];
}

export interface AnggotaBK {
  id: string;
  name: string;
  jabatan: string;
  faction: string | null;
  imageUrl: string | null;
  order: number;
  bkInfoId: string | null;
  createdAt: string;
}

// ── Public APIs ──

export async function fetchBKInfo(id?: string): Promise<BKInfo | null> {
  const url = id ? `${BASE_URL}/bk/info?id=${id}` : `${BASE_URL}/bk/info`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchAllBKInfo(): Promise<BKInfo[]> {
  const res = await fetch(`${BASE_URL}/bk/info/all`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAnggotaBK(params?: { bkInfoId?: string }): Promise<AnggotaBK[]> {
  const query = new URLSearchParams();
  if (params?.bkInfoId) query.set('bkInfoId', params.bkInfoId);
  const queryStr = query.toString();
  const res = await fetch(`${BASE_URL}/bk/anggota${queryStr ? `?${queryStr}` : ''}`);
  if (!res.ok) return [];
  return res.json();
}

// ── Admin APIs: BKInfo ──

export async function createBKInfoApi(data: { masaJabatan: string; deskripsi?: string; isAktif?: boolean }, token: string): Promise<BKInfo> {
  const res = await fetch(`${BASE_URL}/bk/info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal membuat bk info');
  }
  return res.json();
}

export async function updateBKInfoApi(id: string, data: { masaJabatan?: string; deskripsi?: string; isAktif?: boolean }, token: string): Promise<BKInfo> {
  const res = await fetch(`${BASE_URL}/bk/info/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update bk info');
  }
  return res.json();
}

export async function deleteBKInfoApi(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/bk/info/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus bk info');
  }
}

// ── Admin APIs: AnggotaBK ──

export async function createAnggotaBK(formData: FormData, token: string): Promise<AnggotaBK> {
  const res = await fetch(`${BASE_URL}/bk/anggota`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal membuat anggota bk');
  }
  return res.json();
}

export async function updateAnggotaBK(id: string, formData: FormData, token: string): Promise<AnggotaBK> {
  const res = await fetch(`${BASE_URL}/bk/anggota/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update anggota bk');
  }
  return res.json();
}

export async function deleteAnggotaBK(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/bk/anggota/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus anggota bk');
  }
}
