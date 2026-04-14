import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');
  const search = searchParams.get('search');

  const conditions: string[] = [];
  const params: any[] = [];
  if (search) { conditions.push('(judul LIKE ? OR narasumber LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const [countRows]: any = await db.query(`SELECT COUNT(*) as total FROM podcasts ${where}`, params);
  const total = countRows[0].total;

  let sql = `SELECT * FROM podcasts ${where} ORDER BY createdAt DESC`;
  const queryParams = [...params];
  if (limit) { sql += ' LIMIT ?'; queryParams.push(parseInt(limit)); }
  if (page && limit) { sql += ' OFFSET ?'; queryParams.push((parseInt(page) - 1) * parseInt(limit)); }

  const [podcasts] = await db.query(sql, queryParams);
  return NextResponse.json({ data: podcasts, total, page: page ? parseInt(page) : 1 });
}

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;

  try {
    const formData = await req.formData();
    const judul = formData.get('judul') as string;
    if (!judul) return NextResponse.json({ message: 'Judul podcast diperlukan.' }, { status: 400 });

    let thumbnailUrl: string | null = null;
    const thumbnailFile = formData.get('thumbnail') as File | null;
    if (thumbnailFile && thumbnailFile.size > 0) thumbnailUrl = await processFileUpload(thumbnailFile, 'podcast');

    let audioUrl: string | null = null;
    const audioFile = formData.get('audio') as File | null;
    if (audioFile && audioFile.size > 0) audioUrl = await processFileUpload(audioFile, 'podcast-audio');

    const subjudul = formData.get('subjudul') as string;
    const link = formData.get('link') as string;
    const host = formData.get('host') as string;
    const narasumber = formData.get('narasumber') as string;

    const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
    const now = new Date();
    await db.query(
      'INSERT INTO podcasts (id, judul, subjudul, link, host, narasumber, thumbnailUrl, audioUrl, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, judul, subjudul || null, link || null, host || null, narasumber || null, thumbnailUrl, audioUrl, now, now]
    );
    const [rows]: any = await db.query('SELECT * FROM podcasts WHERE id = ?', [id]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
