'use client';
import React, { useEffect, useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { fetchYouTubeVideos } from '../services/api';
import type { YouTubeVideo } from '../services/api';
import { socialConfig } from '../config/social';

const FokusSection: React.FC = () => {
    const [playing, setPlaying] = useState(false);
    const [mainVideo, setMainVideo] = useState<YouTubeVideo | null>(null);
    const [relatedVideos, setRelatedVideos] = useState<YouTubeVideo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchYouTubeVideos(5).then((data) => {
            if (data.items.length > 0) {
                setMainVideo(data.items[0]);
                setRelatedVideos(data.items.slice(1, 5));
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <section className="bg-zinc-950 py-12 w-full">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
                                <Play size={18} className="text-white fill-white ml-0.5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white tracking-tight">Fokus</h2>
                                <div className="w-8 h-0.5 bg-red-600 mt-1"></div>
                            </div>
                        </div>
                    </div>
                    <div className="animate-pulse space-y-4">
                        <div className="w-full bg-zinc-800 rounded-2xl aspect-video md:aspect-[16/7]"></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="w-full aspect-video bg-zinc-800 rounded-xl"></div>
                                    <div className="h-3 bg-zinc-800 rounded w-3/4"></div>
                                    <div className="h-2 bg-zinc-800 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!mainVideo) return null;

    return (
        <section className="bg-zinc-950 py-12 w-full">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
                            <Play size={18} className="text-white fill-white ml-0.5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight leading-none">Fokus</h2>
                            <div className="w-8 h-0.5 bg-red-600 mt-1.5"></div>
                        </div>
                    </div>
                    <a
                        href={socialConfig.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                        <ExternalLink size={13} />
                        <span className="hidden sm:inline">Lihat Semua</span>
                    </a>
                </div>

                {/* Main layout: stacked on mobile, side-by-side on lg */}
                <div className="flex flex-col lg:flex-row gap-4">

                    {/* Main Video */}
                    <div className="w-full lg:flex-1 relative rounded-2xl overflow-hidden bg-black border border-white/5 shadow-2xl shadow-black/50 cursor-pointer group"
                        style={{ aspectRatio: '16/9' }}
                        onClick={() => !playing && setPlaying(true)}
                    >
                        {playing ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${mainVideo.id}?autoplay=1`}
                                title={mainVideo.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full absolute inset-0"
                            />
                        ) : (
                            <>
                                <img
                                    src={mainVideo.thumbnail || `https://img.youtube.com/vi/${mainVideo.id}/maxresdefault.jpg`}
                                    alt={mainVideo.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75 group-hover:opacity-90"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                {/* Play button */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50 group-hover:scale-110 transition-transform duration-300">
                                        <Play size={28} className="text-white fill-white ml-1.5" />
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                                    <span className="inline-block bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded mb-2">
                                        Video Terbaru
                                    </span>
                                    <h3 className="text-white font-black text-base md:text-xl lg:text-2xl leading-tight line-clamp-2 drop-shadow-lg">
                                        {mainVideo.title}
                                    </h3>
                                    {mainVideo.channelTitle && (
                                        <p className="text-zinc-400 text-xs mt-1 font-medium">{mainVideo.channelTitle}</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Related Videos — horizontal scroll on mobile, vertical stack on lg */}
                    <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 lg:w-72 xl:w-80 flex-shrink-0 scrollbar-hide">
                        {relatedVideos.map((vid) => (
                            <a
                                key={vid.id}
                                href={`https://youtube.com/watch?v=${vid.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-col lg:flex-row gap-2 lg:gap-3 group cursor-pointer flex-shrink-0 w-48 sm:w-56 lg:w-auto"
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full lg:w-32 xl:w-36 aspect-video rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                                    <img
                                        src={vid.thumbnail || `https://img.youtube.com/vi/${vid.id}/mqdefault.jpg`}
                                        alt={vid.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-7 h-7 bg-red-600/90 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                            <Play size={12} className="text-white fill-white ml-0.5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex flex-col justify-center min-w-0">
                                    <p className="text-white text-xs font-semibold leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">
                                        {vid.title}
                                    </p>
                                    {vid.channelTitle && (
                                        <span className="text-zinc-500 text-[10px] mt-1 font-medium truncate">
                                            {vid.channelTitle}
                                        </span>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FokusSection;
