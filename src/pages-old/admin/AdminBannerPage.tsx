'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import { fetchBanners, createBanner, updateBanner, deleteBanner } from '../../services/api';
import type { Banner } from '../../services/api';
import AdminLayout from './AdminLayout';

const emptyForm = {
    title: '',
    subtitle: '',
    category: 'Berita Dewan',
    linkUrl: '',
    isActive: 'true',
    order: '0',
};

const AdminBannerPage: React.FC = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<Banner | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const token = localStorage.getItem('admin_token') || '';

    const loadData = useCallback(async () => {
        setLoading(true);
        const data = await fetchBanners();
        setBanners(data);
        setLoading(false);
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const openCreate = () => {
        setEditItem(null);
        setForm(emptyForm);
        setImageFile(null);
        setImagePreview('');
        setError('');
        setShowModal(true);
    };

    const openEdit = (item: Banner) => {
        setEditItem(item);
        setForm({
            title: item.title,
            // Keep the rest as default for backend compatibility
            subtitle: item.subtitle || '',
            category: item.category,
            linkUrl: item.linkUrl || '',
            isActive: item.isActive ? 'true' : 'false',
            order: String(item.order),
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
        if (!editItem && !imageFile) { setError('Gambar banner diperlukan'); return; }
        setSaving(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('title', form.title);
            fd.append('subtitle', form.subtitle);
            fd.append('category', form.category);
            fd.append('linkUrl', form.linkUrl);
            fd.append('isActive', form.isActive);
            fd.append('order', form.order);
            if (imageFile) fd.append('image', imageFile);

            if (editItem) {
                await updateBanner(editItem.id, fd, token);
            } else {
                await createBanner(fd, token);
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
        await deleteBanner(deleteId, token);
        setDeleteId(null);
        loadData();
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Banner Hero</h1>
                    <p className="text-slate-500 text-sm mt-1">Kelola <span className="font-bold text-primary">{banners.length}</span> slide banner terdaftar</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 bg-gradient-to-r from-[#0a2744] to-[#123b66] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all">
                    <Plus size={18} strokeWidth={2.5} /> Tambah Banner
                </button>
            </div>

            {/* Grid Cards */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm h-48 animate-pulse" />
                    ))}
                </div>
            ) : banners.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                    <Upload size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-400">Belum ada banner. Tambah banner pertama!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {banners.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 overflow-hidden group flex flex-col">
                            <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex gap-1">
                                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">Banner</span>
                                </div>
                                {/* Title */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white font-black text-sm leading-tight line-clamp-2 drop-shadow-md">{item.title}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 flex-1 bg-white">
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200">
                                    {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => openEdit(item)} className="px-2.5 py-1.5 hover:bg-blue-50 bg-white border border-blue-100 rounded-lg text-blue-600 transition-colors flex items-center gap-1 text-[11px] font-bold">
                                        <Edit2 size={13} /> Edit
                                    </button>
                                    <button onClick={() => setDeleteId(item.id)} className="px-2.5 py-1.5 hover:bg-red-50 bg-white border border-red-100 rounded-lg text-red-500 transition-colors flex items-center gap-1 text-[11px] font-bold">
                                        <Trash2 size={13} /> Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800">{editItem ? 'Edit Banner' : 'Tambah Banner'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-5 space-y-4">
                            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>}

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gambar Banner *</label>
                                <div
                                    className="border-2 border-dashed border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => document.getElementById('banner-image-input')?.click()}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="" className="w-full h-40 object-cover" />
                                    ) : (
                                        <div className="p-6 text-center">
                                            <Upload size={28} className="mx-auto text-gray-300 mb-2" />
                                            <p className="text-gray-400 text-sm">Klik untuk pilih gambar banner</p>
                                            <p className="text-gray-300 text-xs">Disarankan rasio 16:9, max 5MB</p>
                                        </div>
                                    )}
                                </div>
                                <input id="banner-image-input" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul *</label>
                                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                    placeholder="Judul banner" />
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
                        <h3 className="font-bold text-gray-800 mb-2">Hapus Banner?</h3>
                        <p className="text-gray-500 text-sm mb-5">Banner dan gambarnya akan dihapus permanen.</p>
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

export default AdminBannerPage;
