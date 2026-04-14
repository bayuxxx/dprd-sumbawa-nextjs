'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar } from 'lucide-react';
import { fetchBeritaDetail, fetchBerita, getImageUrl, type Berita } from '../services/api';

const BeritaDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [berita, setBerita] = useState<Berita | null>(null);
    const [recentNews, setRecentNews] = useState<Berita[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        setLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        Promise.all([
            fetchBeritaDetail(slug),
            fetchBerita({ limit: 5, isPublished: true })
        ]).then(([detailRes, recentRes]) => {
            setBerita(detailRes);
            setRecentNews(recentRes.data.filter(b => b.slug !== slug).slice(0, 4));
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setLoading(false);
        });
    }, [slug]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#fcfcfc] py-12 md:py-20">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <div className="h-10 bg-gray-200 animate-pulse rounded w-3/4 mb-4" />
                    <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4 mb-10" />
                    <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-2xl mb-10" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-full mb-3" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-full mb-3" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-4/5" />
                </div>
            </main>
        );
    }

    if (!berita) {
        return (
            <main className="min-h-screen bg-[#fcfcfc] py-20 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-black text-gray-900 mb-4">Berita Tidak Ditemukan</h1>
                    <p className="text-gray-500 mb-8">Maaf, artikel yang Anda cari tidak tersedia atau telah dihapus.</p>
                    <Link href="/berita" className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
                        Kembali ke Arsip Berita
                    </Link>
                </div>
            </main>
        );
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    return (
        <main className="min-h-screen bg-[#fcfcfc] py-12 md:py-20">
            <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

                    {/* Main Article Content */}
                    <article className="flex-1 w-full bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm">

                        <div className="mb-8">
                            <span className="inline-block bg-red-100 text-red-600 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-md mb-4">
                                {berita.category}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                                {berita.title}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                <Calendar size={16} />
                                <span>{formatDate(berita.publishedAt)}</span>
                            </div>
                        </div>

                        {/* Article Image */}
                        {berita.imageUrl && (
                            <div className="w-full aspect-[16/9] bg-gray-100 rounded-2xl overflow-hidden mb-10 shadow-md">
                                <img
                                    src={getImageUrl(berita.imageUrl)}
                                    alt={berita.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Article Body */}
                        <div
                            className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-medium prose-p:mb-5 prose-headings:font-black prose-headings:text-gray-900 prose-a:text-red-600 hover:prose-a:text-red-700"
                            dangerouslySetInnerHTML={{ __html: berita.content || berita.excerpt || '' }}
                        />

                        {/* Back button */}
                        <div className="mt-16 pt-8 border-t border-gray-100">
                            <Link href="/berita" className="inline-flex items-center gap-2 text-gray-600 font-bold hover:text-red-600 transition-colors">
                                <span className="text-xl leading-none rotate-180 mb-0.5">➔</span> Kembali ke Arsip
                            </Link>
                        </div>
                    </article>

                    {/* Sidebar Recent News */}
                    <aside className="w-full lg:w-[350px] flex-shrink-0 lg:sticky lg:top-28">
                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-black text-xl text-gray-900 mb-2 tracking-tight">Kabar Lainnya</h3>
                            <div className="w-12 h-1 bg-red-600 mb-8 rounded-full"></div>

                            <div className="flex flex-col gap-6">
                                {recentNews.map(news => (
                                    <Link href={`/berita/${news.slug}`} key={news.id} className="group flex flex-col gap-3">
                                        <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
                                            <img
                                                src={getImageUrl(news.imageUrl) || 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&q=80'}
                                                alt={news.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-[15px] font-bold text-gray-800 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                                                {news.title}
                                            </h4>
                                            <p className="text-[11px] text-gray-400 mt-2 uppercase tracking-wide font-medium">
                                                {formatDate(news.publishedAt)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </main>
    );
};

export default BeritaDetailPage;
