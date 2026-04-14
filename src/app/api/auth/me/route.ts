import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ message: 'Token tidak ditemukan.' }, { status: 401 });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { adminId: string; username: string; role: string };
    const [rows]: any = await db.query('SELECT id, username, role, lastLoginAt FROM admins WHERE id = ?', [decoded.adminId]);
    if (rows.length === 0) return NextResponse.json({ message: 'Admin tidak ditemukan.' }, { status: 401 });
    return NextResponse.json(rows[0]);
  } catch {
    return NextResponse.json({ message: 'Token tidak valid.' }, { status: 401 });
  }
}
