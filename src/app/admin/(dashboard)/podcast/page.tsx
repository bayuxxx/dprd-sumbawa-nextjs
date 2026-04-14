'use client';
import { useEffect, useState } from 'react';
import AdminPodcastPage from '@/pages-old/admin/AdminPodcastPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AdminPodcastPage />;
}