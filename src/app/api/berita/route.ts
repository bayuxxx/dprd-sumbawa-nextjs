import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');
  const category = searchParams.get('category');
  const isPublished = searchParams.get('isPublished');
  const search = searchParams.get('search');
  const reviewStatus = searchParams.get('reviewStatus');

  const conditions: string[] = [];
  const params: any[] = [];

  if (category) { conditions.push('category = ?'); params.push(category); }
  if (isPublished !== null) { conditions.push('isPublished = ?'); params.push(isPublished === 'true' ? 1 : 0); }
  if (reviewStatus) { conditions.push('reviewStatus = ?'); params.push(reviewStatus); }
  if (search) { conditions.push('(title LIKE ? OR excerpt LIKE ? OR content LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const [countRows]: any = await db.query(`SELECT COUNT(*) as total FROM beritas ${where}`, params);
  const total = countRows[0].total;

  let sql = `SELECT b.*, a.username as authorName FROM beritas b LEFT JOIN admins a ON b.authorId = a.id ${where} ORDER BY b.publishedAt DESC`;
  const queryParams = [...params];
  if (limit) { sql += ' LIMIT ?'; queryParams.push(parseInt(limit)); }
  if (page && limit) { sql += ' OFFSET ?'; queryParams.push((parseInt(page) - 1) * parseInt(limit)); }

  const [beritas] = await db.query(sql, queryParams);
  return NextResponse.json({ data: beritas, total, page: page ? parseInt(page) : 1 });
}

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;

  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    if (!title) return NextResponse.json({ message: 'Judul berita diperlukan.' }, { status: 400 });

    let slug = generateSlug(title);
    const [existing]: any = await db.query('SELECT id FROM beritas WHERE slug = ?', [slug]);
    if (existing.length > 0) slug = `${slug}-${Date.now()}`;

    let imageUrl: string | null = null;
    const file = formData.get('image') as File | null;
    if (file && file.size > 0) imageUrl = await processFileUpload(file, 'berita');

    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const publishedAt = formData.get('publishedAt') as string;

    // news_editor: always draft + pending review
    // admin & super_admin: can set isPublished directly
    let isPublished = 0;
    let reviewStatus = 'pending';
    if (auth.role === 'super_admin' || auth.role === 'admin') {
      const isPublishedParam = formData.get('isPublished') as string;
      isPublished = isPublishedParam === 'true' ? 1 : 0;
      reviewStatus = isPublished ? 'approved' : 'pending';
    }

    const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
    const now = new Date();
    const pubDate = publishedAt ? new Date(publishedAt) : now;

    await db.query(
      'INSERT INTO beritas (id, title, slug, excerpt, content, imageUrl, category, isPublished, authorId, reviewStatus, publishedAt, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, slug, excerpt || null, content || null, imageUrl, category || 'Berita Dewan', isPublished, auth.adminId, reviewStatus, pubDate, now, now]
    );
    const [rows]: any = await db.query('SELECT * FROM beritas WHERE id = ?', [id]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
