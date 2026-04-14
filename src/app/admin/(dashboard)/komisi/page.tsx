'use client';
import { useEffect, useState } from 'react';
import AdminKomisiPage from '@/pages-old/admin/AdminKomisiPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AdminKomisiPage />;
}