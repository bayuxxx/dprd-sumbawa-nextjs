'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Plus, Edit2, Trash2, X, User, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import {
    fetchPimpinan, createPimpinan, updatePimpinan, deletePimpinan,
    fetchMasaJabatan, createMasaJabatan, updateMasaJabatan, deleteMasaJabatan
} from '../../services/api';
import type { Pimpinan, MasaJabatan } from '../../services/api';
import AdminLayout from './AdminLayout';
import { PimpinanCard } from './components/PimpinanCard';
import { MasaJabatanModal, PimpinanModal, DeleteConfirmModal } from './components/PimpinanModals';

const emptyMasaJabatanForm = {
    periode: '',
    tahunMulai: '',
    tahunSelesai: '',
    isAktif: false,
    keterangan: '',
    order: '0',
};

const emptyPimpinanForm = {
    name: '',
    position: '',
    faction: '',
    period: '',
    masaJabatanId: '',
    isPast: false,
    bio: '',
    order: '0',
};

const AdminPimpinanPage: React.FC = () => {
    const [pimpinanList, setPimpinanList] = useState<Pimpinan[]>([]);
    const [masaJabatanList, setMasaJabatanList] = useState<MasaJabatan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

    // MASA JABATAN FORM
    const [showMjForm, setShowMjForm] = useState(false);
    const [editingMj, setEditingMj] = useState<MasaJabatan | null>(null);
    const [mjForm, setMjForm] = useState(emptyMasaJabatanForm);
    const [savingMj, setSavingMj] = useState(false);

    // PIMPINAN FORM
    const [showPimpinanForm, setShowPimpinanForm] = useState(false);
    const [editingPimpinan, setEditingPimpinan] = useState<Pimpinan | null>(null);
    const [form, setForm] = useState(emptyPimpinanForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [saving, setSaving] = useState(false);

    // DELETE CONFIRM
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'mj' | 'pimpinan', id: string, name: string } | null>(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [p, mj] = await Promise.all([
                fetchPimpinan(),
                fetchMasaJabatan()
            ]);
            setPimpinanList(p);
            setMasaJabatanList(mj);

            // Expand active ones by default if empty
            if (Object.keys(expandedIds).length === 0) {
                const activeMj = mj.find(m => m.isAktif);
                if (activeMj) {
                    setExpandedIds({ [activeMj.id]: true });
                } else if (mj.length > 0) {
                    setExpandedIds({ [mj[0].id]: true });
                }
            }
        } catch (e: any) {
            setError(e.message || 'Gagal memuat data');
        } finally {
            setLoading(false);
        }
    }, [expandedIds]);

    useEffect(() => { loadData(); }, [loadData]);

    const toggleExpand = (id: string, force?: boolean) => {
        setExpandedIds(prev => ({
            ...prev,
            [id]: force !== undefined ? force : !prev[id]
        }));
    };

    // -- MJ HANDLERS --
    const openCreateMj = () => {
        setEditingMj(null);
        setMjForm(emptyMasaJabatanForm);
        setShowMjForm(true);
    };

    const openEditMj = (item: MasaJabatan) => {
        setEditingMj(item);
        setMjForm({
            periode: item.periode,
            tahunMulai: String(item.tahunMulai),
            tahunSelesai: String(item.tahunSelesai),
            isAktif: item.isAktif,
            keterangan: item.keterangan || '',
            order: String(item.order)
        });
        setShowMjForm(true);
    };

    const handleSaveMj = async () => {
        if (!mjForm.periode.trim() || !mjForm.tahunMulai || !mjForm.tahunSelesai) {
            setError('Field yang ditandai * wajib diisi');
            return;
        }
        setSavingMj(true);
        setError('');
        try {
            const payload = {
                periode: mjForm.periode,
                tahunMulai: parseInt(mjForm.tahunMulai),
                tahunSelesai: parseInt(mjForm.tahunSelesai),
                isAktif: mjForm.isAktif,
                keterangan: mjForm.keterangan,
                order: parseInt(mjForm.order)
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
        } finally {
            setSavingMj(false);
        }
    };

    // -- PIMPINAN HANDLERS --
    const openCreatePimpinan = (mjId: string, periodeText: string) => {
        setEditingPimpinan(null);
        setForm({ ...emptyPimpinanForm, masaJabatanId: mjId, period: periodeText });
        setImageFile(null);
        setImagePreview('');
        setShowPimpinanForm(true);
    };

    const openEditPimpinan = (item: Pimpinan) => {
        setEditingPimpinan(item);
        setForm({
            name: item.name,
            position: item.position,
            faction: item.faction || '',
            period: item.period || '',
            masaJabatanId: item.masaJabatanId || '',
            isPast: item.isPast,
            bio: item.bio || '',
            order: String(item.order)
        });
        setImageFile(null);
        setImagePreview(item.imageUrl || '');
        setShowPimpinanForm(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSavePimpinan = async () => {
        if (!form.name.trim() || !form.position.trim()) {
            setError('Nama dan Jabatan diperlukan');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('name', form.name);
            fd.append('position', form.position);
            fd.append('faction', form.faction);
            fd.append('period', form.period);
            fd.append('masaJabatanId', form.masaJabatanId);
            fd.append('isPast', String(form.isPast));
            fd.append('bio', form.bio);
            fd.append('order', form.order);
            if (imageFile) fd.append('image', imageFile);

            if (editingPimpinan) {
                await updatePimpinan(editingPimpinan.id, fd, token);
            } else {
                await createPimpinan(fd, token);
            }
            setShowPimpinanForm(false);
            loadData();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    // -- DELETE --
    const handleDelete = async () => {
        if (!deleteTarget) return;
        setError('');
        try {
            if (deleteTarget.type === 'mj') {
                await deleteMasaJabatan(deleteTarget.id, token);
            } else {
                await deletePimpinan(deleteTarget.id, token);
            }
            setDeleteTarget(null);
            loadData();
        } catch (e: any) {
            setError(e.message);
        }
    };


    // Organize data
    const groupedData = useMemo(() => {
        const groups: { [key: string]: { mj: MasaJabatan | null, pimpinan: Pimpinan[] } } = {};

        // Ensure all MJ are in groups even if empty
        masaJabatanList.forEach(mj => {
            groups[mj.id] = { mj, pimpinan: [] };
        });

        // "Tanpa Masa Jabatan"
        groups['none'] = { mj: null, pimpinan: [] };

        pimpinanList.forEach(p => {
            if (p.masaJabatanId && groups[p.masaJabatanId]) {
                groups[p.masaJabatanId].pimpinan.push(p);
            } else {
                groups['none'].pimpinan.push(p);
            }
        });

        // Sort: Active first, then by year desc
        const sortedGroups = Object.values(groups)
            .filter(g => g.mj !== null) // Filter out 'none' temporarily
            .sort((a, b) => {
                if (a.mj!.isAktif && !b.mj!.isAktif) return -1;
                if (!a.mj!.isAktif && b.mj!.isAktif) return 1;
                return b.mj!.tahunMulai - a.mj!.tahunMulai;
            });

        // Append 'none' at the end if it has any members
        if (groups['none'].pimpinan.length > 0) {
            sortedGroups.push(groups['none']);
        }

        // Sort pimpinan per group by order then name
        sortedGroups.forEach(g => {
            g.pimpinan.sort((a, b) => {
                if (a.order !== b.order) return a.order - b.order;
                return a.name.localeCompare(b.name);
            });
        });

        return sortedGroups;
    }, [pimpinanList, masaJabatanList]);

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Pimpinan</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Kelola data pimpinan per masa jabatan
                    </p>
                </div>
                <button
                    onClick={openCreateMj}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#0a2744] to-[#123b66] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all"
                >
                    <Plus size={18} strokeWidth={2.5} /> Tambah Masa Jabatan
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center gap-2"><AlertCircle size={16} /> {error}</span>
                    <button onClick={() => setError('')} className="p-1 hover:bg-red-100 rounded-md transition-colors"><X size={16} /></button>
                </div>
            )}

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-slate-100" />
                    ))}
                </div>
            ) : groupedData.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-sm">
                    <User size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-medium mb-2">Belum ada data Pimpinan dan Masa Jabatan</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {groupedData.map(group => {
                        const isNone = group.mj === null;
                        const groupId = isNone ? 'none' : group.mj!.id;
                        const isExp = expandedIds[groupId] || false;
                        const mj = group.mj;

                        return (
                            <div key={groupId} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:border-blue-100">
                                {/* Header */}
                                <div
                                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                                    onClick={() => toggleExpand(groupId)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isExp ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                            <ChevronDown size={20} className={`transition-transform duration-300 ${isExp ? 'rotate-180' : ''}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-slate-800 text-lg">
                                                    {isNone ? 'Tanpa Masa Jabatan (Belum Ditentukan)' : `Masa Jabatan ${mj!.periode}`}
                                                </h3>
                                                {!isNone && mj!.isAktif && (
                                                    <span className="flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                                        <CheckCircle2 size={10} /> Aktif
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {!isNone && `${mj!.tahunMulai} - ${mj!.tahunSelesai} • `}
                                                {group.pimpinan.length} Pimpinan
                                            </p>
                                        </div>
                                    </div>

                                    {!isNone && (
                                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                            <button onClick={() => openEditMj(mj!)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Masa Jabatan">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => setDeleteTarget({ type: 'mj', id: mj!.id, name: `Masa Jabatan ${mj!.periode}` })} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Masa Jabatan">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Body */}
                                <div className={`overflow-hidden transition-all duration-300 ${isExp ? 'max-h-[5000px] opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-5">
                                        {!isNone && mj!.keterangan && (
                                            <div className="bg-slate-50 rounded-xl p-4 mb-5 text-sm text-slate-600 border border-slate-100">
                                                {mj!.keterangan}
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center mb-5">
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Daftar Pimpinan</h4>
                                            <button
                                                onClick={() => openCreatePimpinan(isNone ? '' : mj!.id, isNone ? '' : mj!.periode)}
                                                className="flex items-center gap-1.5 text-sm font-bold text-[#123b66] hover:text-white bg-blue-50 hover:bg-[#123b66] px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                <Plus size={16} strokeWidth={2.5} /> Tambah Pimpinan {isNone ? '' : 'di Periode Ini'}
                                            </button>
                                        </div>

                                        {group.pimpinan.length === 0 ? (
                                            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                <p className="text-slate-400 text-sm font-medium">Belum ada pimpinan di kelompok ini.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                {group.pimpinan.map(p => (
                                                    <PimpinanCard
                                                        key={p.id}
                                                        item={p}
                                                        onEdit={openEditPimpinan}
                                                        onDelete={() => setDeleteTarget({ type: 'pimpinan', id: p.id, name: p.name })}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <MasaJabatanModal
                show={showMjForm}
                editingMj={editingMj}
                form={mjForm}
                setForm={setMjForm}
                saving={savingMj}
                onClose={() => setShowMjForm(false)}
                onSave={handleSaveMj}
            />

            <PimpinanModal
                show={showPimpinanForm}
                editingPimpinan={editingPimpinan}
                form={form}
                setForm={setForm}
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
                masaJabatanList={masaJabatanList}
                saving={saving}
                onClose={() => setShowPimpinanForm(false)}
                onSave={handleSavePimpinan}
            />

            <DeleteConfirmModal
                target={deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </AdminLayout>
    );
};

export default AdminPimpinanPage;
