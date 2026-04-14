import { BASE_URL } from './config';
import type { Pimpinan } from './pimpinan';

export interface MasaJabatan {
  id: string;
  periode: string;
  tahunMulai: number;
  tahunSelesai: number;
  isAktif: boolean;
  keterangan: string | null;
  order: number;
  createdAt: string;
  pimpinan?: Pimpinan[];
}

export async function fetchMasaJabatan(): Promise<MasaJabatan[]> {
  const res = await fetch(`${BASE_URL}/masa-jabatan`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchMasaJabatanById(id: string): Promise<MasaJabatan | null> {
  const res = await fetch(`${BASE_URL}/masa-jabatan/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function createMasaJabatan(data: Partial<MasaJabatan>, token: string): Promise<MasaJabatan> {
  const res = await fetch(`${BASE_URL}/masa-jabatan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal membuat masa jabatan');
  }
  return res.json();
}

export async function updateMasaJabatan(id: string, data: Partial<MasaJabatan>, token: string): Promise<MasaJabatan> {
  const res = await fetch(`${BASE_URL}/masa-jabatan/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update masa jabatan');
  }
  return res.json();
}

export async function deleteMasaJabatan(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/masa-jabatan/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus masa jabatan');
  }
}
