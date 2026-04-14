const fs = require('fs');
const path = require('path');

const pages = {
    "dashboard": "AdminDashboardPage",
    "berita": "AdminBeritaPage",
    "banner": "AdminBannerPage",
    "pimpinan": "AdminPimpinanPage",
    "komisi": "AdminKomisiPage",
    "bamus": "AdminBamusPage",
    "bapemperda": "AdminBapemperdaPage",
    "banggar": "AdminBanggarPage",
    "bk": "AdminBKPage",
    "fraksi": "AdminFraksiPage",
    "sekretariat": "AdminSekretariatPage",
    "podcast": "AdminPodcastPage",
    "silegda": "AdminSilegdaPage",
    "users": "AdminUsersPage"
};

const baseDir = 'src/app/admin/(dashboard)';

for (const [key, comp] of Object.entries(pages)) {
    const dirPath = path.join(baseDir, key);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

    const content = [
        `'use client';`,
        `import { useEffect, useState } from 'react';`,
        `import ${comp} from '@/pages-old/admin/${comp}';`,
        ``,
        `export default function Page() {`,
        `  const [mounted, setMounted] = useState(false);`,
        `  useEffect(() => setMounted(true), []);`,
        `  if (!mounted) return null;`,
        `  return <${comp} />;`,
        `}`
    ].join('\n');

    fs.writeFileSync(path.join(dirPath, 'page.tsx'), content, 'utf8');
    console.log('Fixed', path.join(dirPath, 'page.tsx'));
}
