import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bkInfoId = searchParams.get('bkInfoId');
  const where = bkInfoId ? 'WHERE bkInfoId = ?' : '';
  const params = bkInfoId ? [bkInfoId] : [];
  const [anggota] = await db.query(`SELECT * FROM anggota_bk ${where} ORDER BY \`order\` ASC`, params);
  return NextResponse.json(anggota);
}

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const jabatan = formData.get('jabatan') as string;
    if (!name || !jabatan) return NextResponse.json({ message: 'Nama dan jabatan diperlukan.' }, { status: 400 });
    let imageUrl: string | null = null;
    const file = formData.get('image') as File | null;
    if (file && file.size > 0) imageUrl = await processFileUpload(file, 'bk');
    const faction = formData.get('faction') as string;
    const order = formData.get('order') as string;
    const bkInfoId = formData.get('bkInfoId') as string;
    const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
    const now = new Date();
    await db.query('INSERT INTO anggota_bk (id, name, jabatan, faction, imageUrl, `order`, bkInfoId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, jabatan, faction || null, imageUrl, order ? parseInt(order) : 0, bkInfoId || null, now, now]);
    const [rows]: any = await db.query('SELECT * FROM anggota_bk WHERE id = ?', [id]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
