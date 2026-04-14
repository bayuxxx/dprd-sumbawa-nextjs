import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError, requirePermission } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';
import { deleteFromStorage } from '@/lib/storage';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM emagazines WHERE id = ?', [id]);
  if (!rows.length) return NextResponse.json({ message: 'Tidak ditemukan.' }, { status: 404 });
  const existing = rows[0];

  const fd = await req.formData();
  let imageUrl = existing.imageUrl;
  let fileUrl = existing.fileUrl;
  const img = fd.get('image') as File | null;
  const file = fd.get('file') as File | null;
  if (img && img.size > 0) { if (existing.imageUrl) await deleteFromStorage(existing.imageUrl); imageUrl = await processFileUpload(img, 'emagazine'); }
  if (file && file.size > 0) { if (existing.fileUrl) await deleteFromStorage(existing.fileUrl); fileUrl = await processFileUpload(file, 'emagazine'); }

  await db.query(
    'UPDATE emagazines SET title=?, edisi=?, imageUrl=?, fileUrl=?, isActive=?, `order`=?, updatedAt=? WHERE id=?',
    [fd.get('title') || existing.title, fd.get('edisi') || existing.edisi, imageUrl, fileUrl, fd.get('isActive') !== 'false' ? 1 : 0, parseInt(fd.get('order') as string || '0'), new Date(), id]
  );
  const [updated]: any = await db.query('SELECT * FROM emagazines WHERE id = ?', [id]);
  return NextResponse.json(updated[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM emagazines WHERE id = ?', [id]);
  if (!rows.length) return NextResponse.json({ message: 'Tidak ditemukan.' }, { status: 404 });
  if (rows[0].imageUrl) await deleteFromStorage(rows[0].imageUrl);
  if (rows[0].fileUrl) await deleteFromStorage(rows[0].fileUrl);
  await db.query('DELETE FROM emagazines WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Berhasil dihapus.' });
}
