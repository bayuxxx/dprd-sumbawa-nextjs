'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const EMagazineReader = dynamic(() => import('./EMagazineReader'), { ssr: false });

interface Propemperda { id: string; tahun: string; raperda: { id: string }[]; }
interface Magazine { id: string; title: string; edisi: string; imageUrl: string | null; fileUrl: string | null; }
interface InfoItem { id: string; title: string; icon: string; url: string; }

const KinerjaMagazineInfo: React.FC = () => {
    const [propemperdaList, setPropemperdaList] = useState<Propemperda[]>([]);
    const [magazines, setMagazines] = useState<Magazine[]>([]);
    const [infoPublik, setInfoPublik] = useState<InfoItem[]>([]);
    const [activeMag, setActiveMag] = useState<Magazine | null>(null);

    useEffect(() => {
        fetch('/api/propemperda').then(r => r.json()).then(d => setPropemperdaList(Array.isArray(d) ? d : [])).catch(() => {});
        fetch('/api/emagazine').then(r => r.json()).then(d => setMagazines(Array.isArray(d) ? d.filter((m: any) => m.isActive) : [])).catch(() => {});
        fetch('/api/info-publik').then(r => r.json()).then(d => setInfoPublik(Array.isArray(d) ? d.filter((i: any) => i.isActive) : [])).catch(() => {});
    }, []);

    return (
    <>
        <section className="bg-white py-12 w-full">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

                    {/* Silegda */}
                    <div className="flex flex-col">
                        <div className="mb-6 flex flex-col">
                            <div className="flex justify-between items-center w-full">
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">Silegda</h2>
                                <Link href="/silegda" className="text-red-600 text-[10px] font-bold tracking-wider hover:underline">LIHAT SEMUA &gt;</Link>
                            </div>
                            <div className="w-12 h-1 bg-red-600 mt-2" />
                        </div>
                        <div className="flex flex-col gap-3">
                            {propemperdaList.length === 0
                                ? Array(5).fill(0).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-sm animate-pulse" />)
                                : propemperdaList.map(item => (
                                    <Link key={item.id} href={`/silegda/${item.tahun}`}
                                        className="flex items-center justify-between py-3 px-4 border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-red-600 text-sm font-semibold text-gray-700 transition-colors shadow-sm rounded-sm group">
                                        <span>Propemperda Tahun {item.tahun}</span>
                                        <span className="text-[11px] font-bold bg-gray-100 group-hover:bg-red-50 group-hover:text-red-600 text-gray-400 px-2 py-0.5 rounded-full transition-colors">
                                            {item.raperda?.length ?? 0}
                                        </span>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>

                    {/* e-Magazine */}
                    <div className="flex flex-col">
                        <div className="mb-6 flex flex-col">
                            <div className="flex justify-between items-center w-full">
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">e-Magazine</h2>
                                <Link href="/emagazine" className="text-red-600 text-[10px] font-bold tracking-wider hover:underline">LIHAT SEMUA &gt;</Link>
                            </div>
                            <div className="w-12 h-1 bg-red-600 mt-2" />
                        </div>
                        {magazines.length === 0 ? (
                            <div className="grid grid-cols-3 gap-3">
                                {Array(6).fill(0).map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-sm animate-pulse" />)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-3">
                                {magazines.slice(0, 6).map(mag => (
                                    <button key={mag.id} onClick={() => setActiveMag(mag)}
                                        className="group relative block aspect-[3/4] overflow-hidden rounded-sm border border-gray-200 w-full text-left">
                                        {mag.imageUrl
                                            ? <img src={mag.imageUrl} alt={mag.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
                                            : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-xs font-bold">{mag.edisi}</div>
                                        }
                                        <div className="absolute bottom-0 inset-x-0 bg-red-600 p-1 text-center translate-y-full group-hover:translate-y-0 transition-transform">
                                            <span className="text-white text-[10px] font-bold">{mag.edisi}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Publik */}
                    <div className="flex flex-col">
                        <div className="mb-6 flex flex-col">
                            <div className="flex justify-between items-center w-full">
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">Info Publik</h2>
                            </div>
                            <div className="w-12 h-1 bg-red-600 mt-2" />
                        </div>
                        <div className="flex flex-col gap-3">
                            {infoPublik.length === 0
                                ? Array(5).fill(0).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-sm animate-pulse" />)
                                : infoPublik.map(info => (
                                    <a key={info.id} href={info.url} target="_blank" rel="noreferrer"
                                        className="flex items-center gap-4 py-2 px-4 border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-red-600 transition-colors shadow-sm rounded-sm group cursor-pointer">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg shadow-sm">{info.icon}</div>
                                        <span className="text-sm font-bold text-gray-800 tracking-wide">{info.title}</span>
                                        <span className="ml-auto text-red-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">›</span>
                                    </a>
                                ))
                            }
                        </div>
                    </div>

                </div>
            </div>
        </section>

        {activeMag && <EMagazineReader magazine={activeMag} onClose={() => setActiveMag(null)} />}
    </>
    );
};

export default KinerjaMagazineInfo;
