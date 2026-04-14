import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Verify JWT token from Authorization header.
 * Returns adminId if valid, or a NextResponse error.
 */
export function verifyAuth(req: NextRequest): { adminId: string } | NextResponse {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'Token tidak ditemukan. Silakan login.' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { adminId: string };
    return { adminId: decoded.adminId };
  } catch {
    return NextResponse.json(
      { message: 'Token tidak valid atau sudah kadaluarsa.' },
      { status: 401 }
    );
  }
}

/**
 * Helper to check if result is an error response
 */
export function isAuthError(result: { adminId: string } | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
