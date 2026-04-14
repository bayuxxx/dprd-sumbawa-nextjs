import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';

export async function GET() {
  const [list]: any = await db.query('SELECT * FROM propemperda ORDER BY tahun DESC');
  const result = await Promise.all(list.map(async (item: any) => {
    const [raperda] = await db.query('SELECT * FROM rancangan_perda WHERE propemperdaId = ? ORDER BY `order` ASC', [item.id]);
    return { ...item, raperda };
  }));
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { tahun, keterangan } = await req.json();
  if (!tahun) return NextResponse.json({ message: 'Tahun diperlukan.' }, { status: 400 });
  const [existing]: any = await db.query('SELECT id FROM propemperda WHERE tahun = ?', [tahun]);
  if (existing.length > 0) return NextResponse.json({ message: `Propemperda tahun ${tahun} sudah ada.` }, { status: 400 });
  const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
  const now = new Date();
  await db.query('INSERT INTO propemperda (id, tahun, keterangan, isAktif, createdAt, updatedAt) VALUES (?, ?, ?, 1, ?, ?)',
    [id, tahun, keterangan || null, now, now]);
  const [rows]: any = await db.query('SELECT * FROM propemperda WHERE id = ?', [id]);
  return NextResponse.json(rows[0], { status: 201 });
}
