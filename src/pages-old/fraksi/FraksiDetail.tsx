'use client';
import React from 'react';
import Link from 'next/link';
import { Users, Award, User } from 'lucide-react';
import { getImageUrl } from '../../services/api';
import type { FraksiInfo } from '../../services/api';

interface Props {
  fraksi: FraksiInfo;
  totalKursiPeriode: number;
}

export function FraksiDetail({ fraksi, totalKursiPeriode }: Props) {
  const ketua = fraksi.anggota.filter(a => ['Ketua Fraksi', 'Wakil Ketua', 'Sekretaris'].includes(a.jabatan));
  const anggotaBiasa = fraksi.anggota.filter(a => a.jabatan === 'Anggota');

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden" style={{ backgroundColor: fraksi.color }}>
          {fraksi.logoUrl ? (
            <img src={getImageUrl(fraksi.logoUrl)} alt="" className="w-8 h-8 object-contain" />
          ) : (
            <Award size={28} className="text-white" />
          )}
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{fraksi.name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Periode {fraksi.masaJabatan?.periode?.replace('-', ' – ') || 'TBD'} · {fraksi.kursi} Kursi
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white border border-gray-100 rounded-xl p-5 text-center">
          <div className="text-3xl font-black text-red-600">{fraksi.kursi}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">Jumlah Kursi</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 text-center">
          <div className="text-3xl font-black text-gray-900">
            {totalKursiPeriode > 0 ? ((fraksi.kursi / totalKursiPeriode) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-xs text-gray-500 mt-1 font-medium">Persentase</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 text-center">
          <div className="text-3xl font-black text-gray-900">{fraksi.anggota.length}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">Anggota</div>
        </div>
      </div>

      {/* Deskripsi */}
      {fraksi.deskripsi && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
          <h2 className="font-black text-gray-900 mb-3 text-lg">Tentang Fraksi</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{fraksi.deskripsi}</p>
        </div>
      )}

      {/* Pimpinan */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
        <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2 text-lg">
          <Award size={20} className="text-red-600" /> Pimpinan Fraksi
        </h2>
        {ketua.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ketua.map(a => (
              <div key={a.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-14 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-100">
                  {a.imageUrl ? (
                    <img src={getImageUrl(a.imageUrl)} alt={a.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={20} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{a.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{a.jabatan}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">Belum ada data pimpinan.</p>
        )}
      </div>

      {/* Anggota */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2 text-lg">
          <Users size={20} className="text-red-600" /> Anggota Fraksi
        </h2>
        {anggotaBiasa.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm">Data anggota fraksi belum tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {anggotaBiasa.map((a, idx) => (
              <div key={a.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                <div className="w-12 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-100">
                  {a.imageUrl ? (
                    <img src={getImageUrl(a.imageUrl)} alt={a.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <span className="text-sm font-bold text-gray-400">{idx + 1}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{a.name}</p>
                  {a.faction && <p className="text-xs text-gray-500 mt-0.5">{a.faction}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10">
        <Link href="/fraksi" className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
          ← Kembali ke Perolehan Kursi
        </Link>
      </div>
    </div>
  );
}
