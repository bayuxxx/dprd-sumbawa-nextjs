import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM masa_jabatan_fraksi ORDER BY tahunMulai DESC');
    return NextResponse.json(rows);
  } catch { return NextResponse.json([]); }
}

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;

  const { periode, tahunMulai, tahunSelesai, isAktif, keterangan, order } = await req.json();
  if (!periode || !tahunMulai || !tahunSelesai)
    return NextResponse.json({ message: 'periode, tahunMulai, tahunSelesai wajib diisi.' }, { status: 400 });

  const [dup]: any = await db.query('SELECT id FROM masa_jabatan_fraksi WHERE periode = ?', [periode]);
  if (dup.length > 0) return NextResponse.json({ message: 'Periode sudah ada.' }, { status: 400 });

  const id  = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
  const now = new Date();
  if (isAktif) await db.query('UPDATE masa_jabatan_fraksi SET isAktif = 0');
  await db.query(
    'INSERT INTO masa_jabatan_fraksi (id, periode, tahunMulai, tahunSelesai, isAktif, keterangan, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, periode, tahunMulai, tahunSelesai, isAktif ? 1 : 0, keterangan || null, order || 0, now, now]
  );
  const [rows]: any = await db.query('SELECT * FROM masa_jabatan_fraksi WHERE id = ?', [id]);
  return NextResponse.json(rows[0], { status: 201 });
}
