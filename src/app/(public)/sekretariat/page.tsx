'use client';
import { useEffect, useState } from 'react';
import SekretariatPage from '@/pages-old/SekretariatPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <SekretariatPage />;
}