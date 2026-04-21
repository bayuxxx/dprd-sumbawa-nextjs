import { BASE_URL } from './config';

export interface AnggotaDapil {
  id: string;
  name: string;
  partai: string | null;
  imageUrl: string | null;
  order: number;
  dapilId: string | null;
  createdAt: string;
}

export interface DaerahPemilihan {
  id: string;
  nama: string;
  slug: string;
  wilayah: string | null;
  jumlahKursi: number;
  imageUrl: string | null;
  deskripsi: string | null;
  isAktif: boolean;
  order: number;
  createdAt: string;
  anggota: AnggotaDapil[];
}

export async function fetchAllDapil(): Promise<DaerahPemilihan[]> {
  const res = await fetch(`${BASE_URL}/dapil`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchDapilById(id: string): Promise<DaerahPemilihan | null> {
  const res = await fetch(`${BASE_URL}/dapil/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function createDapil(formData: FormData, token: string): Promise<DaerahPemilihan> {
  const res = await fetch(`${BASE_URL}/dapil`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal membuat dapil'); }
  return res.json();
}

export async function updateDapil(id: string, formData: FormData, token: string): Promise<DaerahPemilihan> {
  const res = await fetch(`${BASE_URL}/dapil/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal update dapil'); }
  return res.json();
}

export async function deleteDapil(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/dapil/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal hapus dapil'); }
}

export async function createAnggotaDapil(formData: FormData, token: string): Promise<AnggotaDapil> {
  const res = await fetch(`${BASE_URL}/dapil/anggota`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal tambah anggota'); }
  return res.json();
}

export async function updateAnggotaDapil(id: string, formData: FormData, token: string): Promise<AnggotaDapil> {
  const res = await fetch(`${BASE_URL}/dapil/anggota/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal update anggota'); }
  return res.json();
}

export async function deleteAnggotaDapil(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/dapil/anggota/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal hapus anggota'); }
}
