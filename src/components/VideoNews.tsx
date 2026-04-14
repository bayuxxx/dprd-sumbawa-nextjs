'use client';
import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { fetchYouTubeVideos } from '../services/api';
import type { YouTubeVideo } from '../services/api';
import { socialConfig } from '../config/social';

function formatViewCount(count: string | undefined): string {
    if (!count) return '';
    const num = parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}jt tayangan`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}rb tayangan`;
    return `${num} tayangan`;
}

function timeAgo(dateString: string): string {
    const now = new Date();
    const published = new Date(dateString);
    const diffMs = now.getTime() - published.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return '1 hari yang lalu';
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan yang lalu`;
    return `${Math.floor(diffDays / 365)} tahun yang lalu`;
}

const VideoNews: React.FC = () => {
    const [videos, setVideos] = useState<YouTubeVideo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchYouTubeVideos(3).then((data) => {
            setVideos(data.items);
            setLoading(false);
        });
    }, []);

    return (
        <section className="bg-white py-10 w-full relative">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-600 text-white p-1.5 rounded-lg">
                                <Play size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Berita Video</h2>
                        </div>
                        <div className="w-12 h-1 bg-red-600 mt-2"></div>
                    </div>
                    <a
                        href={socialConfig.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="text-red-600 text-[13px] font-bold tracking-wider hover:underline flex items-center gap-1"
                    >
                        <Play size={14} />
                        LIHAT SEMUA &gt;
                    </a>
                </div>

                {/* Loading Skeleton */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-video bg-gray-200 rounded-lg"></div>
                                <div className="p-3 space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Video Grid */}
                {!loading && videos.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <Play size={48} className="mx-auto mb-3 opacity-40" />
                        <p className="font-medium">Belum ada video tersedia</p>
                    </div>
                )}

                {!loading && videos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {videos.map((video) => (
                            <a
                                key={video.id}
                                href={`https://youtube.com/watch?v=${video.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="group block relative border border-gray-100 rounded-lg overflow-hidden bg-gray-50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={video.thumbnail || `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                                        }}
                                        alt={video.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Title overlay inside video */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent opacity-90 p-3 pt-4">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/90 text-center flex items-center justify-center font-bold text-[10px] shrink-0 text-red-600">
                                                DPRD
                                            </div>
                                            <h3 className="text-white text-[13px] font-semibold leading-snug line-clamp-2 drop-shadow-md">
                                                {video.title}
                                            </h3>
                                        </div>
                                    </div>
                                    {/* Center Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-14 h-14 bg-red-600/90 backdrop-blur-sm rounded-2xl flex items-center justify-center drop-shadow-lg group-hover:bg-red-500 group-hover:scale-110 transition-all duration-300">
                                            <Play className="text-white fill-white ml-1 w-6 h-6" />
                                        </div>
                                    </div>
                                    {/* Duration-like overlay */}
                                    {video.viewCount && (
                                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                                            {formatViewCount(video.viewCount)}
                                        </div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <p className="text-xs text-gray-600 font-semibold">{video.channelTitle}</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                        {video.viewCount ? `${formatViewCount(video.viewCount)} • ` : ''}
                                        {timeAgo(video.publishedAt)}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                )}

                {/* Subscribe CTA */}
                {!loading && videos.length > 0 && (
                    <div className="flex justify-center mt-8">
                        <a
                            href={socialConfig.youtube}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 bg-red-600 text-white font-bold px-8 py-2.5 rounded-full text-sm transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25 active:scale-95"
                        >
                            <Play size={18} />
                            Subscribe {socialConfig.youtubeChannelName}
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
};

export default VideoNews;
