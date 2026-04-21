'use client';
import React from 'react';
import Link from 'next/link';
import { Users, Building2, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../../services/api';
import type { FraksiInfo } from '../../services/api';

interface Props {
  periode: string;
  fraksiList: FraksiInfo[];
}

export function FraksiPerolehanKursi({ periode, fraksiList }: Props) {
  if (fraksiList.length === 0) {
    return (
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
          Perolehan Kursi Pemilu Legislatif
        </h1>
        <p className="text-gray-500 text-sm mb-10">Periode {periode.replace('-', ' – ')}</p>
        <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center">
          <Users size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-medium">Belum ada data fraksi untuk periode ini.</p>
        </div>
      </div>
    );
  }

  const sorted = [...fraksiList].sort((a, b) => b.kursi - a.kursi);
  const totalKursi = fraksiList.reduce((s, f) => s + f.kursi, 0);
  const isAktif = fraksiList.some(f => f.isAktif);

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">
        Perolehan Kursi Pemilu Legislatif
      </h1>
      <div className="flex items-center gap-3 mb-10">
        <p className="text-gray-500 text-sm">Periode {periode.replace('-', ' – ')}</p>
        {isAktif && <span className="text-xs font-bold text-green-600 bg-green-100 px-2.5 py-1 rounded-full">Aktif</span>}
        <span className="text-xs text-gray-400">{totalKursi} kursi total</span>
      </div>

      {/* Bar distribusi */}
      <div className="mb-8">
        <div className="flex h-8 rounded-full overflow-hidden shadow-inner">
          {sorted.map(f => (
            <div
              key={f.slug}
              className="relative group cursor-pointer hover:opacity-80 transition-opacity"
              style={{ width: `${(f.kursi / totalKursi) * 100}%`, backgroundColor: f.color }}
              title={`${f.shortName}: ${f.kursi} kursi`}
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {f.shortName}: {f.kursi} kursi
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {sorted.map(f => (
            <span key={f.slug} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }} />
              {f.shortName}
            </span>
          ))}
        </div>
      </div>

      {/* Tabel ranking */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
        <ol className="space-y-3">
          {sorted.map((item, idx) => (
            <li key={item.id} className="flex items-center gap-4 group">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${idx < 3 ? 'bg-gradient-to-br from-red-500 to-red-700 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {idx + 1}
              </span>
              <div className="flex-1 flex items-center justify-between border-b border-gray-50 pb-2.5 group-hover:border-red-100 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-bold text-gray-800 text-sm">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {totalKursi > 0 ? ((item.kursi / totalKursi) * 100).toFixed(1) : 0}%
                  </span>
                  <span className="flex items-center gap-1 text-sm font-black text-red-600 bg-red-50 px-3 py-0.5 rounded-full">
                    {item.kursi}<span className="text-xs font-medium text-red-400">kursi</span>
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-700">Total Kursi</span>
          <span className="text-lg font-black text-gray-900 bg-gray-100 px-4 py-1 rounded-full">
            {totalKursi} <span className="text-sm font-medium text-gray-500">kursi</span>
          </span>
        </div>
      </div>

      {/* Grid fraksi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map(f => (
          <Link
            key={f.slug}
            href={`/fraksi/${f.slug}`}
            className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm overflow-hidden" style={{ backgroundColor: f.color }}>
                {f.logoUrl ? (
                  <img src={getImageUrl(f.logoUrl)} alt="" className="w-6 h-6 object-contain" />
                ) : (
                  <Building2 size={18} className="text-white" />
                )}
              </div>
              <div>
                <h3 className="font-black text-sm text-gray-900 group-hover:text-red-600 transition-colors">{f.shortName}</h3>
                <span className="text-xs text-gray-400">
                  {f.kursi} kursi · {totalKursi > 0 ? ((f.kursi / totalKursi) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{f.name}</p>
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-end">
              <span className="text-xs font-bold text-red-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                Lihat Detail <ChevronRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
