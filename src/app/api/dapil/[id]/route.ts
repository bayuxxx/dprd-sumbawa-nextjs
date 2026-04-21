import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';
import { deleteFromStorage } from '@/lib/storage';

async function getDapilWithAnggota(id: string) {
  const [rows]: any = await db.query('SELECT * FROM daerah_pemilihan WHERE id = ?', [id]);
  if (rows.length === 0) return null;
  const [anggota] = await db.query('SELECT * FROM anggota_dapil WHERE dapilId = ? ORDER BY `order` ASC', [id]);
  return { ...rows[0], anggota };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getDapilWithAnggota(id);
  if (!item) return NextResponse.json({ message: 'Tidak ditemukan.' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM daerah_pemilihan WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Tidak ditemukan.' }, { status: 404 });
  const existing = rows[0];

  try {
    const formData = await req.formData();
    let imageUrl = existing.imageUrl;
    const file = formData.get('image') as File | null;
    if (file && file.size > 0) {
      if (existing.imageUrl) await deleteFromStorage(existing.imageUrl);
      imageUrl = await processFileUpload(file, 'dapil');
    }

    const nama = formData.get('nama') as string;
    const slug = formData.get('slug') as string;
    const wilayah = formData.get('wilayah') as string;
    const jumlahKursi = formData.get('jumlahKursi') as string;
    const deskripsi = formData.get('deskripsi') as string;
    const isAktif = formData.get('isAktif') as string;
    const order = formData.get('order') as string;

    const now = new Date();
    await db.query(
      'UPDATE daerah_pemilihan SET nama = ?, slug = ?, wilayah = ?, jumlahKursi = ?, imageUrl = ?, deskripsi = ?, isAktif = ?, `order` = ?, updatedAt = ? WHERE id = ?',
      [
        nama || existing.nama,
        slug || existing.slug,
        wilayah !== null ? wilayah : existing.wilayah,
        jumlahKursi ? parseInt(jumlahKursi) : existing.jumlahKursi,
        imageUrl,
        deskripsi !== null ? deskripsi : existing.deskripsi,
        isAktif !== null ? (isAktif === 'true' ? 1 : 0) : existing.isAktif,
        order ? parseInt(order) : existing.order,
        now, id
      ]
    );
    return NextResponse.json(await getDapilWithAnggota(id));
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM daerah_pemilihan WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Tidak ditemukan.' }, { status: 404 });
  if (rows[0].imageUrl) await deleteFromStorage(rows[0].imageUrl);
  await db.query('DELETE FROM anggota_dapil WHERE dapilId = ?', [id]);
  await db.query('DELETE FROM daerah_pemilihan WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Berhasil dihapus.' });
}
