'use client';
import { useEffect, useState } from 'react';
import BeritaDetailPage from '@/pages-old/BeritaDetailPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <BeritaDetailPage />;
}