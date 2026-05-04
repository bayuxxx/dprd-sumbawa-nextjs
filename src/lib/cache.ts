/**
 * In-memory cache dengan TTL + tag-based invalidation.
 *
 * Cocok untuk Route Handlers di Next.js (tidak bisa pakai 'use cache' directive).
 * Cache ini hidup dalam satu proses Node.js — di-share antar semua request
 * yang masuk ke worker yang sama.
 *
 * Cara pakai:
 *   const data = await getOrSet('key', ['tag1'], () => db.query(...), 60);
 *
 * Untuk invalidate (setelah mutasi):
 *   invalidateTag('tag1');
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number; // Date.now() + ttl * 1000
  tags: string[];
}

declare global {
  // eslint-disable-next-line no-var
  var _appCache: Map<string, CacheEntry<unknown>> | undefined;
}

// Singleton cache store — survive hot-reload di dev
const store: Map<string, CacheEntry<unknown>> =
  global._appCache ?? new Map();

if (process.env.NODE_ENV !== 'production') {
  global._appCache = store;
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Ambil dari cache, atau jalankan `fetcher` dan simpan hasilnya.
 *
 * @param key    - Cache key unik (mis. "berita:list:page=1")
 * @param tags   - Tag untuk bulk invalidation (mis. ["berita"])
 * @param fetcher - Async function yang mengambil data
 * @param ttlSeconds - Masa cache dalam detik (default 60)
 */
export async function getOrSet<T>(
  key: string,
  tags: string[],
  fetcher: () => Promise<T>,
  ttlSeconds = 60,
): Promise<T> {
  const cached = store.get(key) as CacheEntry<T> | undefined;

  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const data = await fetcher();
  store.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
    tags,
  });

  return data;
}

/**
 * Hapus semua entry cache yang memiliki tag tertentu.
 * Panggil ini di POST / PUT / DELETE handler.
 */
export function invalidateTag(tag: string): void {
  for (const [key, entry] of store.entries()) {
    if (entry.tags.includes(tag)) {
      store.delete(key);
    }
  }
}

/**
 * Hapus multiple tag sekaligus (shorthand).
 */
export function invalidateTags(tags: string[]): void {
  tags.forEach(invalidateTag);
}

/**
 * Hapus satu key secara langsung (untuk invalidation yang sangat spesifik).
 */
export function invalidateKey(key: string): void {
  store.delete(key);
}

/**
 * Stats cache saat ini (untuk /api/health endpoint).
 */
export function getCacheStats() {
  const now = Date.now();
  let active = 0;
  let expired = 0;

  for (const entry of store.values()) {
    if (now < entry.expiresAt) active++;
    else expired++;
  }

  return { total: store.size, active, expired };
}
