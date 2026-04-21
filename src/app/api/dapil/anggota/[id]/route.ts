import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';
import { deleteFromStorage } from '@/lib/storage';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM anggota_dapil WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Tidak ditemukan.' }, { status: 404 });
  const existing = rows[0];

  try {
    const formData = await req.formData();
    let imageUrl = existing.imageUrl;
    const file = formData.get('image') as File | null;
    if (file && file.size > 0) {
      if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
      imageUrl = await processFileUpload(file, 'dapil-anggota');
    }

    const name = formData.get('name') as string;
    const partai = formData.get('partai') as string;
    const order = formData.get('order') as string;
    const dapilId = formData.get('dapilId') as string;

    const now = new Date();
    await db.query(
      'UPDATE anggota_dapil SET name = ?, partai = ?, imageUrl = ?, `order` = ?, dapilId = ?, updatedAt = ? WHERE id = ?',
      [name || existing.name, partai !== null ? partai : existing.partai, imageUrl, order ? parseInt(order) : existing.order, dapilId || existing.dapilId, now, id]
    );
    const [updated]: any = await db.query('SELECT * FROM anggota_dapil WHERE id = ?', [id]);
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM anggota_dapil WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Tidak ditemukan.' }, { status: 404 });
  if (rows[0].imageUrl) await deleteFromStorage(rows[0].imageUrl);
  await db.query('DELETE FROM anggota_dapil WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Berhasil dihapus.' });
}
