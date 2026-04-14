'use client';
import { useEffect, useState } from 'react';
import PodcastPage from '@/pages-old/PodcastPage';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <PodcastPage />;
}