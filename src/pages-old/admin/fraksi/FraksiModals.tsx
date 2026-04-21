'use client';
import React from 'react';
import { X, Save, Upload, User, AlertCircle, Trash2 } from 'lucide-react';
import type { FraksiInfo, AnggotaFraksi, MasaJabatanFraksi } from '../../../services/api';
import { JABATAN_OPTIONS, NAMA_FRAKSI_OPTIONS, generateSlug } from './useFraksiAdmin';

// ── Info Modal ──────────────────────────────────────────────────────────────
export const FraksiInfoModal: React.FC<{
    editingInfo: FraksiInfo | null;
    infoForm: any; setInfoForm: (f: any) => void;
    masaJabatanList: MasaJabatanFraksi[];
    logoPreview: string; saving: boolean;
    onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void; onClose: () => void;
}> = ({ editingInfo, infoForm, setInfoForm, masaJabatanList, logoPreview, saving, onLogoChange, onSave, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h2 className="text-lg font-black text-gray-900">{editingInfo ? 'Edit Fraksi' : 'Tambah Fraksi Baru'}</h2>
                <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Logo Partai</label>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-red-300"
                            style={{ backgroundColor: infoForm.color + '20' }}
                            onClick={() => document.getElementById('fraksi-logo-input')?.click()}>
                            {logoPreview ? <img src={logoPreview} alt="" className="w-full h-full object-contain p-1" /> : <Upload size={20} className="text-gray-300" />}
                        </div>
                        <p className="text-xs text-gray-500">Klik untuk upload logo<br />Format JPG/PNG</p>
                    </div>
                    <input id="fraksi-logo-input" type="file" accept="image/*" className="hidden" onChange={onLogoChange} />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap Fraksi *</label>
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500 bg-white"
                        value={infoForm.name}
                        onChange={e => {
                            const sel = NAMA_FRAKSI_OPTIONS.find(f => f.name === e.target.value);
                            setInfoForm({ ...infoForm, name: e.target.value, shortName: sel?.shortName || infoForm.shortName, slug: !editingInfo && sel ? generateSlug(sel.shortName) : infoForm.slug });
                        }}>
                        <option value="">-- Pilih Nama Fraksi --</option>
                        {NAMA_FRAKSI_OPTIONS.map(f => <option key={f.shortName} value={f.name}>{f.name}</option>)}
                        <option value="__custom">Lainnya (ketik manual)</option>
                    </select>
                    {(infoForm.name === '__custom' || (!NAMA_FRAKSI_OPTIONS.find(f => f.name === infoForm.name) && infoForm.name)) && (
                        <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500 mt-2"
                            placeholder="Ketik nama fraksi..." value={infoForm.name === '__custom' ? '' : infoForm.name}
                            onChange={e => setInfoForm({ ...infoForm, name: e.target.value })} />
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nama Singkat *</label>
                        <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Gerindra" value={infoForm.shortName}
                            onChange={e => setInfoForm({ ...infoForm, shortName: e.target.value, slug: !editingInfo ? generateSlug(e.target.value) : infoForm.slug })} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Slug</label>
                        <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="gerindra" value={infoForm.slug} onChange={e => setInfoForm({ ...infoForm, slug: e.target.value })} />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Warna</label>
                        <div className="flex items-center gap-2">
                            <input type="color" value={infoForm.color} onChange={e => setInfoForm({ ...infoForm, color: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200" />
                            <input type="text" value={infoForm.color} onChange={e => setInfoForm({ ...infoForm, color: e.target.value })} className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Kursi</label>
                        <input type="number" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none" value={infoForm.kursi} min="0" onChange={e => setInfoForm({ ...infoForm, kursi: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Masa Jabatan</label>
                        <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none bg-white" value={infoForm.masaJabatanId} onChange={e => setInfoForm({ ...infoForm, masaJabatanId: e.target.value })}>
                            <option value="">-- Pilih --</option>
                            {masaJabatanList.map(mj => <option key={mj.id} value={mj.id}>{mj.periode}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi</label>
                    <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none resize-none" value={infoForm.deskripsi} onChange={e => setInfoForm({ ...infoForm, deskripsi: e.target.value })} />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={infoForm.isAktif} onChange={e => setInfoForm({ ...infoForm, isAktif: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm font-medium text-gray-700">Aktif</span>
                </label>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white">
                <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
                <button onClick={onSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50">
                    <Save size={16} />{saving ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>
        </div>
    </div>
);

// ── Anggota Modal ───────────────────────────────────────────────────────────
export const FraksiAnggotaModal: React.FC<{
    editingAnggota: AnggotaFraksi | null;
    anggotaForm: any; setAnggotaForm: (f: any) => void;
    imagePreview: string; saving: boolean;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void; onClose: () => void;
}> = ({ editingAnggota, anggotaForm, setAnggotaForm, imagePreview, saving, onImageChange, onSave, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h2 className="text-lg font-black text-gray-900">{editingAnggota ? 'Edit Anggota' : 'Tambah Anggota'}</h2>
                <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Foto</label>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-24 rounded-xl bg-gray-100 overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center">
                            {imagePreview ? <img src={imagePreview} alt="" className="w-full h-full object-cover" /> : <User size={28} className="text-gray-300" />}
                        </div>
                        <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-200">
                            <Upload size={16} />Pilih Foto<input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama *</label>
                    <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500" value={anggotaForm.name} onChange={e => setAnggotaForm({ ...anggotaForm, name: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Jabatan *</label>
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none bg-white" value={anggotaForm.jabatan} onChange={e => setAnggotaForm({ ...anggotaForm, jabatan: e.target.value })}>
                        {JABATAN_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Fraksi / Partai</label>
                    <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none" value={anggotaForm.faction} onChange={e => setAnggotaForm({ ...anggotaForm, faction: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Urutan</label>
                    <input type="number" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none" value={anggotaForm.order} onChange={e => setAnggotaForm({ ...anggotaForm, order: e.target.value })} />
                </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white">
                <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
                <button onClick={onSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50">
                    <Save size={16} />{saving ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>
        </div>
    </div>
);

// ── MJ Modal ────────────────────────────────────────────────────────────────
export const MasaJabatanFraksiModal: React.FC<{
    editingMj: MasaJabatanFraksi | null;
    mjForm: any; setMjForm: (f: any) => void;
    saving: boolean; onSave: () => void; onClose: () => void;
}> = ({ editingMj, mjForm, setMjForm, saving, onSave, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-black text-gray-900">{editingMj ? 'Edit Masa Jabatan Fraksi' : 'Tambah Masa Jabatan Fraksi'}</h2>
                <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
                {!editingMj && (
                    <div className="bg-blue-50 text-blue-700 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
                        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium">Masa jabatan ini khusus untuk Fraksi, terpisah dari masa jabatan Pimpinan/AKD.</p>
                    </div>
                )}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Periode *</label>
                    <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500" placeholder="2024-2029" value={mjForm.periode} onChange={e => setMjForm({ ...mjForm, periode: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Tahun Mulai *</label>
                        <input type="number" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none" placeholder="2024" value={mjForm.tahunMulai} onChange={e => setMjForm({ ...mjForm, tahunMulai: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Tahun Selesai *</label>
                        <input type="number" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none" placeholder="2029" value={mjForm.tahunSelesai} onChange={e => setMjForm({ ...mjForm, tahunSelesai: e.target.value })} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Keterangan</label>
                    <textarea rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none resize-none" value={mjForm.keterangan} onChange={e => setMjForm({ ...mjForm, keterangan: e.target.value })} />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={mjForm.isAktif} onChange={e => setMjForm({ ...mjForm, isAktif: e.target.checked })} className="w-4 h-4" />
                    <span className="text-sm font-bold text-gray-700">Set sebagai Periode Aktif</span>
                </label>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
                <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl">Batal</button>
                <button onClick={onSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50">
                    <Save size={16} />{saving ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>
        </div>
    </div>
);

// ── Delete Modal ────────────────────────────────────────────────────────────
export const FraksiDeleteModal: React.FC<{
    target: { type: string; name: string };
    onConfirm: () => void; onClose: () => void;
}> = ({ target, onConfirm, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-600" /></div>
            <h3 className="text-lg font-black text-gray-900 mb-2">Hapus Data?</h3>
            <p className="text-gray-500 text-sm mb-6">Yakin hapus <span className="font-bold text-gray-700">{target.name}</span>?
                {target.type === 'info' && ' Semua anggota di bawahnya juga akan terhapus.'}
            </p>
            <div className="flex justify-center gap-3">
                <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">Batal</button>
                <button onClick={onConfirm} className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl">Ya, Hapus</button>
            </div>
        </div>
    </div>
);
