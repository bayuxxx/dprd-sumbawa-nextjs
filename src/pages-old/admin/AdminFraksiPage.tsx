'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Upload, User, Save, ChevronDown, Palette, CheckCircle2, AlertCircle } from 'lucide-react';
import {
    fetchAllFraksiInfo,
    createFraksiInfo,
    updateFraksiInfo,
    deleteFraksiInfo,
    createAnggotaFraksi,
    updateAnggotaFraksi,
    deleteAnggotaFraksi,
    fetchMasaJabatan,
    createMasaJabatan,
    updateMasaJabatan,
    deleteMasaJabatan,
} from '../../services/api';
import type { FraksiInfo, AnggotaFraksi, MasaJabatan } from '../../services/api';
import AdminLayout from './AdminLayout';

const emptyMasaJabatanForm = {
    periode: '',
    tahunMulai: '',
    tahunSelesai: '',
    isAktif: false,
    keterangan: '',
    order: '0',
};

const JABATAN_OPTIONS = ['Ketua Fraksi', 'Wakil Ketua', 'Sekretaris', 'Anggota'];

const emptyAnggotaForm = {
    name: '',
    jabatan: 'Anggota',
    faction: '',
    order: '0',
    fraksiInfoId: '',
};

const AdminFraksiPage: React.FC = () => {
    const [fraksiList, setFraksiList] = useState<FraksiInfo[]>([]);
    const [masaJabatanList, setMasaJabatanList] = useState<MasaJabatan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fraksi Info form
    const [showInfoForm, setShowInfoForm] = useState(false);
    const [editingInfo, setEditingInfo] = useState<FraksiInfo | null>(null);
    const [infoForm, setInfoForm] = useState({
        name: '', shortName: '', slug: '', color: '#c8102e', kursi: '0',
        masaJabatanId: '', deskripsi: '', isAktif: true
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [savingInfo, setSavingInfo] = useState(false);

    // Anggota form
    const [showAnggotaForm, setShowAnggotaForm] = useState(false);
    const [editingAnggota, setEditingAnggota] = useState<AnggotaFraksi | null>(null);
    const [anggotaForm, setAnggotaForm] = useState(emptyAnggotaForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [savingAnggota, setSavingAnggota] = useState(false);

    // Delete confirm
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'info' | 'anggota'; id: string; name: string } | null>(null);

    // Expanded
    const [expandedInfo, setExpandedInfo] = useState<string>('');

    // Masa Jabatan modal state
    const [showMjForm, setShowMjForm] = useState(false);
    const [editingMj, setEditingMj] = useState<MasaJabatan | null>(null);
    const [mjForm, setMjForm] = useState(emptyMasaJabatanForm);
    const [savingMj, setSavingMj] = useState(false);
    const [expandedMj, setExpandedMj] = useState<string>('');

    const token = localStorage.getItem('admin_token') || '';

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [dataFraksi, dataMj] = await Promise.all([
                fetchAllFraksiInfo(),
                fetchMasaJabatan()
            ]);
            setFraksiList(dataFraksi);
            setMasaJabatanList(dataMj);

            if (dataMj.length > 0 && !expandedMj) {
                setExpandedMj(dataMj[0].id);
            }
        } catch {
            setError('Gagal memuat data fraksi');
        }
        setLoading(false);
    }, [token]);

    useEffect(() => { loadData(); }, [loadData]);

    // ── Info CRUD ──
    const openCreateInfo = () => {
        setEditingInfo(null);
        setInfoForm({
            name: '', shortName: '', slug: '', color: '#c8102e', kursi: '0',
            masaJabatanId: masaJabatanList.find(m => m.isAktif)?.id || '', deskripsi: '', isAktif: true
        });
        setLogoFile(null);
        setLogoPreview('');
        setShowInfoForm(true);
    };

    const openEditInfo = (info: FraksiInfo) => {
        setEditingInfo(info);
        setInfoForm({
            name: info.name,
            shortName: info.shortName,
            slug: info.slug,
            color: info.color,
            kursi: String(info.kursi),
            masaJabatanId: info.masaJabatan?.id || '',
            deskripsi: info.deskripsi || '',
            isAktif: info.isAktif,
        });
        setLogoFile(null);
        setLogoPreview(info.logoUrl || '');
        setShowInfoForm(true);
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const generateSlug = (text: string) => {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const handleSaveInfo = async () => {
        if (!infoForm.name.trim() || !infoForm.shortName.trim()) {
            setError('Nama dan nama singkat wajib diisi');
            return;
        }
        setSavingInfo(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('name', infoForm.name);
            fd.append('shortName', infoForm.shortName);
            fd.append('slug', infoForm.slug || generateSlug(infoForm.shortName));
            fd.append('color', infoForm.color);
            fd.append('kursi', infoForm.kursi);
            fd.append('masaJabatanId', infoForm.masaJabatanId);
            fd.append('deskripsi', infoForm.deskripsi);
            fd.append('isAktif', String(infoForm.isAktif));
            if (logoFile) fd.append('logo', logoFile);

            if (editingInfo) {
                await updateFraksiInfo(editingInfo.id, fd, token);
            } else {
                await createFraksiInfo(fd, token);
            }
            setShowInfoForm(false);
            loadData();
        } catch (e: any) {
            setError(e.message);
        }
        setSavingInfo(false);
    };

    // ── Anggota CRUD ──
    const openCreateAnggota = (fraksiInfoId: string) => {
        setEditingAnggota(null);
        setAnggotaForm({ ...emptyAnggotaForm, fraksiInfoId });
        setImageFile(null);
        setImagePreview('');
        setShowAnggotaForm(true);
    };

    const openEditAnggota = (anggota: AnggotaFraksi) => {
        setEditingAnggota(anggota);
        setAnggotaForm({
            name: anggota.name,
            jabatan: anggota.jabatan,
            faction: anggota.faction || '',
            order: String(anggota.order),
            fraksiInfoId: anggota.fraksiInfoId || '',
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
            fd.append('fraksiInfoId', anggotaForm.fraksiInfoId);
            if (imageFile) fd.append('image', imageFile);

            if (editingAnggota) {
                await updateAnggotaFraksi(editingAnggota.id, fd, token);
            } else {
                await createAnggotaFraksi(fd, token);
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
            if (deleteTarget.type === 'masaJabatan' as any) {
                await deleteMasaJabatan(deleteTarget.id, token);
            } else if (deleteTarget.type === 'info') {
                await deleteFraksiInfo(deleteTarget.id, token);
            } else {
                await deleteAnggotaFraksi(deleteTarget.id, token);
            }
            setDeleteTarget(null);
            loadData();
        } catch (e: any) {
            setError(e.message);
        }
    };

    // ── Masa Jabatan CRUD ──
    const openCreateMj = () => {
        setEditingMj(null);
        setMjForm(emptyMasaJabatanForm);
        setShowMjForm(true);
    };

    const openEditMj = (mj: MasaJabatan) => {
        setEditingMj(mj);
        setMjForm({
            periode: mj.periode,
            tahunMulai: String(mj.tahunMulai),
            tahunSelesai: String(mj.tahunSelesai),
            isAktif: mj.isAktif,
            keterangan: mj.keterangan || '',
            order: String(mj.order),
        });
        setShowMjForm(true);
    };

    const handleSaveMj = async () => {
        if (!mjForm.periode || !mjForm.tahunMulai || !mjForm.tahunSelesai) {
            setError('Semua kolom wajib diisi');
            return;
        }

        setSavingMj(true);
        setError('');

        try {
            const payload = {
                ...mjForm,
                tahunMulai: parseInt(mjForm.tahunMulai),
                tahunSelesai: parseInt(mjForm.tahunSelesai),
                order: parseInt(mjForm.order) || 0,
            };

            if (editingMj) {
                await updateMasaJabatan(editingMj.id, payload, token);
            } else {
                await createMasaJabatan(payload, token);
            }
            setShowMjForm(false);
            loadData();
        } catch (e: any) {
            setError(e.message);
        }
        setSavingMj(false);
    };

    // Grouping Fraksi by Masa Jabatan
    const groupedData = React.useMemo(() => {
        const groups: { [key: string]: { mj: MasaJabatan | null, fraksi: FraksiInfo[] } } = {};

        // Always include all MasaJabatan
        masaJabatanList.forEach(mj => {
            groups[mj.id] = { mj, fraksi: [] };
        });

        // Distribute fraksi into groups
        fraksiList.forEach(f => {
            const mjId = f.masaJabatan?.id;
            if (mjId && groups[mjId]) {
                groups[mjId].fraksi.push(f);
            } else {
                if (!groups['unassigned']) {
                    groups['unassigned'] = { mj: null, fraksi: [] };
                }
                groups['unassigned'].fraksi.push(f);
            }
        });

        return groups;
    }, [fraksiList, masaJabatanList]);

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Manajemen Fraksi</h1>
                        <p className="text-gray-500 text-sm mt-1">Kelola data fraksi dan anggota per masa jabatan</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={openCreateMj}
                            className="flex items-center justify-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all flex-1 md:flex-none"
                        >
                            <Plus size={16} /> Masa Jabatan
                        </button>
                        <button
                            onClick={openCreateInfo}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-105 transition-all flex-1 md:flex-none"
                        >
                            <Plus size={16} /> Fraksi
                        </button>
                    </div>
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
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100" />
                        ))}
                    </div>
                ) : fraksiList.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                        <Palette size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium mb-2">Belum ada data Masa Jabatan / Fraksi</p>
                        <p className="text-gray-400 text-sm">Tambahkan Masa Jabatan terlebih dahulu, lalu tambahkan Fraksi.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.values(groupedData).map(({ mj, fraksi }) => {
                            const isGroupExpanded = expandedMj === (mj?.id || 'unassigned');
                            const groupName = mj ? `Periode ${mj.periode}` : 'Tanpa Masa Jabatan';

                            return (
                                <div key={mj?.id || 'unassigned'} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div
                                        className="bg-gray-50 px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => setExpandedMj(isGroupExpanded ? '' : (mj?.id || 'unassigned'))}
                                    >
                                        <div className="flex items-center gap-3">
                                            <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isGroupExpanded ? 'rotate-180' : ''}`} />
                                            <h2 className="text-lg font-black text-gray-900">{groupName}</h2>
                                            {mj?.isAktif && (
                                                <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-lg">
                                                    <CheckCircle2 size={12} />
                                                    Aktif
                                                </span>
                                            )}
                                            <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">
                                                {fraksi.length} Fraksi
                                            </span>
                                        </div>

                                        {mj && (
                                            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                                <button onClick={() => openEditMj(mj)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => setDeleteTarget({ type: 'masaJabatan' as any, id: mj.id, name: mj.periode })} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className={`transition-all duration-300 ${isGroupExpanded ? 'max-h-[10000px] opacity-100 border-t border-gray-200' : 'max-h-0 opacity-0'}`}>
                                        <div className="p-4 space-y-4">
                                            {fraksi.length === 0 ? (
                                                <div className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                                    <p className="text-sm font-medium text-gray-500">Belum ada fraksi pada masa jabatan ini.</p>
                                                    <button onClick={openCreateInfo} className="mt-3 text-red-600 text-sm font-bold hover:underline">
                                                        Tambah Fraksi Sekarang
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {fraksi.map((info) => {
                                                        const isExp = expandedInfo === info.id;
                                                        const ketua = info.anggota.filter((a) => a.jabatan === 'Ketua Fraksi');
                                                        const wakil = info.anggota.filter((a) => a.jabatan === 'Wakil Ketua');
                                                        const sekretaris = info.anggota.filter((a) => a.jabatan === 'Sekretaris');
                                                        const anggota = info.anggota.filter((a) => a.jabatan === 'Anggota');

                                                        return (
                                                            <div key={info.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                                                {/* Info Header */}
                                                                <div
                                                                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                                                                    onClick={() => setExpandedInfo(isExp ? '' : info.id)}
                                                                >
                                                                    <div className="flex items-center gap-4">
                                                                        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isExp ? 'rotate-180' : ''}`} />
                                                                        <div
                                                                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
                                                                            style={{ backgroundColor: info.color }}
                                                                        >
                                                                            {info.logoUrl ? (
                                                                                <img src={info.logoUrl} alt="" className="w-6 h-6 object-contain" />
                                                                            ) : (
                                                                                <span className="text-white font-black text-sm">{info.shortName[0]}</span>
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            <div className="flex items-center gap-3">
                                                                                <h3 className="font-bold text-gray-900">{info.name}</h3>
                                                                                {info.isAktif && (
                                                                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                                                                        Aktif
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <p className="text-xs text-gray-500">
                                                                                {info.shortName} · {info.kursi} Kursi · {info.anggota.length} anggota
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                                        <button
                                                                            onClick={() => openEditInfo(info)}
                                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                            title="Edit Fraksi"
                                                                        >
                                                                            <Edit2 size={16} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setDeleteTarget({ type: 'info', id: info.id, name: info.name })}
                                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                            title="Hapus"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* Content */}
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
                                                                                {ketua.length > 0 && <AnggotaSection title="Ketua Fraksi" items={ketua} color={info.color} onEdit={openEditAnggota} onDelete={(a) => setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />}
                                                                                {wakil.length > 0 && <AnggotaSection title="Wakil Ketua" items={wakil} color={info.color} onEdit={openEditAnggota} onDelete={(a) => setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />}
                                                                                {sekretaris.length > 0 && <AnggotaSection title="Sekretaris" items={sekretaris} color={info.color} onEdit={openEditAnggota} onDelete={(a) => setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />}
                                                                                {anggota.length > 0 && <AnggotaSection title="Anggota" items={anggota} color={info.color} onEdit={openEditAnggota} onDelete={(a) => setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />}
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
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Fraksi Info Modal ── */}
            {showInfoForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowInfoForm(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-black text-gray-900">
                                {editingInfo ? 'Edit Fraksi' : 'Tambah Fraksi Baru'}
                            </h2>
                            <button onClick={() => setShowInfoForm(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Logo Partai</label>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 h-16 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-red-300 transition-colors"
                                        style={{ backgroundColor: infoForm.color + '20' }}
                                        onClick={() => document.getElementById('fraksi-logo-input')?.click()}
                                    >
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="" className="w-full h-full object-contain p-1" />
                                        ) : (
                                            <Upload size={20} className="text-gray-300" />
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <p>Klik untuk upload logo</p>
                                        <p>Format JPG/PNG, max 2MB</p>
                                    </div>
                                </div>
                                <input id="fraksi-logo-input" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap Fraksi *</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder="Fraksi Partai Gerakan Indonesia Raya"
                                    value={infoForm.name}
                                    onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama Singkat *</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                        placeholder="Gerindra"
                                        value={infoForm.shortName}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setInfoForm({
                                                ...infoForm,
                                                shortName: v,
                                                slug: !editingInfo ? generateSlug(v) : infoForm.slug,
                                            });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Slug</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                        placeholder="gerindra"
                                        value={infoForm.slug}
                                        onChange={(e) => setInfoForm({ ...infoForm, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Warna</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={infoForm.color}
                                            onChange={(e) => setInfoForm({ ...infoForm, color: e.target.value })}
                                            className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
                                        />
                                        <input
                                            type="text"
                                            value={infoForm.color}
                                            onChange={(e) => setInfoForm({ ...infoForm, color: e.target.value })}
                                            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Jumlah Kursi</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                        value={infoForm.kursi}
                                        onChange={(e) => setInfoForm({ ...infoForm, kursi: e.target.value })}
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Masa Jabatan</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white"
                                        value={infoForm.masaJabatanId}
                                        onChange={(e) => setInfoForm({ ...infoForm, masaJabatanId: e.target.value })}
                                    >
                                        <option value="">-- Pilih Masa Jabatan --</option>
                                        {masaJabatanList.map(mj => (
                                            <option key={mj.id} value={mj.id}>{mj.periode}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi</label>
                                <textarea
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                                    placeholder="Deskripsi tentang fraksi..."
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

                        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white">
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
                                {editingAnggota ? 'Edit Anggota' : 'Tambah Anggota'}
                            </h2>
                            <button onClick={() => setShowAnggotaForm(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Image */}
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
                                <label className="block text-sm font-bold text-gray-700 mb-1">Fraksi / Partai</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                    placeholder="Contoh: Fraksi Gerindra"
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
                            {deleteTarget.type === 'masaJabatan' as any && ' Semua pimpinan/fraksi di dalamnya akan terpengaruh.'}
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
            {/* ── Masa Jabatan Modal ── */}
            {showMjForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowMjForm(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                            <h2 className="text-lg font-black text-gray-900">
                                {editingMj ? 'Edit Masa Jabatan' : 'Tambah Masa Jabatan'}
                            </h2>
                            <button onClick={() => setShowMjForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {!editingMj && (
                                <div className="bg-blue-50 text-blue-700 p-4 rounded-xl flex items-start gap-3 border border-blue-100 mb-2">
                                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                                    <div className="text-sm space-y-1">
                                        <p className="font-bold">Info Penting</p>
                                        <p>Masa Jabatan ini bisa digunakan untuk mengelompokkan Fraksi, Pimpinan, dan AKD lainnya pada periode yang sama.</p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Periode *</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                    placeholder="Contoh: 2024-2029"
                                    value={mjForm.periode}
                                    onChange={(e) => setMjForm({ ...mjForm, periode: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tahun Mulai *</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="2024"
                                        value={mjForm.tahunMulai}
                                        onChange={(e) => setMjForm({ ...mjForm, tahunMulai: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tahun Selesai *</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                        placeholder="2029"
                                        value={mjForm.tahunSelesai}
                                        onChange={(e) => setMjForm({ ...mjForm, tahunSelesai: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Keterangan</label>
                                <textarea
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none"
                                    placeholder="Keterangan opsional..."
                                    rows={3}
                                    value={mjForm.keterangan}
                                    onChange={(e) => setMjForm({ ...mjForm, keterangan: e.target.value })}
                                />
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer mt-2 w-fit">
                                <input
                                    type="checkbox"
                                    checked={mjForm.isAktif}
                                    onChange={(e) => setMjForm({ ...mjForm, isAktif: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm font-bold text-gray-700">Set sebagai Periode Aktif Saat Ini</span>
                            </label>
                        </div>
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={() => setShowMjForm(false)}
                                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveMj}
                                disabled={savingMj}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50"
                            >
                                <Save size={16} />
                                {savingMj ? 'Menyimpan...' : 'Simpan Masa Jabatan'}
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
    items: AnggotaFraksi[];
    color: string;
    onEdit: (a: AnggotaFraksi) => void;
    onDelete: (a: AnggotaFraksi) => void;
}> = ({ title, items, color, onEdit, onDelete }) => (
    <div>
        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{title}</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((anggota) => (
                <div key={anggota.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all group">
                    <div className="w-12 h-14 rounded-lg bg-white border border-gray-100 overflow-hidden flex-shrink-0">
                        {anggota.imageUrl ? (
                            <img src={anggota.imageUrl} alt={anggota.name} className="w-full h-full object-cover object-top" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: color + '15' }}>
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

export default AdminFraksiPage;
