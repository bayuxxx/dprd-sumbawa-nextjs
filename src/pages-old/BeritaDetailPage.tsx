'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar, Tag, ArrowLeft, ChevronRight } from 'lucide-react';
import { fetchBeritaDetail, fetchBerita, getImageUrl, type Berita } from '../services/api';
import BeritaKomentar from '../components/BeritaKomentar';

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
            fetchBerita({ limit: 6, isPublished: true }),
        ]).then(([detail, recent]) => {
            setBerita(detail);
            setRecentNews(recent.data.filter(b => b.slug !== slug).slice(0, 5));
        }).catch(console.error).finally(() => setLoading(false));
    }, [slug]);

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    if (loading) return (
        <main className="min-h-screen bg-[#f8f8f8] py-10 md:py-16">
            <div className="max-w-[1300px] mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8">
                {/* Sidebar skeleton */}
                <aside className="hidden lg:block w-[240px] flex-shrink-0 space-y-3">
                    {Array(5).fill(0).map((_, i) => <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-xl" />)}
                </aside>
                {/* Article skeleton */}
                <div className="flex-1 bg-white rounded-2xl p-8 space-y-4">
                    <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4" />
                    <div className="h-64 bg-gray-200 animate-pulse rounded-xl" />
                    {Array(4).fill(0).map((_, i) => <div key={i} className="h-4 bg-gray-200 animate-pulse rounded" />)}
                </div>
            </div>
        </main>
    );

    if (!berita) return (
        <main className="min-h-screen bg-[#f8f8f8] py-20 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-black text-gray-900 mb-3">Berita Tidak Ditemukan</h1>
                <p className="text-gray-500 mb-6 text-sm">Artikel tidak tersedia atau telah dihapus.</p>
                <Link href="/berita" className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-colors text-sm">
                    Kembali ke Arsip
                </Link>
            </div>
        </main>
    );

    return (
        <main className="min-h-screen bg-[#f8f8f8] py-10 md:py-16">
            <div className="max-w-[1300px] mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* ── Sidebar Kiri — Berita Lainnya ── */}
                    <aside className="w-full lg:w-[220px] flex-shrink-0 lg:sticky lg:top-24">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-50">
                                <h3 className="font-black text-sm text-gray-900">Berita Lainnya</h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {recentNews.map(news => (
                                    <Link key={news.id} href={`/berita/${news.slug}`}
                                        className="flex gap-2.5 p-3 hover:bg-gray-50 transition-colors group">
                                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img
                                                src={getImageUrl(news.imageUrl) || 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=200&q=60'}
                                                alt={news.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] font-semibold text-gray-700 leading-snug line-clamp-3 group-hover:text-red-600 transition-colors">
                                                {news.title}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">{formatDate(news.publishedAt)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div className="px-4 py-3 border-t border-gray-50">
                                <Link href="/berita" className="flex items-center justify-between text-xs font-bold text-red-600 hover:text-red-700 transition-colors">
                                    Lihat Semua Berita <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* ── Artikel Utama ── */}
                    <article className="flex-1 min-w-0">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
                            <Link href="/" className="hover:text-red-600 transition-colors">Beranda</Link>
                            <ChevronRight size={12} />
                            <Link href="/berita" className="hover:text-red-600 transition-colors">Berita</Link>
                            <ChevronRight size={12} />
                            <span className="text-gray-600 truncate max-w-[200px]">{berita.title}</span>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Hero image */}
                            {berita.imageUrl && (
                                <div className="w-full aspect-[16/7] bg-gray-100 overflow-hidden">
                                    <img src={getImageUrl(berita.imageUrl)} alt={berita.title}
                                        className="w-full h-full object-cover" />
                                </div>
                            )}

                            <div className="p-6 md:p-10">
                                {/* Meta */}
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className="flex items-center gap-1 bg-red-50 text-red-600 text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                                        <Tag size={10} />{berita.category}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                                        <Calendar size={12} />{formatDate(berita.publishedAt)}
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight mb-6">
                                    {berita.title}
                                </h1>

                                {/* Excerpt */}
                                {berita.excerpt && (
                                    <p className="text-base text-gray-500 leading-relaxed mb-8 pb-8 border-b border-gray-100 font-medium italic">
                                        {berita.excerpt}
                                    </p>
                                )}

                                {/* Content */}
                                <div
                                    className="prose prose-base max-w-none text-gray-700 leading-relaxed prose-headings:font-black prose-headings:text-gray-900 prose-a:text-red-600 prose-img:rounded-xl prose-blockquote:border-red-600 prose-blockquote:bg-red-50 prose-blockquote:py-1"
                                    dangerouslySetInnerHTML={{ __html: berita.content || '' }}
                                />

                                {/* Back */}
                                <div className="mt-12 pt-6 border-t border-gray-100">
                                    <Link href="/berita"
                                        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors">
                                        <ArrowLeft size={16} /> Kembali ke Arsip Berita
                                    </Link>
                                </div>

                                {/* Komentar */}
                                <BeritaKomentar beritaId={berita.id} />
                            </div>
                        </div>
                    </article>

                </div>
            </div>
        </main>
    );
};

export default BeritaDetailPage;
