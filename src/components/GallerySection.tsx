'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Camera } from 'lucide-react';

const dewanGallery = [
    { id: 1, img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80", caption: "Rapat Paripurna Maret 2026" },
    { id: 2, img: "https://images.unsplash.com/photo-1591522810850-58128c5fb3db?w=400&q=80", caption: "Kunjungan Kerja Komisi II" },
    { id: 3, img: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=400&q=80", caption: "Pengesahan Perda RTRW" },
    { id: 4, img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80", caption: "Dialog Publik dengan Warga" },
    { id: 5, img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80", caption: "Sidak Infrastruktur Jalan" },
    { id: 6, img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80", caption: "Rapat Badan Anggaran" },
];

const setwanGallery = [
    { id: 7, img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=80", caption: "Ruang Kerja Sekretariat" },
    { id: 8, img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=80", caption: "Kegiatan Administrasi Setwan" },
    { id: 9, img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80", caption: "Workshop Tim Sekretariat" },
    { id: 10, img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80", caption: "Apel Pagi Pegawai DPRD" },
    { id: 11, img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80", caption: "Pelantikan Pejabat Setwan" },
    { id: 12, img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80", caption: "Rapat Koordinasi Internal" },
];

const GallerySection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'dewan' | 'setwan'>('dewan');

    const activeGallery = activeTab === 'dewan' ? dewanGallery : setwanGallery;

    return (
        <section className="bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Tabs */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('dewan')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase rounded transition-colors ${activeTab === 'dewan' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                        >
                            <Camera size={14} /> Galeri Dewan
                        </button>
                        <button
                            onClick={() => setActiveTab('setwan')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase rounded transition-colors ${activeTab === 'setwan' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                        >
                            <Camera size={14} /> Galeri Sekretariat
                        </button>
                    </div>
                    <Link href="/galeri" className="text-sm text-primary hover:text-accent flex items-center gap-1 font-medium">
                        Lihat Semua <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Gallery grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {activeGallery.map((item) => (
                        <div
                            key={item.id}
                            className="relative group cursor-pointer overflow-hidden rounded shadow-sm"
                            style={{ aspectRatio: '1' }}
                        >
                            <img
                                src={item.img}
                                alt={item.caption}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-2">
                                    <p className="text-white text-xs font-medium text-center">{item.caption}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
