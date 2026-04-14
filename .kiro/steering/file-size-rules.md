---
inclusion: always
---

# File Size Rules

Setiap file kode **maksimal 250 baris**. Jika sebuah file melebihi batas ini, wajib dipecah menjadi beberapa file yang lebih kecil sebelum melanjutkan.

## Aturan Pemecahan File

- Jika file mencapai atau melebihi 250 baris, **pecah dulu sebelum menambah kode baru**
- Pisahkan berdasarkan tanggung jawab: komponen, hooks, utils, types, constants
- Gunakan barrel export (`index.ts`) jika memecah satu modul jadi banyak file
- Nama file harus deskriptif sesuai isinya

## Pola Pemecahan yang Disarankan

Untuk komponen React besar:
- `ComponentName.tsx` — komponen utama (render saja)
- `ComponentName.hooks.ts` — custom hooks
- `ComponentName.types.ts` — TypeScript types/interfaces
- `ComponentName.utils.ts` — helper functions

Untuk API routes besar:
- Pisah handler GET, POST, PUT, DELETE ke file terpisah jika perlu
- Pindahkan business logic ke `src/lib/` atau `src/services/`

Untuk halaman admin besar:
- Pisah modal form ke komponen tersendiri
- Pisah tabel/list ke komponen tersendiri
- Pisah logic ke custom hook

## Contoh

Jika `AdminBeritaPage.tsx` sudah 300 baris:
```
AdminBeritaPage.tsx        ← max 250 baris, import dari bawah
AdminBeritaModal.tsx       ← form modal
AdminBeritaTable.tsx       ← tabel list
useAdminBerita.ts          ← data fetching & state logic
```
