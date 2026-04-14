import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  const { judul, status, keterangan, order } = await req.json();
  const now = new Date();
  await db.query('UPDATE rancangan_perda SET judul = ?, status = ?, keterangan = ?, `order` = ?, updatedAt = ? WHERE id = ?',
    [judul, status, keterangan, order !== undefined ? parseInt(order) : undefined, now, id]);
  const [rows]: any = await db.query('SELECT * FROM rancangan_perda WHERE id = ?', [id]);
  return NextResponse.json(rows[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  await db.query('DELETE FROM rancangan_perda WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Raperda berhasil dihapus.' });
}
