import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, isAuthError, requirePermission } from '@/lib/auth';

// POST /api/berita/[id]/review — approve or reject (admin & super_admin)
export async function POST(req: NextRequest, { params }: { params: Promise<{ idOrSlug: string }> }) {
  const auth = verifyAuth(req);
  if (isAuthError(auth)) return auth;
  const denied = requirePermission(auth, 'berita:review');
  if (denied) return denied;

  const { idOrSlug: id } = await params;
  const [rows]: any = await db.query('SELECT * FROM beritas WHERE id = ?', [id]);
  if (rows.length === 0) return NextResponse.json({ message: 'Berita tidak ditemukan.' }, { status: 404 });

  try {
    const { action, note } = await req.json(); // action: "approve" | "reject"
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ message: 'Action tidak valid. Gunakan "approve" atau "reject".' }, { status: 400 });
    }

    const reviewStatus = action === 'approve' ? 'approved' : 'rejected';
    const isPublished = action === 'approve' ? 1 : 0;
    const now = new Date();

    await db.query(
      'UPDATE beritas SET reviewStatus = ?, isPublished = ?, reviewedBy = ?, reviewNote = ?, updatedAt = ? WHERE id = ?',
      [reviewStatus, isPublished, auth.adminId, note || null, now, id]
    );

    const [updated]: any = await db.query('SELECT * FROM beritas WHERE id = ?', [id]);
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
