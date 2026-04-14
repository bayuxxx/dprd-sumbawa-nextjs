import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [rows]: any = await db.query('SELECT * FROM propemperda WHERE tahun = ? OR id = ? LIMIT 1', [id, id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Data tidak ditemukan.' }, { status: 404 });
  const [raperda] = await db.query('SELECT * FROM rancangan_perda WHERE propemperdaId = ? ORDER BY `order` ASC', [rows[0].id]);
  return NextResponse.json({ ...rows[0], raperda });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  const { tahun, keterangan, isAktif } = await req.json();
  const now = new Date();
  await db.query('UPDATE propemperda SET tahun = ?, keterangan = ?, isAktif = ?, updatedAt = ? WHERE id = ?',
    [tahun, keterangan, isAktif ? 1 : 0, now, id]);
  const [rows]: any = await db.query('SELECT * FROM propemperda WHERE id = ?', [id]);
  const [raperda] = await db.query('SELECT * FROM rancangan_perda WHERE propemperdaId = ? ORDER BY `order` ASC', [id]);
  return NextResponse.json({ ...rows[0], raperda });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  await db.query('DELETE FROM rancangan_perda WHERE propemperdaId = ?', [id]);
  await db.query('DELETE FROM propemperda WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Propemperda berhasil dihapus.' });
}
