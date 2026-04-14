'use client';
import { useEffect, useState } from 'react';
import AdminUsersPage from '@/pages-old/admin/AdminUsersPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AdminUsersPage />;
}