import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isActive = searchParams.get('isActive');

  let sql = 'SELECT * FROM banners';
  const params: any[] = [];
  if (isActive !== null) { sql += ' WHERE isActive = ?'; params.push(isActive === 'true' ? 1 : 0); }
  sql += ' ORDER BY `order` ASC';

  const [banners] = await db.query(sql, params);
  return NextResponse.json(banners);
}

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;

  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    if (!title) return NextResponse.json({ message: 'Judul banner diperlukan.' }, { status: 400 });

    let imageUrl = (formData.get('imageUrl') as string) || '';
    const file = formData.get('image') as File | null;
    if (file && file.size > 0) imageUrl = (await processFileUpload(file, 'banners')) || '';

    const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
    const now = new Date();
    await db.query(
      'INSERT INTO banners (id, title, subtitle, category, imageUrl, linkUrl, isActive, `order`, createdAt, updatedAt) VALUES (?, ?, NULL, ?, ?, NULL, 1, 0, ?, ?)',
      [id, title, 'Berita Dewan', imageUrl, now, now]
    );
    const [rows]: any = await db.query('SELECT * FROM banners WHERE id = ?', [id]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
