'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchBerita, type Berita } from '../services/api/berita';

const COLORS = ['#eab308', '#dc2626', '#2563eb', '#16a34a', '#7c3aed'];

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const LatestNews: React.FC = () => {
    const [berita, setBerita] = useState<Berita[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBerita({ limit: 12, isPublished: true })
            .then((res) => setBerita(res.data))
            .finally(() => setLoading(false));
    }, []);

    const textList = berita.slice(0, 5);
    const featured = berita[5] ?? null;
    const smallGrid = berita.slice(6, 12);
    const populer = berita.slice(0, 5);

    if (loading) {
        return (
            <section className="bg-white py-10 w-full">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Berita Terbaru</h2>
                        <div className="w-12 h-1 bg-red-600 mt-2"></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="lg:col-span-3 h-64 bg-gray-100 animate-pulse rounded-sm" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (berita.length === 0) return null;

    return (
        <section className="bg-white py-10 w-full">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-6 flex flex-col">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Berita Terbaru</h2>
                    <div className="w-12 h-1 bg-red-600 mt-2"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* COL 1: Text list */}
                    <div className="lg:col-span-2 flex flex-col gap-5">
                        {textList.map((news, i) => (
                            <Link href={`/berita/${news.slug}`} key={news.id} className="group cursor-pointer">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <div className="flex-1">
                                        <h3 className="text-[13px] font-bold text-gray-800 leading-snug group-hover:text-red-600 transition-colors line-clamp-3">
                                            {news.title}
                                        </h3>
                                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold tracking-wider">
                                            {formatDate(news.publishedAt)}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* COL 2: Featured */}
                    {featured && (
                        <div className="lg:col-span-4 h-full">
                            <Link href={`/berita/${featured.slug}`} className="group block relative w-full h-full min-h-[450px] overflow-hidden rounded-sm cursor-pointer border border-gray-100 shadow-sm">
                                {featured.imageUrl ? (
                                    <img
                                        src={featured.imageUrl}
                                        alt={featured.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gray-200" />
                                )}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-5 w-full">
                                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wide rounded-sm mb-3 block w-max">
                                        {featured.category}
                                    </span>
                                    <h3 className="text-white text-2xl font-black leading-tight group-hover:underline decoration-white decoration-2 underline-offset-4">
                                        {featured.title}
                                    </h3>
                                    {featured.excerpt && (
                                        <p className="text-gray-200 text-xs mt-2 line-clamp-2 leading-relaxed font-medium">
                                            {featured.excerpt}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* COL 3: Small grid */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                        {smallGrid.map((news) => (
                            <Link href={`/berita/${news.slug}`} key={news.id} className="group cursor-pointer flex flex-col border border-gray-100 bg-gray-50/50 pb-2 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                                <div className="relative h-28 overflow-hidden rounded-t-sm">
                                    {news.imageUrl ? (
                                        <img
                                            src={news.imageUrl}
                                            alt={news.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200" />
                                    )}
                                    <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                                        {news.category}
                                    </span>
                                </div>
                                <div className="px-3 pt-3 flex-1">
                                    <h4 className="text-[13px] font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-3">
                                        {news.title}
                                    </h4>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* COL 4: Populer */}
                    <div className="lg:col-span-2 flex flex-col">
                        <div className="bg-red-600 text-white text-sm font-bold p-2 text-center uppercase tracking-widest rounded-t-md mb-4 shadow-md">
                            POPULER
                        </div>
                        <div className="flex flex-col gap-4">
                            {populer.map((news) => (
                                <Link href={`/berita/${news.slug}`} key={`populer-${news.id}`} className="group cursor-pointer border-b border-gray-100 pb-3 last:border-0">
                                    <h3 className="text-xs font-bold text-gray-800 leading-snug group-hover:text-red-600 transition-colors line-clamp-3">
                                        {news.title}
                                    </h3>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        {formatDate(news.publishedAt)}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default LatestNews;
