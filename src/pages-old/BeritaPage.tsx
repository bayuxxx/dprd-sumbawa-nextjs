'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronRight, ArrowRight, Search } from 'lucide-react';
import { fetchBerita, getImageUrl } from '../services/api';
import type { Berita } from '../services/api';

const BeritaPage: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryParam = searchParams.get('q') ?? '';
    const kategoriParam = searchParams.get('kategori') ?? '';

    const [beritaList, setBeritaList] = useState<Berita[]>([]);
    const [total, setTotal] = useState(0);
    const [latestNews, setLatestNews] = useState<Berita[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(queryParam);
    const limit = 8;

    // Reset page when query/kategori changes
    useEffect(() => {
        setPage(1);
        setSearchInput(queryParam);
    }, [queryParam, kategoriParam]);

    useEffect(() => {
        setLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        Promise.all([
            fetchBerita({
                limit, page, isPublished: true,
                ...(queryParam ? { search: queryParam } : {}),
                ...(kategoriParam ? { category: kategoriParam } : {}),
            }),
            fetchBerita({ limit: 6, page: 1, isPublished: true }),
        ]).then(([mainRes, latestRes]) => {
            setBeritaList(mainRes.data);
            setTotal(mainRes.total);
            setLatestNews(latestRes.data);
        }).finally(() => setLoading(false));
    }, [page, queryParam, kategoriParam]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const q = searchInput.trim();
        if (q) router.push(`/berita?q=${encodeURIComponent(q)}`);
        else router.push('/berita');
    };

    const totalPages = Math.ceil(total / Math.max(limit, 1));

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    return (
        <main className="min-h-screen bg-[#fcfcfc] py-12 md:py-20">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

                    {/* LEFT SIDEBAR */}
                    <aside className="w-full lg:w-[350px] flex-shrink-0 lg:sticky lg:top-28">
                        {/* Decorative Image */}
                        <div className="relative mb-10 lg:mb-14 w-full aspect-[4/3] max-w-[320px] mx-auto lg:mx-0 group cursor-pointer">
                            <div className="absolute inset-0 bg-red-500 rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500 z-0"></div>
                            <div className="absolute inset-0 bg-red-600 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500 z-0 opacity-80"></div>
                            <div className="absolute inset-2 bg-white rounded-2xl z-10 overflow-hidden shadow-lg shadow-black/10">
                                <img
                                    src="/Gedung-DPRD-Sumbawa-Barat.jpg"
                                    alt="Sidebar Dekorasi"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888045653-f7267eb4bd48?auto=format&fit=crop&q=80&w=600';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Latest News */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-black text-xl text-gray-900 mb-2 tracking-tight">
                                Update Berita Terakhir
                            </h3>
                            <div className="w-12 h-1 bg-red-600 mb-6"></div>

                            <div className="flex flex-col">
                                {loading && latestNews.length === 0
                                    ? Array(5).fill(0).map((_, i) => (
                                        <div key={i} className="py-4 border-b border-gray-50">
                                            <div className="h-4 bg-gray-100 animate-pulse rounded w-full mb-2" />
                                            <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
                                        </div>
                                    ))
                                    : latestNews.map((news) => (
                                        <Link
                                            href={`/berita/${news.slug}`}
                                            key={news.id}
                                            className="group py-4 border-b border-gray-100 last:border-0 flex gap-3 items-start"
                                        >
                                            <div className="flex-1">
                                                <h4 className="text-sm font-semibold text-gray-700 leading-snug group-hover:text-red-600 transition-colors">
                                                    {news.title}
                                                </h4>
                                                <p className="text-[11px] text-gray-400 mt-1.5 uppercase tracking-wider font-medium">
                                                    {formatDate(news.publishedAt)}
                                                </p>
                                            </div>
                                            <ChevronRight size={16} className="text-gray-300 mt-0.5 group-hover:text-red-600 group-hover:translate-x-1 transition-all shrink-0" />
                                        </Link>
                                    ))
                                }
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT CONTENT: Arsip Berita */}
                    <section className="flex-1 w-full">
                        <div className="mb-10 flex flex-col">
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                                {queryParam ? `Hasil: "${queryParam}"` : kategoriParam ? kategoriParam : 'Arsip Berita'}
                            </h1>
                            <div className="w-20 h-1.5 bg-red-600 mt-4 rounded-full"></div>
                            {kategoriParam && (
                                <button
                                    onClick={() => router.push('/berita')}
                                    className="mt-3 text-xs font-bold text-gray-400 hover:text-red-600 transition-colors w-fit"
                                >
                                    ← Semua Berita
                                </button>
                            )}
                        </div>

                        {/* Search bar inline */}
                        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                            <div className="relative flex-1 max-w-md">
                                <input
                                    type="text"
                                    placeholder="Cari berita..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-full pl-5 pr-12 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white text-gray-900 placeholder-gray-400 font-medium"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors">
                                    <Search size={18} strokeWidth={2.5} />
                                </button>
                            </div>
                            {queryParam && (
                                <button
                                    type="button"
                                    onClick={() => { setSearchInput(''); router.push('/berita'); }}
                                    className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-red-600 border border-gray-200 rounded-full transition-colors"
                                >
                                    Reset
                                </button>
                            )}
                        </form>

                        {loading && beritaList.length === 0 ? (
                            <div className="flex flex-col gap-6">
                                {Array(4).fill(0).map((_, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl border border-gray-50 bg-white">
                                        <div className="w-full sm:w-48 aspect-video sm:aspect-square bg-gray-100 animate-pulse rounded-lg flex-shrink-0" />
                                        <div className="flex-1 space-y-4 py-2">
                                            <div className="h-6 bg-gray-100 animate-pulse rounded-md w-3/4" />
                                            <div className="h-4 bg-gray-100 animate-pulse rounded-md w-1/4" />
                                            <div className="space-y-2">
                                                <div className="h-3 bg-gray-100 animate-pulse rounded w-full" />
                                                <div className="h-3 bg-gray-100 animate-pulse rounded w-4/5" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : beritaList.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-xl font-bold text-gray-400">Belum ada berita dipublikasikan.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {beritaList.map((news) => (
                                    <div key={news.id} className="group flex flex-col sm:flex-row gap-6 p-4 rounded-xl border border-transparent hover:border-gray-100 hover:shadow-lg bg-white transition-all duration-300 items-start">

                                        {/* Image */}
                                        <div className="w-full sm:w-48 flex-shrink-0 overflow-hidden rounded-lg aspect-video sm:aspect-square shadow-sm">
                                            <img
                                                src={getImageUrl(news.imageUrl) || 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80'}
                                                alt={news.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col py-1">
                                            <Link href={`/berita/${news.slug}`}>
                                                <h2 className="text-lg md:text-xl font-bold text-gray-900 leading-snug mb-2 group-hover:text-red-600 transition-colors">
                                                    {news.title}
                                                </h2>
                                            </Link>
                                            <p className="text-xs text-gray-400 mb-3 font-semibold tracking-wide uppercase">
                                                {formatDate(news.publishedAt)}
                                            </p>
                                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 md:line-clamp-3 mb-4">
                                                {news.excerpt}
                                            </p>

                                            <div className="mt-auto">
                                                <Link
                                                    href={`/berita/${news.slug}`}
                                                    className="inline-flex items-center gap-1.5 text-red-600 font-bold text-sm group-hover:underline tracking-wide"
                                                >
                                                    Baca Berita <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination Component */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex items-center justify-start gap-2 border-t border-gray-200 pt-8">
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${p === page
                                            ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-red-600 hover:text-red-600'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}

                                {totalPages > 5 && <span className="mx-2 text-gray-400 tracking-widest font-bold">...</span>}

                                {totalPages > 5 && (
                                    <button
                                        onClick={() => setPage(totalPages)}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${page === totalPages
                                            ? 'bg-red-600 text-white shadow-md'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-red-600 hover:text-red-600'
                                            }`}
                                    >
                                        {totalPages}
                                    </button>
                                )}

                                {page < totalPages && (
                                    <button
                                        onClick={() => setPage(p => p + 1)}
                                        className="ml-4 flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        Next <ChevronRight size={16} />
                                    </button>
                                )}
                            </div>
                        )}

                    </section>
                </div>
            </div>
        </main>
    );
};

export default BeritaPage;
