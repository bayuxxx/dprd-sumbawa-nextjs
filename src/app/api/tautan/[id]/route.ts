import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError, requirePermission } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM tautans WHERE id = ?', [id]);
  if (!rows.length) return NextResponse.json({ message: 'Tidak ditemukan.' }, { status: 404 });

  const { title, url, isActive, order } = await req.json();
  await db.query(
    'UPDATE tautans SET title=?, url=?, isActive=?, `order`=?, updatedAt=? WHERE id=?',
    [title || rows[0].title, url || rows[0].url, isActive !== false ? 1 : 0, order ?? rows[0].order, new Date(), id]
  );
  const [updated]: any = await db.query('SELECT * FROM tautans WHERE id = ?', [id]);
  return NextResponse.json(updated[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;
  const { id } = await params;

  await db.query('DELETE FROM tautans WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Berhasil dihapus.' });
}
