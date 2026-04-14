import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [rows]: any = await db.query(
    'SELECT f.*, m.id as mj_id, m.periode FROM fraksi_info f LEFT JOIN masa_jabatan m ON f.masaJabatanId = m.id WHERE f.slug = ? LIMIT 1',
    [slug]
  );
  if (rows.length === 0) return NextResponse.json({ message: 'Fraksi tidak ditemukan.' }, { status: 404 });
  const r = rows[0];
  const [anggota] = await db.query('SELECT * FROM anggota_fraksi WHERE fraksiInfoId = ? ORDER BY `order` ASC', [r.id]);
  return NextResponse.json({ ...r, masaJabatan: r.mj_id ? { id: r.mj_id, periode: r.periode } : null, anggota });
}
