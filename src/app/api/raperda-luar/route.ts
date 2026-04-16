import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError, requirePermission } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tahun = searchParams.get('tahun');
  const conditions = tahun ? 'WHERE tahun = ?' : '';
  const params = tahun ? [tahun] : [];
  try {
    const [rows] = await db.query(`SELECT * FROM raperda_luar ${conditions} ORDER BY tahun DESC, \`order\` ASC`, params);
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;

  const { judul, status, keterangan, tahun, order } = await req.json();
  if (!judul || !tahun) return NextResponse.json({ message: 'judul dan tahun wajib diisi.' }, { status: 400 });

  const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
  const now = new Date();
  await db.query(
    'INSERT INTO raperda_luar (id, judul, status, keterangan, tahun, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, judul, status || 'Belum Pembahasan', keterangan || null, tahun, order || 0, now, now]
  );
  const [rows]: any = await db.query('SELECT * FROM raperda_luar WHERE id = ?', [id]);
  return NextResponse.json(rows[0], { status: 201 });
}
