'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, X, FileText } from 'lucide-react';
import AdminLayout from './AdminLayout';
import {
  fetchPropemperdaList, createPropemperda, updatePropemperda, deletePropemperda,
  createRaperda, updateRaperda, deleteRaperda,
  fetchRaperdaLuar, createRaperdaLuar, updateRaperdaLuar, deleteRaperdaLuar,
} from '../../services/api/propemperda';
import type { Propemperda, RancanganPerda, RaperdaLuar } from '../../services/api/propemperda';

type Tab = 'propemperda' | 'luar';

const STATUS_OPTIONS = ['Belum Pembahasan', 'Proses Pembahasan', 'Selesai Pembahasan'];

const STATUS_COLORS: Record<string, string> = {
  'Selesai Pembahasan': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Proses Pembahasan': 'bg-amber-50 text-amber-700 border-amber-200',
  'Belum Pembahasan': 'bg-gray-50 text-gray-500 border-gray-200',
};

const AdminSilegdaPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('propemperda');
  const [list, setList] = useState<Propemperda[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  // Raperda Luar state
  const [luarList, setLuarList] = useState<RaperdaLuar[]>([]);
  const [loadingLuar, setLoadingLuar] = useState(false);
  const [showLuarModal, setShowLuarModal] = useState(false);
  const [editLuar, setEditLuar] = useState<RaperdaLuar | null>(null);
  const [luarForm, setLuarForm] = useState({ judul: '', status: 'Belum Pembahasan', keterangan: '', tahun: new Date().getFullYear().toString() });
  const [luarSaving, setLuarSaving] = useState(false);
  const [luarError, setLuarError] = useState('');
  const [deleteLuarId, setDeleteLuarId] = useState<string | null>(null);

  // Propemperda modal
  const [showPropModal, setShowPropModal] = useState(false);
  const [editProp, setEditProp] = useState<Propemperda | null>(null);
  const [propForm, setPropForm] = useState({ tahun: '', keterangan: '' });
  const [propSaving, setPropSaving] = useState(false);
  const [propError, setPropError] = useState('');
  const [deletePropId, setDeletePropId] = useState<string | null>(null);

  // Raperda modal
  const [showRaperdaModal, setShowRaperdaModal] = useState(false);
  const [editRaperda, setEditRaperda] = useState<RancanganPerda | null>(null);
  const [activePropId, setActivePropId] = useState<string | null>(null);
  const [raperdaForm, setRaperdaForm] = useState({ judul: '', status: 'Belum Pembahasan', keterangan: '' });
  const [raperdaSaving, setRaperdaSaving] = useState(false);
  const [raperdaError, setRaperdaError] = useState('');
  const [deleteRaperdaId, setDeleteRaperdaId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchPropemperdaList();
    setList(data);
    setLoading(false);
  }, []);

  const loadLuar = useCallback(async () => {
    setLoadingLuar(true);
    const data = await fetchRaperdaLuar();
    setLuarList(data);
    setLoadingLuar(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (tab === 'luar') loadLuar(); }, [tab, loadLuar]);

  // ─── Propemperda handlers ───
  const openCreateProp = () => {
    setEditProp(null);
    setPropForm({ tahun: '', keterangan: '' });
    setPropError('');
    setShowPropModal(true);
  };

  const openEditProp = (item: Propemperda) => {
    setEditProp(item);
    setPropForm({ tahun: item.tahun, keterangan: item.keterangan || '' });
    setPropError('');
    setShowPropModal(true);
  };

  const saveProp = async () => {
    if (!propForm.tahun.trim()) { setPropError('Tahun diperlukan'); return; }
    setPropSaving(true); setPropError('');
    try {
      if (editProp) {
        await updatePropemperda(editProp.id, { tahun: propForm.tahun, keterangan: propForm.keterangan }, token);
      } else {
        await createPropemperda({ tahun: propForm.tahun, keterangan: propForm.keterangan }, token);
      }
      setShowPropModal(false);
      load();
    } catch (e: unknown) {
      setPropError(e instanceof Error ? e.message : 'Gagal menyimpan');
    } finally {
      setPropSaving(false);
    }
  };

  const handleDeleteProp = async () => {
    if (!deletePropId) return;
    await deletePropemperda(deletePropId, token);
    setDeletePropId(null);
    load();
  };

  // ─── Raperda handlers ───
  const openCreateRaperda = (propId: string) => {
    setEditRaperda(null);
    setActivePropId(propId);
    setRaperdaForm({ judul: '', status: 'Belum Pembahasan', keterangan: '' });
    setRaperdaError('');
    setShowRaperdaModal(true);
  };

  const openEditRaperda = (item: RancanganPerda) => {
    setEditRaperda(item);
    setActivePropId(item.propemperdaId);
    setRaperdaForm({ judul: item.judul, status: item.status, keterangan: item.keterangan || '' });
    setRaperdaError('');
    setShowRaperdaModal(true);
  };

  const saveRaperda = async () => {
    if (!raperdaForm.judul.trim()) { setRaperdaError('Judul diperlukan'); return; }
    setRaperdaSaving(true); setRaperdaError('');
    try {
      if (editRaperda) {
        await updateRaperda(editRaperda.id, { judul: raperdaForm.judul, status: raperdaForm.status, keterangan: raperdaForm.keterangan }, token);
      } else {
        const prop = list.find(p => p.id === activePropId);
        await createRaperda({
          propemperdaId: activePropId!,
          judul: raperdaForm.judul,
          status: raperdaForm.status,
          keterangan: raperdaForm.keterangan,
          order: (prop?.raperda.length || 0) + 1,
        }, token);
      }
      setShowRaperdaModal(false);
      load();
    } catch (e: unknown) {
      setRaperdaError(e instanceof Error ? e.message : 'Gagal menyimpan');
    } finally {
      setRaperdaSaving(false);
    }
  };

  const handleDeleteRaperda = async () => {
    if (!deleteRaperdaId) return;
    await deleteRaperda(deleteRaperdaId, token);
    setDeleteRaperdaId(null);
    load();
  };

  // ─── Raperda Luar handlers ───
  const openCreateLuar = () => {
    setEditLuar(null);
    setLuarForm({ judul: '', status: 'Belum Pembahasan', keterangan: '', tahun: new Date().getFullYear().toString() });
    setLuarError('');
    setShowLuarModal(true);
  };

  const openEditLuar = (item: RaperdaLuar) => {
    setEditLuar(item);
    setLuarForm({ judul: item.judul, status: item.status, keterangan: item.keterangan || '', tahun: item.tahun });
    setLuarError('');
    setShowLuarModal(true);
  };

  const saveLuar = async () => {
    if (!luarForm.judul.trim() || !luarForm.tahun.trim()) { setLuarError('Judul dan tahun diperlukan'); return; }
    setLuarSaving(true); setLuarError('');
    try {
      if (editLuar) await updateRaperdaLuar(editLuar.id, { ...luarForm, status: luarForm.status as RaperdaLuar['status'] }, token);
      else await createRaperdaLuar(luarForm, token);
      setShowLuarModal(false); loadLuar();
    } catch (e: unknown) { setLuarError(e instanceof Error ? e.message : 'Gagal menyimpan'); }
    finally { setLuarSaving(false); }
  };

  const handleDeleteLuar = async () => {
    if (!deleteLuarId) return;
    await deleteRaperdaLuar(deleteLuarId, token);
    setDeleteLuarId(null); loadLuar();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Silegda</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola data Propemperda dan Rancangan Peraturan Daerah</p>
        </div>
        <button
          onClick={tab === 'propemperda' ? openCreateProp : openCreateLuar}
          className="flex items-center gap-2 bg-gradient-to-r from-[#0a2744] to-[#123b66] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus size={18} strokeWidth={2.5} /> {tab === 'propemperda' ? 'Tambah Tahun' : 'Tambah Raperda Luar'}
        </button>
      </div>

      {/* Tab */}
      <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm w-fit mb-6">
        {([['propemperda', 'Propemperda'], ['luar', 'Raperda Diluar Propemperda']] as [Tab, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tab === key ? 'bg-[#0a2744] text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'propemperda' && (
      <>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl" />)}
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FileText size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">Belum ada data propemperda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(prop => {
            const isOpen = expanded === prop.id;
            const selesai = prop.raperda.filter(r => r.status === 'Selesai Pembahasan').length;
            const proses = prop.raperda.filter(r => r.status === 'Proses Pembahasan').length;
            const belum = prop.raperda.filter(r => r.status === 'Belum Pembahasan').length;

            return (
              <div key={prop.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Header row */}
                <div className="flex items-center justify-between px-5 py-4">
                  <button
                    onClick={() => setExpanded(isOpen ? null : prop.id)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    {isOpen ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                    <span className="font-black text-slate-800 text-base">Propemperda Tahun {prop.tahun}</span>
                    <span className="text-xs text-slate-400 font-medium">{prop.raperda.length} raperda</span>
                    <div className="hidden sm:flex items-center gap-2 ml-2">
                      <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">{selesai} selesai</span>
                      <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">{proses} proses</span>
                      <span className="text-[11px] bg-gray-50 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full font-semibold">{belum} belum</span>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => openCreateRaperda(prop.id)} className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg text-[11px] font-bold hover:bg-blue-100 transition-colors">
                      <Plus size={12} /> Raperda
                    </button>
                    <button onClick={() => openEditProp(prop)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => setDeletePropId(prop.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Raperda list */}
                {isOpen && (
                  <div className="border-t border-slate-100">
                    {prop.raperda.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm py-6">Belum ada raperda. Klik "+ Raperda" untuk menambah.</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-5 py-2.5 text-gray-500 font-semibold text-xs uppercase w-10">No</th>
                            <th className="text-left px-4 py-2.5 text-gray-500 font-semibold text-xs uppercase">Judul Raperda</th>
                            <th className="text-left px-4 py-2.5 text-gray-500 font-semibold text-xs uppercase hidden md:table-cell">Status</th>
                            <th className="text-right px-4 py-2.5 text-gray-500 font-semibold text-xs uppercase">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {prop.raperda.map((r, idx) => (
                            <tr key={r.id} className="hover:bg-slate-50/60 group transition-colors">
                              <td className="px-5 py-3 text-gray-400 font-medium text-xs">{idx + 1}</td>
                              <td className="px-4 py-3 text-slate-700 font-medium leading-relaxed">{r.judul}</td>
                              <td className="px-4 py-3 hidden md:table-cell">
                                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[r.status]}`}>
                                  {r.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => openEditRaperda(r)} className="px-2.5 py-1.5 hover:bg-blue-100 bg-white border border-blue-100 rounded-lg text-blue-600 text-[11px] font-bold flex items-center gap-1 shadow-sm">
                                    <Edit2 size={12} /> Edit
                                  </button>
                                  <button onClick={() => setDeleteRaperdaId(r.id)} className="px-2.5 py-1.5 hover:bg-red-100 bg-white border border-red-100 rounded-lg text-red-500 text-[11px] font-bold flex items-center gap-1 shadow-sm">
                                    <Trash2 size={12} /> Hapus
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </>
      )}

      {tab === 'luar' && (
        <>
          {loadingLuar ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-xl" />)}</div>
          ) : luarList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <FileText size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">Belum ada data Raperda Diluar Propemperda.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-2.5 text-gray-500 font-semibold text-xs uppercase w-10">No</th>
                    <th className="text-left px-4 py-2.5 text-gray-500 font-semibold text-xs uppercase">Judul Raperda</th>
                    <th className="text-left px-4 py-2.5 text-gray-500 font-semibold text-xs uppercase hidden md:table-cell">Tahun</th>
                    <th className="text-left px-4 py-2.5 text-gray-500 font-semibold text-xs uppercase hidden md:table-cell">Status</th>
                    <th className="text-right px-4 py-2.5 text-gray-500 font-semibold text-xs uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {luarList.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-slate-50/60 group transition-colors">
                      <td className="px-5 py-3 text-gray-400 font-medium text-xs">{idx + 1}</td>
                      <td className="px-4 py-3 text-slate-700 font-medium leading-relaxed">{r.judul}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs font-semibold">{r.tahun}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditLuar(r)} className="px-2.5 py-1.5 hover:bg-blue-100 bg-white border border-blue-100 rounded-lg text-blue-600 text-[11px] font-bold flex items-center gap-1 shadow-sm">
                            <Edit2 size={12} /> Edit
                          </button>
                          <button onClick={() => setDeleteLuarId(r.id)} className="px-2.5 py-1.5 hover:bg-red-100 bg-white border border-red-100 rounded-lg text-red-500 text-[11px] font-bold flex items-center gap-1 shadow-sm">
                            <Trash2 size={12} /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal Raperda Luar */}
      {showLuarModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editLuar ? 'Edit Raperda Luar' : 'Tambah Raperda Diluar Propemperda'}</h2>
              <button onClick={() => setShowLuarModal(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {luarError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{luarError}</div>}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tahun *</label>
                  <input type="text" value={luarForm.tahun} onChange={e => setLuarForm({ ...luarForm, tahun: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="2025" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select value={luarForm.status} onChange={e => setLuarForm({ ...luarForm, status: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Raperda *</label>
                <textarea value={luarForm.judul} onChange={e => setLuarForm({ ...luarForm, judul: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" rows={3} placeholder="Raperda tentang..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Keterangan</label>
                <input type="text" value={luarForm.keterangan} onChange={e => setLuarForm({ ...luarForm, keterangan: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="Opsional..." />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setShowLuarModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Batal</button>
              <button onClick={saveLuar} disabled={luarSaving} className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium disabled:opacity-60">
                {luarSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteLuarId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-800 mb-2">Hapus Raperda Luar?</h3>
            <p className="text-gray-500 text-sm mb-5">Aksi ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteLuarId(null)} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={handleDeleteLuar} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Propemperda */}
      {showPropModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editProp ? 'Edit Propemperda' : 'Tambah Propemperda'}</h2>
              <button onClick={() => setShowPropModal(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {propError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{propError}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tahun *</label>
                <input
                  type="text"
                  value={propForm.tahun}
                  onChange={e => setPropForm({ ...propForm, tahun: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. 2027"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Keterangan</label>
                <textarea
                  value={propForm.keterangan}
                  onChange={e => setPropForm({ ...propForm, keterangan: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                  rows={2}
                  placeholder="Keterangan opsional..."
                />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setShowPropModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Batal</button>
              <button onClick={saveProp} disabled={propSaving} className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-60">
                {propSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Raperda */}
      {showRaperdaModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editRaperda ? 'Edit Raperda' : 'Tambah Raperda'}</h2>
              <button onClick={() => setShowRaperdaModal(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {raperdaError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{raperdaError}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Raperda *</label>
                <textarea
                  value={raperdaForm.judul}
                  onChange={e => setRaperdaForm({ ...raperdaForm, judul: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                  rows={3}
                  placeholder="Raperda tentang..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  value={raperdaForm.status}
                  onChange={e => setRaperdaForm({ ...raperdaForm, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Keterangan</label>
                <input
                  type="text"
                  value={raperdaForm.keterangan}
                  onChange={e => setRaperdaForm({ ...raperdaForm, keterangan: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="Keterangan opsional..."
                />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setShowRaperdaModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Batal</button>
              <button onClick={saveRaperda} disabled={raperdaSaving} className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-60">
                {raperdaSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Propemperda confirm */}
      {deletePropId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-800 mb-2">Hapus Propemperda?</h3>
            <p className="text-gray-500 text-sm mb-5">Semua raperda di dalamnya juga akan ikut terhapus.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletePropId(null)} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={handleDeleteProp} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Raperda confirm */}
      {deleteRaperdaId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-800 mb-2">Hapus Raperda?</h3>
            <p className="text-gray-500 text-sm mb-5">Aksi ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteRaperdaId(null)} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
              <button onClick={handleDeleteRaperda} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSilegdaPage;
