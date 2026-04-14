'use client';
import { useEffect, useState } from 'react';
import AdminDashboardPage from '@/pages-old/admin/AdminDashboardPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AdminDashboardPage />;
}