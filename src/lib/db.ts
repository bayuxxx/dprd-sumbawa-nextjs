import mysql from 'mysql2/promise';

declare global {
  // eslint-disable-next-line no-var
  var db: mysql.Pool | undefined;
}

const db = global.db || mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  timezone: '+00:00',
});

if (process.env.NODE_ENV !== 'production') {
  global.db = db;
}

export default db;
