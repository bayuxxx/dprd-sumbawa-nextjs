import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';

export async function GET() {
  const [list] = await db.query('SELECT * FROM anggota_sekretariat ORDER BY isSekretaris DESC, `order` ASC');
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const position = formData.get('position') as string;
    if (!name || !position) return NextResponse.json({ message: 'Nama dan jabatan diperlukan.' }, { status: 400 });
    let imageUrl: string | null = null;
    const file = formData.get('image') as File | null;
    if (file && file.size > 0) imageUrl = await processFileUpload(file, 'sekretariat');
    const unit = formData.get('unit') as string;
    const isSekretaris = formData.get('isSekretaris') as string;
    const order = formData.get('order') as string;
    const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
    const now = new Date();
    await db.query('INSERT INTO anggota_sekretariat (id, name, position, unit, imageUrl, isSekretaris, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, position, unit || null, imageUrl, isSekretaris === 'true' ? 1 : 0, order ? parseInt(order) : 0, now, now]);
    const [rows]: any = await db.query('SELECT * FROM anggota_sekretariat WHERE id = ?', [id]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
