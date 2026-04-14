'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, User, ChevronDown } from 'lucide-react';
import {
    fetchAllBanggarInfo,
    createBanggarInfoApi,
    updateBanggarInfoApi,
    deleteBanggarInfoApi,
    createAnggotaBanggar,
    updateAnggotaBanggar,
    deleteAnggotaBanggar,
} from '../../services/api';
import type { BanggarInfo, AnggotaBanggar } from '../../services/api';
import AdminLayout from './AdminLayout';

// Subcomponents
import {
    BanggarInfoModal,
    BanggarAnggotaModal,
    BanggarDeleteConfirm
} from './components/BanggarModals';
import { BanggarAnggotaSection } from './components/BanggarAnggotaSection';

const emptyAnggotaForm = {
    name: '',
    jabatan: 'Anggota',
    faction: '',
    order: '0',
    banggarInfoId: '',
};

const AdminBanggarPage: React.FC = () => {
    const [infoList, setInfoList] = useState<BanggarInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Info form
    const [showInfoForm, setShowInfoForm] = useState(false);
    const [editingInfo, setEditingInfo] = useState<BanggarInfo | null>(null);
    const [infoForm, setInfoForm] = useState({ masaJabatan: '', deskripsi: '', isAktif: true });
    const [savingInfo, setSavingInfo] = useState(false);

    // Anggota form
    const [showAnggotaForm, setShowAnggotaForm] = useState(false);
    const [editingAnggota, setEditingAnggota] = useState<AnggotaBanggar | null>(null);
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
            const data = await fetchAllBanggarInfo();
            setInfoList(data);
            if (data.length > 0 && !expandedInfo) {
                setExpandedInfo(data[0].id);
            }
        } catch (e) {
            setError('Gagal memuat data Banggar');
        }
        setLoading(false);
    }, [token, expandedInfo]);

    useEffect(() => { loadData(); }, [loadData]);

    // ── Info CRUD ──
    const openCreateInfo = () => {
        setEditingInfo(null);
        setInfoForm({ masaJabatan: '', deskripsi: '', isAktif: true });
        setShowInfoForm(true);
    };

    const openEditInfo = (info: BanggarInfo) => {
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
                await updateBanggarInfoApi(editingInfo.id, infoForm, token);
            } else {
                await createBanggarInfoApi(infoForm, token);
            }
            setShowInfoForm(false);
            loadData();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Terjadi kesalahan');
        }
        setSavingInfo(false);
    };

    // ── Anggota CRUD ──
    const openCreateAnggota = (banggarInfoId: string) => {
        setEditingAnggota(null);
        setAnggotaForm({ ...emptyAnggotaForm, banggarInfoId });
        setImageFile(null);
        setImagePreview('');
        setShowAnggotaForm(true);
    };

    const openEditAnggota = (anggota: AnggotaBanggar) => {
        setEditingAnggota(anggota);
        setAnggotaForm({
            name: anggota.name,
            jabatan: anggota.jabatan,
            faction: anggota.faction || '',
            order: String(anggota.order),
            banggarInfoId: anggota.banggarInfoId || '',
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
            fd.append('banggarInfoId', anggotaForm.banggarInfoId);
            if (imageFile) fd.append('image', imageFile);

            if (editingAnggota) {
                await updateAnggotaBanggar(editingAnggota.id, fd, token);
            } else {
                await createAnggotaBanggar(fd, token);
            }
            setShowAnggotaForm(false);
            loadData();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Terjadi kesalahan');
        }
        setSavingAnggota(false);
    };

    // ── Delete ──
    const handleDelete = async () => {
        if (!deleteTarget) return;
        setError('');
        try {
            if (deleteTarget.type === 'info') {
                await deleteBanggarInfoApi(deleteTarget.id, token);
            } else {
                await deleteAnggotaBanggar(deleteTarget.id, token);
            }
            setDeleteTarget(null);
            loadData();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Terjadi kesalahan');
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Badan Anggaran</h1>
                        <p className="text-gray-500 text-sm mt-1">Kelola data anggota Banggar per masa jabatan</p>
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
                        <p className="text-gray-400 font-medium mb-2">Belum ada data Banggar</p>
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
                                                    {ketua.length > 0 && <BanggarAnggotaSection title="Ketua" items={ketua} onEdit={openEditAnggota} onDelete={(a) => setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />}
                                                    {wakil.length > 0 && <BanggarAnggotaSection title="Wakil Ketua" items={wakil} onEdit={openEditAnggota} onDelete={(a) => setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />}
                                                    {anggota.length > 0 && <BanggarAnggotaSection title="Anggota" items={anggota} onEdit={openEditAnggota} onDelete={(a) => setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />}
                                                    {sekretaris.length > 0 && <BanggarAnggotaSection title="Sekretaris" items={sekretaris} onEdit={openEditAnggota} onDelete={(a) => setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />}
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

            {/* Modals placed here */}
            <BanggarInfoModal
                show={showInfoForm}
                onClose={() => setShowInfoForm(false)}
                isEditing={!!editingInfo}
                formData={infoForm}
                setFormData={setInfoForm}
                onSave={handleSaveInfo}
                saving={savingInfo}
            />

            <BanggarAnggotaModal
                show={showAnggotaForm}
                onClose={() => setShowAnggotaForm(false)}
                isEditing={!!editingAnggota}
                formData={anggotaForm}
                setFormData={setAnggotaForm}
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
                onSave={handleSaveAnggota}
                saving={savingAnggota}
            />

            <BanggarDeleteConfirm
                show={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                target={deleteTarget}
            />
        </AdminLayout>
    );
};

export default AdminBanggarPage;
