'use client';
import React from 'react';
import { Image, FileImage, Newspaper, Users, Info, CheckCircle, AlertCircle } from 'lucide-react';

type InfoCardProps = {
    icon: React.ReactNode;
    title: string;
    color: string;
    children: React.ReactNode;
};

const InfoCard = ({ icon, title, color, children }: InfoCardProps) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className={`${color} px-6 py-4 flex items-center gap-3`}>
            <div className="text-white">{icon}</div>
            <h2 className="text-white font-bold text-base">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

const Row = ({ label, value, note }: { label: string; value: string; note?: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-gray-50 last:border-0">
        <span className="text-sm font-semibold text-gray-500 sm:w-44 flex-shrink-0">{label}</span>
        <div className="flex-1">
            <span className="text-sm font-bold text-gray-900 font-mono bg-gray-50 px-2 py-0.5 rounded">{value}</span>
            {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
        </div>
    </div>
);

const Tip = ({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) => (
    <div className={`flex gap-2 p-3 rounded-lg text-sm mt-4 ${type === 'info' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
        {type === 'info'
            ? <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
            : <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
        }
        <span>{children}</span>
    </div>
);

export default function PanduanPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0a2744] to-[#1a4a7a] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <Info size={22} />
                    <h1 className="text-xl font-black">Panduan Ukuran & Upload Konten</h1>
                </div>
                <p className="text-blue-200 text-sm">
                    Referensi ukuran gambar dan komposisi upload agar tampilan website optimal di semua perangkat.
                </p>
            </div>

            {/* Banner Hero */}
            <InfoCard icon={<Image size={20} />} title="Banner Hero (Halaman Utama)" color="bg-[#0a2744]">
                <Row label="Rasio Aspek" value="16:5" note="Tampilan desktop — lebar penuh, tinggi relatif pendek" />
                <Row label="Resolusi Ideal" value="1920 × 600 px" note="Minimum 1280 × 400 px agar tidak pecah" />
                <Row label="Rasio Mobile" value="4:3" note="Di layar kecil otomatis berubah ke rasio 4:3" />
                <Row label="Format File" value="JPG / JPEG" note="Gunakan JPG untuk foto, hindari PNG besar" />
                <Row label="Ukuran File" value="Maks. 2 MB" note="Kompres dulu di tinypng.com atau squoosh.app" />
                <Row label="Fokus Gambar" value="Tengah horizontal" note="Bagian atas/bawah bisa terpotong di mobile" />
                <Tip type="info">
                    Gunakan foto landscape (horizontal) dengan subjek utama di tengah. Hindari teks penting di tepi gambar karena bisa terpotong.
                </Tip>
                <Tip type="warning">
                    Gambar terlalu kecil (di bawah 1280px lebar) akan terlihat buram/pecah di layar besar.
                </Tip>
            </InfoCard>

            {/* Foto AKD */}
            <InfoCard icon={<Users size={20} />} title="Foto Anggota AKD (Pimpinan, Komisi, Bamus, dll.)" color="bg-indigo-600">
                <Row label="Rasio Aspek" value="3:4" note="Portrait / tegak — seperti foto KTP atau pas foto" />
                <Row label="Resolusi Ideal" value="600 × 800 px" note="Minimum 300 × 400 px" />
                <Row label="Format File" value="JPG / JPEG" note="PNG juga bisa tapi ukuran file lebih besar" />
                <Row label="Ukuran File" value="Maks. 1 MB" note="Kompres jika lebih besar" />
                <Row label="Posisi Wajah" value="Atas (object-top)" note="Sistem otomatis crop dari atas, pastikan wajah di bagian atas foto" />
                <Row label="Latar Belakang" value="Polos / formal" note="Disarankan latar merah, biru, atau putih sesuai seragam dinas" />
                <Tip type="info">
                    Foto akan ditampilkan dalam card portrait 3:4. Pastikan wajah berada di 1/3 bagian atas foto agar tidak terpotong.
                </Tip>
                <Tip type="warning">
                    Foto landscape (horizontal) tidak cocok — wajah akan terpotong karena card berbentuk portrait.
                </Tip>
            </InfoCard>

            {/* Thumbnail Berita */}
            <InfoCard icon={<Newspaper size={20} />} title="Thumbnail Berita" color="bg-red-600">
                <Row label="Rasio Aspek" value="16:9" note="Landscape — tampilan di list berita desktop" />
                <Row label="Rasio Mobile" value="1:1 (square)" note="Di layar kecil card berubah ke rasio kotak" />
                <Row label="Resolusi Ideal" value="1200 × 675 px" note="Minimum 800 × 450 px" />
                <Row label="Format File" value="JPG / JPEG" note="Hindari PNG untuk foto berita" />
                <Row label="Ukuran File" value="Maks. 1.5 MB" note="Kompres sebelum upload" />
                <Row label="Fokus Gambar" value="Tengah" note="Bagian tepi bisa terpotong di tampilan mobile (square)" />
                <Tip type="info">
                    Thumbnail ditampilkan 16:9 di desktop dan 1:1 di mobile. Pastikan subjek utama berada di tengah gambar.
                </Tip>
            </InfoCard>

            {/* Komposisi Upload Berita */}
            <InfoCard icon={<FileImage size={20} />} title="Komposisi Upload Berita" color="bg-emerald-600">
                <Row label="Judul" value="Maks. 150 karakter" note="Singkat, padat, informatif — tampil di card dan SEO" />
                <Row label="Excerpt / Ringkasan" value="100–200 karakter" note="Ditampilkan di bawah judul pada list berita" />
                <Row label="Isi Berita" value="Min. 3 paragraf" note="Gunakan paragraf pendek agar mudah dibaca" />
                <Row label="Thumbnail" value="16:9 — 1200×675 px" note="Lihat bagian Thumbnail Berita di atas" />
                <Row label="Slug URL" value="Otomatis dari judul" note="Hindari karakter khusus di judul" />
                <Row label="Status" value="Draft / Published" note="Draft tidak tampil di publik, Published langsung live" />
                <Tip type="info">
                    Isi excerpt dengan kalimat pembuka yang menarik. Ini yang pertama kali dibaca pengunjung di halaman daftar berita.
                </Tip>
                <Tip type="warning">
                    Jangan publish berita tanpa thumbnail — tampilan card akan kosong dan tidak menarik.
                </Tip>
            </InfoCard>

            {/* Ringkasan Cepat */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-500" />
                    Ringkasan Cepat — Ukuran Semua Gambar
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-2 pr-4 text-gray-500 font-semibold">Jenis</th>
                                <th className="text-left py-2 pr-4 text-gray-500 font-semibold">Rasio</th>
                                <th className="text-left py-2 pr-4 text-gray-500 font-semibold">Resolusi Ideal</th>
                                <th className="text-left py-2 text-gray-500 font-semibold">Maks. File</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { jenis: 'Banner Hero', rasio: '16:5', resolusi: '1920 × 600 px', maks: '2 MB' },
                                { jenis: 'Foto Anggota AKD', rasio: '3:4', resolusi: '600 × 800 px', maks: '1 MB' },
                                { jenis: 'Thumbnail Berita', rasio: '16:9', resolusi: '1200 × 675 px', maks: '1.5 MB' },
                                { jenis: 'Foto Fraksi/Sekretariat', rasio: '3:4', resolusi: '600 × 800 px', maks: '1 MB' },
                            ].map((row) => (
                                <tr key={row.jenis} className="border-b border-gray-50 last:border-0">
                                    <td className="py-3 pr-4 font-semibold text-gray-800">{row.jenis}</td>
                                    <td className="py-3 pr-4 font-mono text-indigo-600 font-bold">{row.rasio}</td>
                                    <td className="py-3 pr-4 font-mono text-gray-700">{row.resolusi}</td>
                                    <td className="py-3 text-gray-600">{row.maks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
                    Kompres semua gambar sebelum upload di <a href="https://tinypng.com" target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline">tinypng.com</a> atau <a href="https://squoosh.app" target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline">squoosh.app</a> — gratis dan mudah digunakan.
                </div>
            </div>
        </div>
    );
}
