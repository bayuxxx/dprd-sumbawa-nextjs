'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Upload, User, Save, FileText, Users2, Star } from 'lucide-react';
import {
    fetchSekretariatInfo,
    upsertSekretariatInfo,
    fetchAnggotaSekretariat,
    createAnggotaSekretariat,
    updateAnggotaSekretariat,
    deleteAnggotaSekretariat,
} from '../../services/api';
import type { SekretariatInfo, AnggotaSekretariat } from '../../services/api';
import AdminLayout from './AdminLayout';

type TabType = 'info' | 'anggota';

const emptyAnggotaForm = {
    name: '',
    position: '',
    unit: '',
    isSekretaris: false,
    order: '0',
};

const AdminSekretariatPage: React.FC = () => {
    const [tab, setTab] = useState<TabType>('info');
    const token = localStorage.getItem('admin_token') || '';

    // ─── Info State ───
    const [_info, setInfo] = useState<SekretariatInfo | null>(null);
    const [infoForm, setInfoForm] = useState({ visi: '', misi: '', tugas: '', fungsi: '' });
    const [loadingInfo, setLoadingInfo] = useState(true);
    const [savingInfo, setSavingInfo] = useState(false);
    const [infoMsg, setInfoMsg] = useState('');

    // ─── Anggota State ───
    const [anggota, setAnggota] = useState<AnggotaSekretariat[]>([]);
    const [loadingAnggota, setLoadingAnggota] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<AnggotaSekretariat | null>(null);
    const [form, setForm] = useState(emptyAnggotaForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // ─── Load Data ───
    const loadInfo = useCallback(async () => {
        setLoadingInfo(true);
        const data = await fetchSekretariatInfo();
        setInfo(data);
        if (data) {
            setInfoForm({
                visi: data.visi || '',
                misi: data.misi || '',
                tugas: data.tugas || '',
                fungsi: data.fungsi || '',
            });
        }
        setLoadingInfo(false);
    }, []);

    const loadAnggota = useCallback(async () => {
        setLoadingAnggota(true);
        const data = await fetchAnggotaSekretariat();
        setAnggota(data);
        setLoadingAnggota(false);
    }, []);

    useEffect(() => {
        loadInfo();
        loadAnggota();
    }, [loadInfo, loadAnggota]);

    // ─── Info Handlers ───
    const handleSaveInfo = async () => {
        setSavingInfo(true);
        setInfoMsg('');
        try {
            await upsertSekretariatInfo(infoForm, token);
            setInfoMsg('✓ Berhasil disimpan');
            loadInfo();
        } catch (err: unknown) {
            setInfoMsg(err instanceof Error ? err.message : 'Gagal menyimpan');
        } finally {
            setSavingInfo(false);
            setTimeout(() => setInfoMsg(''), 3000);
        }
    };

    // ─── Anggota Handlers ───
    const openCreate = () => {
        setEditItem(null);
        setForm(emptyAnggotaForm);
        setImageFile(null);
        setImagePreview('');
        setError('');
        setShowModal(true);
    };

    const openEdit = (item: AnggotaSekretariat) => {
        setEditItem(item);
        setForm({
            name: item.name,
            position: item.position,
            unit: item.unit || '',
            isSekretaris: item.isSekretaris,
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
        if (!form.name.trim()) { setError('Nama diperlukan'); return; }
        if (!form.position.trim()) { setError('Jabatan diperlukan'); return; }
        setSaving(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('name', form.name);
            fd.append('position', form.position);
            fd.append('unit', form.unit);
            fd.append('isSekretaris', String(form.isSekretaris));
            fd.append('order', form.order);
            if (imageFile) fd.append('image', imageFile);

            if (editItem) {
                await updateAnggotaSekretariat(editItem.id, fd, token);
            } else {
                await createAnggotaSekretariat(fd, token);
            }
            setShowModal(false);
            loadAnggota();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Gagal menyimpan');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        await deleteAnggotaSekretariat(deleteId, token);
        setDeleteId(null);
        loadAnggota();
    };

    const sekretarisList = anggota.filter(a => a.isSekretaris);
    const staffList = anggota.filter(a => !a.isSekretaris);

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Sekretariat</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Kelola informasi sekretariat DPRD dan <span className="font-bold text-primary">{anggota.length}</span> anggota
                    </p>
                </div>
                {tab === 'anggota' && (
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#0a2744] to-[#123b66] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all"
                    >
                        <Plus size={18} strokeWidth={2.5} /> Tambah Anggota
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setTab('info')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'info'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-primary'
                        }`}
                >
                    <FileText size={15} />
                    Visi, Misi & Tugas
                </button>
                <button
                    onClick={() => setTab('anggota')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'anggota'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-primary'
                        }`}
                >
                    <Users2 size={15} />
                    Anggota Sekretariat
                    <span className={`text-xs px-2 py-0.5 rounded-full ${tab === 'anggota' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {anggota.length}
                    </span>
                </button>
            </div>

            {/* ─── TAB: Info (Visi, Misi, Tugas, Fungsi) ─── */}
            {tab === 'info' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    {loadingInfo ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-6 bg-gray-100 rounded w-1/3" />
                            <div className="h-24 bg-gray-100 rounded" />
                            <div className="h-6 bg-gray-100 rounded w-1/3" />
                            <div className="h-24 bg-gray-100 rounded" />
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Visi</label>
                                <textarea
                                    value={infoForm.visi}
                                    onChange={e => setInfoForm({ ...infoForm, visi: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
                                    rows={3}
                                    placeholder="Masukkan visi sekretariat DPRD..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Misi</label>
                                <textarea
                                    value={infoForm.misi}
                                    onChange={e => setInfoForm({ ...infoForm, misi: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
                                    rows={3}
                                    placeholder="Masukkan misi sekretariat DPRD..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Tugas</label>
                                <textarea
                                    value={infoForm.tugas}
                                    onChange={e => setInfoForm({ ...infoForm, tugas: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
                                    rows={4}
                                    placeholder="Masukkan tugas pokok sekretariat..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Fungsi</label>
                                <p className="text-xs text-slate-400 mb-1.5">Masukkan dalam format JSON array, contoh: ["Fungsi 1", "Fungsi 2", "Fungsi 3"]</p>
                                <textarea
                                    value={infoForm.fungsi}
                                    onChange={e => setInfoForm({ ...infoForm, fungsi: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-primary resize-none"
                                    rows={6}
                                    placeholder='["Penyusunan rencana strategis...", "Pelaksanaan rencana strategis..."]'
                                />
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                                <button
                                    onClick={handleSaveInfo}
                                    disabled={savingInfo}
                                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-dark disabled:opacity-60 transition-colors"
                                >
                                    <Save size={16} />
                                    {savingInfo ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                                {infoMsg && (
                                    <span className={`text-sm font-medium ${infoMsg.startsWith('✓') ? 'text-green-600' : 'text-red-500'}`}>
                                        {infoMsg}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ─── TAB: Anggota Sekretariat ─── */}
            {tab === 'anggota' && (
                <div>
                    {loadingAnggota ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array(6).fill(0).map((_, i) => (
                                <div key={i} className="bg-white rounded-xl shadow-sm h-48 animate-pulse" />
                            ))}
                        </div>
                    ) : anggota.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                            <User size={32} className="mx-auto text-gray-300 mb-2" />
                            <p className="text-gray-400">Belum ada anggota sekretariat.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Sekretaris */}
                            {sekretarisList.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Star size={14} className="text-amber-500" />
                                        <span className="text-sm font-bold text-slate-600">Sekretaris DPRD</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {sekretarisList.map(item => (
                                            <AnggotaCard key={item.id} item={item} onEdit={openEdit} onDelete={setDeleteId} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Staff */}
                            {staffList.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Users2 size={14} className="text-slate-400" />
                                        <span className="text-sm font-bold text-slate-600">Staff / Kepala Bagian / Kasubbag</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {staffList.map(item => (
                                            <AnggotaCard key={item.id} item={item} onEdit={openEdit} onDelete={setDeleteId} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ─── Modal Form Anggota ─── */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800">{editItem ? 'Edit Anggota' : 'Tambah Anggota'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-5 space-y-4">
                            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>}

                            {/* Photo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto</label>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-20 h-24 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center cursor-pointer hover:border-primary transition-colors bg-gray-50"
                                        onClick={() => document.getElementById('sek-image-input')?.click()}
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="" className="w-full h-full object-cover object-top" />
                                        ) : (
                                            <div className="text-center p-2">
                                                <Upload size={16} className="mx-auto text-gray-300 mb-1" />
                                                <p className="text-gray-300 text-xs">Foto</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-gray-500 text-xs leading-relaxed">
                                        <p>Klik kotak untuk pilih foto.</p>
                                        <p>Format JPG/PNG, max 5MB.</p>
                                    </div>
                                </div>
                                <input id="sek-image-input" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap *</label>
                                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                        placeholder="Drs. H. Nama Lengkap, M.Si" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Jabatan *</label>
                                    <input type="text" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                        placeholder="Kepala Bagian Umum" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit / Bagian</label>
                                    <input type="text" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                        placeholder="Bagian Umum" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Urutan</label>
                                    <input type="number" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                        min="0" />
                                </div>
                            </div>

                            {/* isSekretaris Toggle */}
                            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                <input
                                    id="isSekretaris"
                                    type="checkbox"
                                    checked={form.isSekretaris}
                                    onChange={e => setForm({ ...form, isSekretaris: e.target.checked })}
                                    className="w-4 h-4 text-amber-600 rounded"
                                />
                                <label htmlFor="isSekretaris" className="text-sm font-medium text-amber-700 cursor-pointer">
                                    Tandai sebagai Sekretaris DPRD
                                    <span className="block text-xs text-amber-500 font-normal">Centang jika orang ini adalah Sekretaris DPRD (ditampilkan di atas)</span>
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
                        <h3 className="font-bold text-gray-800 mb-2">Hapus Anggota?</h3>
                        <p className="text-gray-500 text-sm mb-5">Data dan foto anggota akan dihapus permanen.</p>
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

// Sub-component: Card anggota
const AnggotaCard: React.FC<{
    item: AnggotaSekretariat;
    onEdit: (item: AnggotaSekretariat) => void;
    onDelete: (id: string) => void;
}> = ({ item, onEdit, onDelete }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all duration-200 overflow-hidden group flex">
        {/* Photo */}
        <div className="w-24 h-28 flex-shrink-0 overflow-hidden bg-slate-100">
            {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover object-top" />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <User size={24} className="text-slate-300" />
                </div>
            )}
        </div>
        {/* Info */}
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
            <div>
                <div className="flex items-start gap-1.5">
                    <p className="font-bold text-slate-800 text-xs leading-tight truncate flex-1">{item.name}</p>
                    {item.isSekretaris && (
                        <Star size={12} className="text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" />
                    )}
                </div>
                <p className="text-primary text-[10px] font-medium mt-0.5 truncate">{item.position}</p>
                {item.unit && <p className="text-slate-400 text-[10px] truncate">{item.unit}</p>}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
                <button onClick={() => onEdit(item)} className="px-2 py-1 hover:bg-blue-50 bg-white border border-blue-100 rounded text-blue-600 text-[10px] font-bold flex items-center gap-1">
                    <Edit2 size={10} /> Edit
                </button>
                <button onClick={() => onDelete(item.id)} className="px-2 py-1 hover:bg-red-50 bg-white border border-red-100 rounded text-red-500 text-[10px] font-bold flex items-center gap-1">
                    <Trash2 size={10} /> Hapus
                </button>
                <span className="text-slate-300 text-[9px] ml-auto">#{item.order}</span>
            </div>
        </div>
    </div>
);

export default AdminSekretariatPage;
