'use client';
import React, { useEffect, useState } from 'react';
import { User, Clock, ChevronRight } from 'lucide-react';
import { fetchMasaJabatan, getImageUrl } from '../services/api';
import type { MasaJabatan } from '../services/api';

const PimpinanTerdahuluPage: React.FC = () => {
    const [masaJabatanList, setMasaJabatanList] = useState<MasaJabatan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMasaJabatan()
            .then((data) => {
                // Filter yang non-aktif (terdahulu) dan ada pimpinannya
                const past = data.filter((mj) => !mj.isAktif);
                setMasaJabatanList(past);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="max-w-7xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-400 mb-6 flex items-center gap-2 flex-wrap">
                <a href="/" className="hover:text-primary transition-colors">Beranda</a>
                <ChevronRight size={14} className="text-gray-300" />
                <a href="/pimpinan" className="hover:text-primary transition-colors">Pimpinan Dewan</a>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="text-gray-700 font-medium">Pimpinan Terdahulu</span>
            </div>

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-2xl font-black text-primary mb-2 border-l-4 border-accent pl-3">
                    Pimpinan DPRD Terdahulu
                </h1>
                <p className="text-gray-500 text-sm pl-4">
                    Kabupaten Sumbawa Barat &mdash; Rekam Jejak Pimpinan dari Masa ke Masa
                </p>
            </div>

            {loading ? (
                <div className="space-y-10">
                    {[1, 2, 3].map((i) => (
                        <div key={i}>
                            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {Array(4).fill(0).map((_, j) => (
                                    <div key={j} className="bg-white rounded-xl shadow-sm h-64 animate-pulse" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : masaJabatanList.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock size={40} className="text-gray-300" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-500 mb-2">Belum Ada Data</h2>
                    <p className="text-gray-400 text-sm">Data pimpinan terdahulu belum tersedia.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {masaJabatanList.map((masa) => (
                        <section key={masa.id}>
                            {/* Periode Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-primary text-white text-sm font-black px-4 py-1.5 rounded-full shadow-md">
                                    Periode {masa.periode}
                                </div>
                                <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
                                {masa.keterangan && (
                                    <span className="text-xs text-gray-400 italic hidden sm:block">{masa.keterangan}</span>
                                )}
                            </div>

                            {/* Pimpinan Grid */}
                            {!masa.pimpinan || masa.pimpinan.length === 0 ? (
                                <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-200">
                                    <p className="text-gray-400 text-sm">Belum ada data pimpinan untuk periode ini.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {masa.pimpinan.map((leader) => (
                                        <div
                                            key={leader.id}
                                            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-200 overflow-hidden group"
                                        >
                                            {/* Photo */}
                                            <div className="relative h-40 overflow-hidden bg-gray-100">
                                                {leader.imageUrl ? (
                                                    <img
                                                        src={getImageUrl(leader.imageUrl)}
                                                        alt={leader.name}
                                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                                        <User size={36} className="text-slate-300" />
                                                    </div>
                                                )}
                                                {/* Gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>

                                            {/* Info */}
                                            <div className="p-3">
                                                {leader.faction && (
                                                    <div className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5 inline-block mb-1.5">
                                                        {leader.faction}
                                                    </div>
                                                )}
                                                <h3 className="font-bold text-gray-800 text-xs leading-tight line-clamp-2">
                                                    {leader.name}
                                                </h3>
                                                <p className="text-primary text-[10px] font-medium mt-1 leading-tight">
                                                    {leader.position}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    ))}
                </div>
            )}
        </main>
    );
};

export default PimpinanTerdahuluPage;
