/**
 * Zip node_modules — untuk backup atau transfer ke server
 * Jalankan: node scripts/zip-node-modules.js
 * Output: node_modules.zip
 */

const { execSync } = require('child_process');
const fs = require('fs');

const OUTPUT = 'node_modules.zip';

if (fs.existsSync(OUTPUT)) {
  fs.unlinkSync(OUTPUT);
  console.log('🗑️  Hapus node_modules.zip lama...');
}

console.log('📦 Mengzip node_modules... (bisa makan waktu beberapa menit)');

const has7z = (() => {
  try { execSync('"C:\\Program Files\\7-Zip\\7z.exe" i', { stdio: 'ignore' }); return true; } catch {}
  try { execSync('7z i', { stdio: 'ignore' }); return true; } catch {}
  return false;
})();

try {
  if (has7z) {
    const z7 = fs.existsSync('C:\\Program Files\\7-Zip\\7z.exe')
      ? '"C:\\Program Files\\7-Zip\\7z.exe"'
      : '7z';
    execSync(`${z7} a -tzip -mx=5 ${OUTPUT} node_modules`, { stdio: 'inherit' });
  } else {
    console.log('⚠️  7zip tidak ditemukan, pakai PowerShell (lebih lambat)...');
    execSync(
      `powershell Compress-Archive -Path node_modules -DestinationPath ${OUTPUT} -Force`,
      { stdio: 'inherit' }
    );
  }

  const size = (fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(2);
  console.log(`\n✅ Selesai: ${OUTPUT} (${size} MB)`);
} catch (e) {
  console.error('❌ Gagal:', e.message);
  process.exit(1);
}
