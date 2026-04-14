'use client';
import { useEffect, useState } from 'react';
import AdminPimpinanPage from '@/pages-old/admin/AdminPimpinanPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AdminPimpinanPage />;
}