'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronDown, ChevronRight, Users, Building2, Award, User } from 'lucide-react';
import { fetchAllFraksiInfo, getImageUrl } from '../services/api';
import type { FraksiInfo } from '../services/api';

const FraksiPage: React.FC = () => {
    const { slug } = useParams<{ slug?: string }>();
    const [openPeriode, setOpenPeriode] = useState<string | null>('2024-2029');
    const [fraksiList, setFraksiList] = useState<FraksiInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await fetchAllFraksiInfo();
            setFraksiList(data);
            setLoading(false);
        })();
    }, []);

    const selectedFraksi = slug ? fraksiList.find(f => f.slug === slug) : null;
    const totalKursi = fraksiList.reduce((sum, f) => sum + f.kursi, 0);

    // Group fraksi by masaJabatan for sidebar periods
    const periodeGroups = fraksiList.reduce<Record<string, FraksiInfo[]>>((acc, f) => {
        const key = f.masaJabatan?.periode || 'Unknown';
        if (!acc[key]) acc[key] = [];
        acc[key].push(f);
        return acc;
    }, {});
    const periodes = Object.keys(periodeGroups).sort((a, b) => b.localeCompare(a));

    // Use only active period for main stats if no slug
    const activeFraksi = fraksiList.filter(f => f.isAktif);
    const activeTotalKursi = activeFraksi.reduce((sum, f) => sum + f.kursi, 0);

    // Perolehan kursi sorted
    const perolehanKursi = [...activeFraksi].sort((a, b) => b.kursi - a.kursi);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#fcfcfc] py-12 md:py-20">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                        <div className="w-full lg:w-[320px] space-y-4">
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
                            <div className="space-y-2">
                                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="h-12 bg-gray-200 rounded animate-pulse w-96" />
                            <div className="h-8 bg-gray-100 rounded-full animate-pulse" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />)}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#fcfcfc] py-12 md:py-20">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

                    {/* ── Left Sidebar ── */}
                    <aside className="w-full lg:w-[320px] flex-shrink-0 lg:sticky lg:top-28">
                        {/* Decorative Image */}
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

                        {/* Periode Accordion */}
                        <div className="space-y-1">
                            {periodes.map(periode => {
                                const isOpen = openPeriode === periode;
                                const fraksiInPeriode = periodeGroups[periode];
                                const formattedPeriode = periode.replace('-', ' – ');

                                return (
                                    <div key={periode} className={periode !== periodes[0] ? "border-t border-gray-100" : ""}>
                                        <button
                                            onClick={() => setOpenPeriode(isOpen ? null : periode)}
                                            className="w-full flex items-center justify-between py-3 px-1 text-left group"
                                        >
                                            <span className="font-black text-gray-900 text-[15px] group-hover:text-red-600 transition-colors">
                                                Periode {formattedPeriode}
                                            </span>
                                            <ChevronDown
                                                size={18}
                                                className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="border-l-2 border-red-500 ml-2 pl-4 pb-4 space-y-1">
                                                <Link
                                                    href="/fraksi"
                                                    className={`block py-2 text-[13px] font-semibold transition-colors rounded-md px-2 ${!slug ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                                                >
                                                    Perolehan Kursi Pemilu Legislatif
                                                </Link>
                                                {fraksiInPeriode.map(f => (
                                                    <Link
                                                        key={f.slug}
                                                        href={`/fraksi/${f.slug}`}
                                                        className={`block py-2 text-[13px] font-semibold transition-colors rounded-md px-2 ${slug === f.slug ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                                                    >
                                                        {f.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {periodes.length === 0 && (
                                <p className="text-gray-400 text-sm italic py-3">Belum ada data fraksi.</p>
                            )}
                        </div>
                    </aside>

                    {/* ── Right Main Content ── */}
                    <section className="flex-1 w-full">
                        {!selectedFraksi ? (
                            /* ─── Perolehan Kursi View ─── */
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
                                    Perolehan Kursi Pemilu Legislatif
                                </h1>
                                <p className="text-gray-500 text-sm mb-10">
                                    Distribusi kursi DPRD Kabupaten Sumbawa Barat berdasarkan hasil Pemilu
                                </p>

                                {activeFraksi.length === 0 ? (
                                    <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center">
                                        <Users size={48} className="mx-auto text-gray-200 mb-4" />
                                        <p className="text-gray-400 font-medium">Belum ada data fraksi tersedia.</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Seat Distribution Bar */}
                                        <div className="mb-10">
                                            <div className="flex h-8 rounded-full overflow-hidden shadow-inner">
                                                {activeFraksi.map(f => (
                                                    <div
                                                        key={f.slug}
                                                        className="relative group cursor-pointer transition-all duration-300 hover:opacity-80"
                                                        style={{
                                                            width: `${(f.kursi / activeTotalKursi) * 100}%`,
                                                            backgroundColor: f.color,
                                                        }}
                                                        title={`${f.shortName}: ${f.kursi} kursi`}
                                                    >
                                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-10">
                                                            {f.shortName}: {f.kursi} kursi
                                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex flex-wrap gap-3 mt-4">
                                                {activeFraksi.map(f => (
                                                    <div key={f.slug} className="flex items-center gap-1.5 text-xs text-gray-600">
                                                        <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: f.color }}></span>
                                                        {f.shortName}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Numbered List */}
                                        <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
                                            <ol className="space-y-4">
                                                {perolehanKursi.map((item, idx) => (
                                                    <li key={item.id} className="flex items-center gap-4 group">
                                                        <span className={`
                                                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0
                                                            ${idx < 3
                                                                ? 'bg-gradient-to-br from-red-500 to-red-700 text-white shadow-md shadow-red-200'
                                                                : 'bg-gray-100 text-gray-500'}
                                                        `}>
                                                            {idx + 1}
                                                        </span>
                                                        <div className="flex-1 flex items-center justify-between border-b border-gray-50 pb-3 group-hover:border-red-100 transition-colors">
                                                            <span className="font-bold text-gray-800 text-sm md:text-[15px]">
                                                                {item.name}
                                                            </span>
                                                            <span className="flex items-center gap-1 text-sm font-black text-red-600 bg-red-50 px-3 py-1 rounded-full">
                                                                {item.kursi}
                                                                <span className="text-xs font-medium text-red-400">kursi</span>
                                                            </span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ol>
                                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                                <span className="text-sm font-bold text-gray-700">Total Kursi DPRD</span>
                                                <span className="text-lg font-black text-gray-900 bg-gray-100 px-4 py-1.5 rounded-full">
                                                    {activeTotalKursi} <span className="text-sm font-medium text-gray-500">kursi</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Fraksi Cards Grid */}
                                        <h2 className="text-xl font-black text-gray-900 mt-14 mb-6 flex items-center gap-2">
                                            <Users size={22} className="text-red-600" />
                                            Daftar Fraksi DPRD
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {activeFraksi.map(f => (
                                                <Link
                                                    key={f.slug}
                                                    href={`/fraksi/${f.slug}`}
                                                    className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
                                                >
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div
                                                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm overflow-hidden"
                                                            style={{ backgroundColor: f.color }}
                                                        >
                                                            {f.logoUrl ? (
                                                                <img src={getImageUrl(f.logoUrl)} alt="" className="w-6 h-6 object-contain" />
                                                            ) : (
                                                                <Building2 size={18} className="text-white" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-black text-sm text-gray-900 group-hover:text-red-600 transition-colors leading-tight">
                                                                {f.shortName}
                                                            </h3>
                                                            <span className="text-xs text-gray-400">{f.kursi} kursi</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{f.name}</p>
                                                    <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-end">
                                                        <span className="text-xs font-bold text-red-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                                            Lihat Detail <ChevronRight size={14} />
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            /* ─── Detail Fraksi View ─── */
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
                                        style={{ backgroundColor: selectedFraksi.color }}
                                    >
                                        {selectedFraksi.logoUrl ? (
                                            <img src={getImageUrl(selectedFraksi.logoUrl)} alt="" className="w-8 h-8 object-contain" />
                                        ) : (
                                            <Award size={28} className="text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                                            {selectedFraksi.name}
                                        </h1>
                                        <p className="text-gray-500 text-sm mt-1">
                                            Periode {selectedFraksi.masaJabatan?.periode?.replace('-', ' – ') || 'TBD'} · {selectedFraksi.kursi} Kursi
                                        </p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                                    <div className="bg-white border border-gray-100 rounded-xl p-5 text-center">
                                        <div className="text-3xl font-black text-red-600">{selectedFraksi.kursi}</div>
                                        <div className="text-xs text-gray-500 mt-1 font-medium">Jumlah Kursi</div>
                                    </div>
                                    <div className="bg-white border border-gray-100 rounded-xl p-5 text-center">
                                        <div className="text-3xl font-black text-gray-900">
                                            {totalKursi > 0 ? ((selectedFraksi.kursi / totalKursi) * 100).toFixed(1) : 0}%
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 font-medium">Persentase</div>
                                    </div>
                                    <div className="bg-white border border-gray-100 rounded-xl p-5 text-center col-span-2 md:col-span-1">
                                        <div className="text-3xl font-black text-gray-900">{selectedFraksi.anggota.length}</div>
                                        <div className="text-xs text-gray-500 mt-1 font-medium">Anggota</div>
                                    </div>
                                </div>

                                {/* Deskripsi */}
                                {selectedFraksi.deskripsi && (
                                    <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
                                        <h2 className="font-black text-gray-900 mb-3 text-lg">Tentang Fraksi</h2>
                                        <p className="text-gray-600 text-sm leading-relaxed">{selectedFraksi.deskripsi}</p>
                                    </div>
                                )}

                                {/* Pimpinan Fraksi */}
                                {(() => {
                                    const ketua = selectedFraksi.anggota.filter(a => a.jabatan === 'Ketua Fraksi');
                                    const wakil = selectedFraksi.anggota.filter(a => a.jabatan === 'Wakil Ketua');
                                    const sekretaris = selectedFraksi.anggota.filter(a => a.jabatan === 'Sekretaris');
                                    const ketuaAll = [...ketua, ...wakil, ...sekretaris];

                                    return ketuaAll.length > 0 ? (
                                        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
                                            <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2 text-lg">
                                                <Award size={20} className="text-red-600" />
                                                Pimpinan Fraksi
                                            </h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {ketuaAll.map(a => (
                                                    <div key={a.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                        <div className="w-14 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-100">
                                                            {a.imageUrl ? (
                                                                <img src={getImageUrl(a.imageUrl)} alt={a.name} className="w-full h-full object-cover object-top" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <User size={20} className="text-gray-300" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-gray-900">{a.name}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">{a.jabatan}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
                                            <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2 text-lg">
                                                <Award size={20} className="text-red-600" />
                                                Pimpinan Fraksi
                                            </h2>
                                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <Users size={20} className="text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-900">Belum tersedia</p>
                                                        <p className="text-xs text-gray-500">Pimpinan Fraksi</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Anggota */}
                                <div className="bg-white border border-gray-100 rounded-xl p-6">
                                    <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2 text-lg">
                                        <Users size={20} className="text-red-600" />
                                        Anggota Fraksi
                                    </h2>
                                    {selectedFraksi.anggota.filter(a => a.jabatan === 'Anggota').length === 0 ? (
                                        <div className="text-center py-12 text-gray-400">
                                            <Users size={40} className="mx-auto mb-3 text-gray-200" />
                                            <p className="text-sm">Data anggota fraksi belum tersedia.</p>
                                            <p className="text-xs mt-1 text-gray-300">Silakan tambahkan melalui panel admin.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {selectedFraksi.anggota
                                                .filter(a => a.jabatan === 'Anggota')
                                                .map((a, idx) => (
                                                    <div key={a.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                                                        <div className="w-12 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-100">
                                                            {a.imageUrl ? (
                                                                <img src={getImageUrl(a.imageUrl)} alt={a.name} className="w-full h-full object-cover object-top" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                                    <span className="text-sm font-bold text-gray-400">{idx + 1}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-gray-900">{a.name}</p>
                                                            {a.faction && <p className="text-xs text-gray-500 mt-0.5">{a.faction}</p>}
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>

                                {/* Back Link */}
                                <div className="mt-10">
                                    <Link
                                        href="/fraksi"
                                        className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        ← Kembali ke Perolehan Kursi
                                    </Link>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
};

export default FraksiPage;
