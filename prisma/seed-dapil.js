/**
 * Seed data Daerah Pemilihan DPRD Kabupaten Sumbawa Barat
 * 5 Dapil berdasarkan 8 kecamatan yang ada
 * Jalankan: node prisma/seed-dapil.js
 */

const mysql = require('mysql2/promise');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

const id = () => crypto.randomUUID().replace(/-/g, '').substring(0, 25);

// Pembagian dapil berdasarkan kecamatan Kabupaten Sumbawa Barat
// Total 20 kursi DPRD KSB dibagi 5 dapil
const DAPIL = [
  {
    nama: 'Daerah Pemilihan Sumbawa Barat 1',
    slug: 'dapil-ksb-1',
    wilayah: 'Kecamatan Taliwang',
    jumlahKursi: 6,
    deskripsi: 'Daerah Pemilihan Sumbawa Barat 1 meliputi Kecamatan Taliwang sebagai ibukota Kabupaten Sumbawa Barat.',
    isAktif: true,
    order: 1,
    anggota: [
      { name: 'Nama Anggota 1', partai: 'Partai Golongan Karya', order: 1 },
      { name: 'Nama Anggota 2', partai: 'Partai Gerakan Indonesia Raya', order: 2 },
      { name: 'Nama Anggota 3', partai: 'Partai Kebangkitan Bangsa', order: 3 },
      { name: 'Nama Anggota 4', partai: 'Partai Keadilan Sejahtera', order: 4 },
      { name: 'Nama Anggota 5', partai: 'Partai Demokrat', order: 5 },
      { name: 'Nama Anggota 6', partai: 'Partai Nasional Demokrat', order: 6 },
    ],
  },
  {
    nama: 'Daerah Pemilihan Sumbawa Barat 2',
    slug: 'dapil-ksb-2',
    wilayah: 'Kecamatan Seteluk',
    jumlahKursi: 4,
    deskripsi: 'Daerah Pemilihan Sumbawa Barat 2 meliputi Kecamatan Seteluk.',
    isAktif: true,
    order: 2,
    anggota: [
      { name: 'Nama Anggota 1', partai: 'Partai Golongan Karya', order: 1 },
      { name: 'Nama Anggota 2', partai: 'Partai Gerakan Indonesia Raya', order: 2 },
      { name: 'Nama Anggota 3', partai: 'Partai Kebangkitan Bangsa', order: 3 },
      { name: 'Nama Anggota 4', partai: 'Partai Demokrat', order: 4 },
    ],
  },
  {
    nama: 'Daerah Pemilihan Sumbawa Barat 3',
    slug: 'dapil-ksb-3',
    wilayah: 'Kecamatan Brang Rea, Kecamatan Brang Ene',
    jumlahKursi: 4,
    deskripsi: 'Daerah Pemilihan Sumbawa Barat 3 meliputi Kecamatan Brang Rea dan Kecamatan Brang Ene.',
    isAktif: true,
    order: 3,
    anggota: [
      { name: 'Nama Anggota 1', partai: 'Partai Golongan Karya', order: 1 },
      { name: 'Nama Anggota 2', partai: 'Partai Gerakan Indonesia Raya', order: 2 },
      { name: 'Nama Anggota 3', partai: 'Partai Nasional Demokrat', order: 3 },
      { name: 'Nama Anggota 4', partai: 'Partai Kebangkitan Bangsa', order: 4 },
    ],
  },
  {
    nama: 'Daerah Pemilihan Sumbawa Barat 4',
    slug: 'dapil-ksb-4',
    wilayah: 'Kecamatan Jereweh, Kecamatan Sekongkang',
    jumlahKursi: 3,
    deskripsi: 'Daerah Pemilihan Sumbawa Barat 4 meliputi Kecamatan Jereweh dan Kecamatan Sekongkang.',
    isAktif: true,
    order: 4,
    anggota: [
      { name: 'Nama Anggota 1', partai: 'Partai Golongan Karya', order: 1 },
      { name: 'Nama Anggota 2', partai: 'Partai Gerakan Indonesia Raya', order: 2 },
      { name: 'Nama Anggota 3', partai: 'Partai Keadilan Sejahtera', order: 3 },
    ],
  },
  {
    nama: 'Daerah Pemilihan Sumbawa Barat 5',
    slug: 'dapil-ksb-5',
    wilayah: 'Kecamatan Maluk, Kecamatan Poto Tano',
    jumlahKursi: 3,
    deskripsi: 'Daerah Pemilihan Sumbawa Barat 5 meliputi Kecamatan Maluk dan Kecamatan Poto Tano.',
    isAktif: true,
    order: 5,
    anggota: [
      { name: 'Nama Anggota 1', partai: 'Partai Golongan Karya', order: 1 },
      { name: 'Nama Anggota 2', partai: 'Partai Gerakan Indonesia Raya', order: 2 },
      { name: 'Nama Anggota 3', partai: 'Partai Nasional Demokrat', order: 3 },
    ],
  },
];

async function main() {
  const db = await mysql.createConnection(process.env.DATABASE_URL);
  const now = new Date();

  console.log('\nSeeding daerah_pemilihan...');

  for (const dapil of DAPIL) {
    const [exDapil] = await db.execute('SELECT id FROM daerah_pemilihan WHERE slug = ?', [dapil.slug]);
    let dapilId;

    if (exDapil.length > 0) {
      dapilId = exDapil[0].id;
      console.log(`  SKIP  "${dapil.nama}"`);
    } else {
      dapilId = id();
      await db.execute(
        'INSERT INTO daerah_pemilihan (id, nama, slug, wilayah, jumlahKursi, imageUrl, deskripsi, isAktif, `order`, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [dapilId, dapil.nama, dapil.slug, dapil.wilayah, dapil.jumlahKursi, null, dapil.deskripsi, dapil.isAktif ? 1 : 0, dapil.order, now, now]
      );
      console.log(`  INSERT "${dapil.nama}" (${dapil.jumlahKursi} kursi)`);
    }

    for (const anggota of dapil.anggota) {
      const [exAng] = await db.execute(
        'SELECT id FROM anggota_dapil WHERE dapilId = ? AND name = ?',
        [dapilId, anggota.name]
      );
      if (exAng.length > 0) { console.log(`    SKIP  "${anggota.name}"`); continue; }
      await db.execute(
        'INSERT INTO anggota_dapil (id, name, partai, imageUrl, `order`, dapilId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id(), anggota.name, anggota.partai, null, anggota.order, dapilId, now, now]
      );
      console.log(`    INSERT "${anggota.name}" [${anggota.partai}]`);
    }
  }

  await db.end();
  console.log('\nSelesai.');
}

main().catch((e) => { console.error(e); process.exit(1); });
