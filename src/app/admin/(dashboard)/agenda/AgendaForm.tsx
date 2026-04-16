'use client';
import React from 'react';
import { X, Save } from 'lucide-react';
import type { AgendaItem } from './useAgenda';
import { CATEGORIES, CATEGORY_COLORS } from './useAgenda';

interface Props {
  editing: AgendaItem | null;
  form: { title: string; tanggal: string; waktu: string; lokasi: string; category: string; color: string; isActive: boolean };
  setForm: (f: any) => void;
  saving: boolean;
  error: string;
  onSave: () => void;
  onClose: () => void;
  onCategoryChange: (cat: string) => void;
}

export default function AgendaForm({ editing, form, setForm, saving, error, onSave, onClose, onCategoryChange }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-black text-gray-900">{editing ? 'Edit Agenda' : 'Tambah Agenda'}</h2>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>

        <div className="p-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3">{error}</div>}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Judul Kegiatan *</label>
            <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Rapat Paripurna DPRD" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal *</label>
              <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Waktu</label>
              <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="09.00 WITA" value={form.waktu} onChange={e => setForm({ ...form, waktu: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Lokasi *</label>
            <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Gedung DPRD Sumbawa Barat" value={form.lokasi} onChange={e => setForm({ ...form, lokasi: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} type="button" onClick={() => onCategoryChange(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${form.category === cat ? 'text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                  style={form.category === cat ? { backgroundColor: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">Warna Label</label>
              <div className="flex items-center gap-2">
                <input type="color" className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                  value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
                <span className="text-sm text-gray-500 font-mono">{form.color}</span>
              </div>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" />
                <span className="text-sm font-medium text-gray-700">Aktif</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Batal</button>
          <button onClick={onSave} disabled={saving} className="flex-1 bg-[#0a2744] text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
            <Save size={15} />{saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}
