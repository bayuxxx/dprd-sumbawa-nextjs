import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';
import { deleteFromStorage } from '@/lib/storage';
import { invalidateTags } from '@/lib/cache';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [rows]: any = await db.query('SELECT * FROM banners WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Banner tidak ditemukan.' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM banners WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Banner tidak ditemukan.' }, { status: 404 });
  const existing = rows[0];

  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    let imageUrl = existing.imageUrl;
    const file = formData.get('image') as File | null;
    if (file && file.size > 0) {
      if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
      imageUrl = (await processFileUpload(file, 'banners')) || existing.imageUrl;
    }
    const now = new Date();
    await db.query('UPDATE banners SET title = ?, imageUrl = ?, updatedAt = ? WHERE id = ?', [title || existing.title, imageUrl, now, id]);
    const [updated]: any = await db.query('SELECT * FROM banners WHERE id = ?', [id]);
    invalidateTags(['banners']);
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM banners WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Banner tidak ditemukan.' }, { status: 404 });
  if (rows[0].imageUrl) await deleteFromStorage(rows[0].imageUrl);
  await db.query('DELETE FROM banners WHERE id = ?', [id]);
  invalidateTags(['banners']);
  return NextResponse.json({ message: 'Banner berhasil dihapus.' });
}
