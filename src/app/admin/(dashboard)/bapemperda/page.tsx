'use client';
import { useEffect, useState } from 'react';
import AdminBapemperdaPage from '@/pages-old/admin/AdminBapemperdaPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AdminBapemperdaPage />;
}