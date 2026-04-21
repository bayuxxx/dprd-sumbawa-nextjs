import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';

async function getDapilWithAnggota(id: string) {
  const [rows]: any = await db.query('SELECT * FROM daerah_pemilihan WHERE id = ?', [id]);
  if (rows.length === 0) return null;
  const [anggota] = await db.query('SELECT * FROM anggota_dapil WHERE dapilId = ? ORDER BY `order` ASC', [id]);
  return { ...rows[0], anggota };
}

export async function GET() {
  const [list]: any = await db.query('SELECT * FROM daerah_pemilihan ORDER BY isAktif DESC, `order` ASC');
  const result = await Promise.all(list.map(async (r: any) => {
    const [anggota] = await db.query('SELECT * FROM anggota_dapil WHERE dapilId = ? ORDER BY `order` ASC', [r.id]);
    return { ...r, anggota };
  }));
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;

  try {
    const formData = await req.formData();
    const nama = formData.get('nama') as string;
    const slug = formData.get('slug') as string;
    if (!nama || !slug) return NextResponse.json({ message: 'Nama dan slug diperlukan.' }, { status: 400 });

    let imageUrl: string | null = null;
    const file = formData.get('image') as File | null;
    if (file && file.size > 0) imageUrl = await processFileUpload(file, 'dapil');

    const wilayah = formData.get('wilayah') as string;
    const jumlahKursi = formData.get('jumlahKursi') as string;
    const deskripsi = formData.get('deskripsi') as string;
    const isAktif = formData.get('isAktif') as string;
    const order = formData.get('order') as string;

    const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
    const now = new Date();
    await db.query(
      'INSERT INTO daerah_pemilihan (id, nama, slug, wilayah, jumlahKursi, imageUrl, deskripsi, isAktif, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, nama, slug, wilayah || null, jumlahKursi ? parseInt(jumlahKursi) : 0, imageUrl, deskripsi || null, isAktif === 'true' ? 1 : 0, order ? parseInt(order) : 0, now, now]
    );
    const item = await getDapilWithAnggota(id);
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
