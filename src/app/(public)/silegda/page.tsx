'use client';
import { useEffect, useState } from 'react';
import SilegdaPage from '@/pages-old/SilegdaPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <SilegdaPage />;
}