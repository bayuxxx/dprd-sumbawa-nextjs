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

  const [rows]: any = await db.query('SELECT * FROM ppid_anggaran WHERE id = ?', [id]);
  if (!rows.length) return NextResponse.json({ message: 'Tidak ditemukan.' }, { status: 404 });
  const e = rows[0];

  const fd = await req.formData();
  let fileUrl  = e.fileUrl;
  let fileType = e.fileType;
  const file = fd.get('file') as File | null;
  if (file && file.size > 0) {
    if (e.fileUrl) await deleteFromStorage(e.fileUrl).catch(() => {});
    fileUrl  = await processFileUpload(file, 'ppid-anggaran');
    fileType = file.name.match(/\.(xlsx?|xls)$/i) ? 'excel' : 'pdf';
  }

  await db.query(
    'UPDATE ppid_anggaran SET title=?, fileUrl=?, fileType=?, tahun=?, `order`=?, updatedAt=? WHERE id=?',
    [fd.get('title') || e.title, fileUrl, fileType, fd.get('tahun') || e.tahun, parseInt(fd.get('order') as string || '0'), new Date(), id]
  );
  const [updated]: any = await db.query('SELECT * FROM ppid_anggaran WHERE id = ?', [id]);
  return NextResponse.json(updated[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;
  const { id } = await params;

  const [rows]: any = await db.query('SELECT * FROM ppid_anggaran WHERE id = ?', [id]);
  if (!rows.length) return NextResponse.json({ message: 'Tidak ditemukan.' }, { status: 404 });
  if (rows[0].fileUrl) await deleteFromStorage(rows[0].fileUrl).catch(() => {});
  await db.query('DELETE FROM ppid_anggaran WHERE id = ?', [id]);
  return NextResponse.json({ message: 'Berhasil dihapus.' });
}
