'use client';
import { useEffect, useState } from 'react';
import AdminBannerPage from '@/pages-old/admin/AdminBannerPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AdminBannerPage />;
}