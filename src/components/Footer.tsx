'use client';
import React from 'react';
import Link from 'next/link';
// No icons used, removed lucide-react
import { socialConfig } from '../config/social';

const Footer: React.FC = () => {
    return (
        <footer className="relative">
            {/* Main footer */}
            <div className="bg-zinc-900 text-white">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

                    {/* Col 1 – Logo + About */}
                    <div className="lg:col-span-2 pr-8">
                        <div className="flex items-center gap-4 mb-5">
                            <img src="/LOGO DPRD KSB.png" alt="Logo DPRD KSB" className="w-14 h-14 object-contain drop-shadow-md" />
                            <div className="font-black text-lg leading-tight">DPRD KABUPATEN<br />SUMBAWA BARAT</div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                            Telaga Bertong, Taliwang, Kabupaten Sumbawa Barat<br />
                            Telp : (0372) 81818<br />
                            Email : setwan@sumbawabaratkab.go.id
                        </p>
                    </div>

                    {/* Col 2 – Menu Utama */}
                    <div>
                        <h3 className="font-bold text-white mb-6 text-sm">Menu Utama</h3>
                        <ul className="space-y-3 text-sm font-medium">
                            {[
                                { label: 'Beranda', href: '/' },
                                { label: 'Berita', href: '/berita' },
                                { label: 'AKD', href: '/akd/pimpinan' },
                                { label: 'Fraksi', href: '/fraksi' },
                                { label: 'Sekretariat DPRD', href: '/sekretariat' },
                                { label: 'Silegda', href: '/silegda' },
                                { label: 'PPID', href: '/ppid' },
                                { label: 'Podcast', href: '/podcast' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 – Kanal Berita */}
                    <div>
                        <h3 className="font-bold text-white mb-6 text-sm">Kanal Berita</h3>
                        <ul className="space-y-3 text-sm font-medium">
                            {[
                                { label: 'Berita Dewan', href: '/berita?kategori=Berita+Dewan' },
                                { label: 'Wakil Kita', href: '/berita?kategori=Wakil+Kita' },
                                { label: 'Galeri Dewan', href: '/berita?kategori=Galeri+Dewan' },
                                { label: 'Galeri Sekretariat Dewan', href: '/berita?kategori=Galeri+Sekretariat+Dewan' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4 – Link & Social */}
                    <div>
                        <h3 className="font-bold text-white mb-6 text-sm">Tautan</h3>
                        <ul className="space-y-3 text-sm font-medium mb-8">
                            {[
                                { label: 'e-Rencana', href: '#' },
                                { label: 'JDIH', href: 'https://jdih.sumbawabarat.go.id' },
                                { label: 'PPID', href: '/ppid' },
                                { label: 'Simpeg', href: '#' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <h3 className="font-bold text-white mb-4 text-sm mt-8">Media Sosial</h3>
                        <ul className="space-y-3 test-sm font-medium mb-8">
                            <li><a href={socialConfig.youtube} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">Youtube</a></li>
                            <li><a href={socialConfig.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">Instagram</a></li>
                            <li><a href={socialConfig.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">Facebook</a></li>
                            {/* <li><a href={socialConfig.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">Twitter</a></li> */}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Floating SOBAT logo */}
            {/* <a href="#" className="absolute bottom-6 right-6 lg:right-10 z-50 group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-20 h-20 bg-white rounded-full shadow-2xl flex items-center justify-center p-2 border-4 border-gray-100">
                    <span className="font-black text-xl italic text-gray-800">SOBAT<span className="text-red-600">?</span></span>
                </div>
            </a> */}

            {/* Bottom bar */}
            <div className="bg-zinc-950 border-t border-white/5">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-gray-600 text-xs">© {new Date().getFullYear()} DPRD Kabupaten Sumbawa Barat</p>
                    <div className="flex items-center gap-2">
                        <a href="/admin"
                            className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors border border-white/10">
                            Admin Panel
                        </a>
                        <a href="https://batanghari.iixcp.rumahweb.net:2096" target="_blank" rel="noreferrer"
                            className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors border border-white/10">
                            Webmail
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
