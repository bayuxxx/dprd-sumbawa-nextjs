'use client';
import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { fetchKomisiInfo } from '../../services/api';
import type { KomisiInfo } from '../../services/api';
import { renderProfileCard, GridSkeleton, PageSkeleton } from './SharedComponents';

const KomisiContent: React.FC<{ id?: string }> = ({ id }) => {
    const [info, setInfo] = useState<KomisiInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchKomisiInfo(id)
            .then(data => setInfo(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <PageSkeleton cardCount={5} cols={4} />;

    if (!info) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center py-24">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500 font-medium">Data Komisi belum tersedia.</p>
            </div>
        );
    }

    const koordinator = info.anggota.find(a => a.jabatan.toLowerCase() === 'koordinator');
    const ketua       = info.anggota.find(a => a.jabatan.toLowerCase() === 'ketua');
    const wakilList   = info.anggota.filter(a => a.jabatan.toLowerCase().includes('wakil ketua'));
    const sekretaris  = info.anggota.find(a => a.jabatan.toLowerCase() === 'sekretaris');
    const anggotaArr  = info.anggota.filter(a =>
        a.jabatan.toLowerCase() === 'anggota'
    );

    // Baris tengah: ketua + wakil + sekretaris sejajar
    const barisKetua = [
        ...(ketua ? [ketua] : []),
        ...wakilList,
        ...(sekretaris ? [sekretaris] : []),
    ];

    return (
        <div className="w-full flex flex-col items-center animate-fade-in">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight text-center">
                {info.namaKomisi} <br className="hidden xl:block" /> Masa Jabatan {info.masaJabatan}
            </h1>

            {/* Description */}
            {info.deskripsi && (
                <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-16 rounded-r-xl shadow-sm w-full">
                    <p className="text-gray-700 leading-relaxed font-medium text-[15px]">{info.deskripsi}</p>
                </div>
            )}

            {info.anggota.length === 0 ? (
                <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                    <User size={40} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-gray-400 font-medium">Belum ada data anggota Komisi.</p>
                </div>
            ) : (
                <>
                    {/* Koordinator — tengah */}
                    {koordinator && (
                        <div className="flex justify-center w-full mb-12">
                            <div className="w-[180px] md:w-[240px]">
                                {renderProfileCard({
                                    name: koordinator.name,
                                    title: koordinator.jabatan,
                                    location: koordinator.faction || '',
                                    imageUrl: koordinator.imageUrl,
                                })}
                            </div>
                        </div>
                    )}

                    {/* Ketua + Wakil Ketua + Sekretaris sejajar — center */}
                    {barisKetua.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 w-full mb-12">
                            {barisKetua.map((person) => (
                                <div key={person.id} className="w-[180px] md:w-[220px]">
                                    {renderProfileCard({
                                        name: person.name,
                                        title: person.jabatan,
                                        location: person.faction || '',
                                        imageUrl: person.imageUrl,
                                    })}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Anggota */}
                    {anggotaArr.length > 0 && (
                        <div className="w-full border-t border-gray-100 pt-12">
                            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 w-full">
                                {anggotaArr.map((person) => (
                                    <div key={person.id} className="w-[180px] md:w-[220px]">
                                        {renderProfileCard({
                                            name: person.name,
                                            title: person.jabatan,
                                            location: person.faction || '',
                                            imageUrl: person.imageUrl,
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default KomisiContent;
