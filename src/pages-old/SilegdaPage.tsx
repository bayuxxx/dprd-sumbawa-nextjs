'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, FileText, Scale, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { fetchPropemperdaList, fetchPropemperdaByTahun, fetchRaperdaLuar } from '../services/api/propemperda';
import type { Propemperda, RaperdaLuar } from '../services/api/propemperda';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
        'Selesai Pembahasan': { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle2 size={13} className="text-emerald-500" /> },
        'Proses Pembahasan':  { bg: 'bg-amber-50 border-amber-200',   text: 'text-amber-700',   icon: <Clock size={13} className="text-amber-500" /> },
        'Belum Pembahasan':   { bg: 'bg-gray-50 border-gray-200',     text: 'text-gray-500',    icon: <AlertCircle size={13} className="text-gray-400" /> },
    };
    const c = config[status] ?? config['Belum Pembahasan'];
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${c.bg} ${c.text}`}>
            {c.icon}{status}
        </span>
    );
};

const StatsBar: React.FC<{ items: { status: string }[] }> = ({ items }) => {
    const total   = items.length;
    const selesai = items.filter(r => r.status === 'Selesai Pembahasan').length;
    const proses  = items.filter(r => r.status === 'Proses Pembahasan').length;
    const belum   = items.filter(r => r.status === 'Belum Pembahasan').length;
    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-gray-900">{total}</div>
                    <div className="text-xs text-gray-500 mt-1 font-medium">Total Raperda</div>
                </div>
                <div className="bg-white border border-emerald-100 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-emerald-600">{selesai}</div>
                    <div className="text-xs text-gray-500 mt-1 font-medium">Selesai</div>
                </div>
                <div className="bg-white border border-amber-100 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-amber-600">{proses}</div>
                    <div className="text-xs text-gray-500 mt-1 font-medium">Proses</div>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-gray-400">{belum}</div>
                    <div className="text-xs text-gray-500 mt-1 font-medium">Belum</div>
                </div>
            </div>
            <div className="mb-10">
                <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-100">
                    {selesai > 0 && <div className="bg-emerald-500" style={{ width: `${(selesai / total) * 100}%` }} />}
                    {proses  > 0 && <div className="bg-amber-400"   style={{ width: `${(proses  / total) * 100}%` }} />}
                    {belum   > 0 && <div className="bg-gray-300"    style={{ width: `${(belum   / total) * 100}%` }} />}
                </div>
                <div className="flex flex-wrap gap-4 mt-3">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />Selesai ({selesai})</span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />Proses ({proses})</span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" />Belum ({belum})</span>
                </div>
            </div>
        </>
    );
};

const RaperdaTable: React.FC<{ items: { id: string; judul: string; status: string }[] }> = ({ items }) => (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-[60px_1fr_200px] bg-gray-900 text-white text-xs font-bold uppercase tracking-wider">
            <div className="px-4 py-4 text-center">No</div>
            <div className="px-4 py-4">Rancangan Peraturan Daerah</div>
            <div className="px-4 py-4 text-center">Status</div>
        </div>
        {items.map((item, idx) => (
            <div key={item.id} className={`md:grid md:grid-cols-[60px_1fr_200px] items-center border-b border-gray-50 hover:bg-gray-50/80 transition-colors group ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <div className="px-4 py-4 flex md:justify-center items-start md:items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${item.status === 'Selesai Pembahasan' ? 'bg-emerald-500 text-white' : item.status === 'Proses Pembahasan' ? 'bg-amber-400 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {idx + 1}
                    </span>
                    <div className="md:hidden ml-3 flex-1">
                        <p className="text-sm font-semibold text-gray-800 leading-relaxed">{item.judul}</p>
                        <div className="mt-2"><StatusBadge status={item.status} /></div>
                    </div>
                </div>
                <div className="hidden md:block px-4 py-4">
                    <p className="text-sm font-semibold text-gray-800 leading-relaxed group-hover:text-gray-900">{item.judul}</p>
                </div>
                <div className="hidden md:flex px-4 py-4 justify-center">
                    <StatusBadge status={item.status} />
                </div>
            </div>
        ))}
    </div>
);

const SilegdaPage: React.FC = () => {
    const { tahun: slug } = useParams<{ tahun?: string }>();
    const [allData, setAllData]       = useState<Propemperda[]>([]);
    const [data, setData]             = useState<Propemperda | null>(null);
    const [loading, setLoading]       = useState(true);
    const [latestTahun, setLatestTahun] = useState('');
    const [tab, setTab]               = useState<'propemperda' | 'luar'>('propemperda');
    const [raperdaLuar, setRaperdaLuar] = useState<RaperdaLuar[]>([]);
    const [loadingLuar, setLoadingLuar] = useState(false);

    useEffect(() => {
        fetchPropemperdaList().then(list => {
            setAllData(list);
            if (list.length > 0) {
                setLatestTahun(list[0].tahun);
                if (!slug) { setData(list[0]); setLoading(false); }
            } else {
                setLoading(false);
            }
        });
    }, []);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        fetchPropemperdaByTahun(slug).then(d => setData(d)).finally(() => setLoading(false));
    }, [slug]);

    useEffect(() => {
        if (tab !== 'luar') return;
        setLoadingLuar(true);
        fetchRaperdaLuar().then(d => setRaperdaLuar(d)).finally(() => setLoadingLuar(false));
    }, [tab]);

    const selectedYear = slug || latestTahun;

    // Group raperda luar by tahun
    const luarByTahun = raperdaLuar.reduce((acc, r) => {
        if (!acc[r.tahun]) acc[r.tahun] = [];
        acc[r.tahun].push(r);
        return acc;
    }, {} as Record<string, RaperdaLuar[]>);
    const luarTahunSorted = Object.keys(luarByTahun).sort((a, b) => b.localeCompare(a));

    const navItemClass = (active: boolean) =>
        `flex items-center justify-between py-3 px-3 text-[14px] font-bold border-b border-gray-50 transition-all duration-200 rounded-md ${
            active ? 'text-red-600 bg-red-50 border-l-4 border-l-red-500' : 'text-gray-700 hover:text-red-600 hover:bg-gray-50 border-l-4 border-l-transparent'
        }`;

    return (
        <main className="min-h-screen bg-[#fcfcfc] py-12 md:py-20">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

                    {/* Sidebar */}
                    <aside className="w-full lg:w-[300px] flex-shrink-0 lg:sticky lg:top-28">
                        <div className="relative mb-8 w-full aspect-[4/3] max-w-[280px] mx-auto lg:mx-0 group cursor-pointer">
                            <div className="absolute inset-0 bg-red-500 rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500 z-0" />
                            <div className="absolute inset-0 bg-red-600 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500 z-0 opacity-80" />
                            <div className="absolute inset-2 bg-white rounded-2xl z-10 overflow-hidden shadow-lg shadow-black/10">
                                <img src="/Gedung-DPRD-Sumbawa-Barat.jpg" alt="Gedung DPRD" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={e => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888045653-f7267eb4bd48?auto=format&fit=crop&q=80&w=600'; }} />
                            </div>
                        </div>

                        <nav className="flex flex-col">
                            {allData.map(item => {
                                // aktif hanya jika tab propemperda DAN tahun cocok
                                const isActive = tab === 'propemperda' && selectedYear === item.tahun;
                                return (
                                    <Link key={item.tahun} href={`/silegda/${item.tahun}`}
                                        onClick={() => setTab('propemperda')}
                                        className={navItemClass(isActive)}>
                                        <span>Propemperda Tahun {item.tahun}</span>
                                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isActive ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                                            {item.raperda.length}
                                        </span>
                                    </Link>
                                );
                            })}

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <button onClick={() => setTab(tab === 'luar' ? 'propemperda' : 'luar')}
                                    className={navItemClass(tab === 'luar') + ' w-full text-left gap-2'}>
                                    <span className="flex items-center gap-2"><FileText size={16} />Raperda Diluar Propemperda</span>
                                </button>
                            </div>
                        </nav>
                    </aside>

                    {/* Konten */}
                    <section className="flex-1 w-full min-w-0">
                        {tab === 'luar' ? (
                            <>
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">Raperda Diluar Propemperda</h1>
                                <p className="text-gray-500 text-sm mb-8">Penyusunan Rancangan Peraturan Daerah di luar Program Pembentukan Peraturan Daerah</p>

                                {loadingLuar ? (
                                    <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-xl" />)}</div>
                                ) : raperdaLuar.length === 0 ? (
                                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                                        <FileText size={36} className="mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-400 font-medium">Belum ada data Raperda Diluar Propemperda</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Statistik gabungan semua tahun */}
                                        <StatsBar items={raperdaLuar} />

                                        {/* Per tahun */}
                                        {luarTahunSorted.map(tahun => (
                                            <div key={tahun} className="mb-10">
                                                <h2 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
                                                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">Tahun {tahun}</span>
                                                    <span className="text-sm text-gray-400 font-medium">{luarByTahun[tahun].length} raperda</span>
                                                </h2>
                                                <RaperdaTable items={luarByTahun[tahun]} />
                                                <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Scale size={16} className="text-red-600" />
                                                        <span className="font-bold">Total {luarByTahun[tahun].length} Raperda Tahun {tahun}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-400">Sumber: Bapemperda DPRD Kab. Sumbawa Barat</div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">Propemperda Tahun {selectedYear}</h1>
                                <p className="text-gray-500 text-sm mb-8">Program Pembentukan Peraturan Daerah Kabupaten Sumbawa Barat Tahun {selectedYear}</p>

                                {loading ? (
                                    <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-xl" />)}</div>
                                ) : data ? (
                                    <>
                                        <StatsBar items={data.raperda} />
                                        <RaperdaTable items={data.raperda} />
                                        <div className="mt-6 bg-gray-50 border border-gray-100 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Scale size={18} className="text-red-600" />
                                                <span className="font-bold">Total {data.raperda.length} Rancangan Peraturan Daerah</span>
                                            </div>
                                            <div className="text-xs text-gray-400 font-medium">Sumber: Bapemperda DPRD Kab. Sumbawa Barat</div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <FileText size={36} className="text-gray-300" />
                                        </div>
                                        <h2 className="font-black text-gray-900 text-lg mb-2">Data Belum Tersedia</h2>
                                        <p className="text-gray-500 text-sm mb-6">Data Propemperda Tahun {selectedYear} belum tersedia dalam sistem.</p>
                                        {latestTahun && (
                                            <Link href={`/silegda/${latestTahun}`} className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700">
                                                Lihat Propemperda Terbaru <ChevronRight size={16} />
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
};

export default SilegdaPage;
