import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { propemperdaId, judul, status, keterangan, order } = await req.json();
  if (!propemperdaId || !judul) return NextResponse.json({ message: 'propemperdaId dan judul diperlukan.' }, { status: 400 });
  const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
  const now = new Date();
  await db.query('INSERT INTO rancangan_perda (id, judul, status, keterangan, `order`, propemperdaId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, judul, status || 'Belum Pembahasan', keterangan || null, order ? parseInt(order) : 0, propemperdaId, now, now]);
  const [rows]: any = await db.query('SELECT * FROM rancangan_perda WHERE id = ?', [id]);
  return NextResponse.json(rows[0], { status: 201 });
}
