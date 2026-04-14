import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';
import { deleteFromStorage } from '@/lib/storage';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [rows]: any = await db.query('SELECT * FROM podcasts WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Podcast tidak ditemukan.' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM podcasts WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Podcast tidak ditemukan.' }, { status: 404 });
  const existing = rows[0];

  try {
    const formData = await req.formData();
    const judul = formData.get('judul') as string;
    const subjudul = formData.get('subjudul') as string;
    const link = formData.get('link') as string;
    const host = formData.get('host') as string;
    const narasumber = formData.get('narasumber') as string;

    let thumbnailUrl = existing.thumbnailUrl;
    const thumbnailFile = formData.get('thumbnail') as File | null;
    if (thumbnailFile && thumbnailFile.size > 0) {
      if (existing.thumbnailUrl) await deleteFromStorage(existing.thumbnailUrl);
      thumbnailUrl = await processFileUpload(thumbnailFile, 'podcast');
    }

    let audioUrl = existing.audioUrl;
    const audioFile = formData.get('audio') as File | null;
    if (audioFile && audioFile.size > 0) {
      if (existing.audioUrl) await deleteFromStorage(existing.audioUrl);
      audioUrl = await processFileUpload(audioFile, 'podcast-audio');
    }

    const now = new Date();
    await db.query(
      'UPDATE podcasts SET judul = ?, subjudul = ?, link = ?, host = ?, narasumber = ?, thumbnailUrl = ?, audioUrl = ?, updatedAt = ? WHERE id = ?',
      [judul || existing.judul, subjudul !== undefined ? subjudul : existing.subjudul, link !== undefined ? link : existing.link, host !== undefined ? host : existing.host, narasumber !== undefined ? narasumber : existing.narasumber, thumbnailUrl, audioUrl, now, id]
    );
    const [updated]: any = await db.query('SELECT * FROM podcasts WHERE id = ?', [id]);
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM podcasts WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Podcast tidak ditemukan.' }, { status: 404 });
  if (rows[0].thumbnailUrl) await deleteFromStorage(rows[0].thumbnailUrl);
  if (rows[0].audioUrl) await deleteFromStorage(rows[0].audioUrl);
  await db.query('DELETE FROM podcasts WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Podcast berhasil dihapus.' });
}
