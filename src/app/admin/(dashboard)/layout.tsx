'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard, Newspaper, Image, Users, LogOut, Shield,
    Menu, X, ChevronRight, Building2, UsersRound, BookOpen,
    Palette, Mic, Scale, Info, MessageSquare, Globe, CalendarDays, MapPin,
} from 'lucide-react';
import type { AdminRole } from '@/lib/auth';

// Nav per role
const NAV_BY_ROLE: Record<AdminRole, { path: string; label: string; icon: React.ElementType }[]> = {
    super_admin: [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/panduan', label: 'Panduan Ukuran', icon: Info },
        { path: '/admin/berita', label: 'Berita', icon: Newspaper },
        { path: '/admin/komentar', label: 'Moderasi Komentar', icon: MessageSquare },
        { path: '/admin/banner', label: 'Banner Hero', icon: Image },
        { path: '/admin/pimpinan', label: 'Pimpinan', icon: Users },
        { path: '/admin/komisi', label: 'Komisi', icon: Users },
        { path: '/admin/bamus', label: 'Badan Musyawarah', icon: UsersRound },
        { path: '/admin/bapemperda', label: 'Bapemperda', icon: BookOpen },
        { path: '/admin/banggar', label: 'Badan Anggaran', icon: BookOpen },
        { path: '/admin/bk', label: 'Badan Kehormatan', icon: BookOpen },
        { path: '/admin/fraksi', label: 'Fraksi', icon: Palette },
        { path: '/admin/dapil', label: 'Daerah Pemilihan', icon: MapPin },
        { path: '/admin/sekretariat', label: 'Sekretariat', icon: Building2 },
        { path: '/admin/podcast', label: 'Podcast', icon: Mic },
        { path: '/admin/silegda', label: 'Silegda', icon: Scale },
        { path: '/admin/ppid', label: 'PPID', icon: Globe },
        { path: '/admin/konten-publik', label: 'Konten Publik', icon: Globe },
        { path: '/admin/agenda', label: 'Agenda Kegiatan', icon: CalendarDays },
        { path: '/admin/users', label: 'Admin Akun', icon: Shield },
    ],
    admin: [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/panduan', label: 'Panduan Ukuran', icon: Info },
        { path: '/admin/berita', label: 'Berita', icon: Newspaper },
        { path: '/admin/komentar', label: 'Moderasi Komentar', icon: MessageSquare },
        { path: '/admin/banner', label: 'Banner Hero', icon: Image },
    ],
    news_editor: [
        { path: '/admin/panduan', label: 'Panduan Ukuran', icon: Info },
        { path: '/admin/berita', label: 'Berita', icon: Newspaper },
    ],
};

const ROLE_LABELS: Record<AdminRole, string> = {
    super_admin: 'Super Administrator',
    admin: 'Admin',
    news_editor: 'News Editor',
};

const ROLE_BADGE: Record<AdminRole, string> = {
    super_admin: 'bg-blue-100 text-blue-700',
    admin: 'bg-purple-100 text-purple-700',
    news_editor: 'bg-amber-100 text-amber-700',
};

export default function AdminMainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [adminUser, setAdminUser] = useState<{ username: string; role?: AdminRole } | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem('admin_token');
        const user = localStorage.getItem('admin_user');
        if (!token || !user) { router.push('/admin/login'); return; }
        const parsed = JSON.parse(user);
        setAdminUser(parsed);

        const role: AdminRole = parsed?.role ?? 'news_editor';
        const allowedPaths = (NAV_BY_ROLE[role] ?? NAV_BY_ROLE.news_editor).map(n => n.path);
        const allowed = allowedPaths.some(p => pathname.startsWith(p));
        if (!allowed) router.replace(allowedPaths[0] ?? '/admin/dashboard');
    }, [router, pathname]);

    if (!mounted) return null;

    const role: AdminRole = (adminUser?.role as AdminRole) ?? 'news_editor';
    const navItems = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.news_editor;
    const allPaths = NAV_BY_ROLE.super_admin;

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            <aside className={`fixed top-0 left-0 w-64 bg-gradient-to-b from-[#0a2744] via-[#0f2349] to-[#07162c] z-30 transform transition-transform duration-300 shadow-2xl flex flex-col h-full lg:h-screen lg:sticky flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} lg:transform-none`}>
                <div className="flex items-center gap-3 p-5 border-b border-white/10">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 p-1 shadow-inner">
                        <img src="/LOGO DPRD KSB.png" alt="Logo DPRD KSB" className="w-full h-full object-contain drop-shadow-sm" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm leading-tight">Admin Panel</p>
                        <p className="text-blue-300 text-xs">DPRD Sumbawa Barat</p>
                    </div>
                    <button className="ml-auto lg:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
                        <X size={18} />
                    </button>
                </div>

                <div className="px-5 py-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
                            <span className="text-white text-xs font-bold uppercase">{adminUser?.username?.[0] || 'A'}</span>
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium leading-tight">{adminUser?.username}</p>
                            <p className="text-blue-400 text-xs">{ROLE_LABELS[role]}</p>
                        </div>
                    </div>
                </div>

                <nav className="p-3 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}>
                    <p className="text-blue-400/60 text-xs font-semibold uppercase tracking-widest mb-2 px-2">Menu</p>
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link key={item.path} href={item.path} onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all duration-300 ${isActive
                                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#0f2349] shadow-lg shadow-yellow-500/20 translate-x-1'
                                    : 'text-blue-200 hover:bg-white/10 hover:text-white hover:translate-x-1'
                                }`}
                            >
                                <Icon size={18} className={isActive ? 'text-[#0f2349]' : 'text-blue-300'} />
                                {item.label}
                                {isActive && <ChevronRight size={16} className="ml-auto opacity-70" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-white/10">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all">
                        <LogOut size={16} /> Keluar
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 shadow-sm h-16 flex items-center px-4 lg:px-6 gap-3 flex-shrink-0">
                    <button className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-600" onClick={() => setSidebarOpen(true)}>
                        <Menu size={20} />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-gray-700 font-semibold text-sm">
                            {allPaths.find(item => item.path === pathname)?.label}
                        </h1>
                    </div>
                    {role !== 'super_admin' && (
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${ROLE_BADGE[role]}`}>
                            {ROLE_LABELS[role]}
                        </span>
                    )}
                    <a href="/" target="_blank" rel="noreferrer" className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1">
                        Lihat Website <ChevronRight size={12} strokeWidth={3} />
                    </a>
                </header>

                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
