import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError, requirePermission } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM ppid_anggaran ORDER BY tahun DESC, `order` ASC');
    return NextResponse.json(rows);
  } catch { return NextResponse.json([]); }
}

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;

  const fd = await req.formData();
  const title = fd.get('title') as string;
  const tahun = fd.get('tahun') as string;
  const file  = fd.get('file') as File | null;

  if (!title || !tahun || !file || file.size === 0)
    return NextResponse.json({ message: 'title, tahun, dan file wajib diisi.' }, { status: 400 });

  const fileUrl = await processFileUpload(file, 'ppid-anggaran');
  const fileType = file.name.match(/\.(xlsx?|xls)$/i) ? 'excel' : 'pdf';

  const id  = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
  const now = new Date();
  await db.query(
    'INSERT INTO ppid_anggaran (id, title, fileUrl, fileType, tahun, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, title, fileUrl, fileType, tahun, parseInt(fd.get('order') as string || '0'), now, now]
  );
  const [rows]: any = await db.query('SELECT * FROM ppid_anggaran WHERE id = ?', [id]);
  return NextResponse.json(rows[0], { status: 201 });
}
