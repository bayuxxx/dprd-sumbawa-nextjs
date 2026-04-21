import { BASE_URL } from './config';
import type { MasaJabatan } from './masaJabatan';

export interface AnggotaFraksi {
  id: string;
  name: string;
  jabatan: string;
  faction: string | null;
  imageUrl: string | null;
  order: number;
  fraksiInfoId: string | null;
  createdAt: string;
}

export interface FraksiInfo {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  color: string;
  kursi: number;
  masaJabatanId: string | null;
  masaJabatan: MasaJabatan | null;
  deskripsi: string | null;
  logoUrl: string | null;
  isAktif: boolean;
  order: number;
  createdAt: string;
  anggota: AnggotaFraksi[];
}

// ── FraksiInfo ──

export async function fetchAllFraksiInfo(): Promise<FraksiInfo[]> {
  const res = await fetch(`${BASE_URL}/fraksi`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchFraksiBySlug(slug: string): Promise<FraksiInfo | null> {
  const res = await fetch(`${BASE_URL}/fraksi/slug/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export async function createFraksiInfo(formData: FormData, token: string): Promise<FraksiInfo> {
  const res = await fetch(`${BASE_URL}/fraksi`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal membuat fraksi');
  }
  return res.json();
}

export async function updateFraksiInfo(id: string, formData: FormData, token: string): Promise<FraksiInfo> {
  const res = await fetch(`${BASE_URL}/fraksi/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update fraksi');
  }
  return res.json();
}

export async function deleteFraksiInfo(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/fraksi/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus fraksi');
  }
}

// ── AnggotaFraksi ──

export async function createAnggotaFraksi(formData: FormData, token: string): Promise<AnggotaFraksi> {
  const res = await fetch(`${BASE_URL}/fraksi/anggota`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal menambah anggota fraksi');
  }
  return res.json();
}

export async function updateAnggotaFraksi(id: string, formData: FormData, token: string): Promise<AnggotaFraksi> {
  const res = await fetch(`${BASE_URL}/fraksi/anggota/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update anggota fraksi');
  }
  return res.json();
}

export async function deleteAnggotaFraksi(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/fraksi/anggota/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus anggota fraksi');
  }
}

// ── MasaJabatan Fraksi (terpisah dari MasaJabatan Pimpinan/AKD) ──

export interface MasaJabatanFraksi {
  id: string;
  periode: string;
  tahunMulai: number;
  tahunSelesai: number;
  isAktif: boolean;
  keterangan: string | null;
  order: number;
}

export async function fetchMasaJabatanFraksi(): Promise<MasaJabatanFraksi[]> {
  const res = await fetch(`${BASE_URL}/masa-jabatan-fraksi`);
  if (!res.ok) return [];
  return res.json();
}

export async function createMasaJabatanFraksi(data: Partial<MasaJabatanFraksi>, token: string): Promise<MasaJabatanFraksi> {
  const res = await fetch(`${BASE_URL}/masa-jabatan-fraksi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal membuat'); }
  return res.json();
}

export async function updateMasaJabatanFraksi(id: string, data: Partial<MasaJabatanFraksi>, token: string): Promise<MasaJabatanFraksi> {
  const res = await fetch(`${BASE_URL}/masa-jabatan-fraksi/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal update'); }
  return res.json();
}

export async function deleteMasaJabatanFraksi(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/masa-jabatan-fraksi/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal hapus'); }
}
