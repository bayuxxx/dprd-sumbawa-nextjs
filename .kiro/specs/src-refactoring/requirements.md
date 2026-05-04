# Requirements Document

## Introduction

Refactoring folder `src` pada project Next.js DPRD Sumbawa Barat bertujuan membuat kode lebih rapi, clean, dan mudah di-maintain. Refactoring ini bersifat non-breaking — fungsionalitas aplikasi tidak boleh berubah, hanya struktur dan organisasi kode yang diperbaiki.

Kondisi saat ini yang perlu ditangani:
- Beberapa file melebihi batas 250 baris (contoh: `AdminSilegdaPage.tsx` ~549 baris)
- Folder `src/pages-old/` berisi halaman legacy yang belum dimigrasikan ke App Router
- Beberapa komponen besar mencampur logika data-fetching, state management, dan rendering dalam satu file
- Admin layout (`layout.tsx`) memiliki data navigasi hardcoded yang bisa dipisahkan ke constants

## Glossary

- **Codebase**: Seluruh kode sumber dalam folder `src/`
- **App_Router**: Sistem routing Next.js berbasis folder di `src/app/`
- **Pages_Old**: Folder `src/pages-old/` yang berisi komponen halaman legacy
- **Component**: File React (`.tsx`) yang merender UI
- **Hook**: Custom React hook (file `.ts` dengan prefix `use`)
- **Barrel_Export**: File `index.ts` yang meng-export semua modul dalam satu folder
- **Admin_Layout**: File `src/app/admin/(dashboard)/layout.tsx`
- **File_Size_Limit**: Batas maksimal 250 baris per file kode sesuai workspace rules
- **Refactoring**: Perubahan struktur kode tanpa mengubah perilaku/fungsionalitas

---

## Requirements

### Requirement 1: Batas Ukuran File

**User Story:** Sebagai developer, saya ingin setiap file kode tidak melebihi 250 baris, agar setiap file mudah dibaca dan dipahami dalam sekali baca.

#### Acceptance Criteria

1. THE Codebase SHALL memastikan setiap file `.ts` dan `.tsx` di dalam `src/` tidak melebihi 250 baris.
2. WHEN sebuah file melebihi 250 baris, THE Developer SHALL memecah file tersebut sebelum menambahkan kode baru.
3. WHEN sebuah file dipecah menjadi beberapa file, THE Developer SHALL menggunakan Barrel_Export (`index.ts`) untuk menjaga kompatibilitas import yang sudah ada.
4. IF sebuah file hasil pemecahan masih melebihi 250 baris, THEN THE Developer SHALL memecahnya kembali hingga semua file memenuhi batas.

---

### Requirement 2: Pemecahan File Besar di `src/pages-old/admin/`

**User Story:** Sebagai developer, saya ingin halaman admin yang besar dipecah berdasarkan tanggung jawab, agar setiap bagian mudah ditemukan dan dimodifikasi secara independen.

#### Acceptance Criteria

1. WHEN sebuah halaman admin melebihi 250 baris, THE Developer SHALL memisahkan komponen modal form ke file tersendiri (contoh: `*Modal.tsx`).
2. WHEN sebuah halaman admin melebihi 250 baris, THE Developer SHALL memisahkan logika data-fetching dan state management ke custom hook (contoh: `use*.ts`).
3. WHEN sebuah halaman admin melebihi 250 baris, THE Developer SHALL memisahkan komponen tabel atau list ke file tersendiri (contoh: `*Table.tsx` atau `*List.tsx`).
4. THE Admin_Page SHALL tetap berfungsi identik setelah pemecahan — semua operasi CRUD, validasi, dan tampilan harus tetap bekerja.
5. WHILE melakukan pemecahan file, THE Developer SHALL memastikan tidak ada perubahan pada logika bisnis atau API calls.

---

### Requirement 3: Pemisahan Concerns pada Komponen Shared

**User Story:** Sebagai developer, saya ingin komponen shared di `src/components/` yang besar dipisahkan antara logika dan tampilan, agar komponen lebih mudah di-test dan di-reuse.

#### Acceptance Criteria

1. WHEN sebuah komponen di `src/components/` melebihi 250 baris, THE Developer SHALL memisahkan custom hooks ke file `ComponentName.hooks.ts`.
2. WHEN sebuah komponen di `src/components/` melebihi 250 baris, THE Developer SHALL memisahkan TypeScript types/interfaces ke file `ComponentName.types.ts`.
3. WHEN sebuah komponen di `src/components/` melebihi 250 baris, THE Developer SHALL memisahkan helper functions ke file `ComponentName.utils.ts`.
4. THE Component SHALL tetap mengekspor nama yang sama dari file utamanya agar tidak ada breaking change pada import yang sudah ada.

---

### Requirement 4: Pemisahan Constants dan Config dari Komponen

**User Story:** Sebagai developer, saya ingin data statis seperti daftar navigasi dan konfigurasi role dipisahkan dari komponen, agar komponen lebih fokus pada rendering dan data mudah diubah tanpa menyentuh logika komponen.

#### Acceptance Criteria

1. THE Admin_Layout SHALL memindahkan data `NAV_BY_ROLE`, `ROLE_LABELS`, dan `ROLE_BADGE` ke file constants terpisah (contoh: `src/app/admin/(dashboard)/admin.constants.ts`).
2. THE Header_Component SHALL memindahkan array `navItems` ke file constants terpisah (contoh: `src/components/Header.constants.ts` atau `src/components/Header.types.ts`).
3. WHEN data constants dipindahkan, THE Component SHALL mengimport constants dari file baru tanpa mengubah perilaku rendering.
4. THE Constants_File SHALL hanya berisi data statis — tidak boleh mengandung logika React atau side effects.

---

### Requirement 5: Migrasi `src/pages-old/` ke App Router

**User Story:** Sebagai developer, saya ingin halaman-halaman di `src/pages-old/` dimigrasikan ke struktur App Router di `src/app/`, agar tidak ada kode duplikat dan semua halaman menggunakan konvensi yang sama.

#### Acceptance Criteria

1. THE Developer SHALL mengidentifikasi halaman di `src/pages-old/` yang belum memiliki padanan di `src/app/(public)/`.
2. WHEN sebuah halaman di `src/pages-old/` sudah memiliki padanan aktif di `src/app/(public)/`, THE Developer SHALL memverifikasi bahwa fungsionalitas sudah setara sebelum menghapus file lama.
3. WHEN migrasi sebuah halaman selesai dan diverifikasi, THE Developer SHALL menghapus file yang bersesuaian dari `src/pages-old/`.
4. IF folder `src/pages-old/` kosong setelah semua migrasi selesai, THEN THE Developer SHALL menghapus folder tersebut.
5. THE Migrated_Page SHALL menggunakan konvensi App Router — termasuk `'use client'` hanya jika diperlukan, dan memanfaatkan Server Components untuk data-fetching bila memungkinkan.

---

### Requirement 6: Konsistensi Struktur `src/lib/`

**User Story:** Sebagai developer, saya ingin `src/lib/` hanya berisi utilities dan helpers yang benar-benar reusable, agar mudah dibedakan dari service layer dan tidak ada logika yang salah tempat.

#### Acceptance Criteria

1. THE `src/lib/` SHALL hanya berisi file-file utility yang digunakan lintas modul: `auth.ts`, `db.ts`, `storage.ts`, `upload.ts`.
2. IF ada logika bisnis spesifik domain yang saat ini berada di `src/lib/`, THEN THE Developer SHALL memindahkannya ke `src/services/` yang sesuai.
3. THE `src/lib/db.ts` SHALL tetap menggunakan singleton pattern untuk connection pool agar tidak membuat pool baru pada setiap hot-reload.
4. THE `src/lib/auth.ts` SHALL tetap mengekspor semua fungsi dan types yang sama (`verifyAuth`, `isAuthError`, `hasPermission`, `requirePermission`, `AdminRole`, `AuthPayload`) agar tidak ada breaking change pada API routes.

---

### Requirement 7: Barrel Export untuk Modul yang Dipecah

**User Story:** Sebagai developer, saya ingin setiap modul yang dipecah menjadi banyak file memiliki barrel export, agar import dari luar modul tetap bersih dan tidak perlu tahu struktur internal.

#### Acceptance Criteria

1. WHEN sebuah modul dipecah menjadi lebih dari satu file, THE Developer SHALL membuat file `index.ts` di folder modul tersebut.
2. THE `index.ts` SHALL meng-export semua public API dari modul — komponen, hooks, types, dan utils yang perlu diakses dari luar.
3. THE Barrel_Export SHALL tidak meng-export implementasi internal yang hanya digunakan di dalam modul.
4. THE `src/services/api.ts` yang sudah ada SHALL tetap berfungsi sebagai barrel export utama untuk semua service API dan tidak perlu diubah strukturnya.

---

### Requirement 8: Tidak Ada Breaking Change

**User Story:** Sebagai developer, saya ingin refactoring tidak mengubah perilaku aplikasi yang sudah berjalan, agar pengguna tidak merasakan dampak apapun dari proses refactoring.

#### Acceptance Criteria

1. THE Refactoring SHALL tidak mengubah output HTML/CSS yang dirender ke browser.
2. THE Refactoring SHALL tidak mengubah URL routing yang sudah ada di `src/app/`.
3. THE Refactoring SHALL tidak mengubah request/response contract pada API routes di `src/app/api/`.
4. WHEN sebuah komponen atau fungsi dipindahkan, THE Developer SHALL memastikan semua import yang mereferensikan lokasi lama diperbarui ke lokasi baru.
5. IF ada import yang menggunakan path lama setelah refactoring, THEN THE Developer SHALL menambahkan re-export dari path lama untuk menjaga backward compatibility selama masa transisi.
