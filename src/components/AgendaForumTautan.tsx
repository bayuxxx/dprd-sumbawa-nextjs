'use client';
import React, { useEffect, useState } from 'react';
import { MessageSquare, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface Tautan { id: string; title: string; url: string; }
interface AgendaItem { id: string; tanggal: string; }

const DAYS = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

const AgendaForumTautan: React.FC = () => {
    const today = new Date();
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [tautans, setTautans] = useState<Tautan[]>([]);
    const [agendas, setAgendas] = useState<AgendaItem[]>([]);

    useEffect(() => {
        fetch('/api/tautan').then(r => r.json()).then(d => setTautans(Array.isArray(d) ? d.filter((t: any) => t.isActive) : [])).catch(() => {});
        fetch('/api/agenda').then(r => r.json()).then(d => setAgendas(Array.isArray(d) ? d : [])).catch(() => {});
    }, []);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const agendaDates = new Set(
        agendas
            .filter(a => { const d = new Date(a.tanggal); return d.getMonth() === month && d.getFullYear() === year; })
            .map(a => new Date(a.tanggal).getDate())
    );

    return (
        <section className="bg-white py-12 w-full border-t border-gray-100">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

                    {/* Agenda / Kalender */}
                    <div className="flex flex-col">
                        <div className="mb-6 flex flex-col">
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Agenda Kegiatan</h2>
                            <div className="w-12 h-1 bg-red-600 mt-2" />
                        </div>
                        <div className="border border-gray-200 rounded-sm p-4 bg-gray-50/50 shadow-sm">
                            {/* Nav bulan */}
                            <div className="flex justify-between items-center mb-4">
                                <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="text-gray-400 hover:text-red-600 p-1 transition-colors">
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="font-bold text-gray-800 text-sm">{MONTHS[month]} {year}</span>
                                <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="text-gray-400 hover:text-red-600 p-1 transition-colors">
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            {/* Header hari */}
                            <div className="grid grid-cols-7 gap-1 text-[11px] font-bold text-gray-500 mb-2 text-center">
                                {DAYS.map((d, i) => <div key={d} className={i === 0 ? 'text-red-500' : ''}>{d}</div>)}
                            </div>

                            {/* Grid tanggal */}
                            <div className="grid grid-cols-7 gap-1 text-sm font-medium text-gray-700">
                                {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                                    const hasAgenda = agendaDates.has(day);
                                    return (
                                        <div key={day} className={`relative flex items-center justify-center w-8 h-8 mx-auto rounded-full text-xs cursor-pointer transition-colors
                                            ${isToday ? 'bg-red-600 text-white font-bold' : ''}
                                            ${hasAgenda && !isToday ? 'bg-blue-50 text-blue-700 font-bold hover:bg-blue-100' : ''}
                                            ${!isToday && !hasAgenda ? 'hover:bg-gray-100' : ''}
                                        `}>
                                            {day}
                                            {hasAgenda && !isToday && <span className="absolute bottom-0.5 w-1 h-1 bg-red-500 rounded-full" />}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="flex items-center justify-center gap-5 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-600 inline-block" />Hari Ini</span>
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200 inline-block" />Ada Kegiatan</span>
                            </div>
                        </div>
                    </div>

                    {/* Forum Warga */}
                    <div className="flex flex-col">
                        <div className="mb-6 flex flex-col">
                            <div className="flex justify-between items-center w-full">
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">Forum Warga</h2>
                                <a href="#" className="text-red-600 text-[10px] font-bold tracking-wider hover:underline">LIHAT SEMUA &gt;</a>
                            </div>
                            <div className="w-12 h-1 bg-red-600 mt-2" />
                        </div>
                        <div className="border border-gray-200 bg-gray-50/50 p-5 rounded-sm shadow-sm flex-1">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 shrink-0 flex items-center justify-center">
                                    <MessageSquare size={18} className="text-blue-600" />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <h4 className="font-bold text-gray-800 text-sm">DPRD Sumbawa Barat</h4>
                                    <p className="text-gray-500 text-xs italic mt-2 leading-relaxed bg-white p-3 rounded-tr-xl rounded-b-xl border border-gray-100 shadow-sm">
                                        "Silahkan sampaikan aspirasi, pengaduan, atau saran positif untuk pembangunan Sumbawa Barat yang maju."
                                    </p>
                                </div>
                            </div>
                            <div className="mt-5">
                                <a href="https://wa.me/something" target="_blank" rel="noreferrer"
                                    className="bg-red-600 text-white text-xs font-bold w-full py-3 rounded-sm shadow text-center hover:bg-red-700 transition-colors uppercase tracking-widest block">
                                    Sampaikan Aspirasi
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Tautan */}
                    <div className="flex flex-col">
                        <div className="mb-6 flex flex-col">
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Tautan</h2>
                            <div className="w-12 h-1 bg-red-600 mt-2" />
                        </div>
                        <div className="flex flex-col border border-gray-200 rounded-sm shadow-sm bg-gray-50/50 divide-y divide-gray-100">
                            {tautans.length === 0
                                ? Array(4).fill(0).map((_, i) => <div key={i} className="h-12 bg-gray-50 animate-pulse" />)
                                : tautans.map(t => (
                                    <a key={t.id} href={t.url} target="_blank" rel="noreferrer"
                                        className="w-full flex justify-between items-center p-3 px-4 hover:bg-white transition-colors group">
                                        <span className="text-sm font-bold text-gray-800 group-hover:text-red-600 transition-colors">{t.title}</span>
                                        <ExternalLink size={13} className="text-gray-400 group-hover:text-red-600 transition-colors" />
                                    </a>
                                ))
                            }
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AgendaForumTautan;
