import { BASE_URL } from './config';

export interface RancanganPerda {
  id: string;
  judul: string;
  status: 'Selesai Pembahasan' | 'Proses Pembahasan' | 'Belum Pembahasan';
  keterangan: string | null;
  order: number;
  propemperdaId: string;
  createdAt: string;
}

export interface Propemperda {
  id: string;
  tahun: string;
  keterangan: string | null;
  isAktif: boolean;
  raperda: RancanganPerda[];
  createdAt: string;
}

export async function fetchPropemperdaList(): Promise<Propemperda[]> {
  const res = await fetch(`${BASE_URL}/propemperda`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchPropemperdaByTahun(tahun: string): Promise<Propemperda | null> {
  const res = await fetch(`${BASE_URL}/propemperda/${tahun}`);
  if (!res.ok) return null;
  return res.json();
}

// ─── Admin ───

export async function createPropemperda(data: { tahun: string; keterangan?: string }, token: string): Promise<Propemperda> {
  const res = await fetch(`${BASE_URL}/propemperda`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal membuat propemperda'); }
  return res.json();
}

export async function updatePropemperda(id: string, data: Partial<{ tahun: string; keterangan: string; isAktif: boolean }>, token: string): Promise<Propemperda> {
  const res = await fetch(`${BASE_URL}/propemperda/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal update propemperda'); }
  return res.json();
}

export async function deletePropemperda(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/propemperda/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal hapus propemperda'); }
}

export async function createRaperda(data: { propemperdaId: string; judul: string; status: string; keterangan?: string; order?: number }, token: string): Promise<RancanganPerda> {
  const res = await fetch(`${BASE_URL}/propemperda/raperda/item`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal membuat raperda'); }
  return res.json();
}

export async function updateRaperda(id: string, data: Partial<{ judul: string; status: string; keterangan: string; order: number }>, token: string): Promise<RancanganPerda> {
  const res = await fetch(`${BASE_URL}/propemperda/raperda/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal update raperda'); }
  return res.json();
}

export async function deleteRaperda(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/propemperda/raperda/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal hapus raperda'); }
}

// ─── Raperda Luar Propemperda ───

export interface RaperdaLuar {
  id: string;
  judul: string;
  status: 'Selesai Pembahasan' | 'Proses Pembahasan' | 'Belum Pembahasan';
  keterangan: string | null;
  tahun: string;
  order: number;
}

export async function fetchRaperdaLuar(tahun?: string): Promise<RaperdaLuar[]> {
  const url = tahun ? `${BASE_URL}/raperda-luar?tahun=${tahun}` : `${BASE_URL}/raperda-luar`;
  const res = await fetch(url);
  if (!res.ok) return [];
  return res.json();
}

export async function createRaperdaLuar(data: { judul: string; status: string; keterangan?: string; tahun: string; order?: number }, token: string): Promise<RaperdaLuar> {
  const res = await fetch(`${BASE_URL}/raperda-luar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal membuat'); }
  return res.json();
}

export async function updateRaperdaLuar(id: string, data: Partial<RaperdaLuar>, token: string): Promise<RaperdaLuar> {
  const res = await fetch(`${BASE_URL}/raperda-luar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal update'); }
  return res.json();
}

export async function deleteRaperdaLuar(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/raperda-luar/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Gagal hapus'); }
}
