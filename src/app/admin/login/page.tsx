'use client';
import { useEffect, useState } from 'react';
import AdminLoginPage from '@/pages-old/admin/AdminLoginPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AdminLoginPage />;
}