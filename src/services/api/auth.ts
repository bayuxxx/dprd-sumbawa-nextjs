import { BASE_URL } from './config';

export interface AdminUser {
  id: string;
  username: string;
}

export async function loginAdmin(username: string, password: string): Promise<{ token: string; admin: AdminUser }> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Login gagal');
  }
  return res.json();
}

export async function verifyToken(token: string): Promise<AdminUser> {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Token tidak valid');
  return res.json();
}
