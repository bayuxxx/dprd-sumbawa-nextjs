'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { fetchMasaJabatan, fetchAllBamusInfo, fetchAllBapemperdaInfo, fetchAllBanggarInfo, fetchAllBKInfo, fetchAllKomisiInfo } from '../services/api';
import type { MasaJabatan, BamusInfo, BapemperdaInfo, BanggarInfo, BKInfo, KomisiInfo } from '../services/api';

// Split content components
import PimpinanContent from './akd/PimpinanContent';
import BamusContent from './akd/BamusContent';
import BapemperdaContent from './akd/BapemperdaContent';
import BanggarContent from './akd/BanggarContent';
import BKContent from './akd/BKContent';
import KomisiContent from './akd/KomisiContent';

export type Submenu = { key: string; title: string; isLabel?: boolean };
type AkdMenu = { key: string; title: string; submenus?: Submenu[] };

// Static akd menus
const staticAkdMenus: AkdMenu[] = [
    { key: 'dapil', title: 'Daerah Pemilihan' },
];

const AKDPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();

    // Data dari API
    const [masaJabatanList, setMasaJabatanList] = useState<MasaJabatan[]>([]);
    const [bamusList, setBamusList] = useState<BamusInfo[]>([]);
    const [bapemperdaList, setBapemperdaList] = useState<BapemperdaInfo[]>([]);
    const [banggarList, setBanggarList] = useState<BanggarInfo[]>([]);
    const [bkList, setBkList] = useState<BKInfo[]>([]);
    const [komisiList, setKomisiList] = useState<KomisiInfo[]>([]);
    const [loadingMasa, setLoadingMasa] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchMasaJabatan(),
            fetchAllBamusInfo(),
            fetchAllBapemperdaInfo(),
            fetchAllBanggarInfo(),
            fetchAllBKInfo(),
            fetchAllKomisiInfo()
        ]).then(([masaData, bamusData, bapemperdaData, banggarData, bkData, komisiData]) => {
            setMasaJabatanList(masaData);
            setBamusList(bamusData);
            setBapemperdaList(bapemperdaData);
            setBanggarList(banggarData);
            setBkList(bkData);
            setKomisiList(komisiData);
            setLoadingMasa(false);
        });
    }, []);

    // Build dynamic slugs from masa jabatan for pimpinan
    const aktifMasa = masaJabatanList.find((m) => m.isAktif);
    const pastMasaList = masaJabatanList.filter((m) => !m.isAktif);

    const pimpinanSubmenus = [
        ...(aktifMasa ? [{ key: `pimpinan-${aktifMasa.id}`, title: `Pimpinan DPRD Masa Jabatan ${aktifMasa.periode}` }] : []),
        ...pastMasaList.map((m) => ({ key: `pimpinan-${m.id}`, title: `Pimpinan DPRD Masa Jabatan ${m.periode}` })),
        { key: 'pimpinan-terdahulu', title: 'Pimpinan DPRD Terdahulu' },
    ];

    const generateSubmenus = (baseKey: string, titleName: string, listData: { id: string, isAktif: boolean, masaJabatan: string }[]) => {
        const activeItem = listData.find(item => item.isAktif);
        const pastItems = listData.filter(item => !item.isAktif);
        return [
            ...(activeItem ? [{ key: `${baseKey}-${activeItem.id}`, title: `${titleName} Masa Jabatan ${activeItem.masaJabatan}` }] : []),
            ...pastItems.map(m => ({ key: `${baseKey}-${m.id}`, title: `${titleName} Masa Jabatan ${m.masaJabatan}` }))
        ];
    };

    const bamusSubmenus = generateSubmenus('bamus', 'Badan Musyawarah', bamusList);
    const bapemperdaSubmenus = generateSubmenus('bapemperda', 'Badan Pembentukan Peraturan Daerah', bapemperdaList);
    const banggarSubmenus = generateSubmenus('banggar', 'Badan Anggaran', banggarList);
    const bkSubmenus = generateSubmenus('bk', 'Badan Kehormatan', bkList);

    // Generate Komisi Submenus (grouped by Masa Jabatan)
    const generateKomisiSubmenus = () => {
        const submenus: Submenu[] = [];

        // Group by Masa Jabatan
        const grouped: Record<string, KomisiInfo[]> = {};
        komisiList.forEach(k => {
            if (!grouped[k.masaJabatan]) grouped[k.masaJabatan] = [];
            grouped[k.masaJabatan].push(k);
        });

        // Determine ordering of masa jabatan (we want active first, then descending order of year)
        // Here we just use the list of MasaJabatan as an ordering hint
        const sortedMasa = masaJabatanList.slice().sort((a, b) => {
            if (a.isAktif) return -1;
            if (b.isAktif) return 1;
            return b.periode.localeCompare(a.periode);
        });

        sortedMasa.forEach(masa => {
            const items = grouped[masa.periode];
            if (items && items.length > 0) {
                // Add header label
                submenus.push({ key: `label-${masa.id}`, title: `Masa Jabatan ${masa.periode}`, isLabel: true });
                // Sort by name (A, B, C...)
                items.sort((a, b) => a.namaKomisi.localeCompare(b.namaKomisi));
                // Add items
                items.forEach(k => {
                    submenus.push({ key: `komisi-${k.id}`, title: k.namaKomisi });
                });
            }
        });

        return submenus;
    };

    const komisiSubmenus = generateKomisiSubmenus();

    const akdMenus: AkdMenu[] = [
        { key: 'pimpinan', title: 'Pimpinan DPRD', submenus: pimpinanSubmenus },
        { key: 'bamus', title: 'Badan Musyawarah', submenus: bamusSubmenus },
        { key: 'bapemperda', title: 'Badan Pembentukan Peraturan Daerah', submenus: bapemperdaSubmenus },
        { key: 'banggar', title: 'Badan Anggaran', submenus: banggarSubmenus },
        { key: 'bk', title: 'Badan Kehormatan', submenus: bkSubmenus },
        { key: 'komisi', title: 'Komisi', submenus: komisiSubmenus },
        ...staticAkdMenus,
    ];

    // Determine valid slug
    const defaultSlug = !loadingMasa && aktifMasa ? `pimpinan-${aktifMasa.id}` : 'pimpinan';
    const allValidSlugs = [
        'pimpinan', ...pimpinanSubmenus.map((s) => s.key),
        'komisi', ...komisiSubmenus.filter(s => !s.isLabel).map(s => s.key),
        'bamus', ...bamusSubmenus.map(s => s.key),
        'bapemperda', ...bapemperdaSubmenus.map(s => s.key),
        'banggar', ...banggarSubmenus.map(s => s.key),
        'bk', ...bkSubmenus.map(s => s.key),
        ...staticAkdMenus.map((m) => m.key),
    ];

    const validSlug = (slug && allValidSlugs.includes(slug)) ? slug : defaultSlug;

    const [expanded, setExpanded] = useState<string>(''); // nothing expanded by default

    useEffect(() => {
        // Auto-expand the menu that contains the current slug
        const activeMenu = akdMenus.find(m =>
            m.key === validSlug || m.submenus?.some(s => s.key === validSlug)
        );
        if (activeMenu) setExpanded(activeMenu.key);
    }, [validSlug]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [slug]);

    const router = useRouter();

    useEffect(() => {
        if (slug && !allValidSlugs.includes(slug) && !loadingMasa) {
            router.replace('/akd/pimpinan');
        }
    }, [slug, loadingMasa, router]);

    // ── RENDER CONTENT ──
    const renderContent = () => {
        // Pimpinan sections
        if (validSlug === 'pimpinan' || validSlug.startsWith('pimpinan-')) {
            return (
                <PimpinanContent
                    validSlug={validSlug}
                    masaJabatanList={masaJabatanList}
                    loadingMasa={loadingMasa}
                    pimpinanSubmenus={pimpinanSubmenus}
                />
            );
        }

        // Bamus
        if (validSlug === 'bamus' || validSlug.startsWith('bamus-')) {
            const id = validSlug === 'bamus' ? undefined : validSlug.replace('bamus-', '');
            return <BamusContent id={id} />;
        }

        // Bapemperda
        if (validSlug === 'bapemperda' || validSlug.startsWith('bapemperda-')) {
            const id = validSlug === 'bapemperda' ? undefined : validSlug.replace('bapemperda-', '');
            return <BapemperdaContent id={id} />;
        }

        // Banggar
        if (validSlug === 'banggar' || validSlug.startsWith('banggar-')) {
            const id = validSlug === 'banggar' ? undefined : validSlug.replace('banggar-', '');
            return <BanggarContent id={id} />;
        }

        // BK
        if (validSlug === 'bk' || validSlug.startsWith('bk-')) {
            const id = validSlug === 'bk' ? undefined : validSlug.replace('bk-', '');
            return <BKContent id={id} />;
        }

        // Komisi
        if (validSlug === 'komisi' || validSlug.startsWith('komisi-')) {
            const id = validSlug === 'komisi' ? undefined : validSlug.replace('komisi-', '');
            return <KomisiContent id={id} />;
        }

        // Generic placeholder for other AKD sections
        return (
            <div className="w-full animate-fade-in">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 tracking-tight text-center md:text-left">
                    {akdMenus.find(m => m.key === validSlug)?.title}
                </h1>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center py-24">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl opacity-50">📄</span>
                    </div>
                    <p className="text-gray-500 font-medium">
                        Konten halaman <span className="font-bold text-gray-800">{akdMenus.find(m => m.key === validSlug)?.title}</span> sedang dipersiapkan dan akan segera tersedia.
                    </p>
                </div>
            </div>
        );
    };

    return (
        <main className="min-h-screen bg-[#fcfcfc] py-12 md:py-20">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

                    {/* Left Sidebar */}
                    <aside className="w-full lg:w-[350px] flex-shrink-0 lg:sticky lg:top-28 z-20">
                        <div className="relative mb-10 lg:mb-14 w-full aspect-[4/3] max-w-[320px] mx-auto lg:mx-0 group cursor-pointer">
                            <div className="absolute inset-0 bg-red-500 rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500 z-0"></div>
                            <div className="absolute inset-0 bg-red-600 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500 z-0 opacity-80"></div>
                            <div className="absolute inset-2 bg-white rounded-2xl z-10 overflow-hidden shadow-lg shadow-black/10">
                                <img
                                    src="/Gedung-DPRD-Sumbawa-Barat.jpg"
                                    alt="Sidebar Dekorasi"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888045653-f7267eb4bd48?auto=format&fit=crop&q=80&w=600';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Accordion Menu */}
                        <div className="flex flex-col bg-transparent">
                            {akdMenus.map((menu) => {
                                const isActive = validSlug === menu.key ||
                                    (menu.submenus?.some((s) => s.key === validSlug) ?? false);
                                const isExpanded = expanded === menu.key;

                                return (
                                    <div key={menu.key} className="relative mb-1">
                                        <div
                                            className={`flex justify-between items-center py-4 px-5 border-b border-gray-200 transition-all cursor-pointer ${isActive ? 'bg-white shadow-sm rounded-sm z-10 relative border-b-transparent' : 'hover:bg-white/50'}`}
                                            onClick={() => {
                                                if (menu.submenus) {
                                                    setExpanded(isExpanded ? '' : menu.key);
                                                }
                                            }}
                                        >
                                            <Link
                                                href={`/akd/${menu.key}`}
                                                className={`text-[15px] font-bold ${isActive ? 'text-gray-900' : 'text-gray-700'}`}
                                                onClick={(e) => menu.submenus && e.preventDefault()}
                                            >
                                                {menu.title}
                                            </Link>

                                            {menu.submenus && (
                                                <button className={`text-gray-400 focus:outline-none transition-transform duration-300 ${isExpanded ? 'rotate-180 text-red-600' : ''}`}>
                                                    <ChevronDown size={18} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Submenus */}
                                        {menu.submenus && (
                                            <div className={`overflow-hidden transition-all duration-300 origin-top ${isExpanded ? 'max-h-[5000px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'}`}>
                                                <div className={`flex flex-col p-4 bg-white shadow-lg border border-gray-100 rounded-b-md relative z-20 mx-2 mt-1 mb-3 ${isActive ? 'ml-6 border-l-4 border-l-red-600' : ''}`}>
                                                    {loadingMasa ? (
                                                        <div className="space-y-2 animate-pulse">
                                                            {[1, 2, 3].map(i => (
                                                                <div key={i} className="flex items-center gap-2 px-3 py-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200 flex-shrink-0" />
                                                                    <div className="h-3 bg-gray-100 rounded flex-1" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        menu.submenus.map((sub, idx) => {
                                                            if (sub.isLabel) {
                                                                return (
                                                                    <div key={sub.key} className="text-xs font-black text-gray-500 uppercase tracking-wider mt-4 mb-1.5 px-3 first:mt-1 border-b border-gray-100 pb-1">
                                                                        {sub.title}
                                                                    </div>
                                                                );
                                                            }
                                                            return (
                                                                <Link
                                                                    key={sub.key}
                                                                    href={`/akd/${sub.key}`}
                                                                    className={`py-2 px-3 text-[13px] rounded mb-1 cursor-pointer transition-colors ${validSlug === sub.key
                                                                        ? 'bg-gray-50 font-bold text-gray-900 border-l-2 border-red-600'
                                                                        : idx === 0 && validSlug === menu.key && !menu.submenus?.find((s) => !s.isLabel && s.key === validSlug)
                                                                            ? 'bg-gray-50 font-bold text-gray-900 border-l-2 border-red-600'
                                                                            : 'font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50'
                                                                        }`}
                                                                >
                                                                    {sub.title}
                                                                </Link>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Right Content */}
                    <section className="flex-1 w-full lg:mt-6">
                        {renderContent()}
                    </section>

                </div>
            </div>
        </main>
    );
};

export default AKDPage;
