/**
 * Migration 006: Seed data e-Magazine, Info Publik, dan Tautan
 * Tanggal: 2025-04-15
 */

const crypto = require('crypto');

const id = () => crypto.randomUUID().replace(/-/g, '').substring(0, 25);
const now = new Date();

const EMAGAZINES = [
  { title: 'Majalah DPRD KSB', edisi: 'Edisi 1', order: 1 },
  { title: 'Majalah DPRD KSB', edisi: 'Edisi 2', order: 2 },
  { title: 'Majalah DPRD KSB', edisi: 'Edisi 3', order: 3 },
  { title: 'Majalah DPRD KSB', edisi: 'Edisi 4', order: 4 },
  { title: 'Majalah DPRD KSB', edisi: 'Edisi 5', order: 5 },
  { title: 'Majalah DPRD KSB', edisi: 'Edisi 6', order: 6 },
];

const INFO_PUBLIK = [
  { title: 'LHKPN', icon: '📄', url: 'https://elhkpn.kpk.go.id', order: 1 },
  { title: 'JDIH', icon: '⚖️', url: 'https://jdih.sumbawabarat.go.id', order: 2 },
  { title: 'PPID', icon: '🔍', url: 'https://ppid.sumbawabarat.go.id', order: 3 },
  { title: 'SIAKBM', icon: '📊', url: 'https://siakbm.sumbawabarat.go.id', order: 4 },
  { title: 'Rekrutmen CPNS', icon: '👔', url: 'https://sscasn.bkn.go.id', order: 5 },
  { title: 'Pengaduan LHKPN', icon: '📞', url: 'https://kpk.go.id/id/layanan-publik/pengaduan', order: 6 },
  { title: 'Kemkes', icon: '🏥', url: 'https://kemkes.go.id', order: 7 },
];

const TAUTANS = [
  { title: 'e-Gov Sumbawa Barat', url: 'https://sumbawabarat.go.id', order: 1 },
  { title: 'JDIH', url: 'https://jdih.sumbawabarat.go.id', order: 2 },
  { title: 'PPID', url: 'https://ppid.sumbawabarat.go.id', order: 3 },
  { title: 'LHKPN', url: 'https://elhkpn.kpk.go.id', order: 4 },
  { title: 'Rekrutmen', url: 'https://sscasn.bkn.go.id', order: 5 },
  { title: 'SIMPEG', url: 'https://simpeg.sumbawabarat.go.id', order: 6 },
];

async function run(db) {
  console.log('  Seeding emagazines...');
  for (const item of EMAGAZINES) {
    const [ex] = await db.execute('SELECT id FROM emagazines WHERE edisi = ?', [item.edisi]);
    if (ex.length > 0) { console.log(`    SKIP "${item.edisi}"`); continue; }
    await db.execute(
      'INSERT INTO emagazines (id, title, edisi, imageUrl, fileUrl, isActive, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id(), item.title, item.edisi, null, null, 1, item.order, now, now]
    );
    console.log(`    INSERT "${item.edisi}"`);
  }

  console.log('  Seeding info_publik...');
  for (const item of INFO_PUBLIK) {
    const [ex] = await db.execute('SELECT id FROM info_publik WHERE title = ?', [item.title]);
    if (ex.length > 0) { console.log(`    SKIP "${item.title}"`); continue; }
    await db.execute(
      'INSERT INTO info_publik (id, title, icon, url, isActive, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id(), item.title, item.icon, item.url, 1, item.order, now, now]
    );
    console.log(`    INSERT "${item.title}"`);
  }

  console.log('  Seeding tautans...');
  for (const item of TAUTANS) {
    const [ex] = await db.execute('SELECT id FROM tautans WHERE title = ?', [item.title]);
    if (ex.length > 0) { console.log(`    SKIP "${item.title}"`); continue; }
    await db.execute(
      'INSERT INTO tautans (id, title, url, isActive, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id(), item.title, item.url, 1, item.order, now, now]
    );
    console.log(`    INSERT "${item.title}"`);
  }
}

module.exports = { run };
