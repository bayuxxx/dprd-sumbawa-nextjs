'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Upload, User, Save, ChevronDown } from 'lucide-react';
import {
    fetchAllBKInfo,
    createBKInfoApi,
    updateBKInfoApi,
    deleteBKInfoApi,
    createAnggotaBK,
    updateAnggotaBK,
    deleteAnggotaBK,
} from '../../services/api';
import type { BKInfo, AnggotaBK } from '../../services/api';
import AdminLayout from './AdminLayout';

const JABATAN_OPTIONS = ['Ketua', 'Wakil Ketua', 'Anggota', 'Sekretaris'];

const emptyAnggotaForm = {
    name: '',
    jabatan: 'Anggota',
    faction: '',
    order: '0',
    bkInfoId: '',
};

const AdminBKPage: React.FC = () => {
    const [infoList, setInfoList] = useState<BKInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Info form
    const [showInfoForm, setShowInfoForm] = useState(false);
    const [editingInfo, setEditingInfo] = useState<BKInfo | null>(null);
    const [infoForm, setInfoForm] = useState({ masaJabatan: '', deskripsi: '', isAktif: true });
    const [savingInfo, setSavingInfo] = useState(false);

    // Anggota form
    const [showAnggotaForm, setShowAnggotaForm] = useState(false);
    const [editingAnggota, setEditingAnggota] = useState<AnggotaBK | null>(null);
    const [anggotaForm, setAnggotaForm] = useState(emptyAnggotaForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [savingAnggota, setSavingAnggota] = useState(false);

    // Delete confirm
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'info' | 'anggota'; id: string; name: string } | null>(null);

    // Expanded
    const [expandedInfo, setExpandedInfo] = useState<string>('');

    const token = localStorage.getItem('admin_token') || '';

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAllBKInfo();
            setInfoList(data);
            if (data.length > 0 && !expandedInfo) {
                setExpandedInfo(data[0].id);
            }
        } catch {
            setError('Gagal memuat data Badan Kehormatan');
        }
        setLoading(false);
    }, [expandedInfo]);

    useEffect(() => { loadData(); }, [loadData]);

    // ── Info CRUD ──
    const openCreateInfo = () => {
        setEditingInfo(null);
        setInfoForm({ masaJabatan: '', deskripsi: '', isAktif: true });
        setShowInfoForm(true);
    };

    const openEditInfo = (info: BKInfo) => {
        setEditingInfo(info);
        setInfoForm({
            masaJabatan: info.masaJabatan,
            deskripsi: info.deskripsi || '',
            isAktif: info.isAktif,
        });
        setShowInfoForm(true);
    };

    const handleSaveInfo = async () => {
        if (!infoForm.masaJabatan.trim()) {
            setError('Masa jabatan wajib diisi');
            return;
        }
        setSavingInfo(true);
        setError('');
        try {
            if (editingInfo) {
                await updateBKInfoApi(editingInfo.id, infoForm, token);
            } else {
                await createBKInfoApi(infoForm, token);
            }
            setShowInfoForm(false);
            loadData();
        } catch (e: any) {
            setError(e.message);
        }
        setSavingInfo(false);
    };

    // ── Anggota CRUD ──
    const openCreateAnggota = (bkInfoId: string) => {
        setEditingAnggota(null);
        setAnggotaForm({ ...emptyAnggotaForm, bkInfoId });
        setImageFile(null);
        setImagePreview('');
        setShowAnggotaForm(true);
    };

    const openEditAnggota = (anggota: AnggotaBK) => {
        setEditingAnggota(anggota);
        setAnggotaForm({
            name: anggota.name,
            jabatan: anggota.jabatan,
            faction: anggota.faction || '',
            order: String(anggota.order),
            bkInfoId: anggota.bkInfoId || '',
        });
        setImageFile(null);
        setImagePreview(anggota.imageUrl || '');
        setShowAnggotaForm(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSaveAnggota = async () => {
        if (!anggotaForm.name.trim() || !anggotaForm.jabatan) {
            setError('Nama dan jabatan wajib diisi');
            return;
        }
        setSavingAnggota(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('name', anggotaForm.name);
            fd.append('jabatan', anggotaForm.jabatan);
            fd.append('faction', anggotaForm.faction);
            fd.append('order', anggotaForm.order);
            fd.append('bkInfoId', anggotaForm.bkInfoId);
            if (imageFile) fd.append('image', imageFile);

            if (editingAnggota) {
                await updateAnggotaBK(editingAnggota.id, fd, token);
            } else {
                await createAnggotaBK(fd, token);
            }
            setShowAnggotaForm(false);
            loadData();
        } catch (e: any) {
            setError(e.message);
        }
        setSavingAnggota(false);
    };

    // ── Delete ──
    const handleDelete = async () => {
        if (!deleteTarget) return;
        setError('');
        try {
            if (deleteTarget.type === 'info') {
                await deleteBKInfoApi(deleteTarget.id, token);
            } else {
                await deleteAnggotaBK(deleteTarget.id, token);
            }
            setDeleteTarget(null);
            loadData();
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Badan Kehormatan</h1>
                        <p className="text-gray-500 text-sm mt-1">Kelola data anggota Badan Kehormatan per masa jabatan</p>
                    </div>
                    <button
                        onClick={openCreateInfo}
                        className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-105 transition-all"
                    >
                        <Plus size={16} /> Tambah Masa Jabatan
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
                        <span className="text-sm font-medium">{error}</span>
                        <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100" />
                        ))}
                    </div>
                ) : infoList.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                        <User size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium mb-2">Belum ada data Badan Kehormatan</p>
                        <p className="text-gray-400 text-sm">Klik tombol "Tambah Masa Jabatan" untuk memulai.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {infoList.map((info) => {
                            const isExp = expandedInfo === info.id;
                            const ketua = info.anggota.filter((a) => a.jabatan === 'Ketua');
                            const wakil = info.anggota.filter((a) => a.jabatan === 'Wakil Ketua');
                            const anggota = info.anggota.filter((a) => a.jabatan === 'Anggota');
                            const sekretaris = info.anggota.filter((a) => a.jabatan === 'Sekretaris');

                            return (
                                <div key={info.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    {/* Info Header */}
                                    <div
                                        className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => setExpandedInfo(isExp ? '' : info.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isExp ? 'rotate-180' : ''}`} />
                                            <div>
                                                <h3 className="font-bold text-gray-900">Masa Jabatan {info.masaJabatan}</h3>
                                                <p className="text-xs text-gray-500">{info.anggota.length} anggota</p>
                                            </div>
                                            {info.isAktif && (
                                                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                                    Aktif
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => openEditInfo(info)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Info"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget({ type: 'info', id: info.id, name: `Masa Jabatan ${info.masaJabatan}` })}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expandable Content */}
                                    <div className={`overflow-hidden transition-all duration-300 ${isExp ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="border-t border-gray-100 p-5">
                                            {info.deskripsi && (
                                                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-600 leading-relaxed">
                                                    {info.deskripsi}
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Daftar Anggota</h4>
                                                <button
                                                    onClick={() => openCreateAnggota(info.id)}
                                                    className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
                                                >
                                                    <Plus size={14} /> Tambah Anggota
                                                </button>
                                            </div>

                                            {info.anggota.length === 0 ? (
                                                <p className="text-gray-400 text-sm text-center py-8">Belum ada anggota. Klik "Tambah Anggota" untuk memulai.</p>
                                            ) : (
                                                <div className="space-y-6">
                                                    {ketua.length > 0 && (
                                                        <AnggotaSection title="Ketua" items={ketua} onEdit={openEditAnggota} onDelete={(a) => setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />
                                                    )}
                                                    {wakil.length > 0 && (
                                                        <AnggotaSection title="Wakil Ketua" items={wakil} onEdit={openEditAnggota} onDelete={(a) => setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />
                                                    )}
                                                    {anggota.length > 0 && (
                                                        <AnggotaSection title="Anggota" items={anggota} onEdit={openEditAnggota} onDelete={(a) => setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />
                                                    )}
                                                    {sekretaris.length > 0 && (
                                                        <AnggotaSection title="Sekretaris" items={sekretaris} onEdit={openEditAnggota} onDelete={(a) => setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Info Modal ── */}
            {showInfoForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowInfoForm(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-lg font-black text-gray-900">
                                {editingInfo ? 'Edit Masa Jabatan BK' : 'Tambah Masa Jabatan BK'}
                            </h2>
                            <button onClick={() => setShowInfoForm(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Masa Jabatan *</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder="Contoh: 2024-2029"
                                    value={infoForm.masaJabatan}
                                    onChange={(e) => setInfoForm({ ...infoForm, masaJabatan: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi</label>
                                <textarea
                                    rows={4}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                                    placeholder="Deskripsi..."
                                    value={infoForm.deskripsi}
                                    onChange={(e) => setInfoForm({ ...infoForm, deskripsi: e.target.value })}
                                />
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={infoForm.isAktif}
                                    onChange={(e) => setInfoForm({ ...infoForm, isAktif: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Aktif (tampilkan di halaman publik)</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
                            <button
                                onClick={() => setShowInfoForm(false)}
                                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveInfo}
                                disabled={savingInfo}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50"
                            >
                                <Save size={16} />
                                {savingInfo ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Anggota Modal ── */}
            {showAnggotaForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAnggotaForm(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-black text-gray-900">
                                {editingAnggota ? 'Edit Anggota BK' : 'Tambah Anggota BK'}
                            </h2>
                            <button onClick={() => setShowAnggotaForm(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Foto</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-24 rounded-xl bg-gray-100 overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={28} className="text-gray-300" />
                                        )}
                                    </div>
                                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors">
                                        <Upload size={16} />
                                        Pilih Foto
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nama *</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder="Nama lengkap"
                                    value={anggotaForm.name}
                                    onChange={(e) => setAnggotaForm({ ...anggotaForm, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Jabatan *</label>
                                <select
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white"
                                    value={anggotaForm.jabatan}
                                    onChange={(e) => setAnggotaForm({ ...anggotaForm, jabatan: e.target.value })}
                                >
                                    {JABATAN_OPTIONS.map((j) => (
                                        <option key={j} value={j}>{j}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Fraksi</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder="Contoh: Fraksi PKS"
                                    value={anggotaForm.faction}
                                    onChange={(e) => setAnggotaForm({ ...anggotaForm, faction: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Urutan</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder="0"
                                    value={anggotaForm.order}
                                    onChange={(e) => setAnggotaForm({ ...anggotaForm, order: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white">
                            <button
                                onClick={() => setShowAnggotaForm(false)}
                                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveAnggota}
                                disabled={savingAnggota}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50"
                            >
                                <Save size={16} />
                                {savingAnggota ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm ── */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} className="text-red-600" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-2">Hapus Data?</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Anda yakin ingin menghapus <span className="font-bold text-gray-700">{deleteTarget.name}</span>?
                            {deleteTarget.type === 'info' && ' Semua anggota di bawahnya juga akan ikut terhapus.'}
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

// ── Sub-component: AnggotaSection ──
const AnggotaSection: React.FC<{
    title: string;
    items: AnggotaBK[];
    onEdit: (a: AnggotaBK) => void;
    onDelete: (a: AnggotaBK) => void;
}> = ({ title, items, onEdit, onDelete }) => (
    <div>
        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{title}</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((anggota) => (
                <div key={anggota.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all group">
                    <div className="w-12 h-14 rounded-lg bg-white border border-gray-100 overflow-hidden flex-shrink-0">
                        {anggota.imageUrl ? (
                            <img src={anggota.imageUrl} alt={anggota.name} className="w-full h-full object-cover object-top" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                <User size={18} className="text-gray-300" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{anggota.name}</p>
                        <p className="text-xs text-gray-500">{anggota.faction || '-'}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit(anggota)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={() => onDelete(anggota)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default AdminBKPage;
