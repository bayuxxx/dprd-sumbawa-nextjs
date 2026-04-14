'use client';
import React, { useState, useEffect } from 'react';
import { ChevronRight, Mic, Play, ExternalLink } from 'lucide-react';
import { fetchPodcasts } from '../services/api/podcast';
import type { Podcast } from '../services/api/podcast';
import { getImageUrl as getImg } from '../services/api/config';

const LIMIT = 9;

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=600';

// ── Skeleton card ──────────────────────────────────────────────────────────────
const SkeletonCard: React.FC = () => (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="aspect-video bg-gray-100 animate-pulse" />
        <div className="p-5 space-y-3">
            <div className="h-5 bg-gray-100 animate-pulse rounded w-3/4" />
            <div className="h-4 bg-gray-100 animate-pulse rounded w-full" />
            <div className="h-4 bg-gray-100 animate-pulse rounded w-2/3" />
            <div className="flex gap-4 pt-2">
                <div className="h-3 bg-gray-100 animate-pulse rounded w-1/3" />
                <div className="h-3 bg-gray-100 animate-pulse rounded w-1/3" />
            </div>
        </div>
    </div>
);

// ── Episode card ───────────────────────────────────────────────────────────────
const PodcastCard: React.FC<{ podcast: Podcast }> = ({ podcast }) => {
    const [expanded, setExpanded] = useState(false);
    const imgSrc = getImg(podcast.thumbnailUrl) || PLACEHOLDER_IMG;

    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-transparent hover:border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col">
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                    src={imgSrc}
                    alt={podcast.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG;
                    }}
                />
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Play size={22} className="text-red-600 ml-1" fill="currentColor" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <h2 className="text-base font-bold text-gray-900 leading-snug mb-1 group-hover:text-red-600 transition-colors line-clamp-2">
                    {podcast.judul}
                </h2>

                {podcast.subjudul && (
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
                        {podcast.subjudul}
                    </p>
                )}

                {/* Host & Narasumber */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-auto mb-4">
                    {podcast.host && (
                        <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                            <Mic size={12} className="text-red-500" />
                            Host: <span className="text-gray-700">{podcast.host}</span>
                        </span>
                    )}
                    {podcast.narasumber && (
                        <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                            <Mic size={12} className="text-gray-400" />
                            Narasumber: <span className="text-gray-700">{podcast.narasumber}</span>
                        </span>
                    )}
                </div>

                {/* Audio / Link controls */}
                {(podcast.audioUrl || podcast.link) && (
                    <div className="border-t border-gray-100 pt-4">
                        {!expanded ? (
                            <button
                                onClick={() => setExpanded(true)}
                                className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:underline"
                            >
                                <Play size={14} fill="currentColor" /> Dengarkan Episode
                            </button>
                        ) : (
                            <div className="space-y-3">
                                {podcast.audioUrl && (
                                    <audio
                                        controls
                                        src={getImg(podcast.audioUrl)}
                                        className="w-full h-10 rounded-lg"
                                    />
                                )}
                                {podcast.link && (
                                    <a
                                        href={podcast.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:underline"
                                    >
                                        <ExternalLink size={14} /> Buka Link Episode
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Main page ──────────────────────────────────────────────────────────────────
const PodcastPage: React.FC = () => {
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchPodcasts({ limit: LIMIT, page })
            .then((res) => {
                setPodcasts(res.data);
                setTotal(res.total);
            })
            .finally(() => setLoading(false));
    }, [page]);

    const totalPages = Math.ceil(total / Math.max(LIMIT, 1));

    return (
        <main className="min-h-screen bg-[#fcfcfc] py-12 md:py-20">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* Page header */}
                <div className="mb-10 flex flex-col">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                        Podcast DPRD
                    </h1>
                    <div className="w-20 h-1.5 bg-red-600 mt-4 rounded-full" />
                    <p className="mt-4 text-gray-500 text-sm max-w-xl">
                        Dengarkan episode podcast terbaru dari DPRD Sumbawa Barat — diskusi, wawancara, dan informasi legislatif.
                    </p>
                </div>

                {/* Skeleton loading */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array(LIMIT).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                    </div>

                /* Empty state */
                ) : podcasts.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mic size={28} className="text-red-400" />
                        </div>
                        <p className="text-xl font-bold text-gray-400">Belum ada episode podcast.</p>
                    </div>

                /* Episode grid */
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {podcasts.map((p) => <PodcastCard key={p.id} podcast={p} />)}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-start gap-2 border-t border-gray-200 pt-8">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                                    p === page
                                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-red-600 hover:text-red-600'
                                }`}
                            >
                                {p}
                            </button>
                        ))}

                        {totalPages > 5 && (
                            <span className="mx-2 text-gray-400 tracking-widest font-bold">...</span>
                        )}

                        {totalPages > 5 && (
                            <button
                                onClick={() => setPage(totalPages)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                                    page === totalPages
                                        ? 'bg-red-600 text-white shadow-md'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-red-600 hover:text-red-600'
                                }`}
                            >
                                {totalPages}
                            </button>
                        )}

                        {page < totalPages && (
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                className="ml-4 flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-red-600 transition-colors"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};

export default PodcastPage;
