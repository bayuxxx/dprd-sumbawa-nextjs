import { BASE_URL } from './config';

// ── Types ──

export interface BanggarInfo {
  id: string;
  masaJabatan: string;
  deskripsi: string | null;
  isAktif: boolean;
  createdAt: string;
  updatedAt: string;
  anggota: AnggotaBanggar[];
}

export interface AnggotaBanggar {
  id: string;
  name: string;
  jabatan: string;
  faction: string | null;
  imageUrl: string | null;
  order: number;
  banggarInfoId: string | null;
  createdAt: string;
}

// ── Public APIs ──

export async function fetchBanggarInfo(id?: string): Promise<BanggarInfo | null> {
  const url = id ? `${BASE_URL}/banggar/info?id=${id}` : `${BASE_URL}/banggar/info`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchAllBanggarInfo(): Promise<BanggarInfo[]> {
  const res = await fetch(`${BASE_URL}/banggar/info/all`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAnggotaBanggar(params?: { banggarInfoId?: string }): Promise<AnggotaBanggar[]> {
  const query = new URLSearchParams();
  if (params?.banggarInfoId) query.set('banggarInfoId', params.banggarInfoId);
  const queryStr = query.toString();
  const res = await fetch(`${BASE_URL}/banggar/anggota${queryStr ? `?${queryStr}` : ''}`);
  if (!res.ok) return [];
  return res.json();
}

// ── Admin APIs: BanggarInfo ──

export async function createBanggarInfoApi(data: { masaJabatan: string; deskripsi?: string; isAktif?: boolean }, token: string): Promise<BanggarInfo> {
  const res = await fetch(`${BASE_URL}/banggar/info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal membuat banggar info');
  }
  return res.json();
}

export async function updateBanggarInfoApi(id: string, data: { masaJabatan?: string; deskripsi?: string; isAktif?: boolean }, token: string): Promise<BanggarInfo> {
  const res = await fetch(`${BASE_URL}/banggar/info/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update banggar info');
  }
  return res.json();
}

export async function deleteBanggarInfoApi(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/banggar/info/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus banggar info');
  }
}

// ── Admin APIs: AnggotaBanggar ──

export async function createAnggotaBanggar(formData: FormData, token: string): Promise<AnggotaBanggar> {
  const res = await fetch(`${BASE_URL}/banggar/anggota`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal membuat anggota banggar');
  }
  return res.json();
}

export async function updateAnggotaBanggar(id: string, formData: FormData, token: string): Promise<AnggotaBanggar> {
  const res = await fetch(`${BASE_URL}/banggar/anggota/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update anggota banggar');
  }
  return res.json();
}

export async function deleteAnggotaBanggar(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/banggar/anggota/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus anggota banggar');
  }
}
