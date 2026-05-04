# Tasks: src-refactoring

## Task List

- [ ] 1. Pisahkan constants dari Admin Layout
  - [ ] 1.1 Buat `src/app/admin/(dashboard)/admin.constants.ts` berisi `NAV_BY_ROLE`, `ROLE_LABELS`, `ROLE_BADGE`
  - [ ] 1.2 Update `layout.tsx` untuk mengimport dari `admin.constants.ts` dan hapus definisi inline
  - [ ] 1.3 Verifikasi `layout.tsx` tidak melebihi 250 baris dan tidak ada TypeScript error

- [ ] 2. Pisahkan constants dari Header
  - [ ] 2.1 Buat `src/components/Header.constants.ts` berisi interface `NavItem` dan array `navItems`
  - [ ] 2.2 Update `Header.tsx` untuk mengimport `navItems` dari `Header.constants.ts`
  - [ ] 2.3 Verifikasi `Header.tsx` tidak melebihi 250 baris dan tidak ada TypeScript error

- [ ] 3. Pecah `AdminSilegdaPage.tsx` (549 baris)
  - [ ] 3.1 Buat folder `src/pages-old/admin/silegda/`
  - [ ] 3.2 Buat `src/pages-old/admin/silegda/useSilegdaAdmin.ts` — pindahkan semua state dan handlers (propemperda, raperda, raperda luar)
  - [ ] 3.3 Buat `src/pages-old/admin/silegda/SilegdaModals.tsx` — pindahkan semua modal (Propemperda, Raperda, Luar, Delete confirms)
  - [ ] 3.4 Buat `src/pages-old/admin/silegda/SilegdaTable.tsx` — pindahkan tabel raperda dalam accordion
  - [ ] 3.5 Update `AdminSilegdaPage.tsx` untuk mengimport dari file-file baru, pastikan ≤250 baris
  - [ ] 3.6 Verifikasi tidak ada TypeScript error dan semua operasi CRUD masih berfungsi

- [ ] 4. Verifikasi dan bersihkan `src/pages-old/` (public pages)
  - [ ] 4.1 Verifikasi setiap file di `src/pages-old/` (non-admin) sudah memiliki padanan aktif di `src/app/(public)/`
  - [ ] 4.2 Hapus file-file `src/pages-old/*.tsx` yang sudah diverifikasi setara (HomePage, BeritaPage, BeritaDetailPage, AKDPage, FraksiPage, SilegdaPage, PPIDPage, PodcastPage, SekretariatPage, PimpinanPage)
  - [ ] 4.3 Verifikasi `PimpinanTerdahuluPage.tsx` — jika belum ada padanan, buat dulu di App Router sebelum hapus
  - [ ] 4.4 Hapus subfolder `src/pages-old/akd/` dan `src/pages-old/fraksi/` jika sudah tidak direferensikan
  - [ ] 4.5 Jika `src/pages-old/` hanya tersisa folder `admin/`, biarkan — folder admin masih aktif digunakan

- [ ] 5. Validasi akhir
  - [ ] 5.1 Jalankan `tsc --noEmit` — harus 0 error
  - [ ] 5.2 Jalankan `next build` — harus berhasil tanpa error
  - [ ] 5.3 Pastikan tidak ada file `.ts`/`.tsx` di `src/` yang melebihi 250 baris
