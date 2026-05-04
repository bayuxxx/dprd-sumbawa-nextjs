-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 16, 2026 at 07:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dprd_sumbawa`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` varchar(191) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `lastLoginAt` datetime(3) DEFAULT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'super_admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `createdAt`, `updatedAt`, `lastLoginAt`, `role`) VALUES
('1e8ea5e5a27e48478bc311562', 'admin_dprd', '$2b$10$okBDCopjVSs05QkiEmRSXeImCSCBRUVFxxxFcGmM5MD.c9Nz1//aW', '2026-04-15 00:52:29.001', '2026-04-15 00:52:29.001', NULL, 'admin'),
('5683521997714baa8cfc8b907', 'editor1', '$2b$10$K1p.2csEz8nvIoOhQqGrReZpzNzb5KJ/7D98bI3jyqmllI1oQtERS', '2026-04-14 23:23:21.367', '2026-04-14 15:27:13.045', '2026-04-14 15:27:21.891', 'news_editor'),
('661a8f77fa444c72a0a794f3c', 'editor3', '$2b$10$r9uY.KQDJ8Bu4m1oblF7nuB.oiTJpyzyhaJZ/4e0.FpzW/JcAb.ZG', '2026-04-14 23:23:21.367', '2026-04-14 23:23:21.367', NULL, 'news_editor'),
('a6d74fa3162140929cc58d3c8', 'editor2', '$2b$10$T.Pa5ngc3SJZ1Vbt7Ua9GewpSxSkgTPVXY4wEFF5V88IrEF.HfjFa', '2026-04-14 23:23:21.367', '2026-04-14 23:23:21.367', NULL, 'news_editor'),
('d776c897c1954b679e4901258', 'superadmin', '$2b$10$3B2ArTAIHwGKypYff/V4EeTOhv5AxIp36yvifZvXVDH2GYmp3gcoW', '2026-04-14 23:23:21.367', '2026-04-14 16:25:55.805', '2026-04-16 17:14:31.826', 'super_admin'),
('ebfaf14b7dac412090f292769', 'admin', '$2b$10$iNO0lkZoEV99bSo5kQFsVuDLFoPDbDHaMvGkIUGSQ3CH4SWhpLSX2', '2026-04-14 23:23:21.367', '2026-04-14 15:27:01.285', '2026-04-14 15:30:16.725', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `agendas`
--

CREATE TABLE `agendas` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `tanggal` datetime(3) NOT NULL,
  `waktu` varchar(191) NOT NULL DEFAULT '09.00 WITA',
  `lokasi` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL DEFAULT 'Kegiatan',
  `color` varchar(191) NOT NULL DEFAULT '#1a6bb5',
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `agendas`
--

INSERT INTO `agendas` (`id`, `title`, `tanggal`, `waktu`, `lokasi`, `category`, `color`, `isActive`, `createdAt`, `updatedAt`) VALUES
('0f17f9afbe2d4db58b9f06ccc', 'tes', '2026-04-16 00:00:00.000', '09.00 WITA', 'tes', 'Kegiatan', '#1a6bb5', 1, '2026-04-15 05:45:46.778', '2026-04-15 05:45:46.778');

-- --------------------------------------------------------

--
-- Table structure for table `anggota_bamus`
--

CREATE TABLE `anggota_bamus` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `jabatan` varchar(191) NOT NULL,
  `faction` varchar(191) DEFAULT NULL,
  `imageUrl` text DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `bamusInfoId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `anggota_bamus`
--

INSERT INTO `anggota_bamus` (`id`, `name`, `jabatan`, `faction`, `imageUrl`, `order`, `bamusInfoId`, `createdAt`, `updatedAt`) VALUES
('cmny5us5j000pygouh4lf557b', 'KAHARUDDIN UMAR', 'Ketua', 'F- PDI PERJUANGAN F- NASDEM', '/uploads/bamus/1776144250802-068A2792.jpg', 1, 'cmny5us5f000oygouswxmj78m', '2026-04-14 05:08:08.071', '2026-04-14 05:24:10.806'),
('cmny5us5j000qygou3jbeb3lj', 'BADARUDDIN DURI, S.Psi', 'Wakil Ketua', 'F- GERINDRA', '/uploads/bamus/1776144259629-068A2907.jpg', 2, 'cmny5us5f000oygouswxmj78m', '2026-04-14 05:08:08.071', '2026-04-14 05:24:19.632'),
('cmny5us5j000rygouen92t6jx', 'MERLIZA, S.SOS.,I.M.M', 'Wakil Ketua', '', '/uploads/bamus/1776144269401-068A2960.jpg', 3, 'cmny5us5f000oygouswxmj78m', '2026-04-14 05:08:08.071', '2026-04-14 05:24:29.406'),
('cmny5us5j000sygouf0sjhweu', 'RICK KAMALUDDIN', 'Anggota', 'F- PDI PERJUANGAN', '/uploads/bamus/1776144279440-068A2853.jpg', 4, 'cmny5us5f000oygouswxmj78m', '2026-04-14 05:08:08.071', '2026-04-14 05:24:39.443'),
('cmny5us5j000tygou98e1gh0e', 'RATNAWATI', 'Anggota', 'F- PDI PERJUANGAN F- NASDEM', '/uploads/bamus/1776144303599-068A2992.jpg', 5, 'cmny5us5f000oygouswxmj78m', '2026-04-14 05:08:08.071', '2026-04-14 05:25:03.603'),
('cmny5us5j000uygoupwelr653', 'RIZAL FIKRI', 'Anggota', 'F- GERINDRA', '/uploads/bamus/1776145737805-068A2913.jpg', 6, 'cmny5us5f000oygouswxmj78m', '2026-04-14 05:08:08.071', '2026-04-14 05:48:57.808'),
('cmny5us5j000vygou2um65cqx', 'RIYAN MAULANA, S.AP', 'Anggota', 'F- GOLKAR', '/uploads/bamus/1776145064227-RYAN_MAULANA.jpeg', 7, 'cmny5us5f000oygouswxmj78m', '2026-04-14 05:08:08.071', '2026-04-14 05:37:44.229'),
('cmny5us5j000wygouk6yxez6n', 'BASUKI AR, S.E', 'Anggota', 'F- GOLKAR', '/uploads/bamus/1776144339310-068A2735.jpg', 8, 'cmny5us5f000oygouswxmj78m', '2026-04-14 05:08:08.071', '2026-04-14 05:25:39.314'),
('cmny5us5j000xygouaxzehmdp', 'AHMAD RIVAI, S.K.M', 'Anggota', 'F- PKS', '/uploads/bamus/1776145722748-068A2728.jpg', 9, 'cmny5us5f000oygouswxmj78m', '2026-04-14 05:08:08.071', '2026-04-14 05:48:42.752'),
('cmny5us5j000yygou7xevag6a', 'MUHAMMAD RIZYAL, S.Sos,I', 'Anggota', 'F- PAN', '/uploads/bamus/1776144359638-068A2861.jpg', 10, 'cmny5us5f000oygouswxmj78m', '2026-04-14 05:08:08.071', '2026-04-14 05:25:59.642'),
('cmny5us5j000zygou6xifwry1', 'H. RIYADI, S.E', 'Anggota', 'F- PAN', '/uploads/bamus/1776144373381-068A2762.jpg', 11, 'cmny5us5f000oygouswxmj78m', '2026-04-14 05:08:08.071', '2026-04-14 05:26:13.385'),
('cmny5us5j0010ygouyynjd6nc', 'IWAN IRAWAN MARHALIM', 'Anggota', 'F- PPKB', '/uploads/bamus/1776144383737-068A2833.jpg', 12, 'cmny5us5f000oygouswxmj78m', '2026-04-14 05:08:08.071', '2026-04-14 05:26:23.741'),
('cmny5us5j0011ygou7do0dzat', 'ANDI LAWENG, S.H.,M.H', 'Anggota', 'F- PPKB', '/uploads/bamus/1776145040506-068A2899.jpg', 13, 'cmny5us5f000oygouswxmj78m', '2026-04-14 05:08:08.071', '2026-04-14 05:37:20.510'),
('cmny5us5j0012ygou70wworoh', 'DRS. SYAFRUDDIN, M.Si', 'Anggota', '', '/uploads/bamus/1776144411887-068A2805.jpg', 14, 'cmny5us5f000oygouswxmj78m', '2026-04-14 05:08:08.071', '2026-04-14 05:26:51.891');

-- --------------------------------------------------------

--
-- Table structure for table `anggota_banggar`
--

CREATE TABLE `anggota_banggar` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `jabatan` varchar(191) NOT NULL,
  `faction` varchar(191) DEFAULT NULL,
  `imageUrl` text DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `banggarInfoId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `anggota_banggar`
--

INSERT INTO `anggota_banggar` (`id`, `name`, `jabatan`, `faction`, `imageUrl`, `order`, `banggarInfoId`, `createdAt`, `updatedAt`) VALUES
('cmny5us5r0014ygouubfojy6y', 'KAHARUDDIN UMAR', 'Ketua', 'F- PDI PERJUANGAN', '/uploads/banggar/1776145113864-068A2792.jpg', 1, 'cmny5us5o0013ygouvpxvygq6', '2026-04-14 05:08:08.079', '2026-04-14 05:38:33.867'),
('cmny5us5r0015ygouofz3kxjq', 'BADARUDDIN DURI, S.Psi', 'Wakil Ketua', 'F- NASDEM', '/uploads/banggar/1776145122562-068A2907.jpg', 2, 'cmny5us5o0013ygouvpxvygq6', '2026-04-14 05:08:08.079', '2026-04-14 05:38:42.565'),
('cmny5us5r0016ygoue96mj0yr', 'MERLIZA, S.SOS.,I.M.M', 'Wakil Ketua', 'F- GERINDRA', '/uploads/banggar/1776145133679-068A2960.jpg', 3, 'cmny5us5o0013ygouvpxvygq6', '2026-04-14 05:08:08.079', '2026-04-14 05:38:53.684'),
('cmny5us5r0017ygounk22xoq1', 'NURJANNAH, S.AP', 'Anggota', 'F- PDI PERJUANGAN', '/uploads/banggar/1776145148866-068A2927.jpg', 4, 'cmny5us5o0013ygouvpxvygq6', '2026-04-14 05:08:08.079', '2026-04-14 05:39:08.871'),
('cmny5us5r0018ygouv6aqq19i', 'SANTRI YUSMULYADI, S.T', 'Anggota', 'F- PDI PERJUANGAN', '/uploads/banggar/1776145165258-068A2921.jpg', 5, 'cmny5us5o0013ygouvpxvygq6', '2026-04-14 05:08:08.079', '2026-04-14 05:39:25.263'),
('cmny5us5r0019ygousrsapxtn', 'MUSTAFA HZ', 'Anggota', 'F- NASDEM', '/uploads/banggar/1776145175773-068A2822.jpg', 6, 'cmny5us5o0013ygouvpxvygq6', '2026-04-14 05:08:08.079', '2026-04-14 05:39:35.777'),
('cmny5us5r001aygoucj5uanmj', 'EDI DWI PAWIRA, S.T', 'Anggota', 'F NASDEM', '/uploads/banggar/1776145185843-068A2843.jpg', 7, 'cmny5us5o0013ygouvpxvygq6', '2026-04-14 05:08:08.079', '2026-04-14 05:39:45.847'),
('cmny5us5r001bygoutru7tupa', 'MUHAMMAD ADNAN, S.Pd', 'Anggota', 'F- GERINDRA', '/uploads/banggar/1776145205251-068A2783.jpg', 8, 'cmny5us5o0013ygouvpxvygq6', '2026-04-14 05:08:08.079', '2026-04-14 05:40:05.255'),
('cmny5us5r001cygoue7rr1tqo', 'DRS. H.M. THAMZIL, MM', 'Anggota', 'F- GOLKAR', '/uploads/banggar/1776145219144-068A2747.jpg', 9, 'cmny5us5o0013ygouvpxvygq6', '2026-04-14 05:08:08.079', '2026-04-14 05:40:19.147'),
('cmny5us5r001dygououe1ku3k', 'NORVIE APERIANSYANI, S.T., MA', 'Anggota', 'F- PKS', '/uploads/banggar/1776145246481-068A2954.jpg', 10, 'cmny5us5o0013ygouvpxvygq6', '2026-04-14 05:08:08.079', '2026-04-14 05:40:46.484'),
('cmny5us5r001eygoue6t0mdxv', 'BAHARUNG', 'Anggota', 'F- PKS', '/uploads/banggar/1776145301146-068A2880.jpg', 11, 'cmny5us5o0013ygouvpxvygq6', '2026-04-14 05:08:08.079', '2026-04-14 05:41:41.149'),
('cmny5us5r001fygou4f9g9w2q', 'MOHAMMAD HATTA', 'Anggota', 'F- PAN', '/uploads/banggar/1776145313288-068A2818.jpg', 12, 'cmny5us5o0013ygouvpxvygq6', '2026-04-14 05:08:08.079', '2026-04-14 05:41:53.291'),
('cmny5us5r001gygouzyfrqhyb', 'KONDI PRANATA FAUZAN', 'Anggota', 'F- PPKB', '/uploads/banggar/1776145326032-068A2937.jpg', 13, 'cmny5us5o0013ygouvpxvygq6', '2026-04-14 05:08:08.079', '2026-04-14 05:42:06.036'),
('cmny5us5r001hygougzlfti8f', 'AHMAD, BSA, S.E, M.M', 'Anggota', 'F- PPKB', NULL, 14, 'cmny5us5o0013ygouvpxvygq6', '2026-04-14 05:08:08.079', '2026-04-14 05:08:08.079');

-- --------------------------------------------------------

--
-- Table structure for table `anggota_bapemperda`
--

CREATE TABLE `anggota_bapemperda` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `jabatan` varchar(191) NOT NULL,
  `faction` varchar(191) DEFAULT NULL,
  `imageUrl` text DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `bapemperdaInfoId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `anggota_bapemperda`
--

INSERT INTO `anggota_bapemperda` (`id`, `name`, `jabatan`, `faction`, `imageUrl`, `order`, `bapemperdaInfoId`, `createdAt`, `updatedAt`) VALUES
('cmny5us5y001jygouq3lvm8uz', 'ANDI LAWENG, S.H.,M.H', 'Ketua', 'F- PPKB', '/uploads/bapemperda/1776144635617-068A2899.jpg', 1, 'cmny5us5w001iygoussudzd5q', '2026-04-14 05:08:08.087', '2026-04-14 05:30:35.622'),
('cmny5us5y001kygougeyffh4p', 'RIYAN MAULANA, S.AP', 'Wakil Ketua', 'F- GERINDRA', '/uploads/bapemperda/1776144646190-RYAN_MAULANA.jpeg', 2, 'cmny5us5w001iygoussudzd5q', '2026-04-14 05:08:08.087', '2026-04-14 05:30:46.194'),
('cmny5us5y001lygouh2l48wr2', 'EDI DWI PAWIRA, S.T', 'Anggota', 'F- NASDEM', '/uploads/bapemperda/1776144958893-068A2843.jpg', 3, 'cmny5us5w001iygoussudzd5q', '2026-04-14 05:08:08.087', '2026-04-14 05:35:58.897'),
('cmny5us5y001mygouqa0wrbpy', 'RICK KAMALUDDIN', 'Anggota', 'F- PDI PERJUANGAN', '/uploads/bapemperda/1776144931903-068A2852.jpg', 4, 'cmny5us5w001iygoussudzd5q', '2026-04-14 05:08:08.087', '2026-04-14 05:35:31.906'),
('cmny5us5y001nygou28o7nlfp', 'BASUKI AR, S.E', 'Anggota', 'F- GOLKAR', '/uploads/bapemperda/1776145002815-068A2736.jpg', 5, 'cmny5us5w001iygoussudzd5q', '2026-04-14 05:08:08.087', '2026-04-14 05:36:42.820'),
('cmny5us5y001oygouw5eem6ci', 'NORVIE APERIANSYANI, S.T., MA', 'Anggota', 'F- PKS', '/uploads/bapemperda/1776144971236-068A2954.jpg', 6, 'cmny5us5w001iygoussudzd5q', '2026-04-14 05:08:08.087', '2026-04-14 05:36:11.239'),
('cmny5us5y001pygoucl4bgjb9', 'IWAN IRAWAN MARHALIM', 'Anggota', 'F- PAN', '/uploads/bapemperda/1776144990335-068A2833.jpg', 7, 'cmny5us5w001iygoussudzd5q', '2026-04-14 05:08:08.087', '2026-04-14 05:36:30.338'),
('cmny5us5y001qygouwrzowgtn', 'RATNAWATI', 'Anggota', 'F- PDI PERJUANGAN', '/uploads/bapemperda/1776144947610-068A2990.jpg', 8, 'cmny5us5w001iygoussudzd5q', '2026-04-14 05:08:08.087', '2026-04-14 05:35:47.615');

-- --------------------------------------------------------

--
-- Table structure for table `anggota_bk`
--

CREATE TABLE `anggota_bk` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `jabatan` varchar(191) NOT NULL,
  `faction` varchar(191) DEFAULT NULL,
  `imageUrl` text DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `bkInfoId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `anggota_bk`
--

INSERT INTO `anggota_bk` (`id`, `name`, `jabatan`, `faction`, `imageUrl`, `order`, `bkInfoId`, `createdAt`, `updatedAt`) VALUES
('cmny5us66001sygouawmmcjxy', 'AHMAD RIVAI, S.KM', 'Ketua', 'F- GOLKAR', '/uploads/bk/1776145676519-068A2728.jpg', 1, 'cmny5us65001rygougpa4hwch', '2026-04-14 05:08:08.095', '2026-04-14 05:47:56.524'),
('cmny5us66001tygoubx207dab', 'DRS. SYAFRUDDIN, M.Si', 'Wakil Ketua', 'F- PPKB', '/uploads/bk/1776145687384-068A2805.jpg', 2, 'cmny5us65001rygougpa4hwch', '2026-04-14 05:08:08.095', '2026-04-14 05:48:07.388'),
('cmny5us66001uygoumu5g2ikl', 'RIZAL FIKRI', 'Anggota', 'F- NASDEM', '/uploads/bk/1776145694258-068A2913.jpg', 3, 'cmny5us65001rygougpa4hwch', '2026-04-14 05:08:08.095', '2026-04-14 05:48:14.262');

-- --------------------------------------------------------

--
-- Table structure for table `anggota_dapil`
--

CREATE TABLE `anggota_dapil` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `partai` varchar(191) DEFAULT NULL,
  `imageUrl` text DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `dapilId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `anggota_dapil`
--

INSERT INTO `anggota_dapil` (`id`, `name`, `partai`, `imageUrl`, `order`, `dapilId`, `createdAt`, `updatedAt`) VALUES
('0e89eb628e924d72969f0d13b', 'Nama Anggota 4', 'Partai Kebangkitan Bangsa', NULL, 4, '4efa6a0e7e4e4c5b820127482', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('1179456417ab4fd3b6c784a30', 'Nama Anggota 5', 'Partai Demokrat', NULL, 5, 'c2f8a792aa894712805d907b7', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('1e580f4fbded4862ad300532f', 'Nama Anggota 2', 'Partai Gerakan Indonesia Raya', NULL, 2, '828361d5d89b44e384da319a0', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('1fe463076f3348e1a99ec528a', 'Nama Anggota 2', 'Partai Gerakan Indonesia Raya', NULL, 2, 'dc52445bc52047109d0f83a51', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('2340fd60f857415a81eb8ac3e', 'Nama Anggota 3', 'Partai Kebangkitan Bangsa', NULL, 3, 'c2f8a792aa894712805d907b7', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('2dc4e47df40b41ce8012aea52', 'Nama Anggota 3', 'Partai Kebangkitan Bangsa', NULL, 3, 'bf168dd3259e43f78619cab2f', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('3370fd15a4a0478d9f34c7d8d', 'Nama Anggota 3', 'Partai Nasional Demokrat', NULL, 3, '828361d5d89b44e384da319a0', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('3d4324ee4d1e4e5c96d889f48', 'Nama Anggota 3', 'Partai Keadilan Sejahtera', NULL, 3, 'dc52445bc52047109d0f83a51', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('3e54b9b69d1b494b842c51f06', 'Nama Anggota 4', 'Partai Demokrat', NULL, 4, 'bf168dd3259e43f78619cab2f', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('42c6c6cba8cb4c6a8d9ba7112', 'Nama Anggota 3', 'Partai Nasional Demokrat', NULL, 3, '4efa6a0e7e4e4c5b820127482', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('4f1e75e5fc584cb3a6a6b2d2f', 'Nama Anggota 6', 'Partai Nasional Demokrat', NULL, 6, 'c2f8a792aa894712805d907b7', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('5cd58fef16534e209b43042fc', 'Nama Anggota 2', 'Partai Gerakan Indonesia Raya', NULL, 2, 'c2f8a792aa894712805d907b7', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('6044881d9bf248e1a9c87d04f', 'Nama Anggota 1', 'Partai Golongan Karya', NULL, 1, 'dc52445bc52047109d0f83a51', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('65161cb8e5eb45acafec8b645', 'Nama Anggota 2', 'Partai Gerakan Indonesia Raya', NULL, 2, 'bf168dd3259e43f78619cab2f', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('9ecc6104b1d14d45a1cc4f00e', 'Nama Anggota 1', 'Partai Golongan Karya', NULL, 1, '828361d5d89b44e384da319a0', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('ad2b934cebac491499168ac3a', 'Nama Anggota 1', 'Partai Golongan Karya', NULL, 1, '4efa6a0e7e4e4c5b820127482', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('ada3ae84c84744e0bd5da8576', 'Nama Anggota 4', 'Partai Keadilan Sejahtera', NULL, 4, 'c2f8a792aa894712805d907b7', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('d44c1def2f064904af8cc74dc', 'Nama Anggota 1', 'Partai Golongan Karya', NULL, 1, 'c2f8a792aa894712805d907b7', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('e5c08191fb5d4ef3aa907e673', 'Nama Anggota 1', 'Partai Golongan Karya', NULL, 1, 'bf168dd3259e43f78619cab2f', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896'),
('e8e03074d85a423b85517e828', 'Nama Anggota 2', 'Partai Gerakan Indonesia Raya', NULL, 2, '4efa6a0e7e4e4c5b820127482', '2026-04-17 01:24:05.896', '2026-04-17 01:24:05.896');

-- --------------------------------------------------------

--
-- Table structure for table `anggota_fraksi`
--

CREATE TABLE `anggota_fraksi` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `jabatan` varchar(191) NOT NULL,
  `faction` varchar(191) DEFAULT NULL,
  `imageUrl` text DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `fraksiInfoId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `anggota_fraksi`
--

INSERT INTO `anggota_fraksi` (`id`, `name`, `jabatan`, `faction`, `imageUrl`, `order`, `fraksiInfoId`, `createdAt`, `updatedAt`) VALUES
('018680f71659429488b97cfd8', 'Nama Anggota 4', 'Anggota', 'Golkar', NULL, 4, 'ad47d4f8daa641418a4e695a8', '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('2857ce22d0df4a16bf921e3bd', 'Nama Anggota 1', 'Ketua Fraksi', 'Gerindra', '/uploads/fraksi-anggota/1776355655545-index.jpg', 1, '7b83d2df271140a98fd22c8e9', '2026-04-17 00:05:21.613', '2026-04-16 16:07:35.546'),
('3a0d8cdc0d6a4b5787c6a5a28', 'Nama Anggota 1', 'Ketua Fraksi', 'Golkar', NULL, 1, 'ad47d4f8daa641418a4e695a8', '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('3ca764d872cd476793623915e', 'Nama Anggota 3', 'Anggota', 'Gerindra', NULL, 3, '7b83d2df271140a98fd22c8e9', '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('3e38b5c7f02244c49c28bbfb7', 'Nama Anggota 3', 'Sekretaris', 'Golkar', NULL, 3, 'ad47d4f8daa641418a4e695a8', '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('453750c14eb44668a22a0e395', 'Nama Anggota 2', 'Anggota', 'PKS', NULL, 2, '9e7f7c83855f4d518be424a75', '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('4d69995870be400f934419ebd', 'Nama Anggota 2', 'Wakil Ketua', 'Golkar', NULL, 2, 'ad47d4f8daa641418a4e695a8', '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('6d4a1dca7b9e43c2bd51b6691', 'Nama Anggota 1', 'Ketua Fraksi', 'PKS', NULL, 1, '9e7f7c83855f4d518be424a75', '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('a898b380da084795902acdd84', 'Nama Anggota 2', 'Wakil Ketua', 'PKB', NULL, 2, 'bae63dc0085748118e0678568', '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('aa8dd350b8aa4b26a39643fa9', 'Nama Anggota 2', 'Wakil Ketua', 'Gerindra', NULL, 2, '7b83d2df271140a98fd22c8e9', '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('bab804deb58e4278ac0fd7fe2', 'Nama Anggota 1', 'Ketua Fraksi', 'PKB', NULL, 1, 'bae63dc0085748118e0678568', '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('bb913db772f449ee9f5928371', 'Nama Anggota 3', 'Anggota', 'PKB', NULL, 3, 'bae63dc0085748118e0678568', '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('cd55aca8029445e6b0a03d643', 'Nama Anggota 1', 'Ketua Fraksi', 'NasDem', NULL, 1, '5a1d413f7cc645039d4021ed9', '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('d3d56ec586b344069bfa9f199', 'Nama Anggota 2', 'Anggota', 'NasDem', NULL, 2, '5a1d413f7cc645039d4021ed9', '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('da7349df9e194f03b0a4bddf7', 'Nama Anggota 1', 'Ketua Fraksi', 'Demokrat', NULL, 1, '4f315175db8f4090849880374', '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('e565176c7caa42169d627eaf3', 'adasd', 'Anggota', 'Gerindra', NULL, 0, '1550eec256f74a74877c089b2', '2026-04-16 16:10:41.505', '2026-04-16 16:10:41.505'),
('e7964d39e58444569135b2b80', 'Nama Anggota 2', 'Anggota', 'Demokrat', NULL, 2, '4f315175db8f4090849880374', '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613');

-- --------------------------------------------------------

--
-- Table structure for table `anggota_komisi`
--

CREATE TABLE `anggota_komisi` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `jabatan` varchar(191) NOT NULL,
  `faction` varchar(191) DEFAULT NULL,
  `imageUrl` text DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `komisiInfoId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `anggota_komisi`
--

INSERT INTO `anggota_komisi` (`id`, `name`, `jabatan`, `faction`, `imageUrl`, `order`, `komisiInfoId`, `createdAt`, `updatedAt`) VALUES
('cmny5us6f001wygouc56ypwex', 'Badaruddin Duri', 'Koordinator', '', '/uploads/komisi/1776145780814-068A2907.jpg', 1, 'cmny5us6c001vygoubjvxw04o', '2026-04-14 05:08:08.103', '2026-04-14 05:49:40.817'),
('cmny5us6f001xygouv7zy0aeg', 'Mohammad Hatta', 'Ketua', '', '/uploads/komisi/1776145756216-068A2818.jpg', 2, 'cmny5us6c001vygoubjvxw04o', '2026-04-14 05:08:08.103', '2026-04-14 05:49:16.219'),
('cmny5us6f001yygoun4adtzlx', 'Kondi Pranata', 'Wakil Ketua', '', '/uploads/komisi/1776145763887-068A2937.jpg', 3, 'cmny5us6c001vygoubjvxw04o', '2026-04-14 05:08:08.103', '2026-04-14 05:49:23.891'),
('cmny5us6f001zygoupn6w0df7', 'Muhammad Adnan, S.Pd', 'Sekretaris', '', '/uploads/komisi/1776145772971-068A2783.jpg', 4, 'cmny5us6c001vygoubjvxw04o', '2026-04-14 05:08:08.103', '2026-04-14 05:49:32.975'),
('cmny5us6f0020ygouaso1qlx1', 'Ahmad Riva\'I, SKM', 'Anggota', '', '/uploads/komisi/1776145791061-068A2728.jpg', 5, 'cmny5us6c001vygoubjvxw04o', '2026-04-14 05:08:08.103', '2026-04-14 05:49:51.064'),
('cmny5us6f0021ygouazku0746', 'Nurjannah, S.AP', 'Anggota', '', '/uploads/komisi/1776145804744-068A2927.jpg', 6, 'cmny5us6c001vygoubjvxw04o', '2026-04-14 05:08:08.103', '2026-04-14 05:50:04.748'),
('cmny5us6f0022ygouy5be0vl9', 'Drs. Syafruddin, MSi', 'Anggota', '', '/uploads/komisi/1776145819960-068A2805.jpg', 7, 'cmny5us6c001vygoubjvxw04o', '2026-04-14 05:08:08.103', '2026-04-14 05:50:19.964'),
('cmny5us6f0023ygoucl8f8syb', 'Rizal Fikri', 'Anggota', '', '/uploads/komisi/1776145829704-068A2913.jpg', 8, 'cmny5us6c001vygoubjvxw04o', '2026-04-14 05:08:08.103', '2026-04-14 05:50:29.708'),
('cmny5us6f0024ygoug15dkidw', 'Norvie Aperiasyani, ST., MA', 'Anggota', '', '/uploads/komisi/1776145841182-068A2954.jpg', 9, 'cmny5us6c001vygoubjvxw04o', '2026-04-14 05:08:08.103', '2026-04-14 05:50:41.185'),
('cmny5us6j0026ygoupmr77ve7', 'Kaharuddin Umar', 'Koordinator', '', '/uploads/komisi/1776145894133-068A2792.jpg', 1, 'cmny5us6h0025ygouxajxwqj3', '2026-04-14 05:08:08.107', '2026-04-14 05:51:34.138'),
('cmny5us6j0027ygousx88234o', 'Mustafa HZ', 'Ketua', '', '/uploads/komisi/1776145859797-068A2822.jpg', 2, 'cmny5us6h0025ygouxajxwqj3', '2026-04-14 05:08:08.107', '2026-04-14 05:50:59.802'),
('cmny5us6j0028ygou8dn7942w', 'Fauzan Ahmad BSA, SE., MM', 'Wakil Ketua', '', '/uploads/komisi/1776145872623-068A2969.jpg', 3, 'cmny5us6h0025ygouxajxwqj3', '2026-04-14 05:08:08.107', '2026-04-14 05:51:12.627'),
('cmny5us6j0029ygou6f0y4glg', 'Iwan Irawan Marhalim', 'Sekretaris', '', '/uploads/komisi/1776145882611-068A2833.jpg', 4, 'cmny5us6h0025ygouxajxwqj3', '2026-04-14 05:08:08.107', '2026-04-14 05:51:22.614'),
('cmny5us6j002aygou1kpcl0jk', 'Drs H. M. Thamzil., MM', 'Anggota', '', '/uploads/komisi/1776146017094-068A2747.jpg', 5, 'cmny5us6h0025ygouxajxwqj3', '2026-04-14 05:08:08.107', '2026-04-14 05:53:37.098'),
('cmny5us6j002bygou99vx66wv', 'Muhammad Rizyal, S.Sos. i', 'Anggota', '', '/uploads/komisi/1776146032333-068A2861.jpg', 6, 'cmny5us6h0025ygouxajxwqj3', '2026-04-14 05:08:08.107', '2026-04-14 05:53:52.336'),
('cmny5us6j002cygouhlox6si9', 'Ratnawati', 'Anggota', '', '/uploads/komisi/1776146048031-068A2992.jpg', 7, 'cmny5us6h0025ygouxajxwqj3', '2026-04-14 05:08:08.107', '2026-04-14 05:54:08.035'),
('cmny5us6j002dygoutlpgtukz', 'Riyan Maulana, S.AP', 'Anggota', '', '/uploads/komisi/1776146065385-WhatsApp_Image_2026-04-14_at_07.32.53.jpeg', 8, 'cmny5us6h0025ygouxajxwqj3', '2026-04-14 05:08:08.107', '2026-04-14 05:54:25.388'),
('cmny5us6m002fygoucdnx1jm9', 'Merliza, S. Sos. I., MM', 'Koordinator', '', '/uploads/komisi/1776146131878-068A2960.jpg', 1, 'cmny5us6l002eygou0yf3v71q', '2026-04-14 05:08:08.111', '2026-04-14 05:55:31.881'),
('cmny5us6m002gygou39mmnwte', 'Basuki AR, SE', 'Ketua', '', '/uploads/komisi/1776146082273-068A2735.jpg', 2, 'cmny5us6l002eygou0yf3v71q', '2026-04-14 05:08:08.111', '2026-04-14 05:54:42.276'),
('cmny5us6m002hygou1hb8335v', 'Edi Dwi Pariwa, ST', 'Wakil Ketua', '', '/uploads/komisi/1776146105121-068A2843.jpg', 3, 'cmny5us6l002eygou0yf3v71q', '2026-04-14 05:08:08.111', '2026-04-14 05:55:05.124'),
('cmny5us6m002iygoukrubg11d', 'H. Riyadi, SE', 'Sekretaris', '', '/uploads/komisi/1776146117141-068A2762.jpg', 4, 'cmny5us6l002eygou0yf3v71q', '2026-04-14 05:08:08.111', '2026-04-14 05:55:17.144'),
('cmny5us6m002jygouo6xicx2u', 'Rick Kamaluddin', 'Anggota', '', '/uploads/komisi/1776146144133-068A2852.jpg', 5, 'cmny5us6l002eygou0yf3v71q', '2026-04-14 05:08:08.111', '2026-04-14 05:55:44.137'),
('cmny5us6m002kygoufl3uajfc', 'Baharung', 'Anggota', '', '/uploads/komisi/1776146160611-068A2880.jpg', 6, 'cmny5us6l002eygou0yf3v71q', '2026-04-14 05:08:08.111', '2026-04-14 05:56:00.614'),
('cmny5us6m002lygoundkqi9j6', 'Santri Yusmulyadi, ST', 'Anggota', '', '/uploads/komisi/1776146173958-068A2921.jpg', 7, 'cmny5us6l002eygou0yf3v71q', '2026-04-14 05:08:08.111', '2026-04-14 05:56:13.962'),
('cmny5us6m002mygouq3defxe7', 'Andi Laweng, SH., MH', 'Anggota', '', '/uploads/komisi/1776146188821-068A2899.jpg', 8, 'cmny5us6l002eygou0yf3v71q', '2026-04-14 05:08:08.111', '2026-04-14 05:56:28.826');

-- --------------------------------------------------------

--
-- Table structure for table `anggota_sekretariat`
--

CREATE TABLE `anggota_sekretariat` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `position` varchar(191) NOT NULL,
  `unit` varchar(191) DEFAULT NULL,
  `imageUrl` text DEFAULT NULL,
  `isSekretaris` tinyint(1) NOT NULL DEFAULT 0,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `anggota_sekretariat`
--

INSERT INTO `anggota_sekretariat` (`id`, `name`, `position`, `unit`, `imageUrl`, `isSekretaris`, `order`, `createdAt`, `updatedAt`) VALUES
('cmny5us6r002oygouhlbeiknf', 'HASANUDDIN, S.H., M.H', 'Sekretaris DPRD', NULL, NULL, 1, 1, '2026-04-14 05:08:08.116', '2026-04-14 05:08:08.116'),
('cmny5us6r002pygou7hdrj4bm', 'SYAMBUL HADI, S.Pd.', 'Kepala Bagian Umum', 'Bagian Umum', NULL, 0, 2, '2026-04-14 05:08:08.116', '2026-04-14 05:08:08.116'),
('cmny5us6r002qygouji27d4nq', 'SALIM, S.Pd.', 'Kepala Bagian Persidangan, Perundang-undangan dan Humas', 'Bagian Persidangan', NULL, 0, 3, '2026-04-14 05:08:08.116', '2026-04-14 05:08:08.116'),
('cmny5us6r002rygou3bwtelij', 'LENNY TOVANI, S.Pd., M.M.', 'Kepala Bagian Perencanaan dan Keuangan', 'Bagian Perencanaan dan Keuangan', NULL, 0, 4, '2026-04-14 05:08:08.116', '2026-04-14 05:08:08.116'),
('cmny5us6r002sygouoraf4zbe', 'MUSTAFA, S.E., M.M.', 'Kepala Sub Bagian Tata Usaha dan Kepegawaian', 'Bagian Umum', NULL, 0, 5, '2026-04-14 05:08:08.116', '2026-04-14 05:08:08.116'),
('cmny5us6r002tygou2pwyic52', 'MUHAMMAD ALI, S.E.', 'Pengelola Barang dan Jasa Ahli Muda', 'Bagian Umum', NULL, 0, 6, '2026-04-14 05:08:08.116', '2026-04-14 05:08:08.116'),
('cmny5us6r002uygouc1mymo10', 'EDI PRATAMA, S.E.', 'Analis Keuangan Pusat dan Daerah Ahli Muda', 'Bagian Perencanaan dan Keuangan', NULL, 0, 7, '2026-04-14 05:08:08.116', '2026-04-14 05:08:08.116'),
('cmny5us6r002vygouw3p7jnkz', 'WATI ROCHAYANI, S.E.', 'Perencana Ahli Muda', 'Bagian Perencanaan dan Keuangan', NULL, 0, 8, '2026-04-14 05:08:08.116', '2026-04-14 05:08:08.116');

-- --------------------------------------------------------

--
-- Table structure for table `bamus_info`
--

CREATE TABLE `bamus_info` (
  `id` varchar(191) NOT NULL,
  `masaJabatan` varchar(191) NOT NULL DEFAULT '2024-2029',
  `deskripsi` text DEFAULT NULL,
  `isAktif` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bamus_info`
--

INSERT INTO `bamus_info` (`id`, `masaJabatan`, `deskripsi`, `isAktif`, `createdAt`, `updatedAt`) VALUES
('cmny5us5f000oygouswxmj78m', '2024-2029', 'Badan Musyawarah DPRD Kabupaten Sumbawa Barat Masa Jabatan 2024-2029', 1, '2026-04-14 05:08:08.067', '2026-04-14 05:08:08.067');

-- --------------------------------------------------------

--
-- Table structure for table `banggar_info`
--

CREATE TABLE `banggar_info` (
  `id` varchar(191) NOT NULL,
  `masaJabatan` varchar(191) NOT NULL DEFAULT '2024-2029',
  `deskripsi` text DEFAULT NULL,
  `isAktif` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `banggar_info`
--

INSERT INTO `banggar_info` (`id`, `masaJabatan`, `deskripsi`, `isAktif`, `createdAt`, `updatedAt`) VALUES
('cmny5us5o0013ygouvpxvygq6', '2024-2029', 'Badan Anggaran DPRD Kabupaten Sumbawa Barat Masa Jabatan 2024-2029', 1, '2026-04-14 05:08:08.077', '2026-04-14 05:08:08.077');

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `subtitle` varchar(191) DEFAULT NULL,
  `category` varchar(191) NOT NULL DEFAULT 'Berita Dewan',
  `imageUrl` text DEFAULT NULL,
  `linkUrl` text DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `title`, `subtitle`, `category`, `imageUrl`, `linkUrl`, `isActive`, `order`, `createdAt`, `updatedAt`) VALUES
('cmnrjt15u0000fxywis9knunp', 'tes 1', NULL, 'Berita Dewan', '/uploads/banners/1776180752325-OIP.jpg', NULL, 1, 0, '2026-04-09 14:04:17.826', '2026-04-14 15:32:32.326'),
('cmny1mh2c0000m7tfz1u4b4n1', 'tes 2', NULL, 'Berita Dewan', '/uploads/banners/1776180757727-OIP.jpg', NULL, 1, 0, '2026-04-14 03:09:41.988', '2026-04-14 15:32:37.728');

-- --------------------------------------------------------

--
-- Table structure for table `bapemperda_info`
--

CREATE TABLE `bapemperda_info` (
  `id` varchar(191) NOT NULL,
  `masaJabatan` varchar(191) NOT NULL DEFAULT '2024-2029',
  `deskripsi` text DEFAULT NULL,
  `isAktif` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bapemperda_info`
--

INSERT INTO `bapemperda_info` (`id`, `masaJabatan`, `deskripsi`, `isAktif`, `createdAt`, `updatedAt`) VALUES
('cmny5us5w001iygoussudzd5q', '2024-2029', 'Badan Pembentukan Peraturan Daerah DPRD Kabupaten Sumbawa Barat Masa Jabatan 2024-2029', 1, '2026-04-14 05:08:08.085', '2026-04-14 05:08:08.085');

-- --------------------------------------------------------

--
-- Table structure for table `beritas`
--

CREATE TABLE `beritas` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `imageUrl` text DEFAULT NULL,
  `category` varchar(191) NOT NULL DEFAULT 'Berita Dewan',
  `isPublished` tinyint(1) NOT NULL DEFAULT 0,
  `publishedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `authorId` varchar(191) DEFAULT NULL,
  `reviewNote` text DEFAULT NULL,
  `reviewStatus` varchar(191) NOT NULL DEFAULT 'pending',
  `reviewedBy` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `beritas`
--

INSERT INTO `beritas` (`id`, `title`, `slug`, `excerpt`, `content`, `imageUrl`, `category`, `isPublished`, `publishedAt`, `createdAt`, `updatedAt`, `authorId`, `reviewNote`, `reviewStatus`, `reviewedBy`) VALUES
('cmnrlfdbj0001cog33dec6ox6', 'Salat Idulfitri di Lingkungan Pemkab, Semangat Kebersamaan Menggema', 'salat-idulfitri-semangat-kebersamaan', 'Bupati dan Ketua DPRD Sumbawa Barat menghadiri pelaksanaan Salat Idulfitri 1447 Hijriah di halaman utama Kantor Bupati. Kegiatan tersebut berlangsung khidmat...', '<p>Ketua DPRD menghadiri pelaksanaan Salat Idulfitri 1447 Hijriah di halaman Kantor Pemkab. Kegiatan tersebut merupakan agenda tahunan yang bertujuan untuk mempererat tali silaturahmi antara jajaran pemerintahan dengan masyarakat luas.</p><p>Ribuan jamaah tampak memadati area sejak pukul 06.00 pagi. Dalam sambutannya, Ketua DPRD menekankan pentingnya kolaborasi dan saling memaafkan sebagai fondasi untuk membangun daerah yang lebih maju dan inklusif di tahun yang akan datang.</p>', 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80', 'Berita Utama', 1, '2026-04-09 14:49:39.631', '2026-04-09 14:49:39.631', '2026-04-09 14:49:39.631', NULL, NULL, 'pending', NULL),
('cmnrlfdbm0002cog34bzr2p6u', 'DPRD Dukung Pemerataan Bantuan untuk Tempat Ibadah di Seluruh Kecamatan', 'dprd-dukung-pemerataan-bantuan-tempat-ibadah', 'Ketua DPRD mengapresiasi komitmen pemerintah daerah untuk terus mendukung rehabilitasi dan pembangunan fasilitas tempat ibadah di berbagai pelosok...', '<p>Dalam Rapat Paripurna hari ini, DPRD secara resmi menyetujui alokasi anggaran khusus untuk Program Pemerataan Bantuan Tempat Ibadah tahun 2026. Bantuan ini tidak hanya difokuskan pada pusat kota, melainkan akan disalurkan hingga ke desa-desa terpencil.</p><p>Program ini diharapkan dapat menjadi stimulus yang menguatkan kerukunan antar umat beragama serta menyediakan fasilitas ibadah yang layak dan representatif bagi masyarakat Sumbawa Barat.</p>', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80', 'Berita Dewan', 1, '2026-04-09 14:49:39.634', '2026-04-09 14:49:39.634', '2026-04-09 14:49:39.634', NULL, NULL, 'pending', NULL),
('cmnrlfdbn0003cog3k03zzqy8', 'Armada Mudik Lebaran Gratis Harus Dalam Kondisi Prima', 'armada-mudik-lebaran-gratis-kondisi-prima', 'Wakil Ketua DPRD menekankan pentingnya memastikan seluruh armada program mudik gratis pemerintah daerah berada dalam kondisi mesin yang sehat guna menjamin keselamatan.', '<p>Menjelang arus mudik lebaran, DPRD melakukan inspeksi mendadak ke sejumlah depo bus yang bekerja sama dalam program Mudik Gratis 2026. Inspeksi ini bertujuan untuk menjamin semua armada angkutan dalam kondisi kelaikan jalan terbaik.</p><p>Keselamatan pemudik adalah prioritas tertinggi. Oleh karena itu, seluruh pimpinan PO Bus diinstruksikan untuk mengecek ulang rem, roda, fungsi lampu, hingga kesiapan fisik pengemudi sebelum izin operasi dikeluarkan oleh Dinas Perhubungan.</p>', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80', 'Wakil Kita', 1, '2026-04-09 14:49:39.636', '2026-04-09 14:49:39.636', '2026-04-09 14:49:39.636', NULL, NULL, 'pending', NULL),
('cmnrlfdbp0004cog3z4se11sj', 'Optimalisasi CSR BUMD untuk Program Bedah RTH dan Taman Kota', 'optimalisasi-csr-bumd-program-bedah-rth', 'DPRD mendorong keberlanjutan program perbaikan Ruang Terbuka Hijau (RTH) bagi warga melalui dana Corporate Social Responsibility (CSR) BUMD setempat.', '<p>Sebagai langkah inovatif dalam menata kota, DPRD telah mencapai kesepakatan bersama direksi BUMD untuk mengalokasikan minimal 30% dari dana CSR tahun ini khusus untuk program restorasi Ruang Terbuka Hijau (RTH).</p><p>Taman kota tidak hanya berfungsi sebagai paru-paru lingkungan, namun juga sebagai pusat interaksi sosial warga secara gratis. Konsep pembangunan ini diharapkan dapat meningkatkan indeks kebahagiaan masyarakat Sumbawa Barat dalam jangka panjang.</p>', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', 'Berita Dewan', 1, '2026-04-09 14:49:39.637', '2026-04-09 14:49:39.637', '2026-04-09 14:49:39.637', NULL, NULL, 'pending', NULL),
('cmnrlfdbt0005cog3ampuh4e8', 'DPRD Gelar Rapat Paripurna Penetapan APBD Perubahan 2026', 'dprd-rapat-paripurna-apbd-perubahan-2026', 'DPRD Kabupaten Sumbawa Barat menggelar Rapat Paripurna untuk menetapkan Anggaran Pendapatan dan Belanja Daerah (APBD) Perubahan Tahun Anggaran 2026.', '<p>Rapat Paripurna DPRD Kabupaten Sumbawa Barat digelar hari ini dengan agenda utama penetapan APBD Perubahan Tahun Anggaran 2026. Seluruh fraksi hadir dan menyampaikan pandangan akhirnya sebelum pengesahan dilakukan.</p><p>Ketua DPRD menyatakan bahwa APBD Perubahan ini mencerminkan komitmen bersama untuk mengoptimalkan belanja daerah demi kesejahteraan masyarakat, khususnya di sektor pendidikan, kesehatan, dan infrastruktur pedesaan.</p>', '/uploads/berita/1775746293371-WhatsApp_Image_2026-03-25_at_11.15.49.jpeg', 'Berita Dewan', 1, '2026-04-09 14:49:39.642', '2026-04-09 14:49:39.642', '2026-04-14 15:48:23.941', NULL, NULL, 'approved', 'ebfaf14b7dac412090f292769'),
('cmnrlfdbu0006cog3algilbc5', 'Komisi I DPRD Tinjau Langsung Proyek Jalan Desa di Kecamatan Taliwang', 'komisi-i-tinjau-proyek-jalan-desa-taliwang', 'Anggota Komisi I DPRD melakukan kunjungan kerja ke Kecamatan Taliwang untuk memantau progres pembangunan jalan desa yang bersumber dari Dana Desa tahun 2026.', '<p>Tim Komisi I DPRD Sumbawa Barat turun langsung ke lapangan untuk meninjau realisasi pembangunan jalan desa di beberapa titik di Kecamatan Taliwang. Kunjungan ini merupakan bagian dari fungsi pengawasan dewan terhadap penggunaan Dana Desa.</p><p>Dari hasil peninjauan, ditemukan beberapa ruas jalan yang pengerjaannya belum sesuai spesifikasi teknis. DPRD meminta Dinas PUPR segera berkoordinasi dengan kepala desa terkait untuk melakukan perbaikan sebelum masa pemeliharaan berakhir.</p>', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', 'Berita Dewan', 1, '2026-04-09 14:49:39.643', '2026-04-09 14:49:39.643', '2026-04-14 15:49:04.550', NULL, NULL, 'approved', 'ebfaf14b7dac412090f292769'),
('cmnrlfdbw0007cog3dqaxdn9b', 'Bapemperda DPRD Bahas Raperda Perlindungan Tenaga Kerja Lokal', 'bapemperda-bahas-raperda-perlindungan-tenaga-kerja-lokal', 'Badan Pembentukan Peraturan Daerah (Bapemperda) DPRD menggelar rapat pembahasan Rancangan Peraturan Daerah tentang Perlindungan dan Pemberdayaan Tenaga Kerja Lokal.', '<p>Bapemperda DPRD Sumbawa Barat mengadakan rapat kerja intensif untuk membahas substansi Raperda Perlindungan Tenaga Kerja Lokal. Raperda ini diharapkan menjadi payung hukum yang menjamin hak-hak pekerja asal daerah, terutama di sektor pertambangan dan perkebunan.</p><p>Dalam rapat tersebut, sejumlah pakar hukum dan perwakilan serikat pekerja turut diundang untuk memberikan masukan. Raperda ditargetkan rampung dan disahkan pada kuartal ketiga tahun 2026.</p>', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80', 'Legislasi', 1, '2026-04-09 14:49:39.644', '2026-04-09 14:49:39.644', '2026-04-09 14:49:39.644', NULL, NULL, 'pending', NULL),
('cmnrlfdby0008cog3l61s10tm', 'DPRD Apresiasi Capaian Indeks Pembangunan Manusia Sumbawa Barat', 'dprd-apresiasi-capaian-ipm-sumbawa-barat', 'Ketua DPRD memberikan apresiasi atas meningkatnya Indeks Pembangunan Manusia (IPM) Kabupaten Sumbawa Barat yang masuk dalam kategori tinggi secara nasional.', '<p>Badan Pusat Statistik merilis data terbaru yang menunjukkan Indeks Pembangunan Manusia (IPM) Kabupaten Sumbawa Barat mengalami kenaikan signifikan dan kini masuk dalam kategori tinggi di tingkat nasional.</p><p>Ketua DPRD menyampaikan apresiasi kepada seluruh jajaran pemerintah daerah dan masyarakat atas pencapaian ini. Ia juga mendorong agar momentum positif ini dijaga dengan terus meningkatkan kualitas layanan pendidikan dan kesehatan di seluruh pelosok kabupaten.</p>', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80', 'Berita Utama', 1, '2026-04-09 14:49:39.646', '2026-04-09 14:49:39.646', '2026-04-09 14:49:39.646', NULL, NULL, 'pending', NULL),
('cmnrlfdbz0009cog3pd04v44d', 'Fraksi PKB Dorong Peningkatan Anggaran Beasiswa Santri Berprestasi', 'fraksi-pkb-dorong-anggaran-beasiswa-santri', 'Fraksi PKB DPRD Sumbawa Barat menyampaikan rekomendasi resmi kepada Bupati agar anggaran beasiswa bagi santri berprestasi ditingkatkan pada APBD 2027.', '<p>Dalam sidang paripurna penyampaian pandangan fraksi, Fraksi PKB secara tegas mendorong pemerintah daerah untuk meningkatkan alokasi anggaran beasiswa bagi santri berprestasi dari pondok pesantren yang ada di Sumbawa Barat.</p><p>Juru bicara Fraksi PKB menyatakan bahwa investasi pada pendidikan berbasis pesantren adalah investasi jangka panjang yang akan melahirkan generasi berkarakter kuat dan berakhlak mulia, yang pada akhirnya akan berkontribusi besar bagi kemajuan daerah.</p>', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', 'Fraksi', 1, '2026-04-09 14:49:39.648', '2026-04-09 14:49:39.648', '2026-04-09 14:49:39.648', NULL, NULL, 'pending', NULL),
('cmnrlfdc1000acog3639bdj4p', 'DPRD dan Pemkab Sepakat Percepat Pembangunan RSUD Tipe B', 'dprd-pemkab-sepakat-percepat-rsud-tipe-b', 'Dalam rapat koordinasi, DPRD dan Pemerintah Kabupaten Sumbawa Barat menyepakati percepatan pembangunan Rumah Sakit Umum Daerah (RSUD) bertipe B demi meningkatkan layanan kesehatan.', 'Rapat koordinasi antara pimpinan DPRD dan jajaran eksekutif Pemkab Sumbawa Barat menghasilkan kesepakatan penting: percepatan pembangunan RSUD Tipe B akan menjadi program prioritas dalam RPJMD periode berikutnya.<p>Keberadaan RSUD Tipe B dinilai sangat mendesak mengingat pertumbuhan penduduk dan kebutuhan layanan kesehatan spesialis yang terus meningkat. DPRD berkomitmen untuk mengawal proses penganggaran dan pengawasan pembangunan agar berjalan tepat waktu dan sesuai standar.</p>', '/uploads/berita/1775746248076-WhatsApp_Image_2026-03-25_at_11.15.48__1_.jpeg', 'Berita Utama', 1, '2026-04-09 14:49:39.649', '2026-04-09 14:49:39.649', '2026-04-14 15:40:33.515', NULL, NULL, 'approved', 'ebfaf14b7dac412090f292769');

-- --------------------------------------------------------

--
-- Table structure for table `bk_info`
--

CREATE TABLE `bk_info` (
  `id` varchar(191) NOT NULL,
  `masaJabatan` varchar(191) NOT NULL DEFAULT '2024-2029',
  `deskripsi` text DEFAULT NULL,
  `isAktif` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bk_info`
--

INSERT INTO `bk_info` (`id`, `masaJabatan`, `deskripsi`, `isAktif`, `createdAt`, `updatedAt`) VALUES
('cmny5us65001rygougpa4hwch', '2024-2029', 'Badan Kehormatan DPRD Kabupaten Sumbawa Barat Masa Jabatan 2024-2029', 1, '2026-04-14 05:08:08.093', '2026-04-14 05:08:08.093');

-- --------------------------------------------------------

--
-- Table structure for table `daerah_pemilihan`
--

CREATE TABLE `daerah_pemilihan` (
  `id` varchar(191) NOT NULL,
  `nama` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `wilayah` text DEFAULT NULL,
  `jumlahKursi` int(11) NOT NULL DEFAULT 0,
  `imageUrl` text DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `isAktif` tinyint(1) NOT NULL DEFAULT 1,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `daerah_pemilihan`
--

INSERT INTO `daerah_pemilihan` (`id`, `nama`, `slug`, `wilayah`, `jumlahKursi`, `imageUrl`, `deskripsi`, `isAktif`, `order`, `createdAt`, `updatedAt`) VALUES
('4efa6a0e7e4e4c5b820127482', 'Sumbawa Barat 3', 'dapil-ksb-3', 'Kecamatan Brang Rea, Kecamatan Brang Ene', 4, NULL, 'Daerah Pemilihan Sumbawa Barat 3 meliputi Kecamatan Brang Rea dan Kecamatan Brang Ene.', 1, 3, '2026-04-17 01:24:05.896', '2026-04-16 17:33:21.556'),
('828361d5d89b44e384da319a0', 'Sumbawa Barat 5', 'dapil-ksb-5', 'Kecamatan Maluk, Kecamatan Poto Tano', 3, NULL, 'Daerah Pemilihan Sumbawa Barat 5 meliputi Kecamatan Maluk dan Kecamatan Poto Tano.', 1, 5, '2026-04-17 01:24:05.896', '2026-04-16 17:33:32.947'),
('bf168dd3259e43f78619cab2f', 'Sumbawa Barat 2', 'dapil-ksb-2', 'Kecamatan Seteluk', 4, NULL, 'Daerah Pemilihan Sumbawa Barat 2 meliputi Kecamatan Seteluk.', 1, 2, '2026-04-17 01:24:05.896', '2026-04-16 17:33:15.925'),
('c2f8a792aa894712805d907b7', 'Sumbawa Barat 1', 'dapil-ksb-1', 'Kecamatan Taliwang', 6, NULL, 'Daerah Pemilihan Sumbawa Barat 1 meliputi Kecamatan Taliwang sebagai ibukota Kabupaten Sumbawa Barat.', 1, 1, '2026-04-17 01:24:05.896', '2026-04-16 17:33:12.281'),
('dc52445bc52047109d0f83a51', 'Sumbawa Barat 4', 'dapil-ksb-4', 'Kecamatan Jereweh, Kecamatan Sekongkang', 3, NULL, 'Daerah Pemilihan Sumbawa Barat 4 meliputi Kecamatan Jereweh dan Kecamatan Sekongkang.', 1, 4, '2026-04-17 01:24:05.896', '2026-04-16 17:33:28.588');

-- --------------------------------------------------------

--
-- Table structure for table `emagazines`
--

CREATE TABLE `emagazines` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `edisi` varchar(191) NOT NULL,
  `imageUrl` text DEFAULT NULL,
  `fileUrl` text DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `emagazines`
--

INSERT INTO `emagazines` (`id`, `title`, `edisi`, `imageUrl`, `fileUrl`, `isActive`, `order`, `createdAt`, `updatedAt`) VALUES
('12eea1beb7844feab76be4d60', 'Majalah DPRD KSB', 'Edisi 1', '/uploads/emagazine/1776264023093-Screenshot_2026-04-15_224008.png', '/uploads/emagazine/1776264155729-_______________________49__2026_.pdf', 1, 1, '2026-04-15 00:52:53.628', '2026-04-15 14:42:35.736'),
('1f93f2deaf554c5e996bf0f07', 'Majalah DPRD KSB', 'Edisi 6', NULL, NULL, 1, 6, '2026-04-15 00:52:53.628', '2026-04-15 00:52:53.628'),
('5e54c57e00924cbbbe71b69dc', 'Majalah DPRD KSB', 'Edisi 4', NULL, NULL, 1, 4, '2026-04-15 00:52:53.628', '2026-04-15 00:52:53.628'),
('b97f40b593214a9a94b7a59f7', 'Majalah DPRD KSB', 'Edisi 5', NULL, NULL, 1, 5, '2026-04-15 00:52:53.628', '2026-04-15 00:52:53.628'),
('ef207604e88a4466ac0453589', 'Majalah DPRD KSB', 'Edisi 3', NULL, NULL, 1, 3, '2026-04-15 00:52:53.628', '2026-04-15 00:52:53.628'),
('fd63b96664d94ba4b756da98d', 'Majalah DPRD KSB', 'Edisi 2', NULL, NULL, 1, 2, '2026-04-15 00:52:53.628', '2026-04-15 00:52:53.628');

-- --------------------------------------------------------

--
-- Table structure for table `fraksi_info`
--

CREATE TABLE `fraksi_info` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `shortName` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `color` varchar(191) NOT NULL DEFAULT '#c8102e',
  `kursi` int(11) NOT NULL DEFAULT 0,
  `masaJabatanId` varchar(191) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `logoUrl` text DEFAULT NULL,
  `isAktif` tinyint(1) NOT NULL DEFAULT 1,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `fraksi_info`
--

INSERT INTO `fraksi_info` (`id`, `name`, `shortName`, `slug`, `color`, `kursi`, `masaJabatanId`, `deskripsi`, `logoUrl`, `isAktif`, `order`, `createdAt`, `updatedAt`) VALUES
('1550eec256f74a74877c089b2', 'Fraksi Partai Gerakan Indonesia Raya', 'Gerindra', 'gerindra-2019', '#c8102e', 20, '7de7aad988474026b5bc25cc2', 'a', NULL, 0, 0, '2026-04-16 16:07:02.161', '2026-04-16 16:21:50.699'),
('27ace60704a84c758507a062e', 'Fraksi Partai Golongan Karya', 'Golkar', 'golkar-2019', '#d9ff1a', 20, '7de7aad988474026b5bc25cc2', 'tes', NULL, 1, 0, '2026-04-16 16:22:06.204', '2026-04-16 16:22:06.204'),
('4f315175db8f4090849880374', 'Fraksi Partai Demokrat', 'F-Demokrat', 'demokrat', '#0070C0', 2, '2d9432a088ab4589bef078da4', 'Fraksi Partai Demokrat DPRD Kabupaten Sumbawa Barat.', NULL, 1, 5, '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('5a1d413f7cc645039d4021ed9', 'Fraksi Partai Nasional Demokrat', 'F-NasDem', 'nasdem', '#1E90FF', 2, '2d9432a088ab4589bef078da4', 'Fraksi Partai NasDem DPRD Kabupaten Sumbawa Barat.', NULL, 1, 6, '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('7b83d2df271140a98fd22c8e9', 'Fraksi Partai Gerakan Indonesia Raya', 'Gerindra', 'gerindra', '#c8102e', 20, '2d9432a088ab4589bef078da4', 'testing\r\n', NULL, 1, 0, '2026-04-16 16:02:33.095', '2026-04-16 16:02:33.095'),
('9e7f7c83855f4d518be424a75', 'Fraksi Partai Keadilan Sejahtera', 'F-PKS', 'pks', '#FF6600', 2, '2d9432a088ab4589bef078da4', 'Fraksi Partai Keadilan Sejahtera DPRD Kabupaten Sumbawa Barat.', NULL, 1, 4, '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('ad47d4f8daa641418a4e695a8', 'Fraksi Partai Golongan Karya', 'F-Golkar', 'golkar', '#FFD700', 4, '2d9432a088ab4589bef078da4', 'Fraksi Partai Golongan Karya DPRD Kabupaten Sumbawa Barat.', NULL, 1, 1, '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613'),
('bae63dc0085748118e0678568', 'Fraksi Partai Kebangkitan Bangsa', 'F-PKB', 'pkb', '#00A651', 3, '2d9432a088ab4589bef078da4', 'Fraksi Partai Kebangkitan Bangsa DPRD Kabupaten Sumbawa Barat.', NULL, 1, 3, '2026-04-17 00:05:21.613', '2026-04-17 00:05:21.613');

-- --------------------------------------------------------

--
-- Table structure for table `info_publik`
--

CREATE TABLE `info_publik` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `icon` varchar(191) NOT NULL DEFAULT '?',
  `url` text NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `info_publik`
--

INSERT INTO `info_publik` (`id`, `title`, `icon`, `url`, `isActive`, `order`, `createdAt`, `updatedAt`) VALUES
('0de2f63d51744e40a43add9cc', 'Pengaduan LHKPN', '📞', 'https://kpk.go.id/id/layanan-publik/pengaduan', 1, 6, '2026-04-15 00:52:53.628', '2026-04-15 00:52:53.628'),
('13e5d7e6d5764d4eab8be5131', 'Rekrutmen CPNS', '👔', 'https://sscasn.bkn.go.id', 1, 5, '2026-04-15 00:52:53.628', '2026-04-15 00:52:53.628'),
('5d3fb0ec3a734e83ad2152d5f', 'PPID', '🔍', 'https://ppid.sumbawabarat.go.id', 1, 3, '2026-04-15 00:52:53.628', '2026-04-15 00:52:53.628'),
('cb3ef93abf054a92a666baee0', 'SIAKBM', '📊', 'https://siakbm.sumbawabarat.go.id', 1, 4, '2026-04-15 00:52:53.628', '2026-04-15 00:52:53.628'),
('d8b97f3b9ae243dc9c31fa553', 'Kemkes', '🏥', 'https://kemkes.go.id', 1, 7, '2026-04-15 00:52:53.628', '2026-04-15 00:52:53.628'),
('f2b072e9b1e14ef89f293428c', 'JDIH', '⚖️', 'https://jdih.sumbawabarat.go.id', 1, 2, '2026-04-15 00:52:53.628', '2026-04-15 00:52:53.628'),
('f5458a91d6864b4d856c08be4', 'LHKPN', '📄', 'https://elhkpn.kpk.go.id', 1, 1, '2026-04-15 00:52:53.628', '2026-04-15 00:52:53.628');

-- --------------------------------------------------------

--
-- Table structure for table `komentar_berita`
--

CREATE TABLE `komentar_berita` (
  `id` varchar(191) NOT NULL,
  `beritaId` varchar(191) NOT NULL,
  `nama` varchar(191) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `isi` text NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'pending',
  `reviewedBy` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `komentar_berita`
--

INSERT INTO `komentar_berita` (`id`, `beritaId`, `nama`, `email`, `isi`, `status`, `reviewedBy`, `createdAt`, `updatedAt`) VALUES
('fb5e3167390b4585ae2c04fbc', 'cmnrlfdc1000acog3639bdj4p', 'Anonim', NULL, 'testing', 'approved', 'd776c897c1954b679e4901258', '2026-04-15 15:07:08.316', '2026-04-15 15:07:15.605');

-- --------------------------------------------------------

--
-- Table structure for table `komisi_info`
--

CREATE TABLE `komisi_info` (
  `id` varchar(191) NOT NULL,
  `namaKomisi` varchar(191) NOT NULL,
  `masaJabatan` varchar(191) NOT NULL DEFAULT '2024-2029',
  `deskripsi` text DEFAULT NULL,
  `isAktif` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `komisi_info`
--

INSERT INTO `komisi_info` (`id`, `namaKomisi`, `masaJabatan`, `deskripsi`, `isAktif`, `createdAt`, `updatedAt`) VALUES
('51a7ae4d03e84f5fbaca94f44', 'KOMISI 2', '2019-2018', 'lalalala', 0, '2026-04-14 16:33:59.144', '2026-04-14 16:33:59.144'),
('63814c3ce9e34cbf9e1e27031', 'KOMISI 3', '2019-2018', 'lalalala', 0, '2026-04-14 16:33:59.149', '2026-04-14 16:33:59.149'),
('cmny5us6c001vygoubjvxw04o', 'Komisi 1', '2024-2029', NULL, 1, '2026-04-14 05:08:08.101', '2026-04-14 05:08:08.101'),
('cmny5us6h0025ygouxajxwqj3', 'Komisi 2', '2024-2029', NULL, 1, '2026-04-14 05:08:08.105', '2026-04-14 05:08:08.105'),
('cmny5us6l002eygou0yf3v71q', 'Komisi 3', '2024-2029', NULL, 1, '2026-04-14 05:08:08.109', '2026-04-14 05:08:08.109'),
('ff8db50cb39747bf8b56d3532', 'KOMISI 1', '2019-2018', 'lalalala', 0, '2026-04-14 16:33:59.139', '2026-04-14 16:33:59.139');

-- --------------------------------------------------------

--
-- Table structure for table `masa_jabatan`
--

CREATE TABLE `masa_jabatan` (
  `id` varchar(191) NOT NULL,
  `periode` varchar(191) NOT NULL,
  `tahunMulai` int(11) NOT NULL,
  `tahunSelesai` int(11) NOT NULL,
  `isAktif` tinyint(1) NOT NULL DEFAULT 0,
  `keterangan` text DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `masa_jabatan`
--

INSERT INTO `masa_jabatan` (`id`, `periode`, `tahunMulai`, `tahunSelesai`, `isAktif`, `keterangan`, `order`, `createdAt`, `updatedAt`) VALUES
('cmnrjjaco000145jinr6h3kpv', '2024-2029', 2024, 2029, 1, NULL, 1, '2026-04-09 13:56:43.176', '2026-04-14 05:08:08.046'),
('cmny58dhi0001z3u35ixjl692', '2019-2024', 2019, 2024, 0, NULL, 2, '2026-04-14 04:50:42.631', '2026-04-14 05:08:08.050'),
('cmny58dhp0002z3u367y2ogvn', '2014-2019', 2014, 2019, 0, NULL, 3, '2026-04-14 04:50:42.637', '2026-04-14 05:08:08.053'),
('cmny58dhr0003z3u3oga5yht2', '2009-2014', 2009, 2014, 0, NULL, 4, '2026-04-14 04:50:42.639', '2026-04-14 05:08:08.055'),
('cmny58dhs0004z3u3v099crwl', '2004-2009', 2004, 2009, 0, NULL, 5, '2026-04-14 04:50:42.640', '2026-04-14 05:08:08.057');

-- --------------------------------------------------------

--
-- Table structure for table `masa_jabatan_fraksi`
--

CREATE TABLE `masa_jabatan_fraksi` (
  `id` varchar(191) NOT NULL,
  `periode` varchar(191) NOT NULL,
  `tahunMulai` int(11) NOT NULL,
  `tahunSelesai` int(11) NOT NULL,
  `isAktif` tinyint(1) NOT NULL DEFAULT 0,
  `keterangan` text DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `masa_jabatan_fraksi`
--

INSERT INTO `masa_jabatan_fraksi` (`id`, `periode`, `tahunMulai`, `tahunSelesai`, `isAktif`, `keterangan`, `order`, `createdAt`, `updatedAt`) VALUES
('2d9432a088ab4589bef078da4', '2024-2029', 2024, 2029, 1, 'je', 0, '2026-04-16 15:58:53.324', '2026-04-16 16:05:41.950'),
('7de7aad988474026b5bc25cc2', '2019-2024', 2019, 2024, 0, 'ad', 0, '2026-04-16 16:06:03.401', '2026-04-16 16:06:03.401');

-- --------------------------------------------------------

--
-- Table structure for table `pimpinan`
--

CREATE TABLE `pimpinan` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `position` varchar(191) NOT NULL,
  `faction` varchar(191) DEFAULT NULL,
  `period` varchar(191) NOT NULL DEFAULT '2024-2029',
  `masaJabatanId` varchar(191) DEFAULT NULL,
  `isPast` tinyint(1) NOT NULL DEFAULT 0,
  `imageUrl` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pimpinan`
--

INSERT INTO `pimpinan` (`id`, `name`, `position`, `faction`, `period`, `masaJabatanId`, `isPast`, `imageUrl`, `bio`, `order`, `createdAt`, `updatedAt`) VALUES
('cmny5us590005ygou9m7lt7lg', 'KAHARUDDIN UMAR', 'KETUA', '', '2024-2029', 'cmnrjjaco000145jinr6h3kpv', 0, '/uploads/pimpinan/1776144201929-068A2792.jpg', '', 1, '2026-04-14 05:08:08.061', '2026-04-14 05:23:21.933'),
('cmny5us590006ygou46bopgrt', 'BADARUDDIN DURI, S.Psi', 'WAKIL KETUA 1', '', '2024-2029', 'cmnrjjaco000145jinr6h3kpv', 0, '/uploads/pimpinan/1776144211916-068A2907.jpg', '', 2, '2026-04-14 05:08:08.061', '2026-04-14 05:23:31.919'),
('cmny5us590007ygouqlmfpmyi', 'MERLIZA, S.sos. I., MM', 'WAKIL KETUA 2', '', '2024-2029', 'cmnrjjaco000145jinr6h3kpv', 0, '/uploads/pimpinan/1776144228566-068A2960.jpg', '', 3, '2026-04-14 05:08:08.061', '2026-04-14 05:23:48.571'),
('cmny5us590008ygoueno56zla', 'KAHARUDDIN UMAR', 'KETUA', '', '2019-2024', 'cmny58dhi0001z3u35ixjl692', 1, '/uploads/pimpinan/1776144439892-068A2792.jpg', '', 1, '2026-04-14 05:08:08.061', '2026-04-14 05:27:19.896'),
('cmny5us590009ygoutsjgldcg', 'ABIDIN NASAR, SP., MP', 'WAKIL KETUA 1', NULL, '2019-2024', 'cmny58dhi0001z3u35ixjl692', 1, NULL, NULL, 2, '2026-04-14 05:08:08.061', '2026-04-14 05:08:08.061'),
('cmny5us59000aygou47h3ebql', 'MERLIZA, S.sos. I., MM', 'WAKIL KETUA 2', '', '2019-2024', 'cmny58dhi0001z3u35ixjl692', 1, '/uploads/pimpinan/1776144450512-068A2960.jpg', '', 3, '2026-04-14 05:08:08.061', '2026-04-14 05:27:30.516'),
('cmny5us59000bygou0nl7ucxo', 'MUHAMMAD NASIR., ST., MM', 'KETUA', NULL, '2014-2019', 'cmny58dhp0002z3u367y2ogvn', 1, NULL, NULL, 1, '2026-04-14 05:08:08.061', '2026-04-14 05:08:08.061'),
('cmny5us59000cygoun6yzp561', 'FUD SYAIFUDDIN, ST.', 'WAKIL KETUA 1', NULL, '2014-2019', 'cmny58dhp0002z3u367y2ogvn', 1, NULL, NULL, 2, '2026-04-14 05:08:08.061', '2026-04-14 05:08:08.061'),
('cmny5us59000dygou45tcljht', 'H. AMIR MAKRUF HUSAIN, MM', 'WAKIL KETUA 1', NULL, '2014-2019', 'cmny58dhp0002z3u367y2ogvn', 1, NULL, NULL, 3, '2026-04-14 05:08:08.061', '2026-04-14 05:08:08.061'),
('cmny5us59000eygou5bxztrq9', 'H. MUHAMMAD SYAFII, AMA', 'WAKIL KETUA 1', NULL, '2014-2019', 'cmny58dhp0002z3u367y2ogvn', 1, NULL, NULL, 4, '2026-04-14 05:08:08.061', '2026-04-14 05:08:08.061'),
('cmny5us59000fygououwh74j5', 'IWAN PANJIDINATA', 'WAKIL KETUA 2', NULL, '2014-2019', 'cmny58dhp0002z3u367y2ogvn', 1, NULL, NULL, 5, '2026-04-14 05:08:08.061', '2026-04-14 05:08:08.061'),
('cmny5us59000gygou13tauhzc', 'H. MUSTAFA HMS', 'WAKIL KETUA 2', NULL, '2014-2019', 'cmny58dhp0002z3u367y2ogvn', 1, NULL, NULL, 6, '2026-04-14 05:08:08.061', '2026-04-14 05:08:08.061'),
('cmny5us59000hygouxcr0i53a', 'H. M. SYAFI\'I', 'KETUA', NULL, '2009-2014', 'cmny58dhr0003z3u3oga5yht2', 1, NULL, NULL, 1, '2026-04-14 05:08:08.061', '2026-04-14 05:08:08.061'),
('cmny5us59000iygoud4ha0moc', 'MUSTAKIM PATAWARI', 'WAKIL KETUA 1', NULL, '2009-2014', 'cmny58dhr0003z3u3oga5yht2', 1, NULL, NULL, 2, '2026-04-14 05:08:08.061', '2026-04-14 05:08:08.061'),
('cmny5us59000jygou3bal75yc', 'ABIDIN NASSAR, SP', 'WAKIL KETUA 1', NULL, '2009-2014', 'cmny58dhr0003z3u3oga5yht2', 1, NULL, NULL, 3, '2026-04-14 05:08:08.061', '2026-04-14 05:08:08.061'),
('cmny5us59000kygousra1vrjj', 'MUHAMMAD SALEH, SE', 'WAKIL KETUA 2', NULL, '2009-2014', 'cmny58dhr0003z3u3oga5yht2', 1, NULL, NULL, 4, '2026-04-14 05:08:08.061', '2026-04-14 05:08:08.061'),
('cmny5us59000lygouegivrvlg', 'DRS. MANIMBANG KAHARIYADI, MM', 'KETUA', NULL, '2004-2009', 'cmny58dhs0004z3u3v099crwl', 1, NULL, NULL, 1, '2026-04-14 05:08:08.061', '2026-04-14 05:08:08.061'),
('cmny5us59000mygouv8khrvb0', 'DRS. MOH. ARSYAD', 'WAKIL KETUA 1', NULL, '2004-2009', 'cmny58dhs0004z3u3v099crwl', 1, NULL, NULL, 2, '2026-04-14 05:08:08.061', '2026-04-14 05:08:08.061'),
('cmny5us59000nygou5yxc3jqx', 'DRS. M. THAMZIL', 'WAKIL KETUA 2', NULL, '2004-2009', 'cmny58dhs0004z3u3v099crwl', 1, NULL, NULL, 3, '2026-04-14 05:08:08.061', '2026-04-14 05:08:08.061');

-- --------------------------------------------------------

--
-- Table structure for table `podcasts`
--

CREATE TABLE `podcasts` (
  `id` varchar(191) NOT NULL,
  `judul` varchar(191) NOT NULL,
  `subjudul` varchar(191) DEFAULT NULL,
  `link` text DEFAULT NULL,
  `host` varchar(191) DEFAULT NULL,
  `narasumber` varchar(191) DEFAULT NULL,
  `thumbnailUrl` text DEFAULT NULL,
  `audioUrl` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `podcasts`
--

INSERT INTO `podcasts` (`id`, `judul`, `subjudul`, `link`, `host`, `narasumber`, `thumbnailUrl`, `audioUrl`, `createdAt`, `updatedAt`) VALUES
('cmnschqao000cm6e7oo65tp62', 'Membangun Daerah Melalui Legislasi yang Berpihak Rakyat', 'Episode 1 - Seri Tata Kelola Daerah', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'H. Abidin, S.Pd.', 'Ketua DPRD Sumbawa Barat', 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80', NULL, '2026-04-10 03:27:19.392', '2026-04-10 03:27:19.392'),
('cmnschqaq000dm6e7aujky025', 'Peran DPRD dalam Pengawasan Anggaran Daerah', 'Episode 2 - Seri Tata Kelola Daerah', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'H. Thamrin, S.E.', 'Wakil Ketua DPRD Bidang Anggaran', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80', NULL, '2026-04-10 03:27:19.394', '2026-04-10 03:27:19.394'),
('cmnschqat000em6e74fy6j5du', 'Raperda Perlindungan Tenaga Kerja Lokal: Apa Isinya?', 'Episode 3 - Seri Legislasi', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Mustafa, S.H.', 'Ketua Bapemperda DPRD KSB', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80', NULL, '2026-04-10 03:27:19.397', '2026-04-10 03:27:19.397'),
('cmnschqau000fm6e764n5f8nk', 'Aspirasi Warga dan Fungsi Reses DPRD', 'Episode 4 - Seri Wakil Rakyat', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Hj. Syarifah', 'Anggota Komisi I DPRD KSB', 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80', NULL, '2026-04-10 03:27:19.398', '2026-04-10 03:27:19.398'),
('cmnschqav000gm6e7gjukjmxi', 'APBD dan Prioritas Pembangunan Sumbawa Barat 2026', 'Episode 5 - Seri Anggaran', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'K.H. Syamsul Ismain', 'Ketua Banggar DPRD KSB', 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80', NULL, '2026-04-10 03:27:19.400', '2026-04-10 03:27:19.400'),
('cmnschqax000hm6e7xzp23vph', 'Transparansi dan Akuntabilitas Pemerintah Daerah', 'Episode 6 - Seri Tata Kelola Daerah', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Ziaul Haq', 'Anggota Komisi II DPRD KSB', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', NULL, '2026-04-10 03:27:19.401', '2026-04-10 03:27:19.401'),
('cmnschqay000im6e7s9rbkm91', 'Pendidikan Berkualitas untuk Semua: Peran DPRD', 'Episode 7 - Seri Pendidikan', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Bambang Sudarmanto', 'Anggota Komisi III DPRD KSB', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80', NULL, '2026-04-10 03:27:19.403', '2026-04-10 03:27:19.403'),
('cmnschqb0000jm6e7umbf1662', 'Infrastruktur Desa dan Dana Desa: Pengawasan DPRD', 'Episode 8 - Seri Pembangunan', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Arifin', 'Anggota Komisi I DPRD KSB', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', NULL, '2026-04-10 03:27:19.404', '2026-04-10 03:27:19.404'),
('cmnschqb2000km6e7pnypn3v1', 'Kesehatan Masyarakat dan Rencana RSUD Tipe B', 'Episode 9 - Seri Kesehatan', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Sudarsih', 'Anggota Komisi II DPRD KSB', 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80', NULL, '2026-04-10 03:27:19.406', '2026-04-10 03:27:19.406'),
('cmnschqb3000lm6e7c6u1c1mp', 'Fraksi dan Dinamika Politik di DPRD KSB', 'Episode 10 - Seri Politik Lokal', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'H. Mancawari', 'Ketua Fraksi Golkar DPRD KSB', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', NULL, '2026-04-10 03:27:19.408', '2026-04-10 03:27:19.408');

-- --------------------------------------------------------

--
-- Table structure for table `ppid_anggaran`
--

CREATE TABLE `ppid_anggaran` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `fileUrl` text NOT NULL,
  `fileType` varchar(191) NOT NULL DEFAULT 'pdf',
  `tahun` varchar(191) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ppid_assets`
--

CREATE TABLE `ppid_assets` (
  `id` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `imageUrl` text NOT NULL,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ppid_assets`
--

INSERT INTO `ppid_assets` (`id`, `slug`, `imageUrl`, `updatedAt`) VALUES
('11dee5a6730940289f3330a0f', 'maklumat-pelayanan', '/uploads/ppid/1776262918106-maklumat-pelayanan.png', '2026-04-15 14:21:58.107'),
('34b5a91a0069464e9ed037a38', 'struktur-organisasi', '/uploads/ppid/1776262915718-struktur-organisasi.png', '2026-04-15 14:21:55.719');

-- --------------------------------------------------------

--
-- Table structure for table `propemperda`
--

CREATE TABLE `propemperda` (
  `id` varchar(191) NOT NULL,
  `tahun` varchar(191) NOT NULL,
  `keterangan` text DEFAULT NULL,
  `isAktif` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `propemperda`
--

INSERT INTO `propemperda` (`id`, `tahun`, `keterangan`, `isAktif`, `createdAt`, `updatedAt`) VALUES
('cmnscy5nl000cq1slhzetgu7e', '2026', NULL, 1, '2026-04-10 03:40:05.793', '2026-04-10 03:40:05.793'),
('cmnscy5o3000rq1sls4yb6c10', '2025', NULL, 1, '2026-04-10 03:40:05.811', '2026-04-10 03:40:05.811'),
('cmnscy5ok001aq1slk9o781rb', '2024', NULL, 1, '2026-04-10 03:40:05.828', '2026-04-10 03:40:05.828');

-- --------------------------------------------------------

--
-- Table structure for table `rancangan_perda`
--

CREATE TABLE `rancangan_perda` (
  `id` varchar(191) NOT NULL,
  `judul` text NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Belum Pembahasan',
  `keterangan` text DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `propemperdaId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rancangan_perda`
--

INSERT INTO `rancangan_perda` (`id`, `judul`, `status`, `keterangan`, `order`, `propemperdaId`, `createdAt`, `updatedAt`) VALUES
('cmnscy5np000eq1slukztbkso', 'Raperda tentang Anggaran Pendapatan dan Belanja Daerah Tahun Anggaran 2026', 'Proses Pembahasan', NULL, 1, 'cmnscy5nl000cq1slhzetgu7e', '2026-04-10 03:40:05.797', '2026-04-10 03:40:05.797'),
('cmnscy5nr000gq1slnlw4txo9', 'Raperda tentang Pertanggungjawaban Pelaksanaan APBD Tahun Anggaran 2025', 'Proses Pembahasan', NULL, 2, 'cmnscy5nl000cq1slhzetgu7e', '2026-04-10 03:40:05.799', '2026-04-10 03:40:05.799'),
('cmnscy5nu000iq1slwqm6kk3s', 'Raperda tentang Perubahan APBD Tahun Anggaran 2026', 'Belum Pembahasan', NULL, 3, 'cmnscy5nl000cq1slhzetgu7e', '2026-04-10 03:40:05.803', '2026-04-10 03:40:05.803'),
('cmnscy5nw000kq1slnx8310sc', 'Raperda tentang Rencana Pembangunan Jangka Panjang Daerah (RPJPD) Kabupaten Sumbawa Barat', 'Proses Pembahasan', NULL, 4, 'cmnscy5nl000cq1slhzetgu7e', '2026-04-10 03:40:05.804', '2026-04-10 03:40:05.804'),
('cmnscy5ny000mq1sl5izph1y7', 'Raperda tentang Pajak Daerah dan Retribusi Daerah', 'Belum Pembahasan', NULL, 5, 'cmnscy5nl000cq1slhzetgu7e', '2026-04-10 03:40:05.806', '2026-04-10 03:40:05.806'),
('cmnscy5nz000oq1sls5sr8s02', 'Raperda tentang Penyelenggaraan Bantuan Hukum', 'Belum Pembahasan', NULL, 6, 'cmnscy5nl000cq1slhzetgu7e', '2026-04-10 03:40:05.808', '2026-04-10 03:40:05.808'),
('cmnscy5o1000qq1sl2r5fu2of', 'Raperda tentang Pengelolaan Barang Milik Daerah', 'Proses Pembahasan', NULL, 7, 'cmnscy5nl000cq1slhzetgu7e', '2026-04-10 03:40:05.809', '2026-04-10 03:40:05.809'),
('cmnscy5o5000tq1slrdkz0azi', 'Raperda tentang Anggaran Pendapatan dan Belanja Daerah Tahun Anggaran 2025', 'Selesai Pembahasan', NULL, 1, 'cmnscy5o3000rq1sls4yb6c10', '2026-04-10 03:40:05.813', '2026-04-10 03:40:05.813'),
('cmnscy5o6000vq1slpp1bxi4z', 'Raperda tentang Pertanggungjawaban Pelaksanaan APBD Tahun Anggaran 2024', 'Selesai Pembahasan', NULL, 2, 'cmnscy5o3000rq1sls4yb6c10', '2026-04-10 03:40:05.815', '2026-04-10 03:40:05.815'),
('cmnscy5o8000xq1slt896nq7e', 'Raperda tentang Perubahan APBD Tahun Anggaran 2025', 'Selesai Pembahasan', NULL, 3, 'cmnscy5o3000rq1sls4yb6c10', '2026-04-10 03:40:05.816', '2026-04-10 03:40:05.816'),
('cmnscy5oa000zq1slg215qyev', 'Raperda tentang Rencana Pembangunan Jangka Menengah Daerah (RPJMD) Kabupaten Sumbawa Barat 2024-2029', 'Selesai Pembahasan', NULL, 4, 'cmnscy5o3000rq1sls4yb6c10', '2026-04-10 03:40:05.818', '2026-04-10 03:40:05.818'),
('cmnscy5ob0011q1slkxpyd6xm', 'Raperda tentang Pengelolaan Keuangan Daerah', 'Proses Pembahasan', NULL, 5, 'cmnscy5o3000rq1sls4yb6c10', '2026-04-10 03:40:05.820', '2026-04-10 03:40:05.820'),
('cmnscy5oc0013q1slwbo79paz', 'Raperda tentang Perlindungan dan Pengelolaan Lingkungan Hidup', 'Proses Pembahasan', NULL, 6, 'cmnscy5o3000rq1sls4yb6c10', '2026-04-10 03:40:05.821', '2026-04-10 03:40:05.821'),
('cmnscy5oe0015q1sl7aabyqpq', 'Raperda tentang Penyelenggaraan Pendidikan', 'Proses Pembahasan', NULL, 7, 'cmnscy5o3000rq1sls4yb6c10', '2026-04-10 03:40:05.822', '2026-04-10 03:40:05.822'),
('cmnscy5og0017q1slbl0i8x5n', 'Raperda tentang Penyelenggaraan Kesehatan', 'Belum Pembahasan', NULL, 8, 'cmnscy5o3000rq1sls4yb6c10', '2026-04-10 03:40:05.824', '2026-04-10 03:40:05.824'),
('cmnscy5oh0019q1slu7b9q5ek', 'Raperda tentang Penanggulangan Bencana Daerah', 'Belum Pembahasan', NULL, 9, 'cmnscy5o3000rq1sls4yb6c10', '2026-04-10 03:40:05.826', '2026-04-10 03:40:05.826'),
('cmnscy5om001cq1slimt7gqy8', 'Raperda tentang Anggaran Pendapatan dan Belanja Daerah Tahun Anggaran 2024', 'Selesai Pembahasan', NULL, 1, 'cmnscy5ok001aq1slk9o781rb', '2026-04-10 03:40:05.830', '2026-04-10 03:40:05.830'),
('cmnscy5on001eq1sljfrptk5q', 'Raperda tentang Pertanggungjawaban Pelaksanaan APBD Tahun Anggaran 2023', 'Selesai Pembahasan', NULL, 2, 'cmnscy5ok001aq1slk9o781rb', '2026-04-10 03:40:05.832', '2026-04-10 03:40:05.832'),
('cmnscy5oq001gq1sl83grn5jw', 'Raperda tentang Perubahan APBD Tahun Anggaran 2024', 'Selesai Pembahasan', NULL, 3, 'cmnscy5ok001aq1slk9o781rb', '2026-04-10 03:40:05.834', '2026-04-10 03:40:05.834'),
('cmnscy5or001iq1sl4398wblg', 'Raperda tentang Pengelolaan Air Limbah Domestik', 'Selesai Pembahasan', NULL, 4, 'cmnscy5ok001aq1slk9o781rb', '2026-04-10 03:40:05.835', '2026-04-10 03:40:05.835'),
('cmnscy5ot001kq1slazv4evs4', 'Raperda tentang Penyelenggaraan Sistem Pangan', 'Selesai Pembahasan', NULL, 5, 'cmnscy5ok001aq1slk9o781rb', '2026-04-10 03:40:05.837', '2026-04-10 03:40:05.837'),
('cmnscy5ou001mq1slvzzj9du8', 'Raperda tentang Kawasan Tanpa Rokok', 'Proses Pembahasan', NULL, 6, 'cmnscy5ok001aq1slk9o781rb', '2026-04-10 03:40:05.839', '2026-04-10 03:40:05.839'),
('cmnscy5ow001oq1slfva8p0u1', 'Raperda tentang Rencana Tata Ruang Wilayah', 'Proses Pembahasan', NULL, 7, 'cmnscy5ok001aq1slk9o781rb', '2026-04-10 03:40:05.840', '2026-04-10 03:40:05.840'),
('cmnscy5ox001qq1slc20uhvzg', 'Raperda tentang Penyelenggaraan Transportasi', 'Proses Pembahasan', NULL, 8, 'cmnscy5ok001aq1slk9o781rb', '2026-04-10 03:40:05.842', '2026-04-10 03:40:05.842');

-- --------------------------------------------------------

--
-- Table structure for table `raperda_luar`
--

CREATE TABLE `raperda_luar` (
  `id` varchar(191) NOT NULL,
  `judul` text NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Belum Pembahasan',
  `keterangan` text DEFAULT NULL,
  `tahun` varchar(191) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `raperda_luar`
--

INSERT INTO `raperda_luar` (`id`, `judul`, `status`, `keterangan`, `tahun`, `order`, `createdAt`, `updatedAt`) VALUES
('caba7d5d3c584b33a477c0d27', 'tasda', 'Selesai Pembahasan', 'asdasd', '2026', 0, '2026-04-15 06:56:03.363', '2026-04-15 06:56:32.860'),
('d3cf0cd9178341cfaf42f1107', 'asdfads', 'Belum Pembahasan', 'asdasdsd', '2026', 0, '2026-04-15 06:56:09.121', '2026-04-15 06:56:09.121');

-- --------------------------------------------------------

--
-- Table structure for table `sekretariat`
--

CREATE TABLE `sekretariat` (
  `id` varchar(191) NOT NULL,
  `visi` text DEFAULT NULL,
  `misi` text DEFAULT NULL,
  `tugas` text DEFAULT NULL,
  `fungsi` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sekretariat`
--

INSERT INTO `sekretariat` (`id`, `visi`, `misi`, `tugas`, `fungsi`, `createdAt`, `updatedAt`) VALUES
('cmny5us6p002nygou5ng58dhs', 'MENINGKATNYA KUALITAS PELAYANAN SEKRETARIAT DPRD KEPADA PIMPINAN DAN ANGGOTA DPRD', '[\"MENINGKATKAN PELAYANAN INTERNAL PERANGKAT DAERAH\",\"MENINGKATKAN PELAYANAN KEUANGAN\",\"MENINGKATKAN PELAYANAN PERSIDANGAN, PERUNDANG-UNDANGAN DAN HUMAS\"]', '[\"Menyelenggarakan administrasi kesekretariatan dan keuangan\",\"Mendukung pelaksanaan tugas dan fungsi DPRD\",\"Menyediakan dan mengkoordinasikan tenaga ahli yang diperlukan oleh DPRD dalam melaksanakan hak dan fungsinya sesuai kebutuhan\"]', '[\"Penyelenggaraan administrasi kesekretariatan DPRD\",\"Penyelenggaraan administrasi keuangan DPRD\",\"Fasilitasi penyelenggaraan rapat-rapat DPRD\",\"Penyediaan dan pengkoordinasian tenaga ahli yang diperlukan oleh DPRD\"]', '2026-04-14 05:08:08.114', '2026-04-14 05:08:08.114');

-- --------------------------------------------------------

--
-- Table structure for table `tautans`
--

CREATE TABLE `tautans` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `url` text NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tautans`
--

INSERT INTO `tautans` (`id`, `title`, `url`, `isActive`, `order`, `createdAt`, `updatedAt`) VALUES
('018469d3a71b4a45a56b024d0', 'IPKD', 'https://sumbawabaratkab.go.id/', 1, 9, '2026-04-15 05:26:22.654', '2026-04-15 05:26:22.654'),
('1fe62bf58a8e40c3a10242747', 'JAGA ID', 'https://jaga.id/?vnk=fd2f5b2a', 1, 4, '2026-04-15 00:52:53.628', '2026-04-15 05:22:09.818'),
('21b2a9d7d4eb4989a585a5413', 'Sakip', 'https://sakip.sumbawabaratkab.go.id', 1, 8, '2026-04-15 05:24:43.116', '2026-04-15 05:24:43.116'),
('56f7dd1a42a944cca709b6d8c', 'Cloud Storage', 'https://owncloud.sumbawabaratkab.go.id/index.php/login', 1, 6, '2026-04-15 00:52:53.628', '2026-04-15 05:23:23.311'),
('96de47c6b2064f55a420f7118', 'e-Gov Sumbawa Barat', 'https://sumbawabaratkab.go.id', 1, 1, '2026-04-15 00:52:53.628', '2026-04-15 05:16:10.373'),
('a36e2b6df6dd43e9a43054062', 'Satu Data Sumbawa Barat', 'https://data.sumbawabaratkab.go.id/', 1, 7, '2026-04-15 05:24:02.292', '2026-04-15 05:24:23.234'),
('b5ef6f6840f64b97b72250faa', 'SP4N LAPOR', 'https://prod.lapor.go.id', 1, 5, '2026-04-15 00:52:53.628', '2026-04-15 05:22:53.921'),
('ba1a2cebffa449f9a65e85eb9', 'PPID', 'https://ppid.sumbawabarat.go.id', 1, 3, '2026-04-15 00:52:53.628', '2026-04-15 00:52:53.628'),
('fb9f21b9ed1c4d3a8391eec3f', 'JDIH', 'https://jdih.sumbawabaratkab.go.id', 1, 2, '2026-04-15 00:52:53.628', '2026-04-15 05:16:47.195');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('194e836a-2ed8-41ee-8688-0bfdf90a9195', 'bf08614ee972fa12d3c40bfe36562f585d189c8d50a9475ac1a685a27d29f53a', '2026-04-09 13:56:40.498', '20260409135640_init', NULL, NULL, '2026-04-09 13:56:40.156', 1),
('508a6bd3-fff1-4364-8cb4-5455d3a6d436', '5661dc9af136b25af20fd3835e17595def3e074f31c08801c3cb32670f76a46e', '2026-04-10 03:32:43.127', '20260410033243_add_propemperda_tables', NULL, NULL, '2026-04-10 03:32:43.081', 1),
('d9f81f9b-fde9-4b3b-b306-a1701c346300', '42d764789b4e4706c4d237c7afb61504e5f483e5787fa4a2c3a10c0a27299fa8', '2026-04-10 03:22:14.872', '20260410032214_add_podcast_table', NULL, NULL, '2026-04-10 03:22:14.866', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admins_username_key` (`username`);

--
-- Indexes for table `agendas`
--
ALTER TABLE `agendas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `anggota_bamus`
--
ALTER TABLE `anggota_bamus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `anggota_bamus_bamusInfoId_fkey` (`bamusInfoId`);

--
-- Indexes for table `anggota_banggar`
--
ALTER TABLE `anggota_banggar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `anggota_banggar_banggarInfoId_fkey` (`banggarInfoId`);

--
-- Indexes for table `anggota_bapemperda`
--
ALTER TABLE `anggota_bapemperda`
  ADD PRIMARY KEY (`id`),
  ADD KEY `anggota_bapemperda_bapemperdaInfoId_fkey` (`bapemperdaInfoId`);

--
-- Indexes for table `anggota_bk`
--
ALTER TABLE `anggota_bk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `anggota_bk_bkInfoId_fkey` (`bkInfoId`);

--
-- Indexes for table `anggota_dapil`
--
ALTER TABLE `anggota_dapil`
  ADD PRIMARY KEY (`id`),
  ADD KEY `anggota_dapil_dapilId_fkey` (`dapilId`);

--
-- Indexes for table `anggota_fraksi`
--
ALTER TABLE `anggota_fraksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `anggota_fraksi_fraksiInfoId_fkey` (`fraksiInfoId`);

--
-- Indexes for table `anggota_komisi`
--
ALTER TABLE `anggota_komisi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `anggota_komisi_komisiInfoId_fkey` (`komisiInfoId`);

--
-- Indexes for table `anggota_sekretariat`
--
ALTER TABLE `anggota_sekretariat`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bamus_info`
--
ALTER TABLE `bamus_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `banggar_info`
--
ALTER TABLE `banggar_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bapemperda_info`
--
ALTER TABLE `bapemperda_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `beritas`
--
ALTER TABLE `beritas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `beritas_slug_key` (`slug`);

--
-- Indexes for table `bk_info`
--
ALTER TABLE `bk_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `daerah_pemilihan`
--
ALTER TABLE `daerah_pemilihan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `daerah_pemilihan_slug_key` (`slug`);

--
-- Indexes for table `emagazines`
--
ALTER TABLE `emagazines`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fraksi_info`
--
ALTER TABLE `fraksi_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `fraksi_info_slug_key` (`slug`),
  ADD KEY `fraksi_info_masaJabatanId_fkey` (`masaJabatanId`);

--
-- Indexes for table `info_publik`
--
ALTER TABLE `info_publik`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `komentar_berita`
--
ALTER TABLE `komentar_berita`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `komisi_info`
--
ALTER TABLE `komisi_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `masa_jabatan`
--
ALTER TABLE `masa_jabatan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `masa_jabatan_periode_key` (`periode`);

--
-- Indexes for table `masa_jabatan_fraksi`
--
ALTER TABLE `masa_jabatan_fraksi`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `masa_jabatan_fraksi_periode_key` (`periode`);

--
-- Indexes for table `pimpinan`
--
ALTER TABLE `pimpinan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pimpinan_masaJabatanId_fkey` (`masaJabatanId`);

--
-- Indexes for table `podcasts`
--
ALTER TABLE `podcasts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ppid_anggaran`
--
ALTER TABLE `ppid_anggaran`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ppid_assets`
--
ALTER TABLE `ppid_assets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ppid_assets_slug_key` (`slug`);

--
-- Indexes for table `propemperda`
--
ALTER TABLE `propemperda`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `propemperda_tahun_key` (`tahun`);

--
-- Indexes for table `rancangan_perda`
--
ALTER TABLE `rancangan_perda`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rancangan_perda_propemperdaId_fkey` (`propemperdaId`);

--
-- Indexes for table `raperda_luar`
--
ALTER TABLE `raperda_luar`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sekretariat`
--
ALTER TABLE `sekretariat`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tautans`
--
ALTER TABLE `tautans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `anggota_bamus`
--
ALTER TABLE `anggota_bamus`
  ADD CONSTRAINT `anggota_bamus_bamusInfoId_fkey` FOREIGN KEY (`bamusInfoId`) REFERENCES `bamus_info` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `anggota_banggar`
--
ALTER TABLE `anggota_banggar`
  ADD CONSTRAINT `anggota_banggar_banggarInfoId_fkey` FOREIGN KEY (`banggarInfoId`) REFERENCES `banggar_info` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `anggota_bapemperda`
--
ALTER TABLE `anggota_bapemperda`
  ADD CONSTRAINT `anggota_bapemperda_bapemperdaInfoId_fkey` FOREIGN KEY (`bapemperdaInfoId`) REFERENCES `bapemperda_info` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `anggota_bk`
--
ALTER TABLE `anggota_bk`
  ADD CONSTRAINT `anggota_bk_bkInfoId_fkey` FOREIGN KEY (`bkInfoId`) REFERENCES `bk_info` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `anggota_dapil`
--
ALTER TABLE `anggota_dapil`
  ADD CONSTRAINT `anggota_dapil_dapilId_fkey` FOREIGN KEY (`dapilId`) REFERENCES `daerah_pemilihan` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `anggota_fraksi`
--
ALTER TABLE `anggota_fraksi`
  ADD CONSTRAINT `anggota_fraksi_fraksiInfoId_fkey` FOREIGN KEY (`fraksiInfoId`) REFERENCES `fraksi_info` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `anggota_komisi`
--
ALTER TABLE `anggota_komisi`
  ADD CONSTRAINT `anggota_komisi_komisiInfoId_fkey` FOREIGN KEY (`komisiInfoId`) REFERENCES `komisi_info` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `fraksi_info`
--
ALTER TABLE `fraksi_info`
  ADD CONSTRAINT `fraksi_info_masaJabatanId_fkey` FOREIGN KEY (`masaJabatanId`) REFERENCES `masa_jabatan_fraksi` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `pimpinan`
--
ALTER TABLE `pimpinan`
  ADD CONSTRAINT `pimpinan_masaJabatanId_fkey` FOREIGN KEY (`masaJabatanId`) REFERENCES `masa_jabatan` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `rancangan_perda`
--
ALTER TABLE `rancangan_perda`
  ADD CONSTRAINT `rancangan_perda_propemperdaId_fkey` FOREIGN KEY (`propemperdaId`) REFERENCES `propemperda` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
