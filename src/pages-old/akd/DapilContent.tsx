'use client';
import React, { useEffect, useState } from 'react';
import { MapPin, Users, User } from 'lucide-react';
import { fetchAllDapil, getImageUrl } from '../../services/api';
import type { DaerahPemilihan } from '../../services/api/dapil';

interface Props {
  id?: string; // dapil id dari slug
}

export default function DapilContent({ id }: Props) {
  const [dapilList, setDapilList] = useState<DaerahPemilihan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllDapil().then(data => {
      setDapilList(data);
      setLoading(false);
    });
  }, []);

  const selected = id ? dapilList.find(d => d.id === id) : dapilList[0];

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-80" />
        <div className="h-5 bg-gray-100 rounded w-48" />
        <div className="h-64 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (dapilList.length === 0) {
    return (
      <div className="text-center py-24">
        <MapPin size={48} className="mx-auto text-gray-200 mb-4" />
        <p className="text-gray-400 font-medium">Belum ada data daerah pemilihan.</p>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-400">Daerah pemilihan tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">
        {selected.nama}
      </h1>

      {selected.wilayah && (
        <div className="flex items-start gap-1.5 text-gray-500 text-sm mb-8">
          <MapPin size={15} className="mt-0.5 flex-shrink-0 text-red-500" />
          <div>
            <span className="font-semibold text-gray-700">Meliputi Kab/Kota: </span>
            {selected.wilayah}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 mb-8">
        {selected.jumlahKursi > 0 && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-bold">
            <Users size={15} />
            {selected.jumlahKursi} Kursi
          </div>
        )}
        <div className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium">
          <User size={15} />
          {selected.anggota.length} Anggota
        </div>
      </div>

      {/* Deskripsi */}
      {selected.deskripsi && (
        <p className="text-gray-600 text-sm leading-relaxed mb-8 bg-white border border-gray-100 rounded-xl p-5">
          {selected.deskripsi}
        </p>
      )}

      {/* Tabel anggota */}
      {selected.anggota.length > 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-4 text-sm font-black text-gray-700 w-14">No</th>
                <th className="text-left px-6 py-4 text-sm font-black text-gray-700">Nama</th>
                <th className="text-left px-6 py-4 text-sm font-black text-gray-700">Partai Politik</th>
              </tr>
            </thead>
            <tbody>
              {selected.anggota.map((a, idx) => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {a.imageUrl ? (
                        <img
                          src={getImageUrl(a.imageUrl)}
                          alt={a.name}
                          className="w-9 h-10 rounded-lg object-cover object-top flex-shrink-0 border border-gray-100"
                        />
                      ) : (
                        <div className="w-9 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <User size={16} className="text-gray-300" />
                        </div>
                      )}
                      <span className="font-semibold text-sm text-gray-900">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{a.partai || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center">
          <Users size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm">Belum ada data anggota untuk daerah pemilihan ini.</p>
        </div>
      )}
    </div>
  );
}
