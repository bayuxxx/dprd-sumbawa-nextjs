import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isPast = searchParams.get('isPast');
  const masaJabatanId = searchParams.get('masaJabatanId');

  const conditions: string[] = [];
  const params: any[] = [];
  if (isPast !== null) { conditions.push('p.isPast = ?'); params.push(isPast === 'true' ? 1 : 0); }
  if (masaJabatanId) { conditions.push('p.masaJabatanId = ?'); params.push(masaJabatanId); }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const [rows]: any = await db.query(
    `SELECT p.*, m.id as mj_id, m.periode, m.tahunMulai, m.tahunSelesai, m.isAktif as mj_isAktif
     FROM pimpinan p LEFT JOIN masa_jabatan m ON p.masaJabatanId = m.id
     ${where} ORDER BY p.period DESC, p.\`order\` ASC`,
    params
  );

  const pimpinan = rows.map((r: any) => ({
    ...r,
    masaJabatan: r.mj_id ? { id: r.mj_id, periode: r.periode, tahunMulai: r.tahunMulai, tahunSelesai: r.tahunSelesai, isAktif: r.mj_isAktif } : null,
  }));
  return NextResponse.json(pimpinan);
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
    if (file && file.size > 0) imageUrl = await processFileUpload(file, 'pimpinan');

    const faction = formData.get('faction') as string;
    const period = formData.get('period') as string;
    const bio = formData.get('bio') as string;
    const order = formData.get('order') as string;
    const isPast = formData.get('isPast') as string;
    const masaJabatanId = formData.get('masaJabatanId') as string;

    const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
    const now = new Date();
    await db.query(
      'INSERT INTO pimpinan (id, name, position, faction, period, masaJabatanId, isPast, imageUrl, bio, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, position, faction || null, period || '2024-2029', masaJabatanId || null, isPast === 'true' ? 1 : 0, imageUrl, bio || null, order ? parseInt(order) : 0, now, now]
    );
    const [rows]: any = await db.query(
      'SELECT p.*, m.id as mj_id, m.periode, m.tahunMulai, m.tahunSelesai FROM pimpinan p LEFT JOIN masa_jabatan m ON p.masaJabatanId = m.id WHERE p.id = ?',
      [id]
    );
    const r = rows[0];
    return NextResponse.json({ ...r, masaJabatan: r.mj_id ? { id: r.mj_id, periode: r.periode, tahunMulai: r.tahunMulai, tahunSelesai: r.tahunSelesai } : null }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
