-- Migration: Tambah tabel daerah_pemilihan dan anggota_dapil
-- Jalankan di database production via phpMyAdmin atau MySQL CLI

CREATE TABLE IF NOT EXISTS `daerah_pemilihan` (
  `id` VARCHAR(191) NOT NULL,
  `nama` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `wilayah` TEXT NULL,
  `jumlahKursi` INT NOT NULL DEFAULT 0,
  `imageUrl` TEXT NULL,
  `deskripsi` TEXT NULL,
  `isAktif` TINYINT(1) NOT NULL DEFAULT 1,
  `order` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `daerah_pemilihan_slug_key` (`slug`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `anggota_dapil` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `partai` VARCHAR(191) NULL,
  `imageUrl` TEXT NULL,
  `order` INT NOT NULL DEFAULT 0,
  `dapilId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `anggota_dapil_dapilId_fkey` (`dapilId`),
  CONSTRAINT `anggota_dapil_dapilId_fkey` FOREIGN KEY (`dapilId`) REFERENCES `daerah_pemilihan` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
