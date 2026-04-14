import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';

async function getFraksiWithRelations(id: string) {
  const [rows]: any = await db.query(
    'SELECT f.*, m.id as mj_id, m.periode FROM fraksi_info f LEFT JOIN masa_jabatan m ON f.masaJabatanId = m.id WHERE f.id = ?', [id]
  );
  if (rows.length === 0) return null;
  const r = rows[0];
  const [anggota] = await db.query('SELECT * FROM anggota_fraksi WHERE fraksiInfoId = ? ORDER BY `order` ASC', [id]);
  return { ...r, masaJabatan: r.mj_id ? { id: r.mj_id, periode: r.periode } : null, anggota };
}

export async function GET() {
  const [list]: any = await db.query('SELECT f.*, m.id as mj_id, m.periode FROM fraksi_info f LEFT JOIN masa_jabatan m ON f.masaJabatanId = m.id ORDER BY f.isAktif DESC, f.`order` ASC');
  const result = await Promise.all(list.map(async (r: any) => {
    const [anggota] = await db.query('SELECT * FROM anggota_fraksi WHERE fraksiInfoId = ? ORDER BY `order` ASC', [r.id]);
    return { ...r, masaJabatan: r.mj_id ? { id: r.mj_id, periode: r.periode } : null, anggota };
  }));
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const shortName = formData.get('shortName') as string;
    const slug = formData.get('slug') as string;
    if (!name || !shortName || !slug) return NextResponse.json({ message: 'Nama, nama singkat, dan slug diperlukan.' }, { status: 400 });

    let logoUrl: string | null = null;
    const file = formData.get('logo') as File | null;
    if (file && file.size > 0) logoUrl = await processFileUpload(file, 'fraksi');

    const color = formData.get('color') as string;
    const kursi = formData.get('kursi') as string;
    const masaJabatanId = formData.get('masaJabatanId') as string;
    const deskripsi = formData.get('deskripsi') as string;
    const isAktif = formData.get('isAktif') as string;
    const order = formData.get('order') as string;

    const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
    const now = new Date();
    await db.query(
      'INSERT INTO fraksi_info (id, name, shortName, slug, color, kursi, masaJabatanId, deskripsi, logoUrl, isAktif, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, shortName, slug, color || '#c8102e', kursi ? parseInt(kursi) : 0, masaJabatanId || null, deskripsi || null, logoUrl, isAktif === undefined ? 1 : (isAktif === 'true' ? 1 : 0), order ? parseInt(order) : 0, now, now]
    );
    const item = await getFraksiWithRelations(id);
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
