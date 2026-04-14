'use client';
import { useEffect, useState } from 'react';
import AdminSilegdaPage from '@/pages-old/admin/AdminSilegdaPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AdminSilegdaPage />;
}