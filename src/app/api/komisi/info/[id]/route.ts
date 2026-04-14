import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { deleteFromStorage } from '@/lib/storage';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  const [rows]: any = await db.query('SELECT * FROM komisi_info WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Komisi info tidak ditemukan.' }, { status: 404 });
  const existing = rows[0];
  const { namaKomisi, masaJabatan, deskripsi, isAktif } = await req.json();
  const now = new Date();
  await db.query('UPDATE komisi_info SET namaKomisi = ?, masaJabatan = ?, deskripsi = ?, isAktif = ?, updatedAt = ? WHERE id = ?',
    [namaKomisi ?? existing.namaKomisi, masaJabatan ?? existing.masaJabatan, deskripsi !== undefined ? deskripsi : existing.deskripsi, isAktif !== undefined ? (isAktif === true || isAktif === 'true' ? 1 : 0) : existing.isAktif, now, id]);
  const [updated]: any = await db.query('SELECT * FROM komisi_info WHERE id = ?', [id]);
  const [anggota] = await db.query('SELECT * FROM anggota_komisi WHERE komisiInfoId = ? ORDER BY `order` ASC', [id]);
  return NextResponse.json({ ...updated[0], anggota });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  const [rows]: any = await db.query('SELECT id FROM komisi_info WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Komisi info tidak ditemukan.' }, { status: 404 });
  const [anggota]: any = await db.query('SELECT imageUrl FROM anggota_komisi WHERE komisiInfoId = ?', [id]);
  for (const a of anggota) { if (a.imageUrl) await deleteFromStorage(a.imageUrl); }
  await db.query('DELETE FROM anggota_komisi WHERE komisiInfoId = ?', [id]);
  await db.query('DELETE FROM komisi_info WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Komisi info berhasil dihapus.' });
}
