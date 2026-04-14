import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const where = id ? 'WHERE id = ?' : 'WHERE isAktif = 1';
  const params = id ? [id] : [];
  const [rows]: any = await db.query(`SELECT * FROM komisi_info ${where} LIMIT 1`, params);
  if (rows.length === 0) return NextResponse.json(null);
  const [anggota] = await db.query('SELECT * FROM anggota_komisi WHERE komisiInfoId = ? ORDER BY `order` ASC', [rows[0].id]);
  return NextResponse.json({ ...rows[0], anggota });
}

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { namaKomisi, masaJabatan, deskripsi, isAktif } = await req.json();
  if (!namaKomisi || !masaJabatan) return NextResponse.json({ message: 'Nama komisi dan masa jabatan diperlukan.' }, { status: 400 });
  const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
  const now = new Date();
  await db.query('INSERT INTO komisi_info (id, namaKomisi, masaJabatan, deskripsi, isAktif, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, namaKomisi, masaJabatan, deskripsi || null, isAktif === true || isAktif === 'true' ? 1 : 0, now, now]);
  const [rows]: any = await db.query('SELECT * FROM komisi_info WHERE id = ?', [id]);
  const [anggota] = await db.query('SELECT * FROM anggota_komisi WHERE komisiInfoId = ? ORDER BY `order` ASC', [id]);
  return NextResponse.json({ ...rows[0], anggota }, { status: 201 });
}
