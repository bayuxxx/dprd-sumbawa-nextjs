'use client';
import React, { useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, MapPin, Clock, X } from 'lucide-react';
import { useAgenda } from './useAgenda';
import AgendaForm from './AgendaForm';

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

export default function AgendaAdminPage() {
  const a = useAgenda();

  useEffect(() => { a.load(); }, []);

  const formatDate = (d: string) => {
    const dt = new Date(d);
    return { day: dt.getDate(), month: MONTHS_SHORT[dt.getMonth()], year: dt.getFullYear() };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Calendar size={20} className="text-red-600" /> Agenda Kegiatan
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola jadwal kegiatan DPRD yang tampil di halaman utama</p>
        </div>
        <button onClick={a.openCreate} className="flex items-center gap-2 bg-[#0a2744] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#123b66] transition-colors">
          <Plus size={16} /> Tambah Agenda
        </button>
      </div>

      {a.loading ? (
        <div className="space-y-3">
          {Array(4).fill(0).map((_, i) => <div key={i} className="h-20 bg-white rounded-xl border border-gray-100 animate-pulse" />)}
        </div>
      ) : a.items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <Calendar size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 font-medium">Belum ada agenda</p>
        </div>
      ) : (
        <div className="space-y-3">
          {a.items.map(item => {
            const { day, month, year } = formatDate(item.tanggal);
            return (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm flex items-stretch overflow-hidden group hover:border-blue-200 transition-colors">
                {/* Color bar */}
                <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: item.color }} />

                {/* Date */}
                <div className="flex flex-col items-center justify-center px-4 py-3 bg-slate-50 border-r border-gray-100 min-w-[72px]">
                  <span className="text-2xl font-black text-[#0a2744] leading-none">{day}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{month}</span>
                  <span className="text-[10px] text-slate-400">{year}</span>
                </div>

                {/* Content */}
                <div className="flex-1 px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded" style={{ backgroundColor: item.color }}>{item.category}</span>
                    {!item.isActive && <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Nonaktif</span>}
                  </div>
                  <p className="text-sm font-bold text-gray-800 leading-snug mb-1.5">{item.title}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock size={11} />{item.waktu}</span>
                    <span className="flex items-center gap-1"><MapPin size={11} />{item.lokasi}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => a.openEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={15} /></button>
                  <button onClick={() => a.setDeleteId(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {a.showForm && (
        <AgendaForm
          editing={a.editing} form={a.form} setForm={a.setForm}
          saving={a.saving} error={a.error}
          onSave={a.handleSave} onClose={() => a.setShowForm(false)}
          onCategoryChange={a.handleCategoryChange}
        />
      )}

      {a.deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => a.setDeleteId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
            <Trash2 size={32} className="mx-auto text-red-500 mb-3" />
            <h3 className="font-black text-gray-900 mb-2">Hapus agenda ini?</h3>
            <p className="text-sm text-gray-500 mb-4">Aksi ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => a.setDeleteId(null)} className="flex-1 border border-gray-200 py-2 rounded-xl text-sm font-bold">Batal</button>
              <button onClick={a.handleDelete} className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm font-bold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
