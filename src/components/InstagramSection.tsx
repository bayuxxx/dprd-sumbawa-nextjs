'use client';
import React, { useEffect, useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';
import { socialConfig } from '../config/social';
import { fetchInstagramPosts, fetchInstagramProfile } from '../services/api';
import type { InstagramPost, InstagramProfile } from '../services/api';

const igGradient = 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)';

const IgIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
);

const PostCard: React.FC<{ post: InstagramPost }> = ({ post }) => {
    const isVideo = post.isReel || post.mediaType === 'VIDEO';
    const formatDate = (ts: string) =>
        new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group aspect-square overflow-hidden rounded-xl block"
        >
            <img
                src={post.mediaUrl}
                alt={post.caption?.slice(0, 60) || 'Instagram post'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {/* Video/Reel badge */}
            {isVideo && (
                <div className="absolute top-2 right-2 z-10">
                    {post.isReel ? (
                        <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                            <Play size={8} className="fill-white" /> REELS
                        </span>
                    ) : (
                        <div className="w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Play size={10} className="fill-white text-white ml-0.5" />
                        </div>
                    )}
                </div>
            )}

            {/* Hover overlay */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-end justify-end p-2"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }}
            >
                <p className="text-white text-[9px] md:text-[10px] leading-tight line-clamp-2 text-left w-full">
                    {post.caption?.slice(0, 80)}
                </p>
                {post.timestamp && (
                    <span className="text-white/60 text-[8px] mt-1">{formatDate(post.timestamp)}</span>
                )}
            </div>
        </a>
    );
};

const InstagramSection: React.FC = () => {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [profile, setProfile] = useState<InstagramProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'semua' | 'foto' | 'reels'>('semua');

    useEffect(() => {
        Promise.all([fetchInstagramPosts(12), fetchInstagramProfile()]).then(([postsData, profileData]) => {
            setPosts(postsData.items);
            setProfile(profileData.profile);
            setLoading(false);
        });
    }, []);

    const filtered = posts.filter(p => {
        if (tab === 'foto') return !p.isReel && p.mediaType !== 'VIDEO';
        if (tab === 'reels') return p.isReel || p.mediaType === 'VIDEO';
        return true;
    });

    const hasReels = posts.some(p => p.isReel || p.mediaType === 'VIDEO');

    return (
        <section className="py-10 bg-white border-t border-gray-100">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0" style={{ background: igGradient }}>
                            <IgIcon className="w-5 h-5 fill-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-900 leading-none">Instagram</h2>
                            {profile && (
                                <p className="text-xs text-gray-400 mt-0.5 font-medium">
                                    @{profile.username}
                                    {profile.followersCount ? ` · ${profile.followersCount.toLocaleString('id-ID')} pengikut` : ''}
                                </p>
                            )}
                        </div>
                    </div>
                    <a href={socialConfig.instagram} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-pink-600 transition-colors">
                        <ExternalLink size={13} />
                        <span className="hidden sm:inline">Ikuti Kami</span>
                    </a>
                </div>

                {/* Tab filter — hanya tampil jika ada reels */}
                {!loading && hasReels && (
                    <div className="flex gap-2 mb-5">
                        {(['semua', 'foto', 'reels'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all capitalize ${tab === t ? 'text-white shadow' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                style={tab === t ? { background: igGradient } : {}}
                            >
                                {t === 'reels' && <Play size={9} className="inline mr-1 fill-current" />}
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
                        {Array(6).fill(0).map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />)}
                    </div>
                )}

                {/* Empty */}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: igGradient }}>
                            <ExternalLink size={28} className="text-white" />
                        </div>
                        <p className="font-semibold text-gray-400">Belum ada postingan tersedia</p>
                    </div>
                )}

                {/* Grid */}
                {!loading && filtered.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
                            {filtered.slice(0, 12).map(post => <PostCard key={post.id} post={post} />)}
                        </div>

                        <div className="flex justify-center mt-6">
                            <a
                                href={socialConfig.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all"
                                style={{ background: igGradient }}
                            >
                                <IgIcon className="w-4 h-4 fill-white" />
                                Ikuti @{profile?.username || 'dprdsumbawabaratkab'}
                            </a>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default InstagramSection;
