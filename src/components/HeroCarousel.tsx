'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchBanners } from '../services/api';
import type { Banner } from '../services/api';

const fallbackSlides: Banner[] = [
    {
        id: '1',
        title: "Rapat Paripurna DPRD Kabupaten Sumbawa Barat",
        subtitle: "Pembahasan RAPBD Tahun Anggaran 2025 bersama jajaran Eksekutif untuk kemajuan daerah.",
        category: "Berita Dewan",
        imageUrl: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1920&q=80",
        linkUrl: null,
        isActive: true,
        order: 0,
        createdAt: '',
    },
    {
        id: '2',
        title: "Kunjungan Kerja Komisi III ke Daerah Pemilihan",
        subtitle: "Menampung Aspirasi Masyarakat Sumbawa Barat terkait pembangunan infrastruktur dan kesejahteraan.",
        category: "Wakil Kita",
        imageUrl: "https://images.unsplash.com/photo-1591522810850-58128c5fb3db?w=1920&q=80",
        linkUrl: null,
        isActive: true,
        order: 1,
        createdAt: '',
    },
];

const HeroCarousel: React.FC = () => {
    const [slides, setSlides] = useState<Banner[]>(fallbackSlides);
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        let mounted = true;
        fetchBanners(true).then((data) => {
            if (mounted && data.length > 0) {
                setSlides([...data].sort((a, b) => (a.order || 0) - (b.order || 0)));
            }
        }).catch(() => {});
        return () => { mounted = false; };
    }, []);

    const goTo = useCallback((index: number) => {
        if (isAnimating || index === current) return;
        setIsAnimating(true);
        setCurrent(index);
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating, current]);

    const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length]);
    const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo, slides.length]);

    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(next, 6000);
        return () => clearInterval(timer);
    }, [next, isHovered]);

    if (slides.length === 0) return null;

    return (
        <div
            className="relative w-full overflow-hidden group bg-[#0a2744] aspect-[4/3] sm:aspect-[16/7] md:aspect-[16/5]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id || index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    {/* Clickable overlay */}
                    {slide.linkUrl && (
                        <a
                            href={slide.linkUrl}
                            className="absolute inset-0 z-20"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span className="sr-only">{slide.title}</span>
                        </a>
                    )}

                    {/* Image with Ken Burns */}
                    <div
                        className={`absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear ${index === current ? 'scale-105' : 'scale-100'}`}
                        style={{ backgroundImage: `url('${slide.imageUrl}')` }}
                    />
                </div>
            ))}

            {/* Prev arrow */}
            <button
                onClick={prev}
                className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-40 w-8 h-8 md:w-10 md:h-10 bg-black/30 hover:bg-white text-white hover:text-[#0a2744] backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20 cursor-pointer"
                aria-label="Previous slide"
            >
                <ChevronLeft size={18} />
            </button>

            {/* Next arrow */}
            <button
                onClick={next}
                className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-40 w-8 h-8 md:w-10 md:h-10 bg-black/30 hover:bg-white text-white hover:text-[#0a2744] backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20 cursor-pointer"
                aria-label="Next slide"
            >
                <ChevronRight size={18} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`rounded-full transition-all duration-400 cursor-pointer ${i === current
                            ? 'w-6 md:w-8 h-2 bg-white shadow-md'
                            : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
