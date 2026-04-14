'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Calendar, CheckCircle2, Users } from 'lucide-react';
import { fetchMasaJabatan, createMasaJabatan, updateMasaJabatan, deleteMasaJabatan } from '../../services/api';
import type { MasaJabatan } from '../../services/api';
import AdminLayout from './AdminLayout';

const emptyForm = {
    periode: '',
    tahunMulai: '',
    tahunSelesai: '',
    isAktif: false as boolean,
    keterangan: '',
    order: '0',
};

const AdminMasaJabatanPage: React.FC = () => {
    const [list, setList] = useState<MasaJabatan[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<MasaJabatan | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const token = localStorage.getItem('admin_token') || '';

    const loadData = useCallback(async () => {
        setLoading(true);
        const data = await fetchMasaJabatan();
        setList(data);
        setLoading(false);
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const openCreate = () => {
        setEditItem(null);
        setForm(emptyForm);
        setError('');
        setShowModal(true);
    };

    const openEdit = (item: MasaJabatan) => {
        setEditItem(item);
        setForm({
            periode: item.periode,
            tahunMulai: String(item.tahunMulai),
            tahunSelesai: String(item.tahunSelesai),
            isAktif: item.isAktif,
            keterangan: item.keterangan || '',
            order: String(item.order),
        });
        setError('');
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.periode.trim()) { setError('Periode diperlukan (contoh: 2024-2029)'); return; }
        if (!form.tahunMulai) { setError('Tahun mulai diperlukan'); return; }
        if (!form.tahunSelesai) { setError('Tahun selesai diperlukan'); return; }
        setSaving(true);
        setError('');
        try {
            const payload = {
                periode: form.periode,
                tahunMulai: parseInt(form.tahunMulai),
                tahunSelesai: parseInt(form.tahunSelesai),
                isAktif: form.isAktif,
                keterangan: form.keterangan || null,
                order: parseInt(form.order),
            };

            if (editItem) {
                await updateMasaJabatan(editItem.id, payload, token);
            } else {
                await createMasaJabatan(payload, token);
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
        await deleteMasaJabatan(deleteId, token);
        setDeleteId(null);
        loadData();
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Masa Jabatan</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Kelola <span className="font-bold text-primary">{list.length}</span> periode masa jabatan DPRD
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#0a2744] to-[#123b66] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all"
                >
                    <Plus size={18} strokeWidth={2.5} /> Tambah Periode
                </button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm h-40 animate-pulse" />
                    ))}
                </div>
            ) : list.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                    <Calendar size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-400">Belum ada periode masa jabatan. Tambah periode pertama!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {list.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 hover:shadow-md p-5 flex flex-col gap-3 ${item.isAktif ? 'border-green-300 ring-1 ring-green-200' : 'border-slate-100'}`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar size={16} className="text-primary" />
                                        <span className="font-black text-slate-800 text-lg">{item.periode}</span>
                                    </div>
                                    <p className="text-slate-500 text-xs">{item.tahunMulai} – {item.tahunSelesai}</p>
                                </div>
                                {item.isAktif && (
                                    <span className="flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">
                                        <CheckCircle2 size={10} /> AKTIF
                                    </span>
                                )}
                            </div>

                            {item.keterangan && (
                                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{item.keterangan}</p>
                            )}

                            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1 border-t border-slate-100">
                                <Users size={12} />
                                <span>{item.pimpinan?.length ?? 0} pimpinan</span>
                                <span className="ml-auto">Urutan: {item.order}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openEdit(item)}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 hover:bg-blue-50 border border-blue-100 rounded-lg text-blue-600 text-xs font-bold transition-colors"
                                >
                                    <Edit2 size={13} /> Edit
                                </button>
                                <button
                                    onClick={() => setDeleteId(item.id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 hover:bg-red-50 border border-red-100 rounded-lg text-red-500 text-xs font-bold transition-colors"
                                >
                                    <Trash2 size={13} /> Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800">{editItem ? 'Edit Periode' : 'Tambah Periode Masa Jabatan'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-5 space-y-4">
                            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Periode * <span className="text-gray-400 font-normal">(contoh: 2024-2029)</span></label>
                                <input
                                    type="text"
                                    value={form.periode}
                                    onChange={e => setForm({ ...form, periode: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                    placeholder="2024-2029"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tahun Mulai *</label>
                                    <input
                                        type="number"
                                        value={form.tahunMulai}
                                        onChange={e => setForm({ ...form, tahunMulai: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                        placeholder="2024"
                                        min="1945"
                                        max="2100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tahun Selesai *</label>
                                    <input
                                        type="number"
                                        value={form.tahunSelesai}
                                        onChange={e => setForm({ ...form, tahunSelesai: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                        placeholder="2029"
                                        min="1945"
                                        max="2100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Urutan Tampilan</label>
                                <input
                                    type="number"
                                    value={form.order}
                                    onChange={e => setForm({ ...form, order: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Keterangan</label>
                                <textarea
                                    value={form.keterangan}
                                    onChange={e => setForm({ ...form, keterangan: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                                    rows={2}
                                    placeholder="Keterangan tambahan..."
                                />
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                <input
                                    id="isAktif"
                                    type="checkbox"
                                    checked={form.isAktif}
                                    onChange={e => setForm({ ...form, isAktif: e.target.checked })}
                                    className="w-4 h-4 text-green-600 rounded"
                                />
                                <label htmlFor="isAktif" className="text-sm font-medium text-green-700 cursor-pointer">
                                    Periode Aktif Saat Ini
                                    <span className="block text-xs text-green-500 font-normal">Mencentang ini akan menonaktifkan periode lain</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 p-5 border-t border-gray-100">
                            <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                                Batal
                            </button>
                            <button onClick={handleSave} disabled={saving} className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-60">
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
                        <h3 className="font-bold text-gray-800 mb-2">Hapus Periode?</h3>
                        <p className="text-gray-500 text-sm mb-5">
                            Data periode ini akan dihapus. Pimpinan yang terhubung tidak akan terhapus tetapi akan kehilangan relasi periode ini.
                        </p>
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

export default AdminMasaJabatanPage;
