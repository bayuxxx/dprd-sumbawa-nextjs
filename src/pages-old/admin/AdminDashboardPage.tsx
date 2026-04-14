'use client';
import React, { useEffect, useState } from 'react';
import { Newspaper, Image, Users, TrendingUp, Building2, Scale, Briefcase, BookOpen, Landmark, UserCheck, UsersRound } from 'lucide-react';
import {
    fetchBanners, fetchBerita, fetchPimpinan,
    fetchAllFraksiInfo, fetchAllKomisiInfo, fetchAnggotaSekretariat,
    fetchAllBamusInfo, fetchAllBanggarInfo, fetchAllBKInfo, fetchAllBapemperdaInfo,
} from '../../services/api';
import AdminLayout from './AdminLayout';

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState({
        banners: 0, berita: 0, pimpinan: 0,
        fraksi: 0, komisi: 0, sekretariat: 0,
        bamus: 0, banggar: 0, bk: 0, bapemperda: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchBanners(),
            fetchBerita(),
            fetchPimpinan(),
            fetchAllFraksiInfo(),
            fetchAllKomisiInfo(),
            fetchAnggotaSekretariat(),
            fetchAllBamusInfo(),
            fetchAllBanggarInfo(),
            fetchAllBKInfo(),
            fetchAllBapemperdaInfo(),
        ]).then(([banners, beritaRes, pimpinan, fraksi, komisi, sekretariat, bamus, banggar, bk, bapemperda]) => {
            setStats({
                banners: banners.length,
                berita: beritaRes.total,
                pimpinan: pimpinan.length,
                fraksi: fraksi.length,
                komisi: komisi.length,
                sekretariat: sekretariat.length,
                bamus: bamus.reduce((acc, b) => acc + b.anggota.length, 0),
                banggar: banggar.reduce((acc, b) => acc + b.anggota.length, 0),
                bk: bk.reduce((acc, b) => acc + b.anggota.length, 0),
                bapemperda: bapemperda.reduce((acc, b) => acc + b.anggota.length, 0),
            });
        }).finally(() => setLoading(false));
    }, []);

    const statCards = [
        { label: 'Total Berita', value: stats.berita, icon: Newspaper, textColor: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Banner Hero', value: stats.banners, icon: Image, textColor: 'text-yellow-600', bg: 'bg-yellow-50' },
        { label: 'Pimpinan', value: stats.pimpinan, icon: Users, textColor: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Fraksi', value: stats.fraksi, icon: Landmark, textColor: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Komisi', value: stats.komisi, icon: Scale, textColor: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Sekretariat', value: stats.sekretariat, icon: Briefcase, textColor: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Anggota Bamus', value: stats.bamus, icon: UsersRound, textColor: 'text-teal-600', bg: 'bg-teal-50' },
        { label: 'Anggota Banggar', value: stats.banggar, icon: Building2, textColor: 'text-cyan-600', bg: 'bg-cyan-50' },
        { label: 'Anggota BK', value: stats.bk, icon: UserCheck, textColor: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Anggota Bapemperda', value: stats.bapemperda, icon: BookOpen, textColor: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">Selamat datang di panel <span className="font-bold text-primary">Admin DPRD Sumbawa Barat</span></p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-lg hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
                            <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner`}>
                                <Icon size={22} className={card.textColor} />
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs font-semibold leading-tight">{card.label}</p>
                                <p className="text-2xl font-black text-gray-800 mt-0.5">
                                    {loading ? (
                                        <span className="inline-block w-8 h-6 bg-gray-200 animate-pulse rounded" />
                                    ) : (
                                        card.value
                                    )}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <TrendingUp size={18} className="text-primary" />
                    </div>
                    <h2 className="font-bold text-slate-800 text-base">Aksi Cepat</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                        { href: '/admin/berita', label: '+ Tambah Berita', desc: 'Tambah berita baru ke website' },
                        { href: '/admin/banner', label: '+ Tambah Banner', desc: 'Tambah slide di hero carousel' },
                        { href: '/admin/pimpinan', label: '+ Tambah Pimpinan', desc: 'Tambah data pimpinan DPRD' },
                        { href: '/admin/fraksi', label: '+ Tambah Fraksi', desc: 'Tambah data fraksi DPRD' },
                        { href: '/admin/komisi', label: '+ Tambah Komisi', desc: 'Tambah data komisi DPRD' },
                        { href: '/admin/sekretariat', label: '+ Tambah Sekretariat', desc: 'Tambah anggota sekretariat' },
                        { href: '/admin/bamus', label: '+ Tambah Bamus', desc: 'Tambah anggota Bamus' },
                        { href: '/admin/banggar', label: '+ Tambah Banggar', desc: 'Tambah anggota Banggar' },
                        { href: '/admin/bk', label: '+ Tambah BK', desc: 'Tambah anggota Badan Kehormatan' },
                        { href: '/admin/bapemperda', label: '+ Tambah Bapemperda', desc: 'Tambah anggota Bapemperda' },
                    ].map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="block border border-slate-200 hover:border-primary/50 shadow-sm hover:shadow-md rounded-xl p-5 transition-all bg-slate-50 hover:bg-white group"
                        >
                            <p className="font-bold text-primary text-sm mb-1">{item.label}</p>
                            <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                        </a>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboardPage;
