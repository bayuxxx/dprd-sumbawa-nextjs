'use client';
import React, { useEffect } from 'react';
import { Plus, Trash2, ChevronDown, X, Edit2, User } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAdminKomisi } from './komisi/useAdminKomisi';
import { KomisiAnggotaSection } from './komisi/KomisiAnggotaSection';
import { KomisiInfoModal, KomisiAnggotaModal, KomisiDeleteModal } from './komisi/KomisiModals';

const AdminKomisiPage: React.FC = () => {
    const k = useAdminKomisi();

    useEffect(() => { k.loadData(); }, []);

    // Group by masa jabatan
    const grouped: Record<string, typeof k.infoList> = {};
    k.infoList.forEach(item => {
        if (!grouped[item.masaJabatan]) grouped[item.masaJabatan] = [];
        grouped[item.masaJabatan].push(item);
    });
    const sortedMasa = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Komisi</h1>
                        <p className="text-gray-500 text-sm mt-1">Kelola data Komisi per masa jabatan</p>
                    </div>
                    <button onClick={k.openCreateInfo} className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-all">
                        <Plus size={16} /> Tambah Masa Jabatan
                    </button>
                </div>

                {k.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
                        <span className="text-sm font-medium">{k.error}</span>
                        <button onClick={() => k.setError('')}><X size={16} /></button>
                    </div>
                )}

                {k.loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
                    </div>
                ) : sortedMasa.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                        <User size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium mb-2">Belum ada data Komisi</p>
                        <p className="text-gray-400 text-sm">Klik "Tambah Masa Jabatan" untuk membuat Komisi I–III secara otomatis.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedMasa.map(masa => {
                            const items = [...grouped[masa]].sort((a, b) => a.namaKomisi.localeCompare(b.namaKomisi));
                            const isExp = k.expandedMasa === masa;
                            const hasActive = items.some(i => i.isAktif);
                            const totalAnggota = items.reduce((acc, cur) => acc + cur.anggota.length, 0);

                            return (
                                <div key={masa} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50" onClick={() => k.setExpandedMasa(isExp ? '' : masa)}>
                                        <div className="flex items-center gap-3">
                                            <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isExp ? 'rotate-180' : ''}`} />
                                            <div>
                                                <h3 className="font-bold text-gray-900">Masa Jabatan {masa}</h3>
                                                <p className="text-xs text-gray-400">{items.length} Komisi &bull; {totalAnggota} Anggota</p>
                                            </div>
                                            {hasActive && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Aktif</span>}
                                        </div>
                                        <div onClick={e => e.stopPropagation()}>
                                            <button onClick={() => k.setDeleteTarget({ type: 'masa', ids: items.map(i => i.id), name: `Masa Jabatan ${masa}` })} className="p-2 text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-1.5 text-xs font-bold">
                                                <Trash2 size={16} /><span className="hidden sm:inline">Hapus Periode</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`overflow-hidden transition-all duration-300 ${isExp ? 'max-h-[50000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="bg-gray-50/50 p-5 space-y-6 border-t border-gray-100">
                                            {items.map(komisi => {
                                                const byJabatan = (label: string) => komisi.anggota.filter(a => a.jabatan.toLowerCase().includes(label.toLowerCase()));
                                                const ketua = komisi.anggota.filter(a => a.jabatan.toLowerCase().includes('ketua') && !a.jabatan.toLowerCase().includes('wakil'));
                                                const wakil = byJabatan('wakil ketua');
                                                const sekretaris = byJabatan('sekretaris');
                                                const anggota = komisi.anggota.filter(a => !a.jabatan.toLowerCase().includes('ketua') && !a.jabatan.toLowerCase().includes('sekretaris'));

                                                return (
                                                    <div key={komisi.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                                        <div className="bg-gray-50 flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-gray-100 gap-3">
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="font-black text-gray-900">{komisi.namaKomisi}</h4>
                                                                    {!komisi.isAktif && <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-md">Draft</span>}
                                                                </div>
                                                                {komisi.deskripsi && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{komisi.deskripsi}</p>}
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <button onClick={() => k.openEditInfo(komisi)} className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg">
                                                                    <Edit2 size={13} /> Edit
                                                                </button>
                                                                <button onClick={() => k.setDeleteTarget({ type: 'komisi', id: komisi.id, name: `${komisi.namaKomisi} (${komisi.masaJabatan})` })} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                                    <Trash2 size={15} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="p-4">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <h5 className="text-xs font-black text-gray-500 uppercase tracking-wider">Anggota ({komisi.anggota.length})</h5>
                                                                <button onClick={() => k.openCreateAnggota(komisi.id)} className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700">
                                                                    <Plus size={14} /> Tambah
                                                                </button>
                                                            </div>
                                                            {komisi.anggota.length === 0 ? (
                                                                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                                                    <p className="text-xs text-gray-400">Belum ada anggota</p>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-4">
                                                                    {ketua.length > 0 && <KomisiAnggotaSection title="Ketua" items={ketua} onEdit={k.openEditAnggota} onDelete={a => k.setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />}
                                                                    {wakil.length > 0 && <KomisiAnggotaSection title="Wakil Ketua" items={wakil} onEdit={k.openEditAnggota} onDelete={a => k.setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />}
                                                                    {sekretaris.length > 0 && <KomisiAnggotaSection title="Sekretaris" items={sekretaris} onEdit={k.openEditAnggota} onDelete={a => k.setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />}
                                                                    {anggota.length > 0 && <KomisiAnggotaSection title="Anggota" items={anggota} onEdit={k.openEditAnggota} onDelete={a => k.setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {k.showInfoForm && <KomisiInfoModal editingInfo={k.editingInfo} infoForm={k.infoForm} setInfoForm={k.setInfoForm} saving={k.savingInfo} onSave={k.handleSaveInfo} onClose={() => k.setShowInfoForm(false)} />}
            {k.showAnggotaForm && <KomisiAnggotaModal editingAnggota={k.editingAnggota} anggotaForm={k.anggotaForm} setAnggotaForm={k.setAnggotaForm} imagePreview={k.imagePreview} saving={k.savingAnggota} onImageChange={k.handleImageChange} onSave={k.handleSaveAnggota} onClose={() => k.setShowAnggotaForm(false)} />}
            {k.deleteTarget && <KomisiDeleteModal target={k.deleteTarget} onConfirm={k.handleDelete} onClose={() => k.setDeleteTarget(null)} />}
        </AdminLayout>
    );
};

export default AdminKomisiPage;
