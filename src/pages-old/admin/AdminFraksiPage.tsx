'use client';
import React, { useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, X, ChevronDown, Palette, CheckCircle2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useFraksiAdmin } from './fraksi/useFraksiAdmin';
import { FraksiInfoModal, FraksiAnggotaModal, MasaJabatanFraksiModal, FraksiDeleteModal } from './fraksi/FraksiModals';
import { FraksiAnggotaSection } from './fraksi/FraksiAnggotaSection';

const AdminFraksiPage: React.FC = () => {
    const f = useFraksiAdmin();

    useEffect(() => { f.loadData(); }, []);

    const groupedData = useMemo(() => {
        const groups: Record<string, { mj: any; fraksi: any[] }> = {};
        f.masaJabatanList.forEach(mj => { groups[mj.id] = { mj, fraksi: [] }; });
        f.fraksiList.forEach(fr => {
            const mjId = fr.masaJabatan?.id;
            if (mjId && groups[mjId]) groups[mjId].fraksi.push(fr);
            else { if (!groups['unassigned']) groups['unassigned'] = { mj: null, fraksi: [] }; groups['unassigned'].fraksi.push(fr); }
        });
        return groups;
    }, [f.fraksiList, f.masaJabatanList]);

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Manajemen Fraksi</h1>
                        <p className="text-gray-500 text-sm mt-1">Kelola data fraksi dan anggota per masa jabatan</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={f.openCreateMj} className="flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-all">
                            <Plus size={16} /> Masa Jabatan
                        </button>
                        <button onClick={() => f.openCreateInfo(f.masaJabatanList)} className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-all">
                            <Plus size={16} /> Fraksi
                        </button>
                    </div>
                </div>

                {f.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
                        <span className="text-sm font-medium">{f.error}</span>
                        <button onClick={() => f.setError('')}><X size={16} /></button>
                    </div>
                )}

                {f.loading ? (
                    <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100" />)}</div>
                ) : Object.keys(groupedData).length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                        <Palette size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium mb-2">Belum ada data Masa Jabatan / Fraksi</p>
                        <p className="text-gray-400 text-sm">Tambahkan Masa Jabatan Fraksi terlebih dahulu.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.values(groupedData).map(({ mj, fraksi }) => {
                            const isExp = f.expandedMj === (mj?.id || 'unassigned');
                            return (
                                <div key={mj?.id || 'unassigned'} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => f.setExpandedMj(isExp ? '' : (mj?.id || 'unassigned'))}>
                                        <div className="flex items-center gap-3">
                                            <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isExp ? 'rotate-180' : ''}`} />
                                            <h2 className="text-lg font-black text-gray-900">{mj ? `Periode ${mj.periode}` : 'Tanpa Masa Jabatan'}</h2>
                                            {mj?.isAktif && <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-lg"><CheckCircle2 size={12} />Aktif</span>}
                                            <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">{fraksi.length} Fraksi</span>
                                        </div>
                                        {mj && (
                                            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                                <button onClick={() => f.openEditMj(mj)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Edit2 size={16} /></button>
                                                <button onClick={() => f.setDeleteTarget({ type: 'masaJabatan', id: mj.id, name: mj.periode })} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={16} /></button>
                                            </div>
                                        )}
                                    </div>

                                    <div className={`transition-all duration-300 ${isExp ? 'max-h-[10000px] opacity-100 border-t border-gray-200' : 'max-h-0 opacity-0'}`}>
                                        <div className="p-4 space-y-4">
                                            {fraksi.length === 0 ? (
                                                <div className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                                    <p className="text-sm text-gray-500">Belum ada fraksi.</p>
                                                    <button onClick={() => f.openCreateInfo(f.masaJabatanList)} className="mt-2 text-red-600 text-sm font-bold hover:underline">Tambah Fraksi</button>
                                                </div>
                                            ) : fraksi.map((info: any) => {
                                                const isInfoExp = f.expandedInfo === info.id;
                                                const ketua = info.anggota.filter((a: any) => a.jabatan === 'Ketua Fraksi');
                                                const wakil = info.anggota.filter((a: any) => a.jabatan === 'Wakil Ketua');
                                                const sek   = info.anggota.filter((a: any) => a.jabatan === 'Sekretaris');
                                                const ang   = info.anggota.filter((a: any) => a.jabatan === 'Anggota');
                                                return (
                                                    <div key={info.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                                        <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50" onClick={() => f.setExpandedInfo(isInfoExp ? '' : info.id)}>
                                                            <div className="flex items-center gap-4">
                                                                <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isInfoExp ? 'rotate-180' : ''}`} />
                                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0" style={{ backgroundColor: info.color }}>
                                                                    {info.logoUrl ? <img src={info.logoUrl} alt="" className="w-6 h-6 object-contain" /> : <span className="text-white font-black text-sm">{info.shortName[0]}</span>}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <h3 className="font-bold text-gray-900">{info.name}</h3>
                                                                        {info.isAktif && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Aktif</span>}
                                                                    </div>
                                                                    <p className="text-xs text-gray-500">{info.shortName} · {info.kursi} Kursi · {info.anggota.length} anggota</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                                                <button onClick={() => f.openEditInfo(info)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                                                                <button onClick={() => f.setDeleteTarget({ type: 'info', id: info.id, name: info.name })} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                                            </div>
                                                        </div>
                                                        <div className={`overflow-hidden transition-all duration-300 ${isInfoExp ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                            <div className="border-t border-gray-100 p-5">
                                                                <div className="flex justify-between items-center mb-4">
                                                                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Daftar Anggota</h4>
                                                                    <button onClick={() => f.openCreateAnggota(info.id)} className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700">
                                                                        <Plus size={14} /> Tambah Anggota
                                                                    </button>
                                                                </div>
                                                                {info.anggota.length === 0 ? (
                                                                    <p className="text-gray-400 text-sm text-center py-8">Belum ada anggota.</p>
                                                                ) : (
                                                                    <div className="space-y-6">
                                                                        {ketua.length > 0 && <FraksiAnggotaSection title="Ketua Fraksi" items={ketua} color={info.color} onEdit={f.openEditAnggota} onDelete={a => f.setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />}
                                                                        {wakil.length > 0 && <FraksiAnggotaSection title="Wakil Ketua" items={wakil} color={info.color} onEdit={f.openEditAnggota} onDelete={a => f.setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />}
                                                                        {sek.length   > 0 && <FraksiAnggotaSection title="Sekretaris" items={sek} color={info.color} onEdit={f.openEditAnggota} onDelete={a => f.setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />}
                                                                        {ang.length   > 0 && <FraksiAnggotaSection title="Anggota" items={ang} color={info.color} onEdit={f.openEditAnggota} onDelete={a => f.setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} />}
                                                                    </div>
                                                                )}
                                                            </div>
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

            {f.showInfoForm && <FraksiInfoModal editingInfo={f.editingInfo} infoForm={f.infoForm} setInfoForm={f.setInfoForm} masaJabatanList={f.masaJabatanList} logoPreview={f.logoPreview} saving={f.savingInfo} onLogoChange={f.handleLogoChange} onSave={f.handleSaveInfo} onClose={() => f.setShowInfoForm(false)} />}
            {f.showAnggotaForm && <FraksiAnggotaModal editingAnggota={f.editingAnggota} anggotaForm={f.anggotaForm} setAnggotaForm={f.setAnggotaForm} imagePreview={f.imagePreview} saving={f.savingAnggota} onImageChange={f.handleImageChange} onSave={f.handleSaveAnggota} onClose={() => f.setShowAnggotaForm(false)} />}
            {f.showMjForm && <MasaJabatanFraksiModal editingMj={f.editingMj} mjForm={f.mjForm} setMjForm={f.setMjForm} saving={f.savingMj} onSave={f.handleSaveMj} onClose={() => f.setShowMjForm(false)} />}
            {f.deleteTarget && <FraksiDeleteModal target={f.deleteTarget} onConfirm={f.handleDelete} onClose={() => f.setDeleteTarget(null)} />}
        </AdminLayout>
    );
};

export default AdminFraksiPage;