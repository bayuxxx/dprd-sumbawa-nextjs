import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathSegments } = await params;
  const filePath = join(process.cwd(), 'uploads', ...pathSegments);

  if (!existsSync(filePath)) {
    return NextResponse.json({ message: 'File not found' }, { status: 404 });
  }

  const file = await readFile(filePath);
  const ext = filePath.split('.').pop()?.toLowerCase() || '';
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif',
    webp: 'image/webp', svg: 'image/svg+xml', mp3: 'audio/mpeg', mp4: 'video/mp4',
    pdf: 'application/pdf',
  };

  return new NextResponse(file, {
    headers: {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Content-Length': file.length.toString(),
      'Content-Disposition': ext === 'pdf' ? 'inline' : 'inline',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
