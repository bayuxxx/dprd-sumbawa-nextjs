/**
 * Seed data Fraksi DPRD Sumbawa Barat 2024-2029
 * Jalankan: node prisma/seed-fraksi.js
 */

const mysql = require('mysql2/promise');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

const id = () => crypto.randomUUID().replace(/-/g, '').substring(0, 25);

const MASA_JABATAN = {
  periode: '2024-2029',
  tahunMulai: 2024,
  tahunSelesai: 2029,
  isAktif: true,
  keterangan: 'Masa jabatan aktif DPRD KSB periode 2024-2029',
  order: 1,
};

// Data fraksi DPRD Sumbawa Barat 2024-2029
// Sesuaikan kursi dan anggota dengan data riil
const FRAKSI = [
  {
    name: 'Fraksi Partai Golongan Karya',
    shortName: 'F-Golkar',
    slug: 'golkar',
    color: '#FFD700',
    kursi: 4,
    deskripsi: 'Fraksi Partai Golongan Karya DPRD Kabupaten Sumbawa Barat.',
    order: 1,
    anggota: [
      { name: 'Nama Anggota 1', jabatan: 'Ketua Fraksi', faction: 'Golkar', order: 1 },
      { name: 'Nama Anggota 2', jabatan: 'Wakil Ketua', faction: 'Golkar', order: 2 },
      { name: 'Nama Anggota 3', jabatan: 'Sekretaris', faction: 'Golkar', order: 3 },
      { name: 'Nama Anggota 4', jabatan: 'Anggota', faction: 'Golkar', order: 4 },
    ],
  },
  {
    name: 'Fraksi Partai Gerakan Indonesia Raya',
    shortName: 'F-Gerindra',
    slug: 'gerindra',
    color: '#c8102e',
    kursi: 3,
    deskripsi: 'Fraksi Partai Gerindra DPRD Kabupaten Sumbawa Barat.',
    order: 2,
    anggota: [
      { name: 'Nama Anggota 1', jabatan: 'Ketua Fraksi', faction: 'Gerindra', order: 1 },
      { name: 'Nama Anggota 2', jabatan: 'Wakil Ketua', faction: 'Gerindra', order: 2 },
      { name: 'Nama Anggota 3', jabatan: 'Anggota', faction: 'Gerindra', order: 3 },
    ],
  },
  {
    name: 'Fraksi Partai Kebangkitan Bangsa',
    shortName: 'F-PKB',
    slug: 'pkb',
    color: '#00A651',
    kursi: 3,
    deskripsi: 'Fraksi Partai Kebangkitan Bangsa DPRD Kabupaten Sumbawa Barat.',
    order: 3,
    anggota: [
      { name: 'Nama Anggota 1', jabatan: 'Ketua Fraksi', faction: 'PKB', order: 1 },
      { name: 'Nama Anggota 2', jabatan: 'Wakil Ketua', faction: 'PKB', order: 2 },
      { name: 'Nama Anggota 3', jabatan: 'Anggota', faction: 'PKB', order: 3 },
    ],
  },
  {
    name: 'Fraksi Partai Keadilan Sejahtera',
    shortName: 'F-PKS',
    slug: 'pks',
    color: '#FF6600',
    kursi: 2,
    deskripsi: 'Fraksi Partai Keadilan Sejahtera DPRD Kabupaten Sumbawa Barat.',
    order: 4,
    anggota: [
      { name: 'Nama Anggota 1', jabatan: 'Ketua Fraksi', faction: 'PKS', order: 1 },
      { name: 'Nama Anggota 2', jabatan: 'Anggota', faction: 'PKS', order: 2 },
    ],
  },
  {
    name: 'Fraksi Partai Demokrat',
    shortName: 'F-Demokrat',
    slug: 'demokrat',
    color: '#0070C0',
    kursi: 2,
    deskripsi: 'Fraksi Partai Demokrat DPRD Kabupaten Sumbawa Barat.',
    order: 5,
    anggota: [
      { name: 'Nama Anggota 1', jabatan: 'Ketua Fraksi', faction: 'Demokrat', order: 1 },
      { name: 'Nama Anggota 2', jabatan: 'Anggota', faction: 'Demokrat', order: 2 },
    ],
  },
  {
    name: 'Fraksi Partai Nasional Demokrat',
    shortName: 'F-NasDem',
    slug: 'nasdem',
    color: '#1E90FF',
    kursi: 2,
    deskripsi: 'Fraksi Partai NasDem DPRD Kabupaten Sumbawa Barat.',
    order: 6,
    anggota: [
      { name: 'Nama Anggota 1', jabatan: 'Ketua Fraksi', faction: 'NasDem', order: 1 },
      { name: 'Nama Anggota 2', jabatan: 'Anggota', faction: 'NasDem', order: 2 },
    ],
  },
  {
    name: 'Fraksi Gabungan',
    shortName: 'F-Gabungan',
    slug: 'gabungan',
    color: '#6B7280',
    kursi: 4,
    deskripsi: 'Fraksi Gabungan DPRD Kabupaten Sumbawa Barat.',
    order: 7,
    anggota: [
      { name: 'Nama Anggota 1', jabatan: 'Ketua Fraksi', faction: 'Gabungan', order: 1 },
      { name: 'Nama Anggota 2', jabatan: 'Wakil Ketua', faction: 'Gabungan', order: 2 },
      { name: 'Nama Anggota 3', jabatan: 'Sekretaris', faction: 'Gabungan', order: 3 },
      { name: 'Nama Anggota 4', jabatan: 'Anggota', faction: 'Gabungan', order: 4 },
    ],
  },
];

async function main() {
  const db = await mysql.createConnection(process.env.DATABASE_URL);
  const now = new Date();

  // 1. Seed masa_jabatan_fraksi
  console.log('\nSeeding masa_jabatan_fraksi...');
  let mjId;
  const [exMj] = await db.execute('SELECT id FROM masa_jabatan_fraksi WHERE periode = ?', [MASA_JABATAN.periode]);
  if (exMj.length > 0) {
    mjId = exMj[0].id;
    console.log(`  SKIP  "${MASA_JABATAN.periode}" (id: ${mjId})`);
  } else {
    mjId = id();
    await db.execute(
      'INSERT INTO masa_jabatan_fraksi (id, periode, tahunMulai, tahunSelesai, isAktif, keterangan, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [mjId, MASA_JABATAN.periode, MASA_JABATAN.tahunMulai, MASA_JABATAN.tahunSelesai, MASA_JABATAN.isAktif ? 1 : 0, MASA_JABATAN.keterangan, MASA_JABATAN.order, now, now]
    );
    console.log(`  INSERT "${MASA_JABATAN.periode}" (id: ${mjId})`);
  }

  // 2. Seed fraksi_info + anggota_fraksi
  console.log('\nSeeding fraksi_info...');
  for (const fraksi of FRAKSI) {
    const [exFr] = await db.execute('SELECT id FROM fraksi_info WHERE slug = ?', [fraksi.slug]);
    let fraksiId;

    if (exFr.length > 0) {
      fraksiId = exFr[0].id;
      console.log(`  SKIP  "${fraksi.name}"`);
    } else {
      fraksiId = id();
      await db.execute(
        'INSERT INTO fraksi_info (id, name, shortName, slug, color, kursi, masaJabatanId, deskripsi, logoUrl, isAktif, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [fraksiId, fraksi.name, fraksi.shortName, fraksi.slug, fraksi.color, fraksi.kursi, mjId, fraksi.deskripsi, null, 1, fraksi.order, now, now]
      );
      console.log(`  INSERT "${fraksi.name}"`);
    }

    // Seed anggota
    for (const anggota of fraksi.anggota) {
      const [exAng] = await db.execute(
        'SELECT id FROM anggota_fraksi WHERE fraksiInfoId = ? AND name = ? AND jabatan = ?',
        [fraksiId, anggota.name, anggota.jabatan]
      );
      if (exAng.length > 0) { console.log(`    SKIP  anggota "${anggota.name}"`); continue; }
      await db.execute(
        'INSERT INTO anggota_fraksi (id, name, jabatan, faction, imageUrl, `order`, fraksiInfoId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id(), anggota.name, anggota.jabatan, anggota.faction, null, anggota.order, fraksiId, now, now]
      );
      console.log(`    INSERT anggota "${anggota.name}" [${anggota.jabatan}]`);
    }
  }

  await db.end();
  console.log('\nSelesai.');
}

main().catch((e) => { console.error(e); process.exit(1); });
