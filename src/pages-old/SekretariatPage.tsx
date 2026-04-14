'use client';
import React, { useEffect, useState } from 'react';
import { ChevronRight, User } from 'lucide-react';
import { fetchSekretariatInfo, fetchAnggotaSekretariat, getImageUrl } from '../services/api';
import type { SekretariatInfo, AnggotaSekretariat } from '../services/api';

// ─── Dummy Data (fallback ketika API kosong) ───
const dummySekretaris = {
    name: "Drs. H. Augustinus, SE., M.Si",
    title: "Sekretaris DPRD",
    location: "DPRD Kabupaten Sumbawa Barat",
    image: "https://randomuser.me/api/portraits/men/75.jpg"
};

const dummyStaff = [
    { name: "Asril Pinayungan R, SH., M.Si", title: "Kepala Bagian Umum", location: "", image: "https://randomuser.me/api/portraits/men/44.jpg" },
    { name: "Sarla D.A.G Sinaga, S.STP, MA", title: "Kepala Bagian Perencanaan", location: "", image: "https://randomuser.me/api/portraits/women/68.jpg" },
    { name: "Nur Achmad, SH., M.Si", title: "Kepala Bagian Hukum", location: "", image: "https://randomuser.me/api/portraits/men/46.jpg" },
    { name: "Dyah Suryani H., S.Sos", title: "Kepala Bagian Humas", location: "", image: "https://randomuser.me/api/portraits/women/55.jpg" },
    { name: "Rosnaeni, S.Sos", title: "Kasubbag Tata Usaha Kepegawaian", location: "", image: "https://randomuser.me/api/portraits/women/32.jpg" },
    { name: "Ahmad Yuliadi, SE., MM", title: "Kasubbag Perencanaan & Anggaran", location: "", image: "https://randomuser.me/api/portraits/men/22.jpg" },
    { name: "Mukholik Maswi, S.Sos.", title: "Kasubbag Persidangan", location: "", image: "https://randomuser.me/api/portraits/men/84.jpg" },
    { name: "Tri Indra Gunawan, SH., M.Si", title: "Kasubbag Publikasi & Informasi", location: "", image: "https://randomuser.me/api/portraits/men/91.jpg" },
    { name: "Alex Trioso, S.Sos", title: "Kasubbag Rumah Tangga", location: "", image: "https://randomuser.me/api/portraits/men/50.jpg" },
    { name: "Agus Ermanto, SE", title: "Kasubbag Tata Usaha Keuangan", location: "", image: "https://randomuser.me/api/portraits/men/60.jpg" },
    { name: "Ramandhika S, SH., MH", title: "Kasubbag Pengkajian Hukum", location: "", image: "https://randomuser.me/api/portraits/men/61.jpg" },
    { name: "Priyambodo, S.AP", title: "Kasubbag Pengolahan Data", location: "", image: "https://randomuser.me/api/portraits/men/62.jpg" },
    { name: "Juniadi Jatnoprasetyo, S.AP", title: "Kasubbag Perlengkapan", location: "", image: "https://randomuser.me/api/portraits/men/65.jpg" },
    { name: "Rusda Ulfa, SE", title: "Kasubbag Perbendaharaan", location: "", image: "https://randomuser.me/api/portraits/women/65.jpg" },
    { name: "Arya Angga Avisena, SE", title: "Kasubbag Kerjasama Antar Lembaga", location: "", image: "https://randomuser.me/api/portraits/men/67.jpg" },
    { name: "Dudy Setiawan Ibani, S.Kom", title: "Kasubbag Protokol & Pimpinan", location: "", image: "https://randomuser.me/api/portraits/men/68.jpg" },
];

const defaultVisi = "Terwujudnya pelayanan Sekretariat DPRD Kabupaten Sumbawa Barat yang profesional, transparan, dan akuntabilitas dalam memfasilitasi tugas DPRD Kabupaten Sumbawa Barat.";
const defaultMisi = "Memberikan pelayanan terbaik terhadap pimpinan dan segenap anggota DPRD Kabupaten Sumbawa Barat.";
const defaultTugas = "Menyelenggarakan administrasi kesekretariatan dan keuangan, mendukung pelaksanaan tugas dan fungsi DPRD, serta menyediakan dan mengoordinasikan tenaga ahli yang diperlukan oleh DPRD dalam melaksanakan hak dan fungsinya sesuai dengan kebutuhan.";
const defaultFungsi = [
    "Penyusunan rencana strategis, rencana kerja dan anggaran Sekretariat DPRD.",
    "Pelaksanaan rencana strategis dan dokumen pelaksanaan anggaran Sekretariat DPRD.",
    "Penyelenggaraan kesekretariatan DPRD.",
    "Penyelenggaraan administrasi keuangan DPRD.",
    "Fasilitasi rapat anggota DPRD.",
    "Penyediaan dan pengoordinasian tenaga ahli yang diperlukan oleh DPRD.",
    "Fasilitasi pengangkatan, pelantikan, pemberhentian dalam dan dari jabatan Kepala Daerah dan Wakil Kepala Daerah, serta serah terima jabatan pada rapat paripurna DPRD.",
    "Pengelolaan kepegawaian, keuangan dan kerumahtanggaan Sekretariat DPRD.",
    "Pengelolaan kearsipan, data dan informasi Sekretariat DPRD.",
    "Pelaporan dan pertanggungjawaban pelaksanaan tugas pokok dan fungsi.",
];

// ─── Profile Card Component ───
const renderProfileCard = (person: { name: string; title: string; location?: string; image?: string; imageUrl?: string | null }) => (
    <div className="flex flex-col items-center group w-full">
        <div className="w-full aspect-[3/4] mb-4 relative rounded-md p-1.5 md:p-2 bg-white border border-gray-100 shadow-sm group-hover:shadow-lg transition-all duration-300">
            <div className="w-full h-full overflow-hidden rounded-md bg-gray-50">
                {(person.image || person.imageUrl) ? (
                    <img
                        src={person.image || getImageUrl(person.imageUrl) || ''}
                        alt={person.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <User size={40} className="text-slate-300" />
                    </div>
                )}
            </div>
        </div>
        <h3 className="font-bold text-[13px] md:text-[14px] text-gray-900 mb-1 text-center px-1 group-hover:text-red-600 transition-colors">
            {person.name}
        </h3>
        <p className="text-[11px] md:text-[12px] text-gray-500 font-medium text-center leading-relaxed">
            {person.title} {person.location && <><br /> {person.location}</>}
        </p>
    </div>
);

const SekretariatPage: React.FC = () => {
    const [info, setInfo] = useState<SekretariatInfo | null>(null);
    const [anggota, setAnggota] = useState<AnggotaSekretariat[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        Promise.all([
            fetchSekretariatInfo(),
            fetchAnggotaSekretariat(),
        ]).then(([infoData, anggotaData]) => {
            setInfo(infoData);
            setAnggota(anggotaData);
            setLoaded(true);
        }).catch(() => {
            setLoaded(true);
        });
    }, []);

    // Determine data to show (API or fallback)
    const hasAnggota = anggota.length > 0;
    const hasInfo = info && (info.visi || info.misi || info.tugas || info.fungsi);

    const visiText = hasInfo && info?.visi ? info.visi : defaultVisi;

    // Parse misi, tugas, fungsi as arrays
    const parseJsonArray = (raw: string | null | undefined, fallback: string | string[]): string[] => {
        if (!raw) return Array.isArray(fallback) ? fallback : [fallback];
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
        return Array.isArray(fallback) ? fallback : [fallback];
    };

    const misiList = parseJsonArray(info?.misi, defaultMisi);
    const tugasList = parseJsonArray(info?.tugas, defaultTugas);

    let fungsiList = defaultFungsi;
    if (hasInfo && info?.fungsi) {
        try {
            const parsed = JSON.parse(info.fungsi);
            if (Array.isArray(parsed) && parsed.length > 0) {
                fungsiList = parsed;
            }
        } catch {
            // Invalid JSON, keep default
        }
    }

    // Build people list
    const sekretarisData = hasAnggota
        ? anggota.filter(a => a.isSekretaris).map(a => ({
            name: a.name,
            title: a.position,
            location: a.unit || '',
            imageUrl: a.imageUrl,
        }))
        : [dummySekretaris];

    const staffData = hasAnggota
        ? anggota.filter(a => !a.isSekretaris).map(a => ({
            name: a.name,
            title: a.position,
            location: a.unit || '',
            imageUrl: a.imageUrl,
        }))
        : dummyStaff;

    return (
        <main className="min-h-screen bg-[#fcfcfc] py-12 md:py-20">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

                    {/* Left Sidebar Profil Teks */}
                    <aside className="w-full lg:w-[350px] flex-shrink-0 animate-fade-in z-10 lg:sticky lg:top-28">
                        {/* Decorative Sidebar Image */}
                        <div className="relative mb-10 w-full aspect-[4/3] max-w-[320px] mx-auto lg:mx-0 group cursor-pointer hidden lg:block">
                            <div className="absolute inset-0 bg-red-500 rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500 z-0"></div>
                            <div className="absolute inset-0 bg-red-600 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500 z-0 opacity-80"></div>
                            <div className="absolute inset-2 bg-white rounded-2xl z-10 overflow-hidden shadow-lg shadow-black/10">
                                <img
                                    src="/Gedung-DPRD-Sumbawa-Barat.jpg"
                                    alt="Sumbawa Barat"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888045653-f7267eb4bd48?auto=format&fit=crop&q=80&w=600';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Teks Visi, Misi, Dsb */}
                        <div className="flex flex-col gap-8 text-[13px] md:text-[14px] text-gray-700 font-medium leading-relaxed pr-2">
                            {!loaded ? (
                                <div className="space-y-6 animate-pulse">
                                    <div><div className="h-5 bg-gray-200 rounded w-16 mb-2" /><div className="h-16 bg-gray-100 rounded" /></div>
                                    <div><div className="h-5 bg-gray-200 rounded w-16 mb-2" /><div className="h-16 bg-gray-100 rounded" /></div>
                                    <div><div className="h-5 bg-gray-200 rounded w-16 mb-2" /><div className="h-20 bg-gray-100 rounded" /></div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <h3 className="text-gray-900 font-black text-lg mb-2">Visi</h3>
                                        <p>{visiText}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-900 font-black text-lg mb-3">Misi</h3>
                                        <ol className="flex flex-col gap-2.5">
                                            {misiList.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2.5">
                                                    <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-900 font-black text-lg mb-3">Tugas</h3>
                                        <ol className="flex flex-col gap-2.5">
                                            {tugasList.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2.5">
                                                    <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-900 font-black text-lg mb-3">Fungsi</h3>
                                        <ul className="flex flex-col gap-3">
                                            {fungsiList.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2.5 group">
                                                    <ChevronRight size={16} className="text-red-600 mt-0.5 shrink-0 group-hover:translate-x-1 transition-transform" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                    </aside>

                    {/* Right Main Content */}
                    <section className="flex-1 w-full lg:mt-6 animate-fade-in">
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-16 tracking-tight text-center lg:text-left">
                            Sekretariat DPRD
                        </h1>

                        {!loaded ? (
                            <div className="space-y-8">
                                <div className="flex justify-center"><div className="w-[180px] h-[240px] bg-gray-100 rounded-xl animate-pulse" /></div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {Array(8).fill(0).map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse" />)}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full flex flex-col items-center">
                                {/* Sekretaris */}
                                <div className="flex justify-center w-full mb-16">
                                    {sekretarisData.map((person, idx) => (
                                        <div key={idx} className="w-[180px] md:w-[220px] mx-2">
                                            {renderProfileCard(person)}
                                        </div>
                                    ))}
                                </div>

                                {/* Grid Staff */}
                                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 w-full">
                                    {staffData.map((person, idx) => (
                                        <div key={idx} className="w-[160px] md:w-[200px]">
                                            {renderProfileCard(person)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
};

export default SekretariatPage;
