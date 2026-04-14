'use client';
import React from 'react';
import { Send, MessageSquare } from 'lucide-react';

const ForumWarga: React.FC = () => {
    const comments = [
        { id: 1, name: "Ahmad S.", time: "2 jam lalu", text: "Minta perhatian jalan rusak di Kec. Maluk sudah sangat parah, mohon segera ditindaklanjuti.", avatar: "A" },
        { id: 2, name: "Ibu Sari P.", time: "5 jam lalu", text: "Terima kasih Pak Wakil yang sudah turun langsung ke lapangan kemarin. Kami sangat mengapresiasi.", avatar: "S" },
        { id: 3, name: "Warga Taliwang", time: "1 hari lalu", text: "Kapan pembangunan Pasar Induk baru di Taliwang akan dimulai? Kami sudah lama menantikan.", avatar: "W" },
    ];

    return (
        <section className="bg-white py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-xl font-bold text-primary uppercase tracking-wide border-l-4 border-accent pl-3 mb-6 flex items-center gap-2">
                    <MessageSquare size={20} /> Forum Warga
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Comments list */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Komentar Terbaru</h3>
                        {comments.map((c) => (
                            <div key={c.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                    {c.avatar}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-bold text-gray-800">{c.name}</span>
                                        <span className="text-xs text-gray-400">{c.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{c.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input form */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Sampaikan Aspirasi Anda</h3>
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <input type="text" placeholder="Nama Anda" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                                <input type="email" placeholder="Email (opsional)" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                            </div>
                            <input type="text" placeholder="Subjek / Topik" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary mb-3" />
                            <textarea
                                rows={4}
                                placeholder="Tulis aspirasi, masukan, atau pertanyaan Anda di sini..."
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none mb-3"
                            />
                            <button className="bg-primary text-white px-5 py-2 rounded text-sm font-bold hover:bg-primary-dark transition-colors flex items-center gap-2">
                                <Send size={14} /> Kirim Pesan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForumWarga;
