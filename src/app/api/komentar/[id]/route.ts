import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';

// PUT /api/komentar/[id] — approve or reject (admin only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  const [rows]: any = await db.query('SELECT * FROM komentar_berita WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Komentar tidak ditemukan.' }, { status: 404 });

  try {
    const { status } = await req.json(); // "approved" | "rejected"
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Status tidak valid.' }, { status: 400 });
    }

    const now = new Date();
    await db.query(
      'UPDATE komentar_berita SET status = ?, reviewedBy = ?, updatedAt = ? WHERE id = ?',
      [status, auth.adminId, now, id]
    );

    const [updated]: any = await db.query('SELECT * FROM komentar_berita WHERE id = ?', [id]);
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE /api/komentar/[id] — hapus komentar (admin only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  const [rows]: any = await db.query('SELECT id FROM komentar_berita WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Komentar tidak ditemukan.' }, { status: 404 });

  await db.query('DELETE FROM komentar_berita WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Komentar berhasil dihapus.' });
}
