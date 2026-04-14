import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const [list]: any = await db.query('SELECT * FROM bapemperda_info ORDER BY createdAt DESC');
  const result = await Promise.all(list.map(async (item: any) => {
    const [anggota] = await db.query('SELECT * FROM anggota_bapemperda WHERE bapemperdaInfoId = ? ORDER BY `order` ASC', [item.id]);
    return { ...item, anggota };
  }));
  return NextResponse.json(result);
}
