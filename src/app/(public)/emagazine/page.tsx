'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { BookOpen } from 'lucide-react';

const EMagazineReader = dynamic(() => import('@/components/EMagazineReader'), { ssr: false });

interface Magazine {
  id: string; title: string; edisi: string;
  imageUrl: string | null; fileUrl: string | null;
}

export default function EMagazinePage() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading]     = useState(true);
  const [active, setActive]       = useState<Magazine | null>(null);

  useEffect(() => {
    fetch('/api/emagazine')
      .then(r => r.json())
      .then(d => setMagazines(Array.isArray(d) ? d.filter((m: any) => m.isActive) : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <main className="min-h-screen bg-[#fcfcfc] py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen size={28} className="text-red-600" />
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">e-Magazine</h1>
            </div>
            <div className="w-16 h-1.5 bg-red-600 rounded-full" />
            <p className="text-gray-500 text-sm mt-3">Majalah digital DPRD Kabupaten Sumbawa Barat</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {Array(12).fill(0).map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : magazines.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
              <BookOpen size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-medium">Belum ada e-Magazine tersedia</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {magazines.map(mag => (
                <button key={mag.id} onClick={() => setActive(mag)}
                  className="group flex flex-col items-center text-left">
                  <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl border border-gray-200 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 bg-gray-50">
                    {mag.imageUrl
                      ? <img src={mag.imageUrl} alt={mag.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={32} className="text-gray-300" />
                        </div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-white text-xs font-bold">Baca Sekarang</span>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-bold text-gray-700 leading-tight">{mag.edisi}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{mag.title}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {active && <EMagazineReader magazine={active} onClose={() => setActive(null)} />}
    </>
  );
}
