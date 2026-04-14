/**
 * Migration: Add role system, review workflow, and komentar table
 * Run: node scripts/migrate-roles.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  const db = await mysql.createConnection(process.env.DATABASE_URL);
  console.log('Connected to database...');

  const migrations = [
    // 1. Add role and lastLoginAt to admins
    `ALTER TABLE admins 
     ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'super_admin',
     ADD COLUMN IF NOT EXISTS lastLoginAt DATETIME NULL`,

    // 2. Add review fields to beritas
    `ALTER TABLE beritas
     ADD COLUMN IF NOT EXISTS authorId VARCHAR(25) NULL,
     ADD COLUMN IF NOT EXISTS reviewStatus VARCHAR(20) NOT NULL DEFAULT 'approved',
     ADD COLUMN IF NOT EXISTS reviewedBy VARCHAR(25) NULL,
     ADD COLUMN IF NOT EXISTS reviewNote TEXT NULL`,

    // 3. Update existing beritas: published ones are approved
    `UPDATE beritas SET reviewStatus = 'approved' WHERE isPublished = 1`,
    `UPDATE beritas SET reviewStatus = 'pending' WHERE isPublished = 0`,

    // 4. Create komentar_berita table
    `CREATE TABLE IF NOT EXISTS komentar_berita (
      id VARCHAR(25) NOT NULL PRIMARY KEY,
      beritaId VARCHAR(25) NOT NULL,
      nama VARCHAR(255) NOT NULL,
      email VARCHAR(255) NULL,
      isi TEXT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      reviewedBy VARCHAR(25) NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_beritaId (beritaId),
      INDEX idx_status (status)
    )`,
  ];

  for (const sql of migrations) {
    try {
      await db.execute(sql);
      console.log('OK:', sql.substring(0, 60) + '...');
    } catch (err) {
      // IF NOT EXISTS handles duplicates gracefully
      if (err.code === 'ER_DUP_FIELDNAME' || err.message.includes('Duplicate column')) {
        console.log('SKIP (already exists):', sql.substring(0, 60) + '...');
      } else {
        console.error('ERROR:', err.message);
      }
    }
  }

  await db.end();
  console.log('\nMigration complete.');
  console.log('Note: Existing admins have role="super_admin" by default.');
  console.log('Update specific accounts via admin panel to set role="news_editor".');
}

migrate().catch(console.error);
