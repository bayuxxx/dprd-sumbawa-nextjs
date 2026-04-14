import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { verifyAuth, isAuthError, requirePermission } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;

  try {
    const [admins] = await db.query(
      'SELECT id, username, role, lastLoginAt, createdAt, updatedAt FROM admins ORDER BY createdAt DESC'
    );
    return NextResponse.json(admins);
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal mengambil data admin.', error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;

  try {
    const { username, password, role } = await req.json();
    if (!username || !password) return NextResponse.json({ message: 'Username dan password diperlukan.' }, { status: 400 });

    const validRoles = ['super_admin', 'admin', 'news_editor'];
    const assignedRole = validRoles.includes(role) ? role : 'news_editor';

    const [existing]: any = await db.query('SELECT id FROM admins WHERE username = ?', [username]);
    if (existing.length > 0) return NextResponse.json({ message: 'Username sudah digunakan.' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
    const now = new Date();
    await db.query(
      'INSERT INTO admins (id, username, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
      [id, username, hashedPassword, assignedRole, now, now]
    );
    return NextResponse.json({ id, username, role: assignedRole, createdAt: now, updatedAt: now }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal membuat admin.', error: error.message }, { status: 500 });
  }
}
