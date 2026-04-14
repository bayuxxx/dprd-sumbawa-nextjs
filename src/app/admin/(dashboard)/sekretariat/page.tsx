'use client';
import { useEffect, useState } from 'react';
import AdminSekretariatPage from '@/pages-old/admin/AdminSekretariatPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AdminSekretariatPage />;
}