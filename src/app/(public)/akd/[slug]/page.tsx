'use client';
import { useEffect, useState } from 'react';
import AKDPage from '@/pages-old/AKDPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AKDPage />;
}