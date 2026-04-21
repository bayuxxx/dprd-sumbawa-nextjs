import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;

  const { periode, tahunMulai, tahunSelesai, isAktif, keterangan, order } = await req.json();
  if (isAktif) await db.query('UPDATE masa_jabatan_fraksi SET isAktif = 0 WHERE id != ?', [id]);
  await db.query(
    'UPDATE masa_jabatan_fraksi SET periode=?, tahunMulai=?, tahunSelesai=?, isAktif=?, keterangan=?, `order`=?, updatedAt=? WHERE id=?',
    [periode, tahunMulai, tahunSelesai, isAktif ? 1 : 0, keterangan || null, order || 0, new Date(), id]
  );
  const [rows]: any = await db.query('SELECT * FROM masa_jabatan_fraksi WHERE id = ?', [id]);
  return NextResponse.json(rows[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const { id } = await params;
  await db.query('DELETE FROM masa_jabatan_fraksi WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Berhasil dihapus.' });
}
