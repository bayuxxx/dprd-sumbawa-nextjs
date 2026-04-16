import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET /api/komentar?beritaId=xxx&status=approved
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const beritaId = searchParams.get('beritaId');
  const status = searchParams.get('status'); // "pending" | "approved" | "rejected" | null (all)

  const conditions: string[] = [];
  const params: any[] = [];

  if (beritaId) { conditions.push('beritaId = ?'); params.push(beritaId); }
  if (status) { conditions.push('status = ?'); params.push(status); }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const [rows] = await db.query(`SELECT * FROM komentar_berita ${where} ORDER BY createdAt DESC`, params);
  return NextResponse.json(rows);
}

// POST /api/komentar — submit komentar baru (publik, status = pending)
export async function POST(req: NextRequest) {
  try {
    const { beritaId, nama, email, isi } = await req.json();
    if (!beritaId || !isi?.trim()) {
      return NextResponse.json({ message: 'beritaId dan isi komentar diperlukan.' }, { status: 400 });
    }
    const displayNama = nama?.trim() || 'Anonim';

    // Verify berita exists and is published
    const [beritaRows]: any = await db.query('SELECT id FROM beritas WHERE id = ? AND isPublished = 1', [beritaId]);
    if (beritaRows.length === 0) return NextResponse.json({ message: 'Berita tidak ditemukan.' }, { status: 404 });

    const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
    const now = new Date();
    await db.query(
      'INSERT INTO komentar_berita (id, beritaId, nama, email, isi, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, beritaId, displayNama, email?.trim() || null, isi.trim(), 'pending', now, now]
    );

    return NextResponse.json({ message: 'Komentar berhasil dikirim dan menunggu moderasi.' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
