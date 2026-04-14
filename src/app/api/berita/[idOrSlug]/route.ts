import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';
import { deleteFromStorage } from '@/lib/storage';

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ idOrSlug: string }> }) {
  const { idOrSlug } = await params;
  const [rows]: any = await db.query('SELECT * FROM beritas WHERE id = ? OR slug = ? LIMIT 1', [idOrSlug, idOrSlug]);
  if (rows.length === 0) return NextResponse.json({ message: 'Berita tidak ditemukan.' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ idOrSlug: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { idOrSlug: id } = await params;

  const [rows]: any = await db.query('SELECT * FROM beritas WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Berita tidak ditemukan.' }, { status: 404 });
  const existing = rows[0];

  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const isPublished = formData.get('isPublished') as string;
    const publishedAt = formData.get('publishedAt') as string;

    let imageUrl = existing.imageUrl;
    const file = formData.get('image') as File | null;
    if (file && file.size > 0) {
      if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
      imageUrl = await processFileUpload(file, 'berita');
    }

    let slug = existing.slug;
    if (title && title !== existing.title) {
      const newSlug = generateSlug(title);
      const [dup]: any = await db.query('SELECT id FROM beritas WHERE slug = ? AND id != ?', [newSlug, id]);
      slug = dup.length > 0 ? `${newSlug}-${Date.now()}` : newSlug;
    }

    const now = new Date();
    await db.query(
      'UPDATE beritas SET title = ?, slug = ?, excerpt = ?, content = ?, imageUrl = ?, category = ?, isPublished = ?, publishedAt = ?, updatedAt = ? WHERE id = ?',
      [title || existing.title, slug, excerpt !== undefined ? excerpt : existing.excerpt, content !== undefined ? content : existing.content, imageUrl, category || existing.category, isPublished !== undefined ? (isPublished === 'true' ? 1 : 0) : existing.isPublished, publishedAt ? new Date(publishedAt) : existing.publishedAt, now, id]
    );
    const [updated]: any = await db.query('SELECT * FROM beritas WHERE id = ?', [id]);
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ idOrSlug: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { idOrSlug: id } = await params;

  const [rows]: any = await db.query('SELECT * FROM beritas WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Berita tidak ditemukan.' }, { status: 404 });
  if (rows[0].imageUrl) await deleteFromStorage(rows[0].imageUrl);
  await db.query('DELETE FROM beritas WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Berita berhasil dihapus.' });
}
