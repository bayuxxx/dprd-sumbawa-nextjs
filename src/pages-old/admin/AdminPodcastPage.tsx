'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Mic } from 'lucide-react';
import { fetchPodcasts, createPodcast, updatePodcast, deletePodcast } from '../../services/api/podcast';
import type { Podcast } from '../../services/api/podcast';
import AdminLayout from './AdminLayout';

const emptyForm = {
    judul: '',
    subjudul: '',
    link: '',
    host: '',
    narasumber: '',
};

const AdminPodcastPage: React.FC = () => {
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<Podcast | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioFileName, setAudioFileName] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const limit = 10;
    const token = localStorage.getItem('admin_token') || '';

    const loadData = useCallback(async () => {
        setLoading(true);
        const res = await fetchPodcasts({ limit, page });
        setPodcasts(res.data);
        setTotal(res.total);
        setLoading(false);
    }, [page]);

    useEffect(() => { loadData(); }, [loadData]);

    const openCreate = () => {
        setEditItem(null);
        setForm(emptyForm);
        setThumbnailFile(null);
        setThumbnailPreview('');
        setAudioFile(null);
        setAudioFileName('');
        setError('');
        setShowModal(true);
    };

    const openEdit = (item: Podcast) => {
        setEditItem(item);
        setForm({
            judul: item.judul,
            subjudul: item.subjudul || '',
            link: item.link || '',
            host: item.host || '',
            narasumber: item.narasumber || '',
        });
        setThumbnailFile(null);
        setThumbnailPreview(item.thumbnailUrl || '');
        setAudioFile(null);
        setAudioFileName(item.audioUrl ? 'File audio tersimpan' : '');
        setError('');
        setShowModal(true);
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
    };

    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAudioFile(file);
        setAudioFileName(file.name);
    };

    const handleSave = async () => {
        if (!form.judul.trim()) { setError('Judul diperlukan'); return; }
        setSaving(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('judul', form.judul);
            fd.append('subjudul', form.subjudul);
            fd.append('link', form.link);
            fd.append('host', form.host);
            fd.append('narasumber', form.narasumber);
            if (thumbnailFile) fd.append('thumbnail', thumbnailFile);
            if (audioFile) fd.append('audio', audioFile);

            if (editItem) {
                await updatePodcast(editItem.id, fd, token);
            } else {
                await createPodcast(fd, token);
            }
            setShowModal(false);
            loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Gagal menyimpan');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        await deletePodcast(deleteId, token);
        setDeleteId(null);
        loadData();
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Podcast</h1>
                    <p className="text-slate-500 text-sm mt-1">Kelola <span className="font-bold text-primary">{total}</span> episode podcast</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 bg-gradient-to-r from-[#0a2744] to-[#123b66] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all">
                    <Plus size={18} strokeWidth={2.5} /> Tambah Podcast
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-gray-600 font-semibold text-xs uppercase">Thumbnail</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-semibold text-xs uppercase">Judul</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-semibold text-xs uppercase hidden md:table-cell">Host</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-semibold text-xs uppercase hidden md:table-cell">Narasumber</th>
                                <th className="text-right px-4 py-3 text-gray-600 font-semibold text-xs uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-4 py-3" colSpan={5}>
                                            <div className="h-8 bg-gray-100 animate-pulse rounded" />
                                        </td>
                                    </tr>
                                ))
                            ) : podcasts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-sm">
                                        Belum ada episode podcast.
                                    </td>
                                </tr>
                            ) : podcasts.map((item) => (
                                <tr key={item.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="px-4 py-3 border-b border-slate-50">
                                        {item.thumbnailUrl ? (
                                            <img src={item.thumbnailUrl} alt="" className="w-14 h-10 object-cover rounded-md shadow-sm" />
                                        ) : (
                                            <div className="w-14 h-10 bg-slate-100 rounded-md flex items-center justify-center border border-slate-200">
                                                <Upload size={14} className="text-slate-300" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 border-b border-slate-50">
                                        <p className="font-bold text-slate-800 line-clamp-1 max-w-xs">{item.judul}</p>
                                        {item.subjudul && <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">{item.subjudul}</p>}
                                    </td>
                                    <td className="px-4 py-4 hidden md:table-cell border-b border-slate-50 text-slate-600 text-xs">
                                        {item.host || '-'}
                                    </td>
                                    <td className="px-4 py-4 hidden md:table-cell border-b border-slate-50 text-slate-600 text-xs">
                                        {item.narasumber || '-'}
                                    </td>
                                    <td className="px-4 py-4 text-right border-b border-slate-50">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(item)} className="px-2.5 py-1.5 hover:bg-blue-100 bg-white border border-blue-100 rounded-lg text-blue-600 transition-colors flex items-center gap-1 text-[11px] font-bold shadow-sm">
                                                <Edit2 size={13} /> Edit
                                            </button>
                                            <button onClick={() => setDeleteId(item.id)} className="px-2.5 py-1.5 hover:bg-red-100 bg-white border border-red-100 rounded-lg text-red-500 transition-colors flex items-center gap-1 text-[11px] font-bold shadow-sm">
                                                <Trash2 size={13} /> Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                        <p className="text-gray-500 text-xs">Halaman {page} dari {totalPages}</p>
                        <div className="flex gap-2">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded border text-xs disabled:opacity-40 hover:bg-gray-50">Prev</button>
                            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded border text-xs disabled:opacity-40 hover:bg-gray-50">Next</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800">{editItem ? 'Edit Podcast' : 'Tambah Podcast'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-5 space-y-4">
                            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>}

                            {/* Thumbnail upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail</label>
                                <div
                                    className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => document.getElementById('podcast-thumbnail-input')?.click()}
                                >
                                    {thumbnailPreview ? (
                                        <img src={thumbnailPreview} alt="" className="w-full h-32 object-cover rounded-lg" />
                                    ) : (
                                        <div className="py-4">
                                            <Upload size={24} className="mx-auto text-gray-300 mb-2" />
                                            <p className="text-gray-400 text-sm">Klik untuk pilih gambar</p>
                                            <p className="text-gray-300 text-xs">Max 5MB, format JPG/PNG</p>
                                        </div>
                                    )}
                                </div>
                                <input id="podcast-thumbnail-input" type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                            </div>

                            {/* Audio upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">File Audio</label>
                                <div
                                    className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => document.getElementById('podcast-audio-input')?.click()}
                                >
                                    {audioFileName ? (
                                        <div className="flex items-center justify-center gap-2 py-2">
                                            <Mic size={18} className="text-primary" />
                                            <span className="text-sm text-gray-700 font-medium truncate max-w-xs">{audioFileName}</span>
                                        </div>
                                    ) : (
                                        <div className="py-4">
                                            <Mic size={24} className="mx-auto text-gray-300 mb-2" />
                                            <p className="text-gray-400 text-sm">Klik untuk pilih file audio</p>
                                            <p className="text-gray-300 text-xs">Max 50MB, format MP3/WAV/OGG</p>
                                        </div>
                                    )}
                                </div>
                                <input id="podcast-audio-input" type="file" accept="audio/*" className="hidden" onChange={handleAudioChange} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul *</label>
                                <input
                                    type="text"
                                    value={form.judul}
                                    onChange={e => setForm({ ...form, judul: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                    placeholder="Judul episode podcast"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subjudul</label>
                                <input
                                    type="text"
                                    value={form.subjudul}
                                    onChange={e => setForm({ ...form, subjudul: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                    placeholder="Subjudul episode (opsional)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Link</label>
                                <input
                                    type="text"
                                    value={form.link}
                                    onChange={e => setForm({ ...form, link: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                    placeholder="https://... (opsional)"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Host</label>
                                    <input
                                        type="text"
                                        value={form.host}
                                        onChange={e => setForm({ ...form, host: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                        placeholder="Nama host"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Narasumber</label>
                                    <input
                                        type="text"
                                        value={form.narasumber}
                                        onChange={e => setForm({ ...form, narasumber: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                        placeholder="Nama narasumber"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 p-5 border-t border-gray-100">
                            <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                Batal
                            </button>
                            <button onClick={handleSave} disabled={saving} className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60">
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                        <h3 className="font-bold text-gray-800 mb-2">Hapus Podcast?</h3>
                        <p className="text-gray-500 text-sm mb-5">Aksi ini tidak dapat dibatalkan. File thumbnail dan audio juga akan dihapus.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
                            <button onClick={handleDelete} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600">Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminPodcastPage;
