import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';

export async function GET() {
  const [rows]: any = await db.query('SELECT * FROM sekretariat LIMIT 1');
  return NextResponse.json(rows[0] || null);
}

export async function PUT(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;

  const { visi, misi, tugas, fungsi } = await req.json();
  const [existing]: any = await db.query('SELECT * FROM sekretariat LIMIT 1');
  const now = new Date();

  if (existing.length > 0) {
    const e = existing[0];
    await db.query('UPDATE sekretariat SET visi = ?, misi = ?, tugas = ?, fungsi = ?, updatedAt = ? WHERE id = ?',
      [visi !== undefined ? visi : e.visi, misi !== undefined ? misi : e.misi, tugas !== undefined ? tugas : e.tugas, fungsi !== undefined ? fungsi : e.fungsi, now, e.id]);
    const [updated]: any = await db.query('SELECT * FROM sekretariat WHERE id = ?', [e.id]);
    return NextResponse.json(updated[0]);
  } else {
    const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
    await db.query('INSERT INTO sekretariat (id, visi, misi, tugas, fungsi, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, visi || null, misi || null, tugas || null, fungsi || null, now, now]);
    const [rows]: any = await db.query('SELECT * FROM sekretariat WHERE id = ?', [id]);
    return NextResponse.json(rows[0], { status: 201 });
  }
}
