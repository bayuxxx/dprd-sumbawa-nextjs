'use client';
import React from 'react';
import { X, Save, Upload, Trash2 } from 'lucide-react';
import type { Pimpinan, MasaJabatan } from '../../../services/api';

// --- MASA JABATAN MODAL ---
interface MasaJabatanModalProps {
    show: boolean;
    editingMj: MasaJabatan | null;
    form: any;
    setForm: (form: any) => void;
    saving: boolean;
    onClose: () => void;
    onSave: () => void;
}

export const MasaJabatanModal: React.FC<MasaJabatanModalProps> = ({ show, editingMj, form, setForm, saving, onClose, onSave }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h2 className="font-bold text-slate-800">{editingMj ? 'Edit Periode' : 'Tambah Periode Masa Jabatan'}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500">
                        <X size={18} />
                    </button>
                </div>

                <div className="overflow-y-auto p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Periode * <span className="text-slate-400 font-normal">(contoh: 2024-2029)</span></label>
                        <input
                            type="text"
                            value={form.periode}
                            onChange={e => setForm({ ...form, periode: e.target.value })}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            placeholder="2024-2029"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tahun Mulai *</label>
                            <input
                                type="number"
                                value={form.tahunMulai}
                                onChange={e => setForm({ ...form, tahunMulai: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                placeholder="2024"
                                min="1945"
                                max="2100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tahun Selesai *</label>
                            <input
                                type="number"
                                value={form.tahunSelesai}
                                onChange={e => setForm({ ...form, tahunSelesai: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                placeholder="2029"
                                min="1945"
                                max="2100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Urutan Tampilan</label>
                        <input
                            type="number"
                            value={form.order}
                            onChange={e => setForm({ ...form, order: e.target.value })}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Keterangan</label>
                        <textarea
                            value={form.keterangan}
                            onChange={e => setForm({ ...form, keterangan: e.target.value })}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                            rows={2}
                            placeholder="Keterangan tambahan..."
                        />
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                        <input
                            id="isAktif"
                            type="checkbox"
                            checked={form.isAktif}
                            onChange={e => setForm({ ...form, isAktif: e.target.checked })}
                            className="w-4 h-4 text-green-600 rounded"
                        />
                        <label htmlFor="isAktif" className="text-sm font-medium text-green-700 cursor-pointer">
                            Periode Aktif Saat Ini
                            <span className="block text-xs text-green-500 font-normal">Mencentang ini akan menonaktifkan periode lain</span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-3 p-5 border-t border-slate-100">
                    <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
                        Batal
                    </button>
                    <button onClick={onSave} disabled={saving} className="flex-1 bg-[#123b66] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#0a2744] disabled:opacity-60 flex justify-center items-center gap-2">
                        <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- PIMPINAN MODAL ---
interface PimpinanModalProps {
    show: boolean;
    editingPimpinan: Pimpinan | null;
    form: any;
    setForm: (form: any) => void;
    imagePreview: string;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    masaJabatanList: MasaJabatan[];
    saving: boolean;
    onClose: () => void;
    onSave: () => void;
}

export const PimpinanModal: React.FC<PimpinanModalProps> = ({
    show, editingPimpinan, form, setForm, imagePreview, onImageChange, masaJabatanList, saving, onClose, onSave
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h2 className="font-bold text-slate-800">{editingPimpinan ? 'Edit Pimpinan' : 'Tambah Pimpinan'}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500">
                        <X size={18} />
                    </button>
                </div>

                <div className="overflow-y-auto p-5 space-y-4">
                    {/* Foto Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Foto</label>
                        <div className="flex items-center gap-4">
                            <div
                                className="w-20 h-24 rounded-lg border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center cursor-pointer hover:border-[#123b66] transition-colors bg-slate-50"
                                onClick={() => document.getElementById('pimpinan-image-input')?.click()}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="" className="w-full h-full object-cover object-top" />
                                ) : (
                                    <div className="text-center p-2">
                                        <Upload size={16} className="mx-auto text-slate-300 mb-1" />
                                        <p className="text-slate-300 text-[10px]">Pilih foto</p>
                                    </div>
                                )}
                            </div>
                            <div className="text-slate-500 text-xs leading-relaxed">
                                <p>Klik kotak untuk memilih foto.</p>
                                <p>Format JPG/PNG, maksimal ukuran 5MB.</p>
                            </div>
                        </div>
                        <input id="pimpinan-image-input" type="file" accept="image/*" className="hidden" onChange={onImageChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap *</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                placeholder="H. Nama Lengkap, S.H." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Jabatan *</label>
                            <input type="text" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                placeholder="Ketua DPRD" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Fraksi</label>
                            <input type="text" value={form.faction} onChange={e => setForm({ ...form, faction: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                placeholder="Fraksi Gerindra" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Periode (teks)</label>
                            <input type="text" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                placeholder="2024-2029" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Urutan</label>
                            <input type="number" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                min="0" />
                        </div>
                    </div>

                    {/* Masa Jabatan Select */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Pindah Masa Jabatan</label>
                        <select
                            value={form.masaJabatanId}
                            onChange={e => {
                                const id = e.target.value;
                                const found = masaJabatanList.find(m => m.id === id);
                                setForm({ ...form, masaJabatanId: id, period: found ? found.periode : form.period });
                            }}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                        >
                            <option value="">-- Tanpa Masa Jabatan --</option>
                            {masaJabatanList.map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.periode} {m.isAktif ? '(Aktif)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <input
                            id="isPast"
                            type="checkbox"
                            checked={form.isPast}
                            onChange={e => setForm({ ...form, isPast: e.target.checked })}
                            className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                        />
                        <label htmlFor="isPast" className="text-sm font-medium text-amber-700 cursor-pointer">
                            Tandai sebagai Pimpinan Terdahulu
                            <span className="block text-xs text-amber-500 font-normal">Meskipun di periode aktif, status dapat dibuat pimpinan lalu.</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio / Deskripsi</label>
                        <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                            rows={3} placeholder="Deskripsi singkat pimpinan..." />
                    </div>
                </div>

                <div className="flex gap-3 p-5 border-t border-slate-100">
                    <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
                        Batal
                    </button>
                    <button onClick={onSave} disabled={saving} className="flex-1 bg-[#123b66] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#0a2744] disabled:opacity-60 flex justify-center items-center gap-2">
                        <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- DELETE CONFIRM MODAL ---
interface DeleteConfirmModalProps {
    target: { type: 'mj' | 'pimpinan', id: string, name: string } | null;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ target, onClose, onConfirm }) => {
    if (!target) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={24} className="text-red-500" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Hapus {target.type === 'mj' ? 'Masa Jabatan' : 'Pimpinan'}?</h3>
                <p className="text-slate-500 text-sm mb-5">
                    Yakin ingin menghapus <span className="font-bold">{target.name}</span>?
                    {target.type === 'mj' && ' Pimpinan yang berada di masa jabatan ini akan menjadi "Tanpa Masa Jabatan".'}
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 border border-slate-200 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Batal</button>
                    <button onClick={onConfirm} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600">Teruskan Hapus</button>
                </div>
            </div>
        </div>
    );
};
