'use client';
import { useEffect, useState } from 'react';
import AdminFraksiPage from '@/pages-old/admin/AdminFraksiPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AdminFraksiPage />;
}