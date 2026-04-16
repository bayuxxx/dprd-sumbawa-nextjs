'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowRight, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';

interface AgendaItem {
  id: string; title: string; tanggal: string; waktu: string;
  lokasi: string; category: string; color: string;
}

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

const AgendaSection: React.FC = () => {
    const today = new Date();
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [agendas, setAgendas] = useState<AgendaItem[]>([]);

    useEffect(() => {
        fetch('/api/agenda').then(r => r.json()).then(d => setAgendas(Array.isArray(d) ? d : [])).catch(() => {});
    }, []);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Build set of agenda dates for current viewed month
    const agendaDates = new Set(
        agendas
            .filter(a => { const d = new Date(a.tanggal); return d.getMonth() === month && d.getFullYear() === year; })
            .map(a => new Date(a.tanggal).getDate())
    );

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

    // Tampilkan semua agenda aktif, urutkan dari yang terdekat
    const upcoming = [...agendas].sort(
        (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
    ).slice(0, 5);

    return (
        <section className="py-10 bg-white relative">
            {/* Subtle background pattern/color */}
            <div className="absolute inset-0 bg-slate-50/50 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-gray-200 pb-3">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-8 h-1 bg-[#1a6bb5] rounded-full"></span>
                            <span className="text-[#1a6bb5] text-xs font-bold uppercase tracking-widest">Jadwal Dewan</span>
                        </div>
                        <h2 className="text-2xl font-black text-[#0a2744] flex items-center gap-3">
                            <Calendar size={28} className="text-[#c0392b]" /> Agenda Kegiatan
                        </h2>
                    </div>
                    <Link href="/agenda" className="text-[#1a6bb5] text-sm hover:text-[#0a2744] flex items-center gap-1.5 font-semibold transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full">
                        Lihat Semua Agenda <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Calendar Widget (5 cols) */}
                    <div className="lg:col-span-5 relative">
                        <div className="bg-white border border-gray-100 rounded-xl shadow-lg shadow-blue-900/5 overflow-hidden sticky top-24">
                            {/* Calendar header */}
                            <div className="bg-gradient-to-r from-[#0a2744] to-[#1a6bb5] text-white flex items-center justify-between px-6 py-4">
                                <button onClick={prevMonth} className="hover:bg-white/20 rounded-full p-1.5 transition-colors">
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="flex flex-col items-center">
                                    <span className="font-black text-lg tracking-wide">{MONTHS[month]}</span>
                                    <span className="text-blue-200 text-xs font-bold">{year}</span>
                                </div>
                                <button onClick={nextMonth} className="hover:bg-white/20 rounded-full p-1.5 transition-colors">
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            {/* Day headers */}
                            <div className="grid grid-cols-7 bg-slate-50 border-b border-gray-100">
                                {DAYS.map((d, i) => (
                                    <div key={d} className={`text-center text-xs font-bold py-3 ${i === 0 ? 'text-red-500' : 'text-slate-500'}`}>
                                        {d}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar cells */}
                            <div className="grid grid-cols-7 p-4 gap-2">
                                {Array.from({ length: firstDay }).map((_, i) => (
                                    <div key={`empty-${i}`} className="h-10" />
                                ))}

                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                                    const hasAgenda = agendaDates.has(day);

                                    return (
                                        <div
                                            key={day}
                                            className={`h-10 w-10 mx-auto flex items-center justify-center text-sm rounded-full cursor-pointer transition-all font-semibold relative
                        ${isToday ? 'bg-[#c0392b] text-white shadow-md shadow-red-500/30' : ''}
                        ${hasAgenda && !isToday ? 'bg-blue-50 text-[#1a6bb5] hover:bg-[#1a6bb5] hover:text-white' : ''}
                        ${!isToday && !hasAgenda ? 'text-slate-700 hover:bg-slate-100' : ''}
                      `}
                                        >
                                            {day}
                                            {hasAgenda && !isToday && (
                                                <span className="absolute bottom-1 w-1 h-1 bg-[#c0392b] rounded-full" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="px-6 pb-6 pt-2 flex items-center justify-center gap-6 text-xs text-slate-500 border-t border-gray-50 mt-2">
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#c0392b] shadow-sm shadow-red-500/30" />
                                    Hari Ini
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200 flex items-end justify-center pb-0.5">
                                        <span className="w-1 h-1 rounded-full bg-[#c0392b]"></span>
                                    </span>
                                    Ada Kegiatan
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Agenda List (7 cols) */}
                    <div className="lg:col-span-7 space-y-4">
                        {upcoming.length === 0 ? (
                            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                                <Calendar size={36} className="mx-auto text-gray-200 mb-3" />
                                <p className="text-gray-400 font-medium">Belum ada agenda mendatang</p>
                            </div>
                        ) : upcoming.map((a) => {
                            const dt = new Date(a.tanggal);
                            return (
                            <div key={a.id} className="group bg-white border border-gray-100 hover:border-[#1a6bb5]/30 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 flex items-stretch cursor-pointer relative">
                                <div className="w-1.5 absolute left-0 top-0 bottom-0" style={{ backgroundColor: a.color }}></div>
                                <div className="flex flex-col items-center justify-center min-w-[90px] px-4 py-3 bg-slate-50 border-r border-gray-100 group-hover:bg-blue-50/50 transition-colors ml-1.5">
                                    <span className="text-3xl font-black text-[#0a2744] leading-none mb-1">{dt.getDate()}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{MONTHS[dt.getMonth()]}</span>
                                    <span className="text-[10px] text-slate-400">{dt.getFullYear()}</span>
                                </div>
                                <div className="flex-1 p-4 md:p-5 flex flex-col justify-center">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className="text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm flex items-center gap-1" style={{ backgroundColor: a.color }}>
                                            <Bookmark size={10} fill="currentColor" /> {a.category}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-[#1a6bb5] transition-colors mb-3">{a.title}</h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 text-xs font-medium text-slate-500">
                                        <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded text-slate-600"><Clock size={12} className="text-[#1a6bb5]" /> {a.waktu}</span>
                                        <span className="flex items-center gap-1.5 truncate"><MapPin size={12} className="text-[#c0392b] flex-shrink-0" /> <span className="truncate">{a.lokasi}</span></span>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center justify-center px-4 md:px-6 text-slate-300 group-hover:text-[#1a6bb5] group-hover:translate-x-1 transition-all">
                                    <ChevronRight size={24} />
                                </div>
                            </div>
                        );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AgendaSection;
