import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';
import { deleteFromStorage } from '@/lib/storage';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  const [rows]: any = await db.query('SELECT * FROM anggota_bapemperda WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Anggota tidak ditemukan.' }, { status: 404 });
  const existing = rows[0];
  try {
    const formData = await req.formData();
    let imageUrl = existing.imageUrl;
    const file = formData.get('image') as File | null;
    if (file && file.size > 0) {
      if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
      imageUrl = await processFileUpload(file, 'bapemperda');
    }
    const name = formData.get('name') as string;
    const jabatan = formData.get('jabatan') as string;
    const faction = formData.get('faction') as string;
    const order = formData.get('order') as string;
    const bapemperdaInfoId = formData.get('bapemperdaInfoId') as string;
    const now = new Date();
    await db.query('UPDATE anggota_bapemperda SET name = ?, jabatan = ?, faction = ?, imageUrl = ?, `order` = ?, bapemperdaInfoId = ?, updatedAt = ? WHERE id = ?',
      [name || existing.name, jabatan || existing.jabatan, faction !== undefined ? faction : existing.faction, imageUrl, order !== undefined ? parseInt(order) : existing.order, bapemperdaInfoId !== undefined ? (bapemperdaInfoId || null) : existing.bapemperdaInfoId, now, id]);
    const [updated]: any = await db.query('SELECT * FROM anggota_bapemperda WHERE id = ?', [id]);
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  const [rows]: any = await db.query('SELECT * FROM anggota_bapemperda WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Anggota tidak ditemukan.' }, { status: 404 });
  if (rows[0].imageUrl) await deleteFromStorage(rows[0].imageUrl);
  await db.query('DELETE FROM anggota_bapemperda WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Anggota berhasil dihapus.' });
}
