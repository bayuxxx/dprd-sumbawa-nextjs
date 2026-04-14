import { BASE_URL } from './config';

// ── Types ──

export interface KomisiInfo {
  id: string;
  namaKomisi: string;
  masaJabatan: string;
  deskripsi: string | null;
  isAktif: boolean;
  createdAt: string;
  updatedAt: string;
  anggota: AnggotaKomisi[];
}

export interface AnggotaKomisi {
  id: string;
  name: string;
  jabatan: string;
  faction: string | null;
  imageUrl: string | null;
  order: number;
  komisiInfoId: string | null;
  createdAt: string;
}

// ── Public APIs ──

export async function fetchKomisiInfo(id?: string): Promise<KomisiInfo | null> {
  const url = id ? `${BASE_URL}/komisi/info?id=${id}` : `${BASE_URL}/komisi/info`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchAllKomisiInfo(): Promise<KomisiInfo[]> {
  const res = await fetch(`${BASE_URL}/komisi/info/all`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAnggotaKomisi(params?: { komisiInfoId?: string }): Promise<AnggotaKomisi[]> {
  const query = new URLSearchParams();
  if (params?.komisiInfoId) query.set('komisiInfoId', params.komisiInfoId);
  const queryStr = query.toString();
  const res = await fetch(`${BASE_URL}/komisi/anggota${queryStr ? `?${queryStr}` : ''}`);
  if (!res.ok) return [];
  return res.json();
}

// ── Admin APIs: KomisiInfo ──

export async function createKomisiInfoApi(data: { namaKomisi: string; masaJabatan: string; deskripsi?: string; isAktif?: boolean }, token: string): Promise<KomisiInfo> {
  const res = await fetch(`${BASE_URL}/komisi/info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal membuat komisi info');
  }
  return res.json();
}

export async function updateKomisiInfoApi(id: string, data: { namaKomisi?: string; masaJabatan?: string; deskripsi?: string; isAktif?: boolean }, token: string): Promise<KomisiInfo> {
  const res = await fetch(`${BASE_URL}/komisi/info/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update komisi info');
  }
  return res.json();
}

export async function deleteKomisiInfoApi(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/komisi/info/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus komisi info');
  }
}

// ── Admin APIs: AnggotaKomisi ──

export async function createAnggotaKomisi(formData: FormData, token: string): Promise<AnggotaKomisi> {
  const res = await fetch(`${BASE_URL}/komisi/anggota`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal membuat anggota komisi');
  }
  return res.json();
}

export async function updateAnggotaKomisi(id: string, formData: FormData, token: string): Promise<AnggotaKomisi> {
  const res = await fetch(`${BASE_URL}/komisi/anggota/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update anggota komisi');
  }
  return res.json();
}

export async function deleteAnggotaKomisi(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/komisi/anggota/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus anggota komisi');
  }
}
