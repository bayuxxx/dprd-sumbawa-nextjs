const fs = require('fs');
const path = require('path');

function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(f => {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) walk(full);
        else if ((full.endsWith('page.tsx') || full.endsWith('layout.tsx')) && !full.includes('api')) {
            let c = fs.readFileSync(full, 'utf8');
            if (c.includes('next/dynamic')) {
                const match = c.match(/import\(['"]([^'"]+)['"]\)/);
                if (match) {
                    const impPath = match[1];
                    const compMatch = impPath.split('/').pop().replace('.tsx', '');
                    const newCode = [
                        `'use client';`,
                        `import { useEffect, useState } from 'react';`,
                        `import ${compMatch} from '${impPath}';`,
                        ``,
                        `export default function Page() {`,
                        `  const [mounted, setMounted] = useState(false);`,
                        `  useEffect(() => setMounted(true), []);`,
                        `  if (!mounted) return null;`,
                        `  return <${compMatch} />;`,
                        `}`
                    ].join('\n');
                    fs.writeFileSync(full, newCode, 'utf8');
                    console.log('Fixed', full);
                }
            }
        }
    });
}
walk('src/app');
