'use client';
import { useEffect, useState } from 'react';
import BeritaPage from '@/pages-old/BeritaPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <BeritaPage />;
}