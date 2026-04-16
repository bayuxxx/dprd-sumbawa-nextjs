import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError, requirePermission } from '@/lib/auth';
import { processFileUpload } from '@/lib/upload';
import { deleteFromStorage } from '@/lib/storage';

// GET /api/ppid/assets?slug=xxx  OR  GET /api/ppid/assets (all)
export async function GET(req: NextRequest) {
  const slug = new URL(req.url).searchParams.get('slug');
  try {
    if (slug) {
      const [rows]: any = await db.query('SELECT * FROM ppid_assets WHERE slug = ? LIMIT 1', [slug]);
      return NextResponse.json(rows[0] ?? null);
    }
    const [rows] = await db.query('SELECT * FROM ppid_assets');
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json(slug ? null : []);
  }
}

// POST /api/ppid/assets  — upsert (create or replace image)
export async function POST(req: NextRequest) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'super_admin_only');
  if (denied) return denied;

  const fd = await req.formData();
  const slug = fd.get('slug') as string;
  const file = fd.get('image') as File | null;

  if (!slug || !file || file.size === 0) {
    return NextResponse.json({ message: 'slug dan image wajib diisi.' }, { status: 400 });
  }

  // Hapus gambar lama jika ada
  const [existing]: any = await db.query('SELECT * FROM ppid_assets WHERE slug = ?', [slug]);
  if (existing.length > 0 && existing[0].imageUrl) {
    await deleteFromStorage(existing[0].imageUrl).catch(() => {});
  }

  const imageUrl = await processFileUpload(file, 'ppid');
  const now = new Date();

  if (existing.length > 0) {
    await db.query('UPDATE ppid_assets SET imageUrl = ?, updatedAt = ? WHERE slug = ?', [imageUrl, now, slug]);
  } else {
    const id = crypto.randomUUID().replace(/-/g, '').substring(0, 25);
    await db.query('INSERT INTO ppid_assets (id, slug, imageUrl, updatedAt) VALUES (?, ?, ?, ?)', [id, slug, imageUrl, now]);
  }

  const [rows]: any = await db.query('SELECT * FROM ppid_assets WHERE slug = ?', [slug]);
  return NextResponse.json(rows[0]);
}
