'use client';
import React from 'react';

const years = [
    "Kinerja per Akhir Tahun 2026",
    "Kinerja per Akhir Tahun 2025",
    "Kinerja per Akhir Tahun 2024",
    "Kinerja per Akhir Tahun 2023",
    "Kinerja per Akhir Tahun 2022",
    "Kinerja per Akhir Tahun 2021",
    "Kinerja per Akhir Tahun 2020",
];

const magazines = [
    { title: "Edisi 3", img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=80" },
    { title: "Edisi 4", img: "https://images.unsplash.com/photo-1587614295999-6c1c13675117?w=200&q=80" },
    { title: "Edisi 5", img: "https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?w=200&q=80" },
    { title: "Edisi 6", img: "https://images.unsplash.com/photo-1588523788762-b9e7bbd512a9?w=200&q=80" },
    { title: "Edisi 7", img: "https://images.unsplash.com/photo-1596720426673-e4e14256eb51?w=200&q=80" },
    { title: "Edisi 8", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=80" },
];

const infoPublik = [
    { title: "LHKPN", icon: "📄" },
    { title: "JDIH", icon: "⚖️" },
    { title: "PPID", icon: "🔍" },
    { title: "SIAKBM", icon: "📊" },
    { title: "KEMKES", icon: "🏥" },
    { title: "REKRUTMEN CPNS", icon: "👔" },
    { title: "PENGADUAN LHKPN", icon: "📞" },
];

const KinerjaMagazineInfo: React.FC = () => {
    return (
        <section className="bg-white py-12 w-full">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

                    {/* Kinerja Column */}
                    <div className="flex flex-col">
                        <div className="mb-6 flex flex-col">
                            <div className="flex justify-between items-center w-full">
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">Kinerja</h2>
                                <a href="#" className="text-red-600 text-[10px] font-bold tracking-wider hover:underline">LIHAT SEMUA &gt;</a>
                            </div>
                            <div className="w-12 h-1 bg-red-600 mt-2"></div>
                        </div>
                        <div className="flex flex-col gap-3">
                            {years.map((year, idx) => (
                                <a href="#" key={idx} className="block py-3 px-4 border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-red-600 text-sm font-semibold text-gray-700 transition-colors shadow-sm rounded-sm">
                                    {year}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* e-Magazine Column */}
                    <div className="flex flex-col">
                        <div className="mb-6 flex flex-col">
                            <div className="flex justify-between items-center w-full">
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">e-Magazine</h2>
                                <a href="#" className="text-red-600 text-[10px] font-bold tracking-wider hover:underline">LIHAT SEMUA &gt;</a>
                            </div>
                            <div className="w-12 h-1 bg-red-600 mt-2"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {magazines.map((mag, idx) => (
                                <a href="#" key={idx} className="group relative block aspect-[3/4] overflow-hidden rounded-sm border border-gray-200">
                                    <img src={mag.img} alt={mag.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
                                    <div className="absolute bottom-0 inset-x-0 bg-red-600 p-1 text-center translate-y-full group-hover:translate-y-0 transition-transform">
                                        <span className="text-white text-[10px] font-bold">{mag.title}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Info Publik Column */}
                    <div className="flex flex-col">
                        <div className="mb-6 flex flex-col">
                            <div className="flex justify-between items-center w-full">
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">Info Publik</h2>
                                <a href="#" className="text-red-600 text-[10px] font-bold tracking-wider hover:underline">LIHAT SEMUA &gt;</a>
                            </div>
                            <div className="w-12 h-1 bg-red-600 mt-2"></div>
                        </div>
                        <div className="flex flex-col gap-3">
                            {infoPublik.map((info, idx) => (
                                <a href="#" key={idx} className="flex items-center gap-4 py-2 px-4 border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-red-600 transition-colors shadow-sm rounded-sm relative group cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg shadow-sm">
                                        {info.icon}
                                    </div>
                                    <span className="text-sm font-bold text-gray-800 tracking-wide">{info.title}</span>
                                    <span className="ml-auto text-red-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">›</span>
                                </a>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default KinerjaMagazineInfo;
