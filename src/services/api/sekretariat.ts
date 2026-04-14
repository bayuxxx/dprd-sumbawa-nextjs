import { BASE_URL } from './config';

export interface SekretariatInfo {
  id: string;
  visi: string | null;
  misi: string | null;
  tugas: string | null;
  fungsi: string | null; // JSON-stringified array
}

export interface AnggotaSekretariat {
  id: string;
  name: string;
  position: string;
  unit: string | null;
  imageUrl: string | null;
  isSekretaris: boolean;
  order: number;
  createdAt: string;
}

// ─── Sekretariat Info ───

export async function fetchSekretariatInfo(): Promise<SekretariatInfo | null> {
  const res = await fetch(`${BASE_URL}/sekretariat/info`);
  if (!res.ok) return null;
  return res.json();
}

export async function upsertSekretariatInfo(
  data: { visi?: string; misi?: string; tugas?: string; fungsi?: string },
  token: string
): Promise<SekretariatInfo> {
  const res = await fetch(`${BASE_URL}/sekretariat/info`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal menyimpan info sekretariat');
  }
  return res.json();
}

// ─── Anggota Sekretariat ───

export async function fetchAnggotaSekretariat(): Promise<AnggotaSekretariat[]> {
  const res = await fetch(`${BASE_URL}/sekretariat/anggota`);
  if (!res.ok) return [];
  return res.json();
}

export async function createAnggotaSekretariat(data: FormData, token: string): Promise<AnggotaSekretariat> {
  const res = await fetch(`${BASE_URL}/sekretariat/anggota`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal menambah anggota');
  }
  return res.json();
}

export async function updateAnggotaSekretariat(id: string, data: FormData, token: string): Promise<AnggotaSekretariat> {
  const res = await fetch(`${BASE_URL}/sekretariat/anggota/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update anggota');
  }
  return res.json();
}

export async function deleteAnggotaSekretariat(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/sekretariat/anggota/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus anggota');
  }
}
