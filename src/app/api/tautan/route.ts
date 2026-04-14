import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError, requirePermission } from '@/lib/auth';

export async function GET() {
  const [rows] = await db.query('SELECT * FROM tautans ORDER BY `order` ASC, createdAt ASC');
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;

  const { title, url, isActive, order } = await req.json();
  if (!title || !url) return NextResponse.json({ message: 'title dan url wajib diisi.' }, { status: 400 });

  const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
  const now = new Date();
  await db.query(
    'INSERT INTO tautans (id, title, url, isActive, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, title, url, isActive !== false ? 1 : 0, order || 0, now, now]
  );
  const [rows]: any = await db.query('SELECT * FROM tautans WHERE id = ?', [id]);
  return NextResponse.json(rows[0], { status: 201 });
}
