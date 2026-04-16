'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { MessageSquare, Send, Clock } from 'lucide-react';

interface Komentar { id: string; nama: string; isi: string; createdAt: string; }

export default function BeritaKomentar({ beritaId }: { beritaId: string }) {
  const [komentarList, setKomentarList] = useState<Komentar[]>([]);
  const [isi, setIsi]           = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState('');

  const load = useCallback(async () => {
    const res = await fetch(`/api/komentar?beritaId=${beritaId}&status=approved`);
    const data = await res.json();
    setKomentarList(Array.isArray(data) ? data : []);
  }, [beritaId]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isi.trim()) { setError('Komentar tidak boleh kosong.'); return; }
    setSubmitting(true); setError('');
    const res = await fetch('/api/komentar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ beritaId, isi }),
    });
    if (res.ok) { setSubmitted(true); setIsi(''); }
    else { const d = await res.json(); setError(d.message || 'Gagal mengirim komentar.'); }
    setSubmitting(false);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="mt-12 pt-10 border-t border-gray-100">
      <h3 className="font-black text-xl text-gray-900 mb-1 flex items-center gap-2">
        <MessageSquare size={20} className="text-red-600" />
        Komentar
        {komentarList.length > 0 && <span className="text-sm font-bold text-gray-400">({komentarList.length})</span>}
      </h3>
      <div className="w-12 h-1 bg-red-600 mb-8 rounded-full" />

      {/* Daftar komentar */}
      {komentarList.length === 0 ? (
        <p className="text-gray-400 text-sm mb-8">Belum ada komentar. Jadilah yang pertama!</p>
      ) : (
        <div className="space-y-4 mb-10">
          {komentarList.map(k => (
            <div key={k.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <MessageSquare size={16} className="text-gray-400" />
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-700 text-sm">{k.nama}</span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock size={10} />{formatDate(k.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{k.isi}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl p-5 text-sm font-medium">
          Komentar Anda telah dikirim dan sedang menunggu moderasi. Terima kasih!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-5 space-y-3">
          <h4 className="font-black text-gray-900 text-sm">Tulis Komentar</h4>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3">{error}</div>}
          <textarea value={isi} onChange={e => setIsi(e.target.value)}
            placeholder="Tulis komentar Anda..."
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white resize-none" />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">Komentar akan ditampilkan setelah disetujui moderator.</p>
            <button type="submit" disabled={submitting}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-sm font-bold disabled:opacity-60 transition-colors">
              <Send size={14} />
              {submitting ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
