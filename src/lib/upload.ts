/**
 * Parse multipart form data from NextRequest.
 * Next.js App Router supports req.formData() natively.
 */

import { uploadToStorage } from './storage';

/**
 * Process a file from FormData and upload to local storage
 */
export async function processFileUpload(
  file: File | null,
  folder: string
): Promise<string | null> {
  if (!file || !(file instanceof File) || file.size === 0) return null;

  // Validate image
  if (!file.type.startsWith('image/') && !file.type.startsWith('audio/')) {
    throw new Error('Hanya file gambar atau audio yang diizinkan.');
  }

  // Check size (5MB for images, 50MB for audio)
  const maxSize = file.type.startsWith('audio/') ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error(`Ukuran file terlalu besar. Maksimal ${maxSize / 1024 / 1024}MB.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return uploadToStorage(buffer, file.name, file.type, folder);
}
