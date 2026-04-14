import { BASE_URL } from './config';
import type { AdminUser } from './auth';

export async function fetchAdmins(token: string): Promise<AdminUser[]> {
  const res = await fetch(`${BASE_URL}/admins`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function createAdmin(data: { username: string; password?: string }, token: string): Promise<AdminUser> {
  const res = await fetch(`${BASE_URL}/admins`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal membuat admin');
  }
  return res.json();
}

export async function updateAdmin(id: string, data: { username: string; password?: string }, token: string): Promise<AdminUser> {
  const res = await fetch(`${BASE_URL}/admins/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal update admin');
  }
  return res.json();
}

export async function deleteAdmin(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admins/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal hapus admin');
  }
}
