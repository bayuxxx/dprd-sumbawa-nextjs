import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [rows]: any = await db.query('SELECT * FROM masa_jabatan WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Data masa jabatan tidak ditemukan.' }, { status: 404 });
  const item = rows[0];
  const [pimpinan] = await db.query('SELECT * FROM pimpinan WHERE masaJabatanId = ? ORDER BY `order` ASC', [id]);
  item.pimpinan = pimpinan;
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM masa_jabatan WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Data masa jabatan tidak ditemukan.' }, { status: 404 });
  const existing = rows[0];

  const { periode, tahunMulai, tahunSelesai, isAktif, keterangan, order } = await req.json();
  const setActive = isAktif === true || isAktif === 'true';
  if (setActive) await db.query('UPDATE masa_jabatan SET isAktif = 0 WHERE id != ?', [id]);

  const now = new Date();
  await db.query(
    'UPDATE masa_jabatan SET periode = ?, tahunMulai = ?, tahunSelesai = ?, isAktif = ?, keterangan = ?, `order` = ?, updatedAt = ? WHERE id = ?',
    [periode || existing.periode, tahunMulai ? parseInt(tahunMulai) : existing.tahunMulai, tahunSelesai ? parseInt(tahunSelesai) : existing.tahunSelesai, isAktif !== undefined ? (setActive ? 1 : 0) : existing.isAktif, keterangan !== undefined ? keterangan : existing.keterangan, order !== undefined ? parseInt(order) : existing.order, now, id]
  );
  const [updated]: any = await db.query('SELECT * FROM masa_jabatan WHERE id = ?', [id]);
  return NextResponse.json(updated[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT id FROM masa_jabatan WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Data masa jabatan tidak ditemukan.' }, { status: 404 });
  await db.query('UPDATE pimpinan SET masaJabatanId = NULL WHERE masaJabatanId = ?', [id]);
  await db.query('DELETE FROM masa_jabatan WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Data masa jabatan berhasil dihapus.' });
}
