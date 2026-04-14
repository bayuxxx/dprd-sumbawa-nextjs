import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export type AdminRole = 'super_admin' | 'admin' | 'news_editor';

export interface AuthPayload {
  adminId: string;
  role: AdminRole;
}

// Permissions per role
export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: ['*'], // semua akses
  admin: [
    'berita:read', 'berita:write', 'berita:review',
    'komentar:read', 'komentar:moderate',
    'banner:read', 'banner:write',
    'dashboard:read',
  ],
  news_editor: [
    'berita:read', 'berita:write',
    'dashboard:read',
  ],
};

export function verifyAuth(req: NextRequest): AuthPayload | NextResponse {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Token tidak ditemukan. Silakan login.' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(
      authHeader.split(' ')[1],
      process.env.JWT_SECRET!
    ) as AuthPayload;
    return { adminId: decoded.adminId, role: decoded.role ?? 'news_editor' };
  } catch {
    return NextResponse.json({ message: 'Token tidak valid atau sudah kadaluarsa.' }, { status: 401 });
  }
}

export function isAuthError(result: AuthPayload | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}

export function hasPermission(auth: AuthPayload, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[auth.role] ?? [];
  return perms.includes('*') || perms.includes(permission);
}

export function requirePermission(auth: AuthPayload, permission: string): NextResponse | null {
  if (!hasPermission(auth, permission)) {
    return NextResponse.json(
      { message: `Akses ditolak. Role "${auth.role}" tidak memiliki izin untuk tindakan ini.` },
      { status: 403 }
    );
  }
  return null;
}

/** Shorthand: hanya super_admin */
export function requireSuperAdmin(auth: AuthPayload): NextResponse | null {
  return requirePermission(auth, 'super_admin_only');
}
