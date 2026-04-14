import { BASE_URL } from './config';

// ── Types ──

export interface BamusInfo {
  id: string;
  masaJabatan: string;
  deskripsi: string | null;
  isAktif: boolean;
  createdAt: string;
  updatedAt: string;
  anggota: AnggotaBamus[];
}

export interface AnggotaBamus {
  id: string;
  name: string;
  jabatan: string; // "Ketua" | "Wakil Ketua" | "Anggota" | "Sekretaris"
  faction: string | null;
  imageUrl: string | null;
  order: number;
  bamusInfoId: string | null;
  createdAt: string;
}

// ── Public APIs ──

export async function fetchBamusInfo(id?: string): Promise<BamusInfo | null> {
  const url = id ? `${BASE_URL}/bamus/info?id=${id}` : `${BASE_URL}/bamus/info`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchAllBamusInfo(): Promise<BamusInfo[]> {
  const res = await fetch(`${BASE_URL}/bamus/info/all`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAnggotaBamus(params?: { bamusInfoId?: string }): Promise<AnggotaBamus[]> {
  const query = new URLSearchParams();
  if (params?.bamusInfoId) query.set('bamusInfoId', params.bamusInfoId);
  const queryStr = query.toString();
  const res = await fetch(`${BASE_URL}/bamus/anggota${queryStr ? `?${queryStr}` : ''}`);
  if (!res.ok) return [];
  return res.json();
}

// ── Admin APIs: BamusInfo ──

export async function createBamusInfoApi(data: { masaJabatan: string; deskripsi?: string; isAktif?: boolean }, token: string): Promise<BamusInfo> {
  const res = await fetch(`${BASE_URL}/bamus/info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal membuat bamus info');
  }
  return res.json();
}

export async function updateBamusInfoApi(id: string, data: { masaJabatan?: string; deskripsi?: string; isAktif?: boolean }, token: string): Promise<BamusInfo> {
  const res = await fetch(`${BASE_URL}/bamus/info/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update bamus info');
  }
  return res.json();
}

export async function deleteBamusInfoApi(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/bamus/info/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus bamus info');
  }
}

// ── Admin APIs: AnggotaBamus ──

export async function createAnggotaBamus(formData: FormData, token: string): Promise<AnggotaBamus> {
  const res = await fetch(`${BASE_URL}/bamus/anggota`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal membuat anggota bamus');
  }
  return res.json();
}

export async function updateAnggotaBamus(id: string, formData: FormData, token: string): Promise<AnggotaBamus> {
  const res = await fetch(`${BASE_URL}/bamus/anggota/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update anggota bamus');
  }
  return res.json();
}

export async function deleteAnggotaBamus(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/bamus/anggota/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus anggota bamus');
  }
}
