import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError, requirePermission } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM agendas WHERE id = ?', [id]);
  if (!rows.length) return NextResponse.json({ message: 'Tidak ditemukan.' }, { status: 404 });
  const e = rows[0];

  const { title, tanggal, waktu, lokasi, category, color, isActive } = await req.json();
  await db.query(
    'UPDATE agendas SET title=?, tanggal=?, waktu=?, lokasi=?, category=?, color=?, isActive=?, updatedAt=? WHERE id=?',
    [title ?? e.title, tanggal ? new Date(tanggal) : e.tanggal, waktu ?? e.waktu, lokasi ?? e.lokasi, category ?? e.category, color ?? e.color, isActive !== undefined ? (isActive ? 1 : 0) : e.isActive, new Date(), id]
  );
  const [updated]: any = await db.query('SELECT * FROM agendas WHERE id = ?', [id]);
  return NextResponse.json(updated[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;
  const { id } = await params;

  await db.query('DELETE FROM agendas WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Berhasil dihapus.' });
}
