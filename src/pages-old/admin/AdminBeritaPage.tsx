'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, X, Upload, CheckCircle, XCircle, Clock } from 'lucide-react';
import { fetchBerita, createBerita, updateBerita, deleteBerita } from '../../services/api';
import type { Berita } from '../../services/api';
import AdminLayout from './AdminLayout';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('../../components/RichTextEditor'), { ssr: false });

const CATEGORIES = ['Berita Dewan', 'Wakil Kita', 'Galeri Dewan', 'Galeri Sekretariat Dewan'];

const emptyForm = {
    title: '',
    excerpt: '',
    content: '',
    category: 'Berita Dewan',
    isPublished: 'false',
};

const AdminBeritaPage: React.FC = () => {
    const [beritas, setBeritas] = useState<Berita[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<Berita | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [reviewModal, setReviewModal] = useState<{ id: string; action: 'approve' | 'reject' } | null>(null);
    const [reviewNote, setReviewNote] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);

    const limit = 10;
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';
    const adminUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('admin_user') || '{}') : {};
    const role = adminUser?.role ?? 'news_editor';
    const isSuperAdmin = role === 'super_admin';
    const isAdmin = role === 'super_admin' || role === 'admin'; // bisa CRUD semua + approve
    const isNewsEditor = role === 'news_editor';

    const loadData = useCallback(async () => {
        setLoading(true);
        const res = await fetchBerita({ limit, page });
        setBeritas(res.data);
        setTotal(res.total);
        setLoading(false);
    }, [page]);

    useEffect(() => { loadData(); }, [loadData]);

    const openCreate = () => {
        setEditItem(null);
        setForm(emptyForm);
        setImageFile(null);
        setImagePreview('');
        setError('');
        setShowModal(true);
    };

    const openEdit = (item: Berita) => {
        // news_editor hanya bisa edit berita miliknya
        if (isNewsEditor && (item as any).authorId !== adminUser?.id) return;
        setEditItem(item);
        setForm({
            title: item.title,
            excerpt: item.excerpt || '',
            content: item.content || '',
            category: item.category,
            isPublished: item.isPublished ? 'true' : 'false',
        });
        setImageFile(null);
        setImagePreview(item.imageUrl || '');
        setError('');
        setShowModal(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        if (!form.title.trim()) { setError('Judul diperlukan'); return; }
        setSaving(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('title', form.title);
            fd.append('excerpt', form.excerpt);
            fd.append('content', form.content);
            fd.append('category', form.category);
            // admin & super_admin bisa set isPublished, news_editor selalu draft
            fd.append('isPublished', isAdmin ? form.isPublished : 'false');
            if (imageFile) fd.append('image', imageFile);

            if (editItem) {
                await updateBerita(editItem.id, fd, token);
            } else {
                await createBerita(fd, token);
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
        await deleteBerita(deleteId, token);
        setDeleteId(null);
        loadData();
    };

    const handleReview = async () => {
        if (!reviewModal) return;
        setReviewLoading(true);
        await fetch(`/api/berita/${reviewModal.id}/review`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ action: reviewModal.action, note: reviewNote }),
        });
        setReviewModal(null);
        setReviewNote('');
        setReviewLoading(false);
        loadData();
    };

    const filtered = beritas.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(total / limit);

    const getReviewBadge = (item: any) => {
        if (item.isPublished) return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">Terbit</span>;
        if (item.reviewStatus === 'rejected') return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-100">Ditolak</span>;
        if (item.reviewStatus === 'pending') return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1 w-fit"><Clock size={10} />Menunggu Review</span>;
        return <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200">Draft</span>;
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Berita</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Kelola <span className="font-bold text-primary">{total}</span> artikel berita
                        {!isAdmin && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Berita baru perlu disetujui admin</span>}
                    </p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 bg-gradient-to-r from-[#0a2744] to-[#123b66] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all">
                    <Plus size={18} strokeWidth={2.5} /> Tambah Berita
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
                <div className="relative max-w-md">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari artikel berita..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-gray-600 font-semibold text-xs uppercase">Gambar</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-semibold text-xs uppercase">Judul</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-semibold text-xs uppercase hidden md:table-cell">Kategori</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-semibold text-xs uppercase hidden md:table-cell">Status</th>
                                {isAdmin && <th className="text-left px-4 py-3 text-gray-600 font-semibold text-xs uppercase hidden lg:table-cell">Penulis</th>}
                                <th className="text-left px-4 py-3 text-gray-600 font-semibold text-xs uppercase hidden lg:table-cell">Tanggal</th>
                                <th className="text-right px-4 py-3 text-gray-600 font-semibold text-xs uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}><td className="px-4 py-3" colSpan={7}><div className="h-8 bg-gray-100 animate-pulse rounded" /></td></tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">Belum ada berita.</td></tr>
                            ) : filtered.map((item: any) => (
                                <tr key={item.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="px-4 py-3">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt="" className="w-14 h-10 object-cover rounded-md shadow-sm" />
                                        ) : (
                                            <div className="w-14 h-10 bg-slate-100 rounded-md flex items-center justify-center border border-slate-200">
                                                <Upload size={14} className="text-slate-300" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="font-bold text-slate-800 line-clamp-1 max-w-xs">{item.title}</p>
                                        {item.excerpt && <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">{item.excerpt}</p>}
                                        {item.reviewNote && item.reviewStatus === 'rejected' && (
                                            <p className="text-xs text-red-500 mt-1 italic">Catatan: {item.reviewNote}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 hidden md:table-cell">
                                        <span className="bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-md">{item.category}</span>
                                    </td>
                                    <td className="px-4 py-4 hidden md:table-cell">
                                        {getReviewBadge(item)}
                                    </td>
                                    {isAdmin && (
                                        <td className="px-4 py-4 hidden lg:table-cell text-xs text-gray-500">
                                            {item.authorName || '—'}
                                        </td>
                                    )}
                                    <td className="px-4 py-4 text-slate-500 font-medium text-xs hidden lg:table-cell">
                                        {new Date(item.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-wrap">
                                            {/* Approve/Reject — admin & super_admin, untuk item pending */}
                                            {isAdmin && item.reviewStatus === 'pending' && !item.isPublished && (
                                                <>
                                                    <button
                                                        onClick={() => setReviewModal({ id: item.id, action: 'approve' })}
                                                        className="px-2 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                                                    >
                                                        <CheckCircle size={12} /> Setujui
                                                    </button>
                                                    <button
                                                        onClick={() => setReviewModal({ id: item.id, action: 'reject' })}
                                                        className="px-2 py-1.5 bg-red-50 border border-red-100 rounded-lg text-red-500 text-[11px] font-bold flex items-center gap-1 hover:bg-red-100 transition-colors"
                                                    >
                                                        <XCircle size={12} /> Tolak
                                                    </button>
                                                </>
                                            )}
                                            {/* Edit — admin bisa semua, news_editor hanya miliknya */}
                                            {(isAdmin || item.authorId === adminUser?.id) && (
                                                <button onClick={() => openEdit(item)} className="px-2.5 py-1.5 hover:bg-blue-100 bg-white border border-blue-100 rounded-lg text-blue-600 transition-colors flex items-center gap-1 text-[11px] font-bold shadow-sm">
                                                    <Edit2 size={13} /> Edit
                                                </button>
                                            )}
                                            {/* Delete — admin bisa semua, news_editor hanya draft miliknya */}
                                            {(isAdmin || (item.authorId === adminUser?.id && !item.isPublished)) && (
                                                <button onClick={() => setDeleteId(item.id)} className="px-2.5 py-1.5 hover:bg-red-100 bg-white border border-red-100 rounded-lg text-red-500 transition-colors flex items-center gap-1 text-[11px] font-bold shadow-sm">
                                                    <Trash2 size={13} /> Hapus
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
                            <h2 className="font-bold text-gray-800">{editItem ? 'Edit Berita' : 'Tambah Berita'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"><X size={18} /></button>
                        </div>

                        <div className="overflow-y-auto p-5 space-y-4">
                            {!isAdmin && (
                                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg p-3 flex items-start gap-2">
                                    <Clock size={16} className="flex-shrink-0 mt-0.5" />
                                    <span>Berita yang Anda buat akan disimpan sebagai draft dan perlu disetujui oleh Admin sebelum tampil di website.</span>
                                </div>
                            )}

                            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gambar</label>
                                <div
                                    className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => document.getElementById('berita-image-input')?.click()}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="" className="w-full h-32 object-cover rounded-lg" />
                                    ) : (
                                        <div className="py-4">
                                            <Upload size={24} className="mx-auto text-gray-300 mb-2" />
                                            <p className="text-gray-400 text-sm">Klik untuk pilih gambar</p>
                                            <p className="text-gray-300 text-xs">Max 5MB, format JPG/PNG</p>
                                        </div>
                                    )}
                                </div>
                                <input id="berita-image-input" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                    placeholder="Judul berita"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
                                    <select
                                        value={form.category}
                                        onChange={e => setForm({ ...form, category: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                {/* admin & super_admin bisa toggle status publish */}
                                {isAdmin && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                                        <select
                                            value={form.isPublished}
                                            onChange={e => setForm({ ...form, isPublished: e.target.value })}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                        >
                                            <option value="true">Terbit</option>
                                            <option value="false">Draft</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ringkasan</label>
                                <textarea
                                    value={form.excerpt}
                                    onChange={e => setForm({ ...form, excerpt: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                                    rows={2}
                                    placeholder="Ringkasan singkat berita..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Konten</label>
                                <RichTextEditor
                                    value={form.content}
                                    onChange={val => setForm({ ...form, content: val })}
                                    placeholder="Tulis konten berita lengkap di sini..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 p-5 border-t border-gray-100">
                            <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Batal</button>
                            <button onClick={handleSave} disabled={saving} className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60">
                                {saving ? 'Menyimpan...' : (isAdmin ? 'Simpan' : 'Kirim untuk Review')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {reviewModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                        <h3 className="font-bold text-gray-800 mb-1">
                            {reviewModal.action === 'approve' ? 'Setujui Berita?' : 'Tolak Berita?'}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">
                            {reviewModal.action === 'approve'
                                ? 'Berita akan langsung tampil di website.'
                                : 'Berita tidak akan dipublish. Tambahkan catatan untuk penulis.'}
                        </p>
                        {reviewModal.action === 'reject' && (
                            <textarea
                                value={reviewNote}
                                onChange={e => setReviewNote(e.target.value)}
                                placeholder="Catatan untuk penulis (opsional)..."
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none mb-4"
                                rows={3}
                            />
                        )}
                        <div className="flex gap-3">
                            <button onClick={() => { setReviewModal(null); setReviewNote(''); }} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
                            <button
                                onClick={handleReview}
                                disabled={reviewLoading}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60 ${reviewModal.action === 'approve' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'}`}
                            >
                                {reviewLoading ? 'Memproses...' : (reviewModal.action === 'approve' ? 'Ya, Setujui' : 'Ya, Tolak')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                        <h3 className="font-bold text-gray-800 mb-2">Hapus Berita?</h3>
                        <p className="text-gray-500 text-sm mb-5">Aksi ini tidak dapat dibatalkan.</p>
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

export default AdminBeritaPage;
