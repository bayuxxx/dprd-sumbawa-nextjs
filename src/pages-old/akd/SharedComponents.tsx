'use client';
import React from 'react';
import { User } from 'lucide-react';
import type { Pimpinan } from '../../services/api';

// ── Profile card (used across AKD sections) ──
export const renderProfileCard = (person: {
    name: string;
    title: string;
    location: string;
    image?: string;
    imageUrl?: string | null;
    faction?: string | null;
}) => (
    <div className="flex flex-col items-center group w-full">
        <div className="w-full aspect-[3/4] mb-5 relative rounded-md p-1.5 md:p-2 bg-white border border-gray-100 shadow-sm group-hover:shadow-lg transition-all duration-300">
            <div className="w-full h-full overflow-hidden rounded-md bg-gray-50">
                {(person.image || person.imageUrl) ? (
                    <img
                        src={person.image || person.imageUrl || ''}
                        alt={person.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <User size={40} className="text-slate-300" />
                    </div>
                )}
            </div>
        </div>
        <h3 className="font-bold text-[14px] md:text-[15px] text-gray-900 mb-1 text-center group-hover:text-red-600 transition-colors">
            {person.name}
        </h3>
        <p className="text-[11px] md:text-[12px] text-gray-500 font-medium text-center leading-relaxed">
            {person.title}
        </p>
    </div>
);

// ── Mini card for pimpinan terdahulu ──
export const renderMiniCard = (pimpinan: Pimpinan) => (
    <div key={pimpinan.id} className="flex flex-col items-center group w-full">
        <div className="w-full aspect-[3/4] mb-3 relative rounded-md p-1 bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="w-full h-full overflow-hidden rounded-sm bg-gray-50">
                {pimpinan.imageUrl ? (
                    <img
                        src={pimpinan.imageUrl}
                        alt={pimpinan.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <User size={28} className="text-slate-300" />
                    </div>
                )}
            </div>
        </div>
        <h3 className="font-bold text-[12px] text-gray-800 mb-0.5 text-center group-hover:text-red-600 transition-colors leading-tight line-clamp-2">
            {pimpinan.name}
        </h3>
        <p className="text-[10px] text-gray-500 font-medium text-center leading-relaxed">
            {pimpinan.position}
            {pimpinan.faction && <><br /><span className="text-amber-600">{pimpinan.faction}</span></>}
        </p>
    </div>
);

// ── Loading skeleton ──
export const GridSkeleton: React.FC<{ count?: number; cols?: number }> = ({ count = 4, cols = 4 }) => (
    <div className={`grid grid-cols-2 sm:grid-cols-${Math.min(cols, 3)} lg:grid-cols-${cols} gap-6 w-full`}>
        {Array(count).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col items-center w-full">
                <div className="w-full aspect-[3/4] bg-gray-100 rounded-xl animate-pulse mb-3" />
                <div className="h-3.5 bg-gray-100 rounded animate-pulse w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
            </div>
        ))}
    </div>
);

// ── Full page skeleton (title + deskripsi + grid) ──
export const PageSkeleton: React.FC<{ cardCount?: number; cols?: number; showDesc?: boolean }> = ({
    cardCount = 5,
    cols = 4,
    showDesc = true,
}) => (
    <div className="w-full flex flex-col items-center animate-pulse">
        {/* Title */}
        <div className="h-9 bg-gray-100 rounded-lg w-2/3 mb-3" />
        <div className="h-9 bg-gray-100 rounded-lg w-1/2 mb-10" />

        {/* Description block */}
        {showDesc && (
            <div className="w-full bg-gray-50 border-l-4 border-gray-200 p-6 mb-16 rounded-r-xl">
                <div className="h-3.5 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3.5 bg-gray-100 rounded w-5/6 mb-2" />
                <div className="h-3.5 bg-gray-100 rounded w-4/6" />
            </div>
        )}

        {/* Center card (ketua) */}
        <div className="flex justify-center w-full mb-12">
            <div className="w-[180px] md:w-[240px] flex flex-col items-center">
                <div className="w-full aspect-[3/4] bg-gray-100 rounded-xl mb-3" />
                <div className="h-3.5 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
        </div>

        {/* Grid cards */}
        <GridSkeleton count={cardCount} cols={cols} />
    </div>
);
