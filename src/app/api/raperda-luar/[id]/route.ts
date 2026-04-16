import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError, requirePermission } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM raperda_luar WHERE id = ?', [id]);
  if (!rows.length) return NextResponse.json({ message: 'Tidak ditemukan.' }, { status: 404 });
  const e = rows[0];

  const { judul, status, keterangan, tahun, order } = await req.json();
  await db.query(
    'UPDATE raperda_luar SET judul=?, status=?, keterangan=?, tahun=?, `order`=?, updatedAt=? WHERE id=?',
    [judul ?? e.judul, status ?? e.status, keterangan ?? e.keterangan, tahun ?? e.tahun, order ?? e.order, new Date(), id]
  );
  const [updated]: any = await db.query('SELECT * FROM raperda_luar WHERE id = ?', [id]);
  return NextResponse.json(updated[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;
  const { id } = await params;

  await db.query('DELETE FROM raperda_luar WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Berhasil dihapus.' });
}
