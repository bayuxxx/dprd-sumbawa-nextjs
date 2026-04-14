'use client';
import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import LatestNews from '../components/LatestNews';
import VideoNews from '../components/VideoNews';
import FokusSection from '../components/FokusSection';
import KinerjaMagazineInfo from '../components/KinerjaMagazineInfo';
import AgendaForumTautan from '../components/AgendaForumTautan';
import InstagramSection from '../components/InstagramSection';

const HomePage: React.FC = () => {
    return (
        <main className="bg-[#fcfcfc] min-h-screen">
            {/* 1. Hero banner / carousel */}
            <HeroCarousel />

            {/* 2. Berita Terbaru – 4 column complex layout */}
            <LatestNews />

            {/* 3. Berita Video – YouTube grid */}
            <VideoNews />

            {/* 4. Fokus – large featured YouTube video with 3 small under */}
            <FokusSection />

            {/* 5. Kinerja / e-Magazine / Info Publik */}
            <KinerjaMagazineInfo />

            {/* 6. Agenda / Forum Warga / Tautan */}
            <AgendaForumTautan />

            {/* 7. Instagram Feed */}
            <InstagramSection />
        </main>
    );
};

export default HomePage;

