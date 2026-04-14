'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, ChevronDown } from 'lucide-react';

const navItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Berita', href: '/berita' },
    {
        label: 'AKD',
        href: '/akd',
        children: [
            { label: 'Pimpinan DPRD', href: '/akd/pimpinan' },
            { label: 'Badan Musyawarah', href: '/akd/bamus' },
            { label: 'Badan Pembentukan Peraturan Daerah', href: '/akd/bapemperda' },
            { label: 'Badan Anggaran', href: '/akd/banggar' },
            { label: 'Badan Kehormatan', href: '/akd/bk' },
            { label: 'Komisi', href: '/akd/komisi' },
        ],
    },
    {
        label: 'Fraksi',
        href: '/fraksi',
        children: [
            { label: 'Fraksi Gerindra', href: '/fraksi/gerindra' },
            { label: 'Fraksi Golkar', href: '/fraksi/golkar' },
            { label: 'Fraksi PKB', href: '/fraksi/pkb' },
            { label: 'Fraksi PKS', href: '/fraksi/pks' },
            { label: 'Fraksi Demokrat', href: '/fraksi/demokrat' },
            { label: 'Fraksi NasDem', href: '/fraksi/nasdem' },
        ],
    },
    { label: 'Sekretariat DPRD', href: '/sekretariat' },
    {
        label: 'Silegda',
        href: '/silegda',
        children: [
            { label: 'Propemperda 2024', href: '/silegda/2024' },
            { label: 'Propemperda 2025', href: '/silegda/2025' },
            { label: 'Propemperda 2026', href: '/silegda/2026' },
        ],
    },
    {
        label: 'PPID',
        href: '/ppid',
    },
    { label: 'Podcast', href: '/podcast' },
];

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const pathname = usePathname();
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) router.push(`/berita?q=${encodeURIComponent(q)}`);
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper to close dropdown when clicking outside or navigating
    useEffect(() => {
        setOpenDropdown(null);
        setMobileOpen(false);
    }, [pathname]);

    return (
        <header className={`sticky top-0 z-50 bg-zinc-900 transition-all duration-300 ${isScrolled ? 'shadow-xl' : ''}`}>
            <div className="px-4 lg:px-6 h-16 xl:h-20 flex items-center justify-between">

                {/* Left: Logo & Title */}
                <Link href="/" className="flex items-center gap-3 shrink-0 mr-2 xl:mr-4">
                    <div className="w-10 h-10 xl:w-12 xl:h-12 flex items-center justify-center shrink-0">
                        <img src="/LOGO DPRD KSB.png" alt="Logo DPRD KSB" className="w-full h-full object-contain drop-shadow-lg" />
                    </div>
                    <div className="text-white font-black text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg uppercase tracking-wider whitespace-nowrap">
                        DPRD KABUPATEN SUMBAWA BARAT
                    </div>
                </Link>

                {/* Middle: Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-1 justify-end mr-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                        return (
                            <div
                                key={item.label}
                                className="relative group"
                                onMouseEnter={() => setOpenDropdown(item.label)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-1 text-[11px] xl:text-[13px] font-bold px-3 py-1.5 xl:py-2 rounded transition-all whitespace-nowrap ${isActive
                                        ? 'bg-white text-black shadow-sm'
                                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {item.label}
                                </Link>

                                {/* Desktop Dropdown Menu */}
                                {item.children && openDropdown === item.label && (
                                    <div className="absolute top-full left-0 pt-5 z-50">
                                        <div className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] min-w-[260px] rounded-md border border-gray-100 relative animate-in fade-in slide-in-from-top-2 duration-200">
                                            {/* Caret/Triangle indicator */}
                                            <div className="absolute -top-[7px] left-6 w-3.5 h-3.5 bg-white border-t border-l border-gray-100 transform rotate-45 rounded-sm pointer-events-none z-0"></div>

                                            <div className="relative z-10 bg-white rounded-md py-1.5 flex flex-col">
                                                {item.children.map((child) => {
                                                    const isChildActive = pathname === child.href;
                                                    return (
                                                        <Link
                                                            key={child.label}
                                                            href={child.href}
                                                            className={`block px-5 py-3 text-[13px] font-bold transition-all border-l-4 ${isChildActive
                                                                ? 'bg-gray-100 text-gray-900 border-red-600'
                                                                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-red-400'
                                                                }`}
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Right: Search */}
                <div className="hidden md:flex items-center shrink-0">
                    <form onSubmit={handleSearch} className="relative group">
                        <input
                            type="text"
                            placeholder="Cari Artikel Berita"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-48 xl:w-56 pl-5 pr-12 py-2 rounded-full text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 placeholder-gray-400 font-medium shadow-inner transition-all"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black transition-colors focus:outline-none">
                            <Search size={18} strokeWidth={2.5} />
                        </button>
                    </form>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden flex items-center ml-4">
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-2 focus:outline-none">
                        {mobileOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <div className={`lg:hidden bg-zinc-900 border-t border-white/10 overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}>
                {/* Mobile Search */}
                <div className="p-4 border-b border-white/5 md:hidden">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Cari Artikel Berita"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-5 pr-12 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 placeholder-gray-400 font-medium"
                        />
                        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 focus:outline-none">
                            <Search size={18} strokeWidth={2.5} />
                        </button>
                    </form>
                </div>

                {/* Nav Items */}
                <div className="overflow-y-auto max-h-[calc(80vh-73px)] pb-4">
                    {navItems.map((item) => (
                        <div key={item.label}>
                            <div className="flex items-center justify-between border-b border-white/5">
                                <Link
                                    href={item.href}
                                    className="flex-1 text-white py-3.5 px-5 text-sm font-bold hover:bg-white/5 transition-colors"
                                >
                                    {item.label}
                                </Link>
                                {item.children && (
                                    <button
                                        className="px-5 py-3.5 text-white/50 hover:text-white"
                                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                                    >
                                        <ChevronDown size={20} className={`transition-transform duration-300 ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                                    </button>
                                )}
                            </div>
                            {/* Mobile Dropdown */}
                            <div className={`bg-black overflow-hidden transition-all duration-300 ${openDropdown === item.label ? 'max-h-[800px]' : 'max-h-0'}`}>
                                {item.children?.map((child) => (
                                    <Link
                                        key={child.label}
                                        href={child.href}
                                        className="block text-gray-300 py-3 pl-9 text-sm border-b border-white/5 hover:bg-white/5 hover:text-white font-medium transition-colors"
                                    >
                                        {child.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Header;
