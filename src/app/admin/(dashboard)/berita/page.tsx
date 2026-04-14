'use client';
import { useEffect, useState } from 'react';
import AdminBeritaPage from '@/pages-old/admin/AdminBeritaPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AdminBeritaPage />;
}