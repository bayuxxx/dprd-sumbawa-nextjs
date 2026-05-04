# Design Document: src-refactoring

## Overview

Refactoring struktural pada folder `src/` project Next.js DPRD Sumbawa Barat. Tujuannya adalah menegakkan batas 250 baris per file, memisahkan concerns (komponen, hooks, types, constants), dan membersihkan folder `src/pages-old/` yang sudah memiliki padanan di App Router.

Refactoring ini bersifat **non-breaking** — tidak ada perubahan pada logika bisnis, API contract, URL routing, atau output HTML yang dirender.

---

## Architecture

Struktur `src/` setelah refactoring mengikuti pola yang sudah ada, dengan penambahan file-file pemecahan:

```
src/
├── app/
│   ├── (public)/          ← halaman publik (App Router)
│   └── admin/
│       └── (dashboard)/
│           ├── layout.tsx              ← import dari admin.constants.ts
│           └── admin.constants.ts      ← NAV_BY_ROLE, ROLE_LABELS, ROLE_BADGE [BARU]
├── components/
│   ├── Header.tsx                      ← import navItems dari Header.constants.ts
│   ├── Header.constants.ts             ← navItems array [BARU]
│   ├── HeroCarousel.tsx                ← tetap (sudah <250 baris)
│   └── ...
├── pages-old/
│   └── admin/
│       └── AdminSilegdaPage.tsx        ← dipecah jadi 4 file
│           ├── silegda/
│           │   ├── useSilegdaAdmin.ts  ← state + handlers [BARU]
│           │   ├── SilegdaModals.tsx   ← semua modal [BARU]
│           │   └── SilegdaTable.tsx    ← tabel raperda [BARU]
│           └── AdminSilegdaPage.tsx    ← max 250 baris, import dari atas
├── lib/                   ← tidak berubah
└── services/              ← tidak berubah
```

### Prinsip Desain

1. **Separation of Concerns** — setiap file punya satu tanggung jawab
2. **Barrel Export** — `index.ts` di folder yang dipecah agar import luar tidak berubah
3. **No Logic Change** — hanya memindahkan kode, tidak menulis ulang
4. **Incremental** — setiap file dikerjakan independen, tidak ada big-bang rewrite

---

## Components and Interfaces

### 1. Admin Layout Constants (`admin.constants.ts`)

Memindahkan data statis dari `layout.tsx` ke file terpisah.

**Dari:** `src/app/admin/(dashboard)/layout.tsx` (inline constants)
**Ke:** `src/app/admin/(dashboard)/admin.constants.ts`

```ts
// admin.constants.ts
export const NAV_BY_ROLE: Record<AdminRole, NavItem[]> = { ... }
export const ROLE_LABELS: Record<AdminRole, string> = { ... }
export const ROLE_BADGE: Record<AdminRole, string> = { ... }
```

`layout.tsx` cukup mengimport ketiga konstanta ini. Tidak ada perubahan perilaku.

---

### 2. Header Constants (`Header.constants.ts`)

**Dari:** `src/components/Header.tsx` (inline `navItems`)
**Ke:** `src/components/Header.constants.ts`

```ts
// Header.constants.ts
export interface NavItem {
  label: string
  href: string
  children?: { label: string; href: string }[]
}
export const navItems: NavItem[] = [ ... ]
```

`Header.tsx` mengimport `navItems` dari file ini.

---

### 3. AdminSilegdaPage Decomposition

File saat ini: **549 baris** → dipecah menjadi 4 file di folder `src/pages-old/admin/silegda/`:

| File | Isi | Estimasi baris |
|------|-----|----------------|
| `useSilegdaAdmin.ts` | Semua state, handlers (propemperda, raperda, luar) | ~180 |
| `SilegdaModals.tsx` | Modal Propemperda, Modal Raperda, Modal Luar, Delete confirms | ~200 |
| `SilegdaTable.tsx` | Tabel raperda dalam accordion propemperda | ~80 |
| `AdminSilegdaPage.tsx` | Komponen utama (layout, tab, list) | ~120 |

Interface hook:
```ts
// useSilegdaAdmin.ts
export interface SilegdaAdminState {
  tab: Tab; setTab: (t: Tab) => void
  list: Propemperda[]; loading: boolean
  luarList: RaperdaLuar[]; loadingLuar: boolean
  // ... semua state modal dan handlers
  load: () => void; loadLuar: () => void
}
export function useSilegdaAdmin(): SilegdaAdminState
```

---

### 4. Pages-Old Migration Assessment

Mapping `src/pages-old/` → `src/app/(public)/`:

| pages-old | app/(public) | Status |
|-----------|-------------|--------|
| `HomePage.tsx` | `page.tsx` | ✅ Ada padanan |
| `BeritaPage.tsx` | `berita/page.tsx` | ✅ Ada padanan |
| `BeritaDetailPage.tsx` | `berita/[slug]/page.tsx` | ✅ Ada padanan |
| `AKDPage.tsx` | `akd/page.tsx` | ✅ Ada padanan |
| `FraksiPage.tsx` | `fraksi/page.tsx` | ✅ Ada padanan |
| `SilegdaPage.tsx` | `silegda/page.tsx` | ✅ Ada padanan |
| `PPIDPage.tsx` | `ppid/page.tsx` | ✅ Ada padanan |
| `PodcastPage.tsx` | `podcast/page.tsx` | ✅ Ada padanan |
| `SekretariatPage.tsx` | `sekretariat/page.tsx` | ✅ Ada padanan |
| `PimpinanPage.tsx` | `akd/[slug]/page.tsx` | ✅ Tercakup di AKD |
| `PimpinanTerdahuluPage.tsx` | — | ⚠️ Perlu verifikasi |

Setiap file di `pages-old/` yang sudah diverifikasi setara dengan padanannya di App Router akan dihapus. Folder `src/pages-old/admin/` **tidak dihapus** karena masih digunakan sebagai komponen yang di-render oleh App Router admin pages.

---

## Data Models

Tidak ada perubahan data model. Semua types yang ada di `src/services/api/` dan `src/lib/auth.ts` tetap sama.

Satu-satunya type baru adalah `NavItem` di `Header.constants.ts` — ini hanya memformalkan shape yang sudah implisit ada di `Header.tsx`.

```ts
// Sudah ada secara implisit, sekarang diekspor eksplisit
interface NavItem {
  label: string
  href: string
  children?: { label: string; href: string }[]
}
```

---

## Error Handling

Karena ini adalah refactoring struktural, tidak ada error handling baru yang perlu ditambahkan. Yang perlu dijaga:

- **Import paths** — setelah memindahkan file, semua import yang mereferensikan path lama harus diperbarui
- **Re-export** — jika ada file yang dipindahkan dan masih direferensikan dari banyak tempat, tambahkan re-export di path lama selama masa transisi
- **TypeScript errors** — setiap pemecahan file harus divalidasi dengan `getDiagnostics` sebelum lanjut ke file berikutnya

---

## Testing Strategy

PBT tidak applicable untuk refactoring ini karena:
- Tidak ada fungsi transformasi dengan input/output yang bervariasi
- Tidak ada business logic baru yang ditulis
- Ini adalah reorganisasi kode, bukan penulisan algoritma baru

### Pendekatan Testing

**Smoke tests (manual):**
- Jalankan `next build` — harus 0 error TypeScript
- Buka halaman publik di browser — tampilan harus identik
- Login admin, navigasi ke setiap halaman admin — semua CRUD harus berfungsi

**Unit tests (example-based):**
- Verifikasi `navItems` di `Header.constants.ts` mengandung semua item yang sama dengan sebelumnya (jumlah dan href)
- Verifikasi `NAV_BY_ROLE` di `admin.constants.ts` mengandung semua role dan path yang sama

**Regression check:**
- Sebelum menghapus file dari `pages-old/`, verifikasi padanan di App Router merender konten yang setara
- Jalankan `tsc --noEmit` setelah setiap pemecahan file untuk memastikan tidak ada broken import
