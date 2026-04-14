import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) return NextResponse.json({ message: 'Username dan password diperlukan.' }, { status: 400 });

    const [rows]: any = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (rows.length === 0) return NextResponse.json({ message: 'Username atau password salah.' }, { status: 401 });
    const admin = rows[0];

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return NextResponse.json({ message: 'Username atau password salah.' }, { status: 401 });

    const token = jwt.sign(
      { adminId: admin.id, username: admin.username },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
    );
    return NextResponse.json({ token, admin: { id: admin.id, username: admin.username } });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Terjadi kesalahan.' }, { status: 500 });
  }
}
