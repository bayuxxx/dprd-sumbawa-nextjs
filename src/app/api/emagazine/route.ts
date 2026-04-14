import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError, requirePermission } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';

export async function GET() {
  const [rows] = await db.query('SELECT * FROM emagazines ORDER BY `order` ASC, createdAt DESC');
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;

  try {
    const fd = await req.formData();
    const title = fd.get('title') as string;
    const edisi = fd.get('edisi') as string;
    if (!title || !edisi) return NextResponse.json({ message: 'title dan edisi wajib diisi.' }, { status: 400 });

    let imageUrl: string | null = null;
    let fileUrl: string | null = null;
    const img = fd.get('image') as File | null;
    const file = fd.get('file') as File | null;
    if (img && img.size > 0) imageUrl = await processFileUpload(img, 'emagazine');
    if (file && file.size > 0) fileUrl = await processFileUpload(file, 'emagazine');

    const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
    const now = new Date();
    await db.query(
      'INSERT INTO emagazines (id, title, edisi, imageUrl, fileUrl, isActive, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, edisi, imageUrl, fileUrl, fd.get('isActive') !== 'false' ? 1 : 0, parseInt(fd.get('order') as string || '0'), now, now]
    );
    const [rows]: any = await db.query('SELECT * FROM emagazines WHERE id = ?', [id]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
