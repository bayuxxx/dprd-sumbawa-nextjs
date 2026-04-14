import { BASE_URL } from './config';

// ── Types ──

export interface BapemperdaInfo {
  id: string;
  masaJabatan: string;
  deskripsi: string | null;
  isAktif: boolean;
  createdAt: string;
  updatedAt: string;
  anggota: AnggotaBapemperda[];
}

export interface AnggotaBapemperda {
  id: string;
  name: string;
  jabatan: string;
  faction: string | null;
  imageUrl: string | null;
  order: number;
  bapemperdaInfoId: string | null;
  createdAt: string;
}

// ── Public APIs ──

export async function fetchBapemperdaInfo(id?: string): Promise<BapemperdaInfo | null> {
  const url = id ? `${BASE_URL}/bapemperda/info?id=${id}` : `${BASE_URL}/bapemperda/info`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchAllBapemperdaInfo(): Promise<BapemperdaInfo[]> {
  const res = await fetch(`${BASE_URL}/bapemperda/info/all`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAnggotaBapemperda(params?: { bapemperdaInfoId?: string }): Promise<AnggotaBapemperda[]> {
  const query = new URLSearchParams();
  if (params?.bapemperdaInfoId) query.set('bapemperdaInfoId', params.bapemperdaInfoId);
  const queryStr = query.toString();
  const res = await fetch(`${BASE_URL}/bapemperda/anggota${queryStr ? `?${queryStr}` : ''}`);
  if (!res.ok) return [];
  return res.json();
}

// ── Admin APIs: BapemperdaInfo ──

export async function createBapemperdaInfoApi(data: { masaJabatan: string; deskripsi?: string; isAktif?: boolean }, token: string): Promise<BapemperdaInfo> {
  const res = await fetch(`${BASE_URL}/bapemperda/info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal membuat bapemperda info');
  }
  return res.json();
}

export async function updateBapemperdaInfoApi(id: string, data: { masaJabatan?: string; deskripsi?: string; isAktif?: boolean }, token: string): Promise<BapemperdaInfo> {
  const res = await fetch(`${BASE_URL}/bapemperda/info/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update bapemperda info');
  }
  return res.json();
}

export async function deleteBapemperdaInfoApi(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/bapemperda/info/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus bapemperda info');
  }
}

// ── Admin APIs: AnggotaBapemperda ──

export async function createAnggotaBapemperda(formData: FormData, token: string): Promise<AnggotaBapemperda> {
  const res = await fetch(`${BASE_URL}/bapemperda/anggota`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal membuat anggota bapemperda');
  }
  return res.json();
}

export async function updateAnggotaBapemperda(id: string, formData: FormData, token: string): Promise<AnggotaBapemperda> {
  const res = await fetch(`${BASE_URL}/bapemperda/anggota/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update anggota bapemperda');
  }
  return res.json();
}

export async function deleteAnggotaBapemperda(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/bapemperda/anggota/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus anggota bapemperda');
  }
}
