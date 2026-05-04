import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCacheStats } from '@/lib/cache';

export async function GET() {
  // Pool stats dari mysql2 (internal properties)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pool = db as any;
  const poolStats = {
    all: pool.pool?._allConnections?.length ?? 0,
    free: pool.pool?._freeConnections?.length ?? 0,
    queued: pool.pool?._connectionQueue?.length ?? 0,
    used:
      (pool.pool?._allConnections?.length ?? 0) -
      (pool.pool?._freeConnections?.length ?? 0),
  };

  const cacheStats = getCacheStats();

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    db: poolStats,
    cache: cacheStats,
  });
}
