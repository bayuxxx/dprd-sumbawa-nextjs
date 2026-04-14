import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';
import { deleteFromStorage } from '@/lib/storage';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [rows]: any = await db.query('SELECT * FROM anggota_sekretariat WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Data anggota sekretariat tidak ditemukan.' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  const [rows]: any = await db.query('SELECT * FROM anggota_sekretariat WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Data anggota sekretariat tidak ditemukan.' }, { status: 404 });
  const existing = rows[0];
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const position = formData.get('position') as string;
    const unit = formData.get('unit') as string;
    const isSekretaris = formData.get('isSekretaris') as string;
    const order = formData.get('order') as string;
    let imageUrl = existing.imageUrl;
    const file = formData.get('image') as File | null;
    if (file && file.size > 0) {
      if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
      imageUrl = await processFileUpload(file, 'sekretariat');
    }
    const now = new Date();
    await db.query('UPDATE anggota_sekretariat SET name = ?, position = ?, unit = ?, imageUrl = ?, isSekretaris = ?, `order` = ?, updatedAt = ? WHERE id = ?',
      [name || existing.name, position || existing.position, unit !== undefined ? (unit || null) : existing.unit, imageUrl, isSekretaris !== undefined ? (isSekretaris === 'true' ? 1 : 0) : existing.isSekretaris, order !== undefined ? parseInt(order) : existing.order, now, id]);
    const [updated]: any = await db.query('SELECT * FROM anggota_sekretariat WHERE id = ?', [id]);
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  const [rows]: any = await db.query('SELECT * FROM anggota_sekretariat WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Data anggota sekretariat tidak ditemukan.' }, { status: 404 });
  if (rows[0].imageUrl) await deleteFromStorage(rows[0].imageUrl);
  await db.query('DELETE FROM anggota_sekretariat WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Data anggota sekretariat berhasil dihapus.' });
}
