'use client';
import React, { useEffect, useState } from 'react';
import { MessageSquare, ExternalLink } from 'lucide-react';

interface Tautan { id: string; title: string; url: string; }

const AgendaForumTautan: React.FC = () => {
    const daysArray = Array.from({ length: 31 }, (_, i) => i + 1);
    const [tautans, setTautans] = useState<Tautan[]>([]);

    useEffect(() => {
        fetch('/api/tautan').then(r => r.json()).then(data => setTautans(Array.isArray(data) ? data.filter((t: any) => t.isActive) : [])).catch(() => {});
    }, []);

    return (
        <section className="bg-white py-12 w-full border-t border-gray-100">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

                    {/* Agenda Column */}
                    <div className="flex flex-col">
                        <div className="mb-6 flex flex-col">
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Agenda Kegiatan</h2>
                            <div className="w-12 h-1 bg-red-600 mt-2"></div>
                        </div>
                        <div className="border border-gray-200 rounded-sm p-4 text-center bg-gray-50/50 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <button className="text-gray-400 font-bold hover:text-red-600">&lt;</button>
                                <span className="font-bold text-gray-800">Maret 2026</span>
                                <button className="text-gray-400 font-bold hover:text-red-600">&gt;</button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-[11px] font-bold text-gray-500 mb-2">
                                <div>Min</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-sm font-medium text-gray-700">
                                <div className="text-gray-300">28</div><div className="text-gray-300">29</div>
                                {daysArray.map((day) => (
                                    <div key={day} className={`p-1 flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-100 cursor-pointer ${day === 15 ? 'bg-red-600 text-white font-bold' : ''}`}>
                                        {day}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Forum Warga Column */}
                    <div className="flex flex-col">
                        <div className="mb-6 flex flex-col">
                            <div className="flex justify-between items-center w-full">
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">Forum Warga</h2>
                                <a href="#" className="text-red-600 text-[10px] font-bold tracking-wider hover:underline">LIHAT SEMUA &gt;</a>
                            </div>
                            <div className="w-12 h-1 bg-red-600 mt-2"></div>
                        </div>

                        <div className="border border-gray-200 bg-gray-50/50 p-5 rounded-sm shadow-sm relative overflow-hidden flex-1">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 shrink-0 overflow-hidden flex items-center justify-center">
                                    <MessageSquare size={18} className="text-blue-600" />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <h4 className="font-bold text-gray-800 text-sm">DPRD Sumbawa Barat</h4>
                                    <p className="text-gray-500 text-xs italic mt-2 leading-relaxed bg-white p-3 rounded-tr-xl rounded-b-xl border border-gray-100 shadow-sm relative">
                                        "Silahkan sampaikan aspirasi, pengaduan, atau saran positif untuk pembangunan Sumbawa Barat yang maju."
                                    </p>
                                </div>
                            </div>
                            <div className="mt-5 w-full flex">
                                <a href="https://wa.me/something" target="_blank" className="bg-red-600 text-white text-xs font-bold w-full py-3 rounded-sm shadow text-center hover:bg-red-700 transition-colors uppercase tracking-widest">
                                    Sampaikan Aspirasi
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Tautan Column */}
                    <div className="flex flex-col">
                        <div className="mb-6 flex flex-col">
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Tautan</h2>
                            <div className="w-12 h-1 bg-red-600 mt-2"></div>
                        </div>

                        <div className="flex flex-col border border-gray-200 rounded-sm shadow-sm bg-gray-50/50 divide-y divide-gray-100">
                            {tautans.length === 0
                                ? Array(4).fill(0).map((_, i) => <div key={i} className="h-12 bg-gray-50 animate-pulse" />)
                                : tautans.map(t => (
                                    <a key={t.id} href={t.url} target="_blank" rel="noreferrer"
                                        className="w-full flex justify-between items-center p-3 px-4 hover:bg-white cursor-pointer transition-colors group">
                                        <span className="text-sm font-bold text-gray-800 group-hover:text-red-600 transition-colors">{t.title}</span>
                                        <ExternalLink size={13} className="text-gray-400 group-hover:text-red-600 transition-colors" />
                                    </a>
                                ))
                            }
                        </div>
                    </div>

                </div>

                {/* Bottom logos strip — hapus karena data sudah dinamis */}
            </div>
        </section>
    );
};

export default AgendaForumTautan;
