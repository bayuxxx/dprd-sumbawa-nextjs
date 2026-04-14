/**
 * Prisma Seed
 * Jalankan: npm run db:seed
 */

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

const id = () => crypto.randomUUID().replace(/-/g, '').substring(0, 25);

const ACCOUNTS = [
  { username: 'superadmin', password: 'SuperAdmin@2025!', role: 'super_admin' },
  { username: 'admin_dprd', password: 'Admin@2025!',      role: 'admin'       },
  { username: 'editor1',    password: 'Editor1@2025!',    role: 'news_editor' },
  { username: 'editor2',    password: 'Editor2@2025!',    role: 'news_editor' },
  { username: 'editor3',    password: 'Editor3@2025!',    role: 'news_editor' },
];

const EMAGAZINES = [
  { title: 'Majalah DPRD KSB', edisi: 'Edisi 1', order: 1 },
  { title: 'Majalah DPRD KSB', edisi: 'Edisi 2', order: 2 },
  { title: 'Majalah DPRD KSB', edisi: 'Edisi 3', order: 3 },
  { title: 'Majalah DPRD KSB', edisi: 'Edisi 4', order: 4 },
  { title: 'Majalah DPRD KSB', edisi: 'Edisi 5', order: 5 },
  { title: 'Majalah DPRD KSB', edisi: 'Edisi 6', order: 6 },
];

const INFO_PUBLIK = [
  { title: 'LHKPN',          icon: '📄', url: 'https://elhkpn.kpk.go.id',                        order: 1 },
  { title: 'JDIH',           icon: '⚖️', url: 'https://jdih.sumbawabarat.go.id',                 order: 2 },
  { title: 'PPID',           icon: '🔍', url: 'https://ppid.sumbawabarat.go.id',                 order: 3 },
  { title: 'SIAKBM',         icon: '📊', url: 'https://siakbm.sumbawabarat.go.id',               order: 4 },
  { title: 'Rekrutmen CPNS', icon: '👔', url: 'https://sscasn.bkn.go.id',                        order: 5 },
  { title: 'Pengaduan LHKPN',icon: '📞', url: 'https://kpk.go.id/id/layanan-publik/pengaduan',   order: 6 },
  { title: 'Kemkes',         icon: '🏥', url: 'https://kemkes.go.id',                            order: 7 },
];

const TAUTANS = [
  { title: 'e-Gov Sumbawa Barat', url: 'https://sumbawabarat.go.id',          order: 1 },
  { title: 'JDIH',                url: 'https://jdih.sumbawabarat.go.id',     order: 2 },
  { title: 'PPID',                url: 'https://ppid.sumbawabarat.go.id',     order: 3 },
  { title: 'LHKPN',               url: 'https://elhkpn.kpk.go.id',           order: 4 },
  { title: 'Rekrutmen',           url: 'https://sscasn.bkn.go.id',           order: 5 },
  { title: 'SIMPEG',              url: 'https://simpeg.sumbawabarat.go.id',   order: 6 },
];

async function seedAdmins(db, now) {
  console.log('\nSeeding admins...');
  for (const acc of ACCOUNTS) {
    const [ex] = await db.execute('SELECT id FROM admins WHERE username = ?', [acc.username]);
    if (ex.length > 0) { console.log(`  SKIP  "${acc.username}"`); continue; }
    const hashed = await bcrypt.hash(acc.password, 10);
    await db.execute(
      'INSERT INTO admins (id, username, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
      [id(), acc.username, hashed, acc.role, now, now]
    );
    console.log(`  INSERT "${acc.username}" [${acc.role}]`);
  }
}

async function seedEMagazines(db, now) {
  console.log('\nSeeding e-magazines...');
  for (const item of EMAGAZINES) {
    const [ex] = await db.execute('SELECT id FROM emagazines WHERE edisi = ?', [item.edisi]);
    if (ex.length > 0) { console.log(`  SKIP  "${item.edisi}"`); continue; }
    await db.execute(
      'INSERT INTO emagazines (id, title, edisi, imageUrl, fileUrl, isActive, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id(), item.title, item.edisi, null, null, 1, item.order, now, now]
    );
    console.log(`  INSERT "${item.edisi}"`);
  }
}

async function seedInfoPublik(db, now) {
  console.log('\nSeeding info_publik...');
  for (const item of INFO_PUBLIK) {
    const [ex] = await db.execute('SELECT id FROM info_publik WHERE title = ?', [item.title]);
    if (ex.length > 0) { console.log(`  SKIP  "${item.title}"`); continue; }
    await db.execute(
      'INSERT INTO info_publik (id, title, icon, url, isActive, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id(), item.title, item.icon, item.url, 1, item.order, now, now]
    );
    console.log(`  INSERT "${item.title}"`);
  }
}

async function seedTautans(db, now) {
  console.log('\nSeeding tautans...');
  for (const item of TAUTANS) {
    const [ex] = await db.execute('SELECT id FROM tautans WHERE title = ?', [item.title]);
    if (ex.length > 0) { console.log(`  SKIP  "${item.title}"`); continue; }
    await db.execute(
      'INSERT INTO tautans (id, title, url, isActive, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id(), item.title, item.url, 1, item.order, now, now]
    );
    console.log(`  INSERT "${item.title}"`);
  }
}

async function main() {
  const db = await mysql.createConnection(process.env.DATABASE_URL);
  const now = new Date();

  await seedAdmins(db, now);
  await seedEMagazines(db, now);
  await seedInfoPublik(db, now);
  await seedTautans(db, now);

  await db.end();
  console.log('\nSelesai.');
}

main().catch((e) => { console.error(e); process.exit(1); });
