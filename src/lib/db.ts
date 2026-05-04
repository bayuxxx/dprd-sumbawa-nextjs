import mysql from 'mysql2/promise';

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
}

const isProd = process.env.NODE_ENV === 'production';

function createPool(): mysql.Pool {
  const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    // prod: lebih banyak koneksi, dev: minimal agar tidak exhausted saat hot-reload
    connectionLimit: isProd ? 10 : 5,
    // antrian request — kalau penuh baru lempar error
    queueLimit: 100,
    // timeout connect ke MySQL server
    connectTimeout: 10000,
    // tutup koneksi yg idle setelah 30 detik (lebih agresif agar tidak numpuk)
    idleTimeout: 30000,
    // keepAlive: cegah koneksi mati diam-diam karena MySQL wait_timeout
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    timezone: '+00:00',
  });

  // Log koneksi yang error agar mudah di-debug
  pool.on('connection', (conn) => {
    conn.on('error', (err) => {
      console.error('[DB] Connection error:', err.code, err.message);
    });
  });

  return pool;
}

// Singleton: satu pool per proses Node.js
// global._mysqlPool mencegah pool baru dibuat setiap hot-reload di dev
const db: mysql.Pool = global._mysqlPool ?? createPool();

if (!isProd) {
  // Simpan di global hanya saat dev (hot-reload safety)
  global._mysqlPool = db;
}

export default db;
