'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { User, Clock } from 'lucide-react';
import { fetchPimpinan } from '../../services/api';
import type { MasaJabatan, Pimpinan } from '../../services/api';
import { renderProfileCard, renderMiniCard, GridSkeleton, PageSkeleton } from './SharedComponents';

interface PimpinanContentProps {
    validSlug: string;
    masaJabatanList: MasaJabatan[];
    loadingMasa: boolean;
    pimpinanSubmenus: { key: string; title: string }[];
}

const PimpinanContent: React.FC<PimpinanContentProps> = ({
    validSlug,
    masaJabatanList,
    loadingMasa,
    pimpinanSubmenus,
}) => {
    // Pimpinan per-masa-jabatan cache
    const [pimpinanCache, setPimpinanCache] = useState<Record<string, Pimpinan[]>>({});
    const [loadingPimpinan, setLoadingPimpinan] = useState(false);

    // Pimpinan terdahulu
    const [pimpinanTerdahulu, setPimpinanTerdahulu] = useState<Pimpinan[]>([]);
    const [loadingTerdahulu, setLoadingTerdahulu] = useState(false);

    // Load pimpinan for a specific masaJabatanId
    const loadPimpinanForMasa = useCallback(async (masaJabatanId: string) => {
        if (pimpinanCache[masaJabatanId]) return;
        setLoadingPimpinan(true);
        const data = await fetchPimpinan({ masaJabatanId });
        setPimpinanCache((prev) => ({ ...prev, [masaJabatanId]: data }));
        setLoadingPimpinan(false);
    }, [pimpinanCache]);

    // Load pimpinan terdahulu
    const loadPimpinanTerdahulu = useCallback(async () => {
        if (pimpinanTerdahulu.length > 0) return;
        setLoadingTerdahulu(true);
        const data = await fetchPimpinan({ isPast: true });
        setPimpinanTerdahulu(data);
        setLoadingTerdahulu(false);
    }, [pimpinanTerdahulu.length]);

    // When slug changes, load appropriate data
    useEffect(() => {
        if (validSlug.startsWith('pimpinan-') && validSlug !== 'pimpinan-terdahulu') {
            const masaId = validSlug.replace('pimpinan-', '');
            loadPimpinanForMasa(masaId);
        } else if (validSlug === 'pimpinan-terdahulu') {
            loadPimpinanTerdahulu();
        } else if (validSlug === 'pimpinan' && !loadingMasa) {
            const aktif = masaJabatanList.find(m => m.isAktif) || masaJabatanList[0];
            if (aktif) loadPimpinanForMasa(aktif.id);
        }
    }, [validSlug, loadingMasa, masaJabatanList, loadPimpinanForMasa, loadPimpinanTerdahulu]);

    // ── Pimpinan per-masa-jabatan ──
    if (validSlug.startsWith('pimpinan-') && validSlug !== 'pimpinan-terdahulu') {
        const masaId = validSlug.replace('pimpinan-', '');
        const masa = masaJabatanList.find((m) => m.id === masaId);
        const pimpinanList = pimpinanCache[masaId] || [];

        const sorted = [...pimpinanList].sort((a, b) => a.order - b.order);
        const ketua = sorted[0];
        const wakil = sorted.slice(1);

        return (
            <div className="w-full flex flex-col items-center animate-fade-in">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-12 tracking-tight text-center">
                    Pimpinan DPRD Kabupaten Sumbawa Barat <br className="hidden xl:block" />
                    Masa Jabatan {masa?.periode ?? ''}
                    {masa?.isAktif && (
                        <span className="ml-3 text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full align-middle">Aktif</span>
                    )}
                </h1>

                {loadingMasa || loadingPimpinan ? (
                    <PageSkeleton cardCount={4} cols={4} showDesc={false} />
                ) : pimpinanList.length === 0 ? (
                    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                        <User size={40} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-400 font-medium">Belum ada data pimpinan untuk periode ini.</p>
                        <p className="text-gray-400 text-sm mt-1">Tambahkan melalui panel admin.</p>
                    </div>
                ) : (
                    <>
                        {ketua && (
                            <div className="flex justify-center w-full mb-12">
                                <div className="w-[200px] md:w-[260px]">
                                    {renderProfileCard({
                                        name: ketua.name,
                                        title: ketua.position,
                                        location: ketua.faction || '',
                                        imageUrl: ketua.imageUrl,
                                    })}
                                </div>
                            </div>
                        )}

                        {wakil.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-6 lg:gap-8 w-full">
                                {wakil.map((p) => (
                                    <div key={p.id} className="w-[180px] md:w-[220px]">
                                        {renderProfileCard({
                                            name: p.name,
                                            title: p.position,
                                            location: p.faction || '',
                                            imageUrl: p.imageUrl,
                                        })}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }

    // ── Pimpinan Terdahulu ──
    if (validSlug === 'pimpinan-terdahulu') {
        const grouped: Record<string, { label: string; items: Pimpinan[] }> = {};
        pimpinanTerdahulu.forEach((p) => {
            const key = p.masaJabatan?.periode || p.period || 'Tidak Diketahui';
            if (!grouped[key]) grouped[key] = { label: key, items: [] };
            grouped[key].items.push(p);
        });
        const groupList = Object.values(grouped).sort((a, b) => b.label.localeCompare(a.label));

        return (
            <div className="w-full flex flex-col items-center xl:items-start animate-fade-in">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight text-center xl:text-left">
                    Pimpinan DPRD Terdahulu
                </h1>
                <p className="text-gray-500 text-sm mb-12 text-center xl:text-left">
                    Kabupaten Sumbawa Barat — Rekam jejak pimpinan dari masa ke masa
                </p>

                {loadingTerdahulu ? (
                    <div className="space-y-10 w-full animate-pulse">
                        {[1, 2].map((i) => (
                            <div key={i}>
                                <div className="h-7 bg-gray-100 rounded-full w-36 mb-6" />
                                <GridSkeleton count={5} cols={5} />
                            </div>
                        ))}
                    </div>
                ) : pimpinanTerdahulu.length === 0 ? (
                    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                        <Clock size={40} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-400 font-medium">Belum ada data pimpinan terdahulu.</p>
                        <p className="text-gray-400 text-sm mt-1">Tandai pimpinan sebagai "Terdahulu" di panel admin.</p>
                    </div>
                ) : (
                    <div className="space-y-14 w-full">
                        {groupList.map((group) => (
                            <section key={group.label}>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-primary text-white text-sm font-black px-4 py-1.5 rounded-full shadow">
                                        Periode {group.label}
                                    </div>
                                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                                    <span className="text-xs text-gray-400">{group.items.length} pimpinan</span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
                                    {group.items.sort((a, b) => a.order - b.order).map((p) => renderMiniCard(p))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // ── Default pimpinan landing → redirect to active masa jabatan ──
    const aktifMasa = masaJabatanList.find(m => m.isAktif) || masaJabatanList[0];

    if (aktifMasa) {
        const pimpinanList = pimpinanCache[aktifMasa.id] || [];
        const sorted = [...pimpinanList].sort((a, b) => a.order - b.order);
        const ketua = sorted[0];
        const wakil = sorted.slice(1);

        // Trigger load if not cached yet
        if (!pimpinanCache[aktifMasa.id] && !loadingPimpinan) {
            loadPimpinanForMasa(aktifMasa.id);
        }

        return (
            <div className="w-full flex flex-col items-center xl:items-start animate-fade-in">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-12 tracking-tight text-center xl:text-left">
                    Pimpinan DPRD Kabupaten Sumbawa Barat <br className="hidden xl:block" />
                    Masa Jabatan {aktifMasa.periode}
                    <span className="ml-3 text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full align-middle">Aktif</span>
                </h1>

                {loadingMasa || loadingPimpinan ? (
                    <PageSkeleton cardCount={4} cols={4} showDesc={false} />
                ) : pimpinanList.length === 0 ? (
                    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                        <User size={40} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-400 font-medium">Belum ada data pimpinan untuk periode ini.</p>
                        <p className="text-gray-400 text-sm mt-1">Tambahkan melalui panel admin.</p>
                    </div>
                ) : (
                    <>
                        {ketua && (
                            <div className="flex justify-center w-full mb-12">
                                <div className="w-[200px] md:w-[260px]">
                                    {renderProfileCard({
                                        name: ketua.name,
                                        title: ketua.position,
                                        location: ketua.faction || '',
                                        imageUrl: ketua.imageUrl,
                                    })}
                                </div>
                            </div>
                        )}
                        {wakil.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-6 lg:gap-8 w-full">
                                {wakil.map((p) => (
                                    <div key={p.id} className="w-[180px] md:w-[220px]">
                                        {renderProfileCard({
                                            name: p.name,
                                            title: p.position,
                                            location: p.faction || '',
                                            imageUrl: p.imageUrl,
                                        })}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center xl:items-start animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 tracking-tight text-center xl:text-left">
                Pimpinan DPRD Kabupaten Sumbawa Barat
            </h1>
            {loadingMasa ? (
                    <PageSkeleton cardCount={4} cols={4} showDesc={false} />
            ) : (
                <div className="text-center xl:text-left">
                    <p className="text-gray-500 mb-6">Pilih menu di sebelah kiri untuk melihat pimpinan per periode masa jabatan.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                        {pimpinanSubmenus.map((sub) => (
                            <Link
                                key={sub.key}
                                href={`/akd/${sub.key}`}
                                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-primary hover:shadow-md transition-all group"
                            >
                                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                    {sub.key === 'pimpinan-terdahulu'
                                        ? <Clock size={16} className="text-primary group-hover:text-white" />
                                        : <User size={16} className="text-primary group-hover:text-white" />
                                    }
                                </div>
                                <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors leading-tight">{sub.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PimpinanContent;
