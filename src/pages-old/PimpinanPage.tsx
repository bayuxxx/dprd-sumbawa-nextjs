'use client';
import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { fetchPimpinan, fetchMasaJabatan, getImageUrl } from '../services/api';
import type { Pimpinan, MasaJabatan } from '../services/api';

const PimpinanPage: React.FC = () => {
    const [leaders, setLeaders] = useState<Pimpinan[]>([]);
    const [aktiveMasa, setAktiveMasa] = useState<MasaJabatan | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const masaList = await fetchMasaJabatan();
            const aktif = masaList.find(m => m.isAktif) || masaList[0] || null;
            setAktiveMasa(aktif);

            if (aktif) {
                const data = await fetchPimpinan({ masaJabatanId: aktif.id });
                setLeaders(data.sort((a, b) => a.order - b.order));
            }
            setLoading(false);
        })();
    }, []);

    return (
        <main className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-black text-primary mb-2 border-l-4 border-accent pl-3">
                Pimpinan DPRD Kabupaten Sumbawa Barat
            </h1>
            <p className="text-gray-500 text-sm mb-8 pl-4">
                {aktiveMasa ? `Periode ${aktiveMasa.periode}` : 'Periode 2024 - 2029'}
            </p>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden h-72 animate-pulse" />
                    ))}
                </div>
            ) : leaders.length === 0 ? (
                <div className="text-center py-12 text-gray-400 mb-10">
                    <User size={40} className="mx-auto mb-2 text-gray-200" />
                    <p>Belum ada data pimpinan. Tambahkan melalui panel admin.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {leaders.map((leader) => (
                        <div key={leader.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-64">
                                {leader.imageUrl ? (
                                    <img src={getImageUrl(leader.imageUrl)} alt={leader.name} className="w-full h-full object-cover object-top" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                        <User size={60} className="text-blue-300" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                    <h2 className="font-black text-lg leading-tight drop-shadow">{leader.name}</h2>
                                    <p className="text-blue-200 text-sm font-medium">{leader.position}</p>
                                </div>
                            </div>
                            {leader.bio && (
                                <div className="p-4">
                                    <p className="text-sm text-gray-600 leading-relaxed">{leader.bio}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default PimpinanPage;
