'use client';
import React from 'react';
import { X, Save, Upload, User, Trash2 } from 'lucide-react';

const JABATAN_OPTIONS = ['Ketua', 'Wakil Ketua', 'Anggota', 'Sekretaris'];

interface InfoModalProps {
    show: boolean;
    onClose: () => void;
    isEditing: boolean;
    formData: { masaJabatan: string; deskripsi: string; isAktif: boolean };
    setFormData: React.Dispatch<React.SetStateAction<{ masaJabatan: string; deskripsi: string; isAktif: boolean }>>;
    onSave: () => void;
    saving: boolean;
}

export const BanggarInfoModal: React.FC<InfoModalProps> = ({
    show, onClose, isEditing, formData, setFormData, onSave, saving
}) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-lg font-black text-gray-900">
                        {isEditing ? 'Edit Masa Jabatan Banggar' : 'Tambah Masa Jabatan Banggar'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Masa Jabatan *</label>
                        <input
                            type="text"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            placeholder="Contoh: 2024-2029"
                            value={formData.masaJabatan}
                            onChange={(e) => setFormData({ ...formData, masaJabatan: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi</label>
                        <textarea
                            rows={4}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                            placeholder="Deskripsi tentang Banggar..."
                            value={formData.deskripsi}
                            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isAktif}
                            onChange={(e) => setFormData({ ...formData, isAktif: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Aktif (tampilkan di halaman publik)</span>
                    </label>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50"
                    >
                        <Save size={16} />
                        {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface AnggotaModalProps {
    show: boolean;
    onClose: () => void;
    isEditing: boolean;
    formData: { name: string; jabatan: string; faction: string; order: string; banggarInfoId: string };
    setFormData: React.Dispatch<React.SetStateAction<{ name: string; jabatan: string; faction: string; order: string; banggarInfoId: string }>>;
    imagePreview: string;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    saving: boolean;
}

export const BanggarAnggotaModal: React.FC<AnggotaModalProps> = ({
    show, onClose, isEditing, formData, setFormData, imagePreview, onImageChange, onSave, saving
}) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-black text-gray-900">
                        {isEditing ? 'Edit Anggota Banggar' : 'Tambah Anggota Banggar'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
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
                                <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nama *</label>
                        <input
                            type="text"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            placeholder="Nama lengkap"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Jabatan *</label>
                        <select
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white"
                            value={formData.jabatan}
                            onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                        >
                            {JABATAN_OPTIONS.map((j) => (
                                <option key={j} value={j}>{j}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Fraksi</label>
                        <input
                            type="text"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            placeholder="Contoh: Fraksi PKS"
                            value={formData.faction}
                            onChange={(e) => setFormData({ ...formData, faction: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Urutan</label>
                        <input
                            type="number"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            placeholder="0"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50"
                    >
                        <Save size={16} />
                        {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface DeleteConfirmProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    target: { type: 'info' | 'anggota'; id: string; name: string } | null;
}

export const BanggarDeleteConfirm: React.FC<DeleteConfirmProps> = ({
    show, onClose, onConfirm, target
}) => {
    if (!show || !target) return null;
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center" onClick={(e) => e.stopPropagation()}>
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={24} className="text-red-600" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">Hapus Data?</h3>
                <p className="text-gray-500 text-sm mb-6">
                    Anda yakin ingin menghapus <span className="font-bold text-gray-700">{target.name}</span>?
                    {target.type === 'info' && ' Semua anggota di bawahnya juga akan ikut terhapus.'}
                </p>
                <div className="flex justify-center gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                    >
                        Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};
