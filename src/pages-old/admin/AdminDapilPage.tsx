'use client';
import React, { useEffect } from 'react';
import { Plus, Edit2, Trash2, X, ChevronDown, MapPin, User } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAdminDapil } from './dapil/useAdminDapil';
import { getImageUrl } from '../../services/api';

export default function AdminDapilPage() {
  const f = useAdminDapil();

  useEffect(() => { f.loadData(); }, []);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Daerah Pemilihan</h1>
            <p className="text-gray-500 text-sm mt-1">Kelola data dapil dan anggota DPRD</p>
          </div>
          <button onClick={f.openCreateDapil} className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-all">
            <Plus size={16} /> Tambah Dapil
          </button>
        </div>

        {f.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
            <span className="text-sm">{f.error}</span>
            <button onClick={() => f.setError('')}><X size={16} /></button>
          </div>
        )}

        {/* List */}
        {f.loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        ) : f.dapilList.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <MapPin size={48} className="mx-auto mb-3 text-gray-200" />
            <p>Belum ada daerah pemilihan.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {f.dapilList.map(dapil => (
              <div key={dapil.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                {/* Dapil header */}
                <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => f.setExpanded(f.expanded === dapil.id ? '' : dapil.id)}>
                  <div className="flex items-center gap-3">
                    <ChevronDown size={18} className={`text-gray-400 transition-transform ${f.expanded === dapil.id ? 'rotate-180' : ''}`} />
                    <div>
                      <span className="font-bold text-gray-900">{dapil.nama}</span>
                      {dapil.wilayah && <span className="text-xs text-gray-400 ml-2">· {dapil.wilayah}</span>}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${dapil.isAktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {dapil.isAktif ? 'Aktif' : 'Nonaktif'}
                    </span>
                    <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                      {dapil.jumlahKursi} kursi
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={e => { e.stopPropagation(); f.openEditDapil(dapil); }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); f.setDeleteTarget({ type: 'dapil', id: dapil.id, name: dapil.nama }); }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Anggota section */}
                {f.expanded === dapil.id && (
                  <div className="border-t border-gray-100 px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-700">Anggota ({dapil.anggota.length})</span>
                      <button onClick={() => f.openCreateAnggota(dapil.id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                        <Plus size={13} /> Tambah Anggota
                      </button>
                    </div>

                    {dapil.anggota.length === 0 ? (
                      <p className="text-sm text-gray-400 italic py-2">Belum ada anggota.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 w-10">No</th>
                              <th className="text-left py-2 px-3 text-xs font-bold text-gray-500">Nama</th>
                              <th className="text-left py-2 px-3 text-xs font-bold text-gray-500">Partai</th>
                              <th className="w-20" />
                            </tr>
                          </thead>
                          <tbody>
                            {dapil.anggota.map((a, idx) => (
                              <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="py-2 px-3 text-gray-400">{idx + 1}</td>
                                <td className="py-2 px-3">
                                  <div className="flex items-center gap-2">
                                    {a.imageUrl ? (
                                      <img src={getImageUrl(a.imageUrl)} alt={a.name} className="w-7 h-8 rounded object-cover object-top border border-gray-100" />
                                    ) : (
                                      <div className="w-7 h-8 rounded bg-gray-100 flex items-center justify-center">
                                        <User size={12} className="text-gray-300" />
                                      </div>
                                    )}
                                    <span className="font-medium text-gray-900">{a.name}</span>
                                  </div>
                                </td>
                                <td className="py-2 px-3 text-gray-500">{a.partai || '-'}</td>
                                <td className="py-2 px-3">
                                  <div className="flex items-center gap-1 justify-end">
                                    <button onClick={() => f.openEditAnggota(a)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit2 size={13} /></button>
                                    <button onClick={() => f.setDeleteTarget({ type: 'anggota', id: a.id, name: a.name })} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={13} /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Dapil */}
      {f.showDapilForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-black text-gray-900">{f.editingDapil ? 'Edit Dapil' : 'Tambah Dapil'}</h2>
              <button onClick={() => f.setShowDapilForm(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Dapil</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400"
                  value={f.dapilForm.nama} onChange={e => f.setDapilForm({ ...f.dapilForm, nama: e.target.value })} placeholder="Daerah Pemilihan 1" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Slug</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400"
                  value={f.dapilForm.slug} onChange={e => f.setDapilForm({ ...f.dapilForm, slug: e.target.value })} placeholder="dapil-1" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Wilayah (Kecamatan/Desa)</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400"
                  value={f.dapilForm.wilayah} onChange={e => f.setDapilForm({ ...f.dapilForm, wilayah: e.target.value })} placeholder="Kecamatan A, Kecamatan B" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Jumlah Kursi</label>
                <input type="number" min="0" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400"
                  value={f.dapilForm.jumlahKursi} onChange={e => f.setDapilForm({ ...f.dapilForm, jumlahKursi: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi</label>
                <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400 resize-none"
                  value={f.dapilForm.deskripsi} onChange={e => f.setDapilForm({ ...f.dapilForm, deskripsi: e.target.value })} />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Urutan</label>
                  <input type="number" min="0" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400"
                    value={f.dapilForm.order} onChange={e => f.setDapilForm({ ...f.dapilForm, order: e.target.value })} />
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <input type="checkbox" id="isAktif" checked={f.dapilForm.isAktif} onChange={e => f.setDapilForm({ ...f.dapilForm, isAktif: e.target.checked })} className="w-4 h-4 accent-red-600" />
                  <label htmlFor="isAktif" className="text-sm font-bold text-gray-700">Aktif</label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Gambar (opsional)</label>
                {f.imagePreview && <img src={f.imagePreview.startsWith('blob:') || f.imagePreview.startsWith('http') ? f.imagePreview : `/api/uploads/${f.imagePreview}`} alt="" className="w-full h-32 object-cover rounded-xl mb-2 border border-gray-100" />}
                <input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) { f.setImageFile(file); f.setImagePreview(URL.createObjectURL(file)); } }} className="text-sm text-gray-500" />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => f.setShowDapilForm(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50">Batal</button>
              <button onClick={f.handleSaveDapil} disabled={f.savingDapil} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-50">
                {f.savingDapil ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Anggota */}
      {f.showAnggotaForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-black text-gray-900">{f.editingAnggota ? 'Edit Anggota' : 'Tambah Anggota'}</h2>
              <button onClick={() => f.setShowAnggotaForm(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400"
                  value={f.anggotaForm.name} onChange={e => f.setAnggotaForm({ ...f.anggotaForm, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Partai Politik</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400"
                  value={f.anggotaForm.partai} onChange={e => f.setAnggotaForm({ ...f.anggotaForm, partai: e.target.value })} placeholder="Partai Golkar" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Urutan</label>
                <input type="number" min="0" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400"
                  value={f.anggotaForm.order} onChange={e => f.setAnggotaForm({ ...f.anggotaForm, order: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Foto (opsional)</label>
                {f.anggotaImagePreview && <img src={f.anggotaImagePreview.startsWith('blob:') || f.anggotaImagePreview.startsWith('http') ? f.anggotaImagePreview : `/api/uploads/${f.anggotaImagePreview}`} alt="" className="w-16 h-20 object-cover rounded-lg mb-2 border border-gray-100" />}
                <input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) { f.setAnggotaImageFile(file); f.setAnggotaImagePreview(URL.createObjectURL(file)); } }} className="text-sm text-gray-500" />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => f.setShowAnggotaForm(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50">Batal</button>
              <button onClick={f.handleSaveAnggota} disabled={f.savingAnggota} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-50">
                {f.savingAnggota ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Konfirmasi Delete */}
      {f.deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h3 className="font-black text-gray-900 mb-2">Hapus Data</h3>
            <p className="text-sm text-gray-600 mb-6">Yakin ingin menghapus <span className="font-bold">"{f.deleteTarget.name}"</span>? Tindakan ini tidak bisa dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => f.setDeleteTarget(null)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50">Batal</button>
              <button onClick={f.handleDelete} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-red-700">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
