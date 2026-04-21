import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';
import { deleteFromStorage } from '@/lib/storage';

async function getFraksiWithRelations(id: string) {
  const [rows]: any = await db.query(
    'SELECT f.*, m.id as mj_id, m.periode FROM fraksi_info f LEFT JOIN masa_jabatan_fraksi m ON f.masaJabatanId = m.id WHERE f.id = ?', [id]
  );
  if (rows.length === 0) return null;
  const r = rows[0];
  const [anggota] = await db.query('SELECT * FROM anggota_fraksi WHERE fraksiInfoId = ? ORDER BY `order` ASC', [id]);
  return { ...r, masaJabatan: r.mj_id ? { id: r.mj_id, periode: r.periode } : null, anggota };
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM fraksi_info WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Fraksi tidak ditemukan.' }, { status: 404 });
  const existing = rows[0];

  try {
    const formData = await req.formData();
    let logoUrl = existing.logoUrl;
    const file = formData.get('logo') as File | null;
    if (file && file.size > 0) {
      if (existing.logoUrl) await deleteFromStorage(existing.logoUrl);
      logoUrl = await processFileUpload(file, 'fraksi');
    }
    const name = formData.get('name') as string;
    const shortName = formData.get('shortName') as string;
    const slug = formData.get('slug') as string;
    const color = formData.get('color') as string;
    const kursi = formData.get('kursi') as string;
    const masaJabatanId = formData.get('masaJabatanId') as string;
    const deskripsi = formData.get('deskripsi') as string;
    const isAktif = formData.get('isAktif') as string;
    const order = formData.get('order') as string;

    const now = new Date();
    await db.query(
      'UPDATE fraksi_info SET name = ?, shortName = ?, slug = ?, color = ?, kursi = ?, masaJabatanId = ?, deskripsi = ?, logoUrl = ?, isAktif = ?, `order` = ?, updatedAt = ? WHERE id = ?',
      [name || existing.name, shortName || existing.shortName, slug || existing.slug, color || existing.color, kursi ? parseInt(kursi) : existing.kursi, masaJabatanId !== null ? (masaJabatanId || null) : existing.masaJabatanId, deskripsi !== null ? deskripsi : existing.deskripsi, logoUrl, isAktif !== null ? (isAktif === 'true' ? 1 : 0) : existing.isAktif, order ? parseInt(order) : existing.order, now, id]
    );
    const updated = await getFraksiWithRelations(id);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM fraksi_info WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Fraksi tidak ditemukan.' }, { status: 404 });
  if (rows[0].logoUrl) await deleteFromStorage(rows[0].logoUrl);
  await db.query('DELETE FROM anggota_fraksi WHERE fraksiInfoId = ?', [id]);
  await db.query('DELETE FROM fraksi_info WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Fraksi berhasil dihapus.' });
}
