'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowRight, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';

const agendas = [
    { id: 1, date: '18', month: 'Maret', year: '2026', title: "Rapat Paripurna: Penyampaian LKPD Tahun 2025", location: "Gedung DPRD Sumbawa Barat", time: "09.00 WITA", category: "Paripurna", color: "#c0392b" },
    { id: 2, date: '20', month: 'Maret', year: '2026', title: "Rapat Kerja Komisi I dengan Dinas Pendidikan dan Kebudayaan", location: "Ruang Komisi I", time: "10.00 WITA", category: "Rapat Komisi", color: "#1a6bb5" },
    { id: 3, date: '22', month: 'Maret', year: '2026', title: "Kunjungan Kerja Terpadu Pimpinan ke Dapil III", location: "Kecamatan Sekongkang", time: "08.00 WITA", category: "Kunker", color: "#27ae60" },
    { id: 4, date: '25', month: 'Maret', year: '2026', title: "Rapat Badan Musyawarah Penentuan Jadwal Sidang", location: "Ruang Bamus DPRD", time: "13.00 WITA", category: "Bamus", color: "#8e44ad" },
    { id: 5, date: '28', month: 'Maret', year: '2026', title: "Forum Konsultasi Publik Ranperda APBD Perubahan 2026", location: "Aula DPRD Sumbawa Barat", time: "09.00 WITA", category: "Konsultasi", color: "#16a085" },
];

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const AgendaSection: React.FC = () => {
    const today = new Date();
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const agendaDates = new Set(['18', '20', '22', '25', '28']);

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

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
                                    const hasAgenda = agendaDates.has(String(day).padStart(2, '0'));

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
                        {agendas.map((a) => (
                            <div
                                key={a.id}
                                className="group bg-white border border-gray-100 hover:border-[#1a6bb5]/30 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 flex items-stretch cursor-pointer relative"
                            >
                                {/* Left Colored Accent Line */}
                                <div className="w-1.5 absolute left-0 top-0 bottom-0" style={{ backgroundColor: a.color }}></div>

                                {/* Left Date Block */}
                                <div className="flex flex-col items-center justify-center min-w-[90px] px-4 py-3 bg-slate-50 border-r border-gray-100 group-hover:bg-blue-50/50 transition-colors ml-1.5">
                                    <span className="text-3xl font-black text-[#0a2744] leading-none mb-1">{a.date}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{a.month}</span>
                                    <span className="text-[10px] text-slate-400">{a.year}</span>
                                </div>

                                {/* Content Block */}
                                <div className="flex-1 p-4 md:p-5 flex flex-col justify-center">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span
                                            className="text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm flex items-center gap-1"
                                            style={{ backgroundColor: a.color }}
                                        >
                                            <Bookmark size={10} fill="currentColor" /> {a.category}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-[#1a6bb5] transition-colors mb-3">
                                        {a.title}
                                    </h3>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 text-xs font-medium text-slate-500">
                                        <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded text-slate-600">
                                            <Clock size={12} className="text-[#1a6bb5]" /> {a.time}
                                        </span>
                                        <span className="flex items-center gap-1.5 truncate">
                                            <MapPin size={12} className="text-[#c0392b] flex-shrink-0" /> <span className="truncate">{a.location}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Hover Arrow indicator */}
                                <div className="hidden md:flex items-center justify-center px-4 md:px-6 text-slate-300 group-hover:text-[#1a6bb5] group-hover:translate-x-1 transition-all">
                                    <ChevronRight size={24} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AgendaSection;
