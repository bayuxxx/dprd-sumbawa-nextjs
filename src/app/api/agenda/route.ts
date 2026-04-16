import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError, requirePermission } from '@/lib/auth';

export async function GET() {
  try {
    const [rows] = await db.query(
      'SELECT * FROM agendas WHERE isActive = 1 ORDER BY tanggal ASC'
    );
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

  const { title, tanggal, waktu, lokasi, category, color, isActive } = await req.json();
  if (!title || !tanggal || !lokasi) {
    return NextResponse.json({ message: 'title, tanggal, dan lokasi wajib diisi.' }, { status: 400 });
  }

  const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
  const now = new Date();
  await db.query(
    'INSERT INTO agendas (id, title, tanggal, waktu, lokasi, category, color, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, title, new Date(tanggal), waktu || '09.00 WITA', lokasi, category || 'Kegiatan', color || '#1a6bb5', isActive !== false ? 1 : 0, now, now]
  );
  const [rows]: any = await db.query('SELECT * FROM agendas WHERE id = ?', [id]);
  return NextResponse.json(rows[0], { status: 201 });
}
