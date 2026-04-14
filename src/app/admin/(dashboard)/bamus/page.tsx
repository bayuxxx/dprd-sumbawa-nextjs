'use client';
import { useEffect, useState } from 'react';
import AdminBamusPage from '@/pages-old/admin/AdminBamusPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AdminBamusPage />;
}