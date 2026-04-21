import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;

  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    if (!name) return NextResponse.json({ message: 'Nama diperlukan.' }, { status: 400 });

    let imageUrl: string | null = null;
    const file = formData.get('image') as File | null;
    if (file && file.size > 0) imageUrl = await processFileUpload(file, 'dapil-anggota');

    const partai = formData.get('partai') as string;
    const order = formData.get('order') as string;
    const dapilId = formData.get('dapilId') as string;

    const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
    const now = new Date();
    await db.query(
      'INSERT INTO anggota_dapil (id, name, partai, imageUrl, `order`, dapilId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, partai || null, imageUrl, order ? parseInt(order) : 0, dapilId || null, now, now]
    );
    const [rows]: any = await db.query('SELECT * FROM anggota_dapil WHERE id = ?', [id]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
