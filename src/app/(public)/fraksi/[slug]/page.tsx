'use client';
import { useEffect, useState } from 'react';
import FraksiPage from '@/pages-old/FraksiPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <FraksiPage />;
}