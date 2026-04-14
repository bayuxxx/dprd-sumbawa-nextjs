import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { verifyAuth, isAuthError, requirePermission } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;

  const { id } = await params;

  try {
    const { username, password, role } = await req.json();
    const [rows]: any = await db.query('SELECT id, username FROM admins WHERE id = ?', [id]);
    if (rows.length === 0) return NextResponse.json({ message: 'Admin tidak ditemukan.' }, { status: 404 });
    const existing = rows[0];

    if (username && username !== existing.username) {
      const [dup]: any = await db.query('SELECT id FROM admins WHERE username = ? AND id != ?', [username, id]);
      if (dup.length > 0) return NextResponse.json({ message: 'Username sudah digunakan oleh admin lain.' }, { status: 400 });
    }

    const validRoles = ['super_admin', 'news_editor'];
    const assignedRole = validRoles.includes(role) ? role : undefined;

    const now = new Date();
    if (password && password.trim() !== '') {
      const hashed = await bcrypt.hash(password, 10);
      if (assignedRole) {
        await db.query('UPDATE admins SET username = ?, password = ?, role = ?, updatedAt = ? WHERE id = ?', [username, hashed, assignedRole, now, id]);
      } else {
        await db.query('UPDATE admins SET username = ?, password = ?, updatedAt = ? WHERE id = ?', [username, hashed, now, id]);
      }
    } else {
      if (assignedRole) {
        await db.query('UPDATE admins SET username = ?, role = ?, updatedAt = ? WHERE id = ?', [username, assignedRole, now, id]);
      } else {
        await db.query('UPDATE admins SET username = ?, updatedAt = ? WHERE id = ?', [username, now, id]);
      }
    }

    const [updated]: any = await db.query('SELECT id, username, role, lastLoginAt, createdAt, updatedAt FROM admins WHERE id = ?', [id]);
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal memperbarui admin.', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;

  const { id } = await params;

  try {
    const [rows]: any = await db.query('SELECT id FROM admins WHERE id = ?', [id]);
    if (rows.length === 0) return NextResponse.json({ message: 'Admin tidak ditemukan.' }, { status: 404 });
    if (id === auth.adminId) return NextResponse.json({ message: 'Tidak dapat menghapus akun Anda sendiri saat sedang login.' }, { status: 400 });
    await db.query('DELETE FROM admins WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Admin berhasil dihapus.' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal menghapus admin.', error: error.message }, { status: 500 });
  }
}
