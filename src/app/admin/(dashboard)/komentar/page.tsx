'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Trash2, MessageSquare, Clock, RefreshCw } from 'lucide-react';

interface Komentar {
    id: string;
    beritaId: string;
    nama: string;
    email: string | null;
    isi: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy: string | null;
    createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending: { label: 'Menunggu', color: 'bg-amber-100 text-amber-700' },
    approved: { label: 'Disetujui', color: 'bg-green-100 text-green-700' },
    rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-700' },
};

export default function KomentarPage() {
    const [komentarList, setKomentarList] = useState<Komentar[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

    const load = useCallback(async () => {
        setLoading(true);
        const url = filter === 'all' ? '/api/komentar' : `/api/komentar?status=${filter}`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setKomentarList(Array.isArray(data) ? data : []);
        setLoading(false);
    }, [filter, token]);

    useEffect(() => { load(); }, [load]);

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        setActionLoading(id);
        await fetch(`/api/komentar/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ status }),
        });
        await load();
        setActionLoading(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus komentar ini?')) return;
        setActionLoading(id);
        await fetch(`/api/komentar/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        await load();
        setActionLoading(null);
    };

    const pendingCount = komentarList.filter(k => k.status === 'pending').length;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <MessageSquare size={20} className="text-primary" />
                        Moderasi Komentar
                        {filter === 'pending' && pendingCount > 0 && (
                            <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">{pendingCount}</span>
                        )}
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">Setujui atau tolak komentar sebelum tampil di website</p>
                </div>
                <button onClick={load} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                    <RefreshCw size={16} />
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm w-fit">
                {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === f ? 'bg-[#0a2744] text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        {f === 'all' ? 'Semua' : STATUS_LABELS[f].label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse">
                            <div className="h-4 bg-gray-100 rounded w-1/4 mb-3" />
                            <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-3/4" />
                        </div>
                    ))}
                </div>
            ) : komentarList.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <MessageSquare size={36} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-gray-400 font-medium">Tidak ada komentar {filter !== 'all' ? STATUS_LABELS[filter]?.label.toLowerCase() : ''}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {komentarList.map((k) => {
                        const isLoading = actionLoading === k.id;
                        const statusInfo = STATUS_LABELS[k.status];
                        return (
                            <div key={k.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="font-bold text-gray-900 text-sm">{k.nama}</span>
                                            {k.email && <span className="text-xs text-gray-400">{k.email}</span>}
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed mb-2">{k.isi}</p>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Clock size={11} />
                                            {new Date(k.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        {k.status !== 'approved' && (
                                            <button
                                                onClick={() => handleAction(k.id, 'approved')}
                                                disabled={isLoading}
                                                title="Setujui"
                                                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50"
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                        )}
                                        {k.status !== 'rejected' && (
                                            <button
                                                onClick={() => handleAction(k.id, 'rejected')}
                                                disabled={isLoading}
                                                title="Tolak"
                                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                                            >
                                                <XCircle size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(k.id)}
                                            disabled={isLoading}
                                            title="Hapus"
                                            className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
