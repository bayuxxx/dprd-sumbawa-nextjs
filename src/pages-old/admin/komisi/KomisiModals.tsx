'use client';
import React from 'react';
import { X, Save, Upload, User, Trash2 } from 'lucide-react';
import type { KomisiInfo, AnggotaKomisi } from '../../../services/api';

const JABATAN_OPTIONS = ['Ketua', 'Wakil Ketua', 'Anggota', 'Sekretaris'];

// ── Info Modal ──────────────────────────────────────────────────────────────
export const KomisiInfoModal: React.FC<{
    editingInfo: KomisiInfo | null;
    infoForm: { namaKomisi: string; masaJabatan: string; deskripsi: string; isAktif: boolean };
    setInfoForm: (f: any) => void;
    saving: boolean;
    onSave: () => void;
    onClose: () => void;
}> = ({ editingInfo, infoForm, setInfoForm, saving, onSave, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-black text-gray-900">{editingInfo ? 'Edit Komisi' : 'Tambah Masa Jabatan Komisi'}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
                {!editingInfo && (
                    <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm border border-blue-100 font-medium">
                        Sistem akan otomatis membuat 3 Komisi (Komisi 1, 2, dan 3) untuk masa jabatan yang Anda masukkan.
                    </div>
                )}
                {editingInfo && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nama Komisi *</label>
                        <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" placeholder="Contoh: KOMISI I | Bidang Pemerintahan" value={infoForm.namaKomisi} onChange={e => setInfoForm({ ...infoForm, namaKomisi: e.target.value })} />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Masa Jabatan *</label>
                    <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" placeholder="Contoh: 2024-2029" value={infoForm.masaJabatan} onChange={e => setInfoForm({ ...infoForm, masaJabatan: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi</label>
                    <textarea rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none" placeholder="Deskripsi ruang lingkup atau tugas..." value={infoForm.deskripsi} onChange={e => setInfoForm({ ...infoForm, deskripsi: e.target.value })} />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={infoForm.isAktif} onChange={e => setInfoForm({ ...infoForm, isAktif: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-red-600" />
                    <span className="text-sm font-medium text-gray-700">Aktif (tampilkan di halaman publik)</span>
                </label>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
                <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Batal</button>
                <button onClick={onSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50">
                    <Save size={16} />{saving ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>
        </div>
    </div>
);

// ── Anggota Modal ───────────────────────────────────────────────────────────
export const KomisiAnggotaModal: React.FC<{
    editingAnggota: AnggotaKomisi | null;
    anggotaForm: { name: string; jabatan: string; faction: string; order: string; komisiInfoId: string };
    setAnggotaForm: (f: any) => void;
    imagePreview: string;
    saving: boolean;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    onClose: () => void;
}> = ({ editingAnggota, anggotaForm, setAnggotaForm, imagePreview, saving, onImageChange, onSave, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h2 className="text-lg font-black text-gray-900">{editingAnggota ? 'Edit Anggota' : 'Tambah Anggota Komisi'}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Foto</label>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-24 rounded-xl bg-gray-100 overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center">
                            {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <User size={28} className="text-gray-300" />}
                        </div>
                        <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer">
                            <Upload size={16} />Pilih Foto
                            <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama *</label>
                    <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" placeholder="Nama lengkap" value={anggotaForm.name} onChange={e => setAnggotaForm({ ...anggotaForm, name: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Jabatan *</label>
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white" value={anggotaForm.jabatan} onChange={e => setAnggotaForm({ ...anggotaForm, jabatan: e.target.value })}>
                        {JABATAN_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Fraksi</label>
                    <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" placeholder="Contoh: Fraksi PKS" value={anggotaForm.faction} onChange={e => setAnggotaForm({ ...anggotaForm, faction: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Urutan</label>
                    <input type="number" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" value={anggotaForm.order} onChange={e => setAnggotaForm({ ...anggotaForm, order: e.target.value })} />
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

// ── Delete Modal ────────────────────────────────────────────────────────────
export const KomisiDeleteModal: React.FC<{
    target: { type: string; name: string };
    onConfirm: () => void;
    onClose: () => void;
}> = ({ target, onConfirm, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-600" />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2">Hapus Data?</h3>
            <p className="text-gray-500 text-sm mb-6">
                Yakin hapus <span className="font-bold text-gray-700">{target.name}</span>?
                {(target.type === 'komisi' || target.type === 'masa') && ' Semua anggota di bawahnya juga akan terhapus!'}
            </p>
            <div className="flex justify-center gap-3">
                <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">Batal</button>
                <button onClick={onConfirm} className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl">Ya, Hapus</button>
            </div>
        </div>
    </div>
);
