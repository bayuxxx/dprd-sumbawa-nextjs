/**
 * Deploy packer — zip file yang dibutuhkan untuk cPanel (tanpa dev cache)
 * Jalankan: node scripts/deploy-pack.js
 * Output: deploy.zip
 */

    // "prisma": "^6.19.3",

const { execSync } = require('child_process');
const fs = require('fs');

const OUTPUT = 'deploy.zip';

if (fs.existsSync(OUTPUT)) fs.unlinkSync(OUTPUT);

console.log('📦 Packing deploy.zip (tanpa cache dev)...');

const cmd = `powershell Compress-Archive -Path .next,public,package.json,package-lock.json,next.config.ts,server.js,node_modules -DestinationPath ${OUTPUT} -Force`;

try {
  const has7z = (() => {
    try { execSync('"C:\\Program Files\\7-Zip\\7z.exe" i', { stdio: 'ignore' }); return true; } catch {}
    try { execSync('7z i', { stdio: 'ignore' }); return true; } catch {}
    return false;
  })();

  const z7path = fs.existsSync('C:\\Program Files\\7-Zip\\7z.exe')
    ? '"C:\\Program Files\\7-Zip\\7z.exe"'
    : '7z';

  if (has7z) {
    const excludeArgs = [
      '.next\\dev',
      '.next\\cache',
      '.next\\trace-build',
      '.next\\turbopack',
      '.next\\diagnostics',
      '.next\\node_modules',
    ].map(e => `-xr!"${e}"`).join(' ');

    execSync(
      `${z7path} a -tzip ${OUTPUT} .next public package.json package-lock.json next.config.ts server.js node_modules ${excludeArgs}`,
      { stdio: 'inherit' }
    );
  } else {
    console.log('⚠️  7zip tidak ditemukan, menggunakan PowerShell (lebih lambat)...');

    const tempRename = [];
    const toExclude = ['.next/dev', '.next/cache', '.next/trace-build', '.next/turbopack', '.next/diagnostics'];

    toExclude.forEach(dir => {
      if (fs.existsSync(dir)) {
        const tmp = dir + '__tmp';
        fs.renameSync(dir, tmp);
        tempRename.push({ from: tmp, to: dir });
      }
    });

    execSync(cmd, { stdio: 'inherit' });

    tempRename.forEach(({ from, to }) => fs.renameSync(from, to));
  }

  const size = (fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(2);
  console.log(`\n✅ deploy.zip siap: ${size} MB`);
  console.log('\nLangkah deploy ke cPanel:');
  console.log('1. Upload deploy.zip ke server');
  console.log('2. Extract di folder aplikasi');
  console.log('3. Upload .env.local secara manual');
  console.log('4. Upload folder uploads/ jika ada gambar');
  console.log('5. Restart app di cPanel Node.js');
} catch (e) {
  console.error('❌ Gagal:', e.message);
}
