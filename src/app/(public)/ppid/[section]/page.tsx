'use client';
import { useEffect, useState } from 'react';
import PPIDPage from '@/pages-old/PPIDPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <PPIDPage />;
}