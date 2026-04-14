import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';

export async function GET() {
  const [list]: any = await db.query('SELECT * FROM masa_jabatan ORDER BY isAktif DESC, tahunMulai DESC');
  for (const item of list) {
    const [pimpinan] = await db.query('SELECT * FROM pimpinan WHERE masaJabatanId = ? ORDER BY `order` ASC', [item.id]);
    item.pimpinan = pimpinan;
  }
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;

  const { periode, tahunMulai, tahunSelesai, isAktif, keterangan, order } = await req.json();
  if (!periode || !tahunMulai || !tahunSelesai) return NextResponse.json({ message: 'Periode, tahun mulai, dan tahun selesai diperlukan.' }, { status: 400 });

  if (isAktif === true || isAktif === 'true') {
    await db.query('UPDATE masa_jabatan SET isAktif = 0');
  }

  const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
  const now = new Date();
  await db.query(
    'INSERT INTO masa_jabatan (id, periode, tahunMulai, tahunSelesai, isAktif, keterangan, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, periode, parseInt(tahunMulai), parseInt(tahunSelesai), isAktif === true || isAktif === 'true' ? 1 : 0, keterangan || null, order ? parseInt(order) : 0, now, now]
  );
  const [rows]: any = await db.query('SELECT * FROM masa_jabatan WHERE id = ?', [id]);
  return NextResponse.json(rows[0], { status: 201 });
}
