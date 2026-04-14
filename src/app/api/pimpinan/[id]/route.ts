import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';
import { deleteFromStorage } from '@/lib/storage';

async function getPimpinanWithMJ(id: string) {
  const [rows]: any = await db.query(
    'SELECT p.*, m.id as mj_id, m.periode, m.tahunMulai, m.tahunSelesai, m.isAktif as mj_isAktif FROM pimpinan p LEFT JOIN masa_jabatan m ON p.masaJabatanId = m.id WHERE p.id = ?',
    [id]
  );
  if (rows.length === 0) return null;
  const r = rows[0];
  return { ...r, masaJabatan: r.mj_id ? { id: r.mj_id, periode: r.periode, tahunMulai: r.tahunMulai, tahunSelesai: r.tahunSelesai, isAktif: r.mj_isAktif } : null };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getPimpinanWithMJ(id);
  if (!item) return NextResponse.json({ message: 'Data pimpinan tidak ditemukan.' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM pimpinan WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Data pimpinan tidak ditemukan.' }, { status: 404 });
  const existing = rows[0];

  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const position = formData.get('position') as string;
    const faction = formData.get('faction') as string;
    const period = formData.get('period') as string;
    const bio = formData.get('bio') as string;
    const order = formData.get('order') as string;
    const isPast = formData.get('isPast') as string;
    const masaJabatanId = formData.get('masaJabatanId') as string;

    let imageUrl = existing.imageUrl;
    const file = formData.get('image') as File | null;
    if (file && file.size > 0) {
      if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
      imageUrl = await processFileUpload(file, 'pimpinan');
    }

    const now = new Date();
    await db.query(
      'UPDATE pimpinan SET name = ?, position = ?, faction = ?, period = ?, masaJabatanId = ?, isPast = ?, imageUrl = ?, bio = ?, `order` = ?, updatedAt = ? WHERE id = ?',
      [name || existing.name, position || existing.position, faction !== undefined ? faction : existing.faction, period || existing.period, masaJabatanId !== undefined ? (masaJabatanId || null) : existing.masaJabatanId, isPast !== undefined ? (isPast === 'true' ? 1 : 0) : existing.isPast, imageUrl, bio !== undefined ? bio : existing.bio, order !== undefined ? parseInt(order) : existing.order, now, id]
    );
    const updated = await getPimpinanWithMJ(id);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM pimpinan WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Data pimpinan tidak ditemukan.' }, { status: 404 });
  if (rows[0].imageUrl) await deleteFromStorage(rows[0].imageUrl);
  await db.query('DELETE FROM pimpinan WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Data pimpinan berhasil dihapus.' });
}
