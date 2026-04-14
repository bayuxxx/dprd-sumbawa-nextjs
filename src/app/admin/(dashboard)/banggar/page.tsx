'use client';
import { useEffect, useState } from 'react';
import AdminBanggarPage from '@/pages-old/admin/AdminBanggarPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AdminBanggarPage />;
}