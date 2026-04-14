'use client';
import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { fetchBKInfo } from '../../services/api';
import type { BKInfo } from '../../services/api';
import { renderProfileCard, PageSkeleton } from './SharedComponents';

const BKContent: React.FC<{ id?: string }> = ({ id }) => {
    const [bkInfo, setBkInfo] = useState<BKInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchBKInfo(id)
            .then((data) => setBkInfo(data))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <PageSkeleton cardCount={5} cols={4} />;

    // Separate members by jabatan
    const anggotaList = bkInfo?.anggota || [];
    const ketua = anggotaList.find((a) => a.jabatan === 'Ketua');
    const wakilList = anggotaList.filter((a) => a.jabatan === 'Wakil Ketua');
    const anggotaArr = anggotaList.filter((a) => a.jabatan === 'Anggota');
    const sekretaris = anggotaList.find((a) => a.jabatan === 'Sekretaris');

    const masaJabatan = bkInfo?.masaJabatan || '2024 – 2029';
    const deskripsi = bkInfo?.deskripsi ||
        'Badan Kehormatan (BK) dibentuk untuk memantau dan mengevaluasi disiplin dan/atau kepatuhan terhadap moral, kode etik, dan/atau peraturan tata tertib DPRD dalam rangka menjaga martabat, kehormatan, citra, dan kredibilitas DPRD.';

    const hasData = anggotaList.length > 0;

    return (
        <div className="w-full flex flex-col items-center animate-fade-in">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight text-center">
                Badan Kehormatan <br className="hidden xl:block" /> Masa Jabatan {masaJabatan}
            </h1>

            {/* Description */}
            <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-16 rounded-r-xl shadow-sm w-full">
                <p className="text-gray-700 leading-relaxed font-medium text-[15px]">
                    {deskripsi}
                </p>
            </div>

            {!hasData ? (
                <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                    <User size={40} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-gray-400 font-medium">Belum ada data anggota Badan Kehormatan.</p>
                    <p className="text-gray-400 text-sm mt-1">Tambahkan melalui panel admin.</p>
                </div>
            ) : (
                <>
                    {/* Ketua */}
                    {ketua && (
                        <div className="flex justify-center w-full mb-12">
                            <div className="w-[180px] md:w-[240px]">
                                {renderProfileCard({
                                    name: ketua.name,
                                    title: ketua.jabatan,
                                    location: ketua.faction || '',
                                    imageUrl: ketua.imageUrl,
                                })}
                            </div>
                        </div>
                    )}

                    {/* Wakil Ketua */}
                    {wakilList.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 w-full mb-12">
                            {wakilList.map((person) => (
                                <div key={person.id} className="w-[180px] md:w-[220px]">
                                    {renderProfileCard({ name: person.name, title: person.jabatan, location: person.faction || '', imageUrl: person.imageUrl })}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Anggota */}
                    {anggotaArr.length > 0 && (
                        <div className="w-full border-t border-gray-100 pt-12 mb-12">
                            <h2 className="text-xl md:text-2xl font-black text-center text-gray-900 mb-8 md:mb-10">
                                Anggota Badan Kehormatan
                            </h2>
                            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 w-full">
                                {anggotaArr.map((person) => (
                                    <div key={person.id} className="w-[180px] md:w-[220px]">
                                        {renderProfileCard({ name: person.name, title: person.jabatan, location: person.faction || '', imageUrl: person.imageUrl })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sekretaris / Eks-Officio */}
                    {sekretaris && (
                        <div className="w-full border-t border-gray-100 pt-12 flex flex-col items-center mb-10">
                            <h2 className="text-xl font-bold text-center text-gray-500 mb-8 uppercase tracking-widest">
                                Eks-Officio
                            </h2>
                            <div className="w-[160px] md:w-[200px]">
                                {renderProfileCard({
                                    name: sekretaris.name,
                                    title: sekretaris.jabatan,
                                    location: sekretaris.faction || '(Bukan Anggota)',
                                    imageUrl: sekretaris.imageUrl,
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default BKContent;
