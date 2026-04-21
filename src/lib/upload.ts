import { uploadToStorage } from './storage';

const MAX_SIZE_AUDIO = 50 * 1024 * 1024;  // 50MB untuk audio
const MAX_SIZE_DEFAULT = 20 * 1024 * 1024; // 20MB untuk gambar & PDF

export async function processFileUpload(
  file: File | null,
  folder: string
): Promise<string | null> {
  if (!file || !(file instanceof File) || file.size === 0) return null;

  const isAudio = file.type.startsWith('audio/');
  const isImage = file.type.startsWith('image/');
  const isPdf   = file.type === 'application/pdf';
  const isExcel = file.type.includes('spreadsheet') || file.type.includes('excel') || file.name.match(/\.(xlsx?|xls)$/i);

  if (!isImage && !isAudio && !isPdf && !isExcel) {
    throw new Error('Hanya file gambar, PDF, Excel, atau audio yang diizinkan.');
  }

  const maxSize = isAudio ? MAX_SIZE_AUDIO : MAX_SIZE_DEFAULT;
  if (file.size > maxSize) {
    throw new Error(`Ukuran file terlalu besar. Maksimal ${maxSize / 1024 / 1024}MB.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return uploadToStorage(buffer, file.name, file.type, folder);
}
