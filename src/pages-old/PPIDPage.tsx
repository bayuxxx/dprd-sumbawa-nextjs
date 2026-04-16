'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const ppidMenu = [
    { slug: 'profil', title: 'Profil PPID' },
    { slug: 'struktur-organisasi', title: 'Struktur Organisasi' },
    { slug: 'formulir-permohonan', title: 'Formulir Permohonan Informasi Publik' },
    { slug: 'formulir-keberatan', title: 'Formulir Pengajuan Keberatan' },
    { slug: 'maklumat-pelayanan', title: 'Maklumat Pelayanan' },
    { slug: 'data-anggaran', title: 'Data Anggaran' },
];

const DYNAMIC_IMAGE_SLUGS = ['struktur-organisasi', 'maklumat-pelayanan'];

const ExternalBtn: React.FC<{ href: string; label: string }> = ({ href, label }) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-red-600/20">
        {label}
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    </a>
);

const PPIDPage: React.FC = () => {
    const { slug, section } = useParams<{ slug?: string; section?: string }>();
    const activeSlug = slug || section || 'profil';
    const activeMenuTitle = ppidMenu.find(m => m.slug === activeSlug)?.title || 'Profil PPID';

    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

    useEffect(() => {
        // Fetch semua asset PPID sekaligus
        fetch('/api/ppid/assets')
            .then(r => r.json())
            .then((data: any[]) => {
                if (!Array.isArray(data)) return;
                const map: Record<string, string> = {};
                data.forEach(a => { if (a?.slug && a?.imageUrl) map[a.slug] = a.imageUrl; });
                setImageUrls(map);
            })
            .catch(() => {});
    }, []);

    return (
        <main className="min-h-screen bg-[#fcfcfc] py-12 md:py-20">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
                    {/* ── Left Sidebar ── */}
                    <aside className="w-full lg:w-[320px] flex-shrink-0 lg:sticky lg:top-28">
                        {/* Decorative Image Container styling similar to standard theme */}
                        <div className="relative mb-8 w-full aspect-[4/3] max-w-[300px] mx-auto lg:mx-0 group cursor-pointer">
                            <div className="absolute inset-0 bg-red-500 rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500 z-0"></div>
                            <div className="absolute inset-0 bg-red-600 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500 z-0 opacity-80"></div>
                            <div className="absolute inset-2 bg-white rounded-2xl z-10 overflow-hidden shadow-lg shadow-black/10">
                                <img
                                    src="/Gedung-DPRD-Sumbawa-Barat.jpg"
                                    alt="Gedung DPRD Sumbawa Barat"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888045653-f7267eb4bd48?auto=format&fit=crop&q=80&w=600';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Side Menu */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {ppidMenu.map((menu) => (
                                <Link
                                    key={menu.slug}
                                    href={menu.slug === 'profil' ? '/ppid' : `/ppid/${menu.slug}`}
                                    className={`
                                        block px-5 py-4 text-sm font-bold transition-all border-b border-gray-50 last:border-b-0
                                        ${activeSlug === menu.slug
                                            ? 'text-gray-900 bg-gray-50'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    {menu.title}
                                </Link>
                            ))}
                        </div>
                    </aside>

                    {/* ── Right Main Content ── */}
                    <section className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10 tracking-tight font-serif">
                            {activeMenuTitle}
                        </h1>

                        {activeSlug === 'profil' ? (
                            <div className="flex flex-col items-center py-12 gap-6">
                                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-red-600 fill-none stroke-current stroke-2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                </div>
                                <div className="text-center">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">Portal PPID DPRD Kabupaten Sumbawa Barat</h2>
                                    <p className="text-gray-500 text-sm mb-6 max-w-md">
                                        Informasi terkait PPID DPRD Kabupaten Sumbawa Barat dapat diakses melalui portal resmi berikut.
                                    </p>
                                </div>
                                <a
                                    href="https://setwan.ppid.sumbawabaratkab.go.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-red-600/20"
                                >
                                    Buka Portal PPID
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                </a>
                            </div>

                        ) : activeSlug === 'struktur-organisasi' ? (
                            <div>
                                {imageUrls['struktur-organisasi'] ? (
                                    <img src={imageUrls['struktur-organisasi']} alt="Struktur Organisasi PPID DPRD Kabupaten Sumbawa Barat" className="w-full rounded-xl border border-gray-100 shadow-sm" />
                                ) : (
                                    <div className="py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-gray-400 font-medium">Gambar belum tersedia</p>
                                        <p className="text-gray-300 text-sm mt-1">Upload melalui Admin → PPID</p>
                                    </div>
                                )}
                            </div>

                        ) : activeSlug === 'maklumat-pelayanan' ? (
                            <div>
                                {imageUrls['maklumat-pelayanan'] ? (
                                    <img src={imageUrls['maklumat-pelayanan']} alt="Maklumat Pelayanan PPID DPRD Kabupaten Sumbawa Barat" className="w-full rounded-xl border border-gray-100 shadow-sm" />
                                ) : (
                                    <div className="py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-gray-400 font-medium">Gambar belum tersedia</p>
                                        <p className="text-gray-300 text-sm mt-1">Upload melalui Admin → PPID</p>
                                    </div>
                                )}
                            </div>

                        ) : activeSlug === 'formulir-permohonan' ? (
                            <div className="flex flex-col items-center py-12 gap-6">
                                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-red-600 fill-none stroke-current stroke-2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                                </div>
                                <div className="text-center">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">Formulir Permohonan Informasi Publik</h2>
                                    <p className="text-gray-500 text-sm mb-6 max-w-md">Ajukan permohonan informasi publik melalui portal resmi PPID Kabupaten Sumbawa Barat.</p>
                                </div>
                                <a
                                    href="https://setwan.ppid.sumbawabaratkab.go.id/form/permohonan-informasi-publik"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-red-600/20"
                                >
                                    Buka Formulir
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                </a>
                            </div>

                        ) : activeSlug === 'formulir-keberatan' ? (
                            <div className="flex flex-col items-center py-12 gap-6">
                                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-red-600 fill-none stroke-current stroke-2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                                </div>
                                <div className="text-center">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">Formulir Pengajuan Keberatan</h2>
                                    <p className="text-gray-500 text-sm mb-6 max-w-md">Ajukan keberatan atas penolakan atau keterlambatan pemberian informasi publik.</p>
                                </div>
                                <a
                                    href="https://setwan.ppid.sumbawabaratkab.go.id/form/pengajuan-keberatan"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-red-600/20"
                                >
                                    Buka Formulir
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                </a>
                            </div>

                        ) : (
                            <div className="py-20 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">🚧</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Halaman Sedang Dalam Pengembangan</h2>
                                <p className="text-gray-500">Konten untuk menu <span className="font-semibold text-gray-700">{activeMenuTitle}</span> akan segera tersedia.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
};

export default PPIDPage;
