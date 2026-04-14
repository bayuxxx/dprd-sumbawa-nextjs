'use client';
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const members = [
    {
        id: 1,
        name: "H. Ahmad Rifai, S.H.",
        position: "Ketua DPRD",
        faction: "Fraksi Gerindra",
        factionColor: "bg-red-700",
        commission: "-",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    },
    {
        id: 2,
        name: "Dra. Siti Rahayu, M.M.",
        position: "Wakil Ketua I",
        faction: "Fraksi Golkar",
        factionColor: "bg-yellow-600",
        commission: "-",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80",
    },
    {
        id: 3,
        name: "Ir. Zulkifli Harun",
        position: "Wakil Ketua II",
        faction: "Fraksi PKB",
        factionColor: "bg-green-700",
        commission: "-",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80",
    },
    {
        id: 4,
        name: "Hj. Nurlaela, S.Pd.",
        position: "Anggota",
        faction: "Fraksi PKS",
        factionColor: "bg-orange-600",
        commission: "Komisi I",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80",
    },
    {
        id: 5,
        name: "M. Farhan Hidayat, S.T.",
        position: "Anggota",
        faction: "Fraksi Demokrat",
        factionColor: "bg-blue-700",
        commission: "Komisi II",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
    },
    {
        id: 6,
        name: "Lalu Hendra Kusuma",
        position: "Anggota",
        faction: "Fraksi NasDem",
        factionColor: "bg-sky-600",
        commission: "Komisi III",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&q=80",
    },
];

const MembersSection: React.FC = () => {
    return (
        <section className="bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-primary uppercase tracking-wide border-l-4 border-accent pl-3">
                        Pimpinan & Anggota Dewan
                    </h2>
                    <Link href="/pimpinan" className="text-sm text-primary hover:text-accent flex items-center gap-1 font-medium">
                        Lihat Semua <ChevronRight size={14} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {members.map((member) => (
                        <div key={member.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow group cursor-pointer overflow-hidden">
                            <div className="relative h-48 overflow-hidden bg-gray-200">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                            parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-200"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>`;
                                        }
                                    }}
                                />
                                <div className={`absolute bottom-0 left-0 right-0 ${member.factionColor} text-white text-xs py-1 text-center font-bold opacity-90`}>
                                    {member.faction}
                                </div>
                            </div>
                            <div className="p-3 text-center">
                                <h3 className="text-xs font-bold text-gray-800 leading-tight">{member.name}</h3>
                                <p className="text-xs text-primary font-medium mt-1">{member.position}</p>
                                {member.commission !== '-' && (
                                    <p className="text-xs text-gray-500 mt-0.5">{member.commission}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MembersSection;
