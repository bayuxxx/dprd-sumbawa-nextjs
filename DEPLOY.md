# Panduan Deploy ke cPanel

## Persiapan di Lokal

```bash
# 1. Build project
npm run build

# 2. Buat deploy.zip otomatis
node scripts/deploy-pack.js
```

File `deploy.zip` akan berisi:
- `.next/` — hasil build
- `public/` — assets statis
- `package.json` + `package-lock.json`
- `next.config.ts`
- `server.js`

---

## Upload ke cPanel

### File yang diupload:
| File/Folder | Cara |
|---|---|
| `deploy.zip` | Upload via File Manager, lalu Extract |
| `.env.local` | Upload manual (jangan lewat zip, rahasia) |
| `uploads/` | Upload manual jika ada gambar |

---

## Setup Database MySQL di cPanel

### 1. Buat Database & User
- Buka **MySQL Databases** di cPanel
- Buat database baru, misal: `namacpanel_dprd`
- Buat user baru, misal: `namacpanel_dprduser` dengan password kuat
- Klik **Add User To Database** → pilih user & database → centang **All Privileges**

### 2. Import Schema
- Buka **phpMyAdmin** di cPanel
- Pilih database yang baru dibuat
- Klik tab **Import**
- Export dulu dari lokal:
  ```bash
  # Di lokal, export database
  mysqldump -u root nama_db_local > backup.sql
  ```
- Upload file `backup.sql` dan klik **Go**

### 3. Update .env.local
Sesuaikan `DATABASE_URL` dengan kredensial cPanel:
```
DATABASE_URL="mysql://namacpanel_dprduser:PASSWORD@localhost:3306/namacpanel_dprd"
```

> Di cPanel, host MySQL biasanya tetap `localhost`.

### 4. Buat Tabel (jika database kosong)
Kalau database baru dan belum ada tabel, import schema dari lokal:
```bash
# Di lokal, export schema + data
mysqldump -u root nama_db_local > backup.sql
```
Lalu upload dan import via phpMyAdmin.

---



### 1. Node.js App
- Buka **Setup Node.js App**
- Klik **Create Application**
- Node.js version: **18.x** atau lebih baru
- Application mode: **Production**
- Application root: folder tempat extract (misal `dprd-sumbawa`)
- Application URL: domain kamu
- Application startup file: `node_modules/.bin/next`

### 2. Install Dependencies
Di Terminal cPanel:
```bash
cd ~/dprd-sumbawa
npm install --omit=dev
```

### 3. Set Environment Variables
Di cPanel Node.js App → **Environment Variables**, tambahkan semua isi `.env.local`:
```
DATABASE_URL=...
JWT_SECRET=...
```
Atau upload file `.env.local` langsung ke root folder aplikasi.

### 4. Jalankan
Di cPanel Node.js App → klik **Run JS Script** atau set:
- Startup file: `node_modules/.bin/next`
- Command: `start`

Lalu klik **Restart**.

---

## Update / Redeploy

```bash
# Lokal
npm run build
node scripts/deploy-pack.js

# Upload deploy.zip baru ke cPanel
# Extract (timpa yang lama)
# Restart app di cPanel
```

> Folder `uploads/` tidak perlu diupload ulang saat update kode.
