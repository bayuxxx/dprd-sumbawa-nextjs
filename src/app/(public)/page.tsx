'use client';
import { useEffect, useState } from 'react';
import HomePage from '@/pages-old/HomePage';

export default function Page() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return <HomePage />;
}
