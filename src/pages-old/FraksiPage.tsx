'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useFraksiPage } from './fraksi/useFraksiPage';
import { FraksiPerolehanKursi } from './fraksi/FraksiPerolehanKursi';
import { FraksiDetail } from './fraksi/FraksiDetail';

export default function FraksiPage() {
  const { slug } = useParams<{ slug?: string }>();
  const {
    loading,
    openPeriode, setOpenPeriode,
    selectedPeriode, setSelectedPeriode,
    selectedFraksi,
    periodeGroups, periodes,
    fraksiBySelectedPeriode,
    displayPeriode,
  } = useFraksiPage(slug);

  const totalKursiPeriode = selectedFraksi
    ? (periodeGroups[selectedFraksi.masaJabatan?.periode || ''] ?? []).reduce((s, f) => s + f.kursi, 0)
    : 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fcfcfc] py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="w-full lg:w-[320px] space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
              {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
            </div>
            <div className="flex-1 space-y-6">
              <div className="h-12 bg-gray-200 rounded animate-pulse w-96" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfcfc] py-12 md:py-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* Sidebar */}
          <aside className="w-full lg:w-[320px] flex-shrink-0 lg:sticky lg:top-28">
            <div className="relative mb-8 w-full aspect-[4/3] max-w-[300px] mx-auto lg:mx-0 group cursor-pointer">
              <div className="absolute inset-0 bg-red-500 rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500 z-0" />
              <div className="absolute inset-0 bg-red-600 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500 z-0 opacity-80" />
              <div className="absolute inset-2 bg-white rounded-2xl z-10 overflow-hidden shadow-lg shadow-black/10">
                <img
                  src="/Gedung-DPRD-Sumbawa-Barat.jpg"
                  alt="Gedung DPRD Sumbawa Barat"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={e => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888045653-f7267eb4bd48?auto=format&fit=crop&q=80&w=600'; }}
                />
              </div>
            </div>

            <div className="space-y-1">
              {periodes.map((periode, i) => {
                const isOpen = openPeriode === periode;
                const fraksiInPeriode = periodeGroups[periode];
                // "Perolehan Kursi" aktif jika tidak ada slug DAN periode ini yang dipilih
                const isPerolehanActive = !slug && selectedPeriode === periode;

                return (
                  <div key={periode} className={i > 0 ? 'border-t border-gray-100' : ''}>
                    <button
                      onClick={() => setOpenPeriode(isOpen ? null : periode)}
                      className="w-full flex items-center justify-between py-3 px-1 text-left group"
                    >
                      <span className="font-black text-gray-900 text-[15px] group-hover:text-red-600 transition-colors">
                        Periode {periode.replace('-', ' – ')}
                      </span>
                      <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="border-l-2 border-red-500 ml-2 pl-4 pb-4 space-y-1">
                        {/* Klik ini set periode yang dipilih */}
                        <Link
                          href="/fraksi"
                          onClick={() => setSelectedPeriode(periode)}
                          className={`block py-2 text-[13px] font-semibold transition-colors rounded-md px-2 ${isPerolehanActive ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                          Perolehan Kursi Pemilu Legislatif
                        </Link>
                        {fraksiInPeriode.map(f => (
                          <Link
                            key={f.slug}
                            href={`/fraksi/${f.slug}`}
                            className={`block py-2 text-[13px] font-semibold transition-colors rounded-md px-2 ${slug === f.slug ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                          >
                            {f.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              {periodes.length === 0 && <p className="text-gray-400 text-sm italic py-3">Belum ada data fraksi.</p>}
            </div>
          </aside>

          {/* Main content */}
          <section className="flex-1 w-full">
            {selectedFraksi ? (
              <FraksiDetail fraksi={selectedFraksi} totalKursiPeriode={totalKursiPeriode} />
            ) : (
              <FraksiPerolehanKursi
                periode={displayPeriode ?? ''}
                fraksiList={fraksiBySelectedPeriode}
              />
            )}
          </section>

        </div>
      </div>
    </main>
  );
}
