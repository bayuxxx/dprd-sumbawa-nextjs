'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Upload, RefreshCw, Plus, Trash2, Edit2, X, Save, FileText, FileSpreadsheet } from 'lucide-react';

const ASSETS = [
  { slug: 'struktur-organisasi', label: 'Struktur Organisasi' },
  { slug: 'maklumat-pelayanan',  label: 'Maklumat Pelayanan'  },
];

interface Asset { slug: string; imageUrl: string; }
interface Anggaran { id: string; title: string; fileUrl: string; fileType: string; tahun: string; order: number; }

type Tab = 'gambar' | 'anggaran';

// ── Gambar Section ──────────────────────────────────────────────────────────
function GambarSection() {
  const [assets, setAssets]     = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState<string | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [files, setFiles]       = useState<Record<string, File>>({});
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch('/api/ppid/assets');
    const data: Asset[] = await res.json().catch(() => []);
    const map: Record<string, string> = {};
    data.forEach(a => { map[a.slug] = a.imageUrl; });
    setAssets(map);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleFile = (slug: string, file: File) => {
    setFiles(f => ({ ...f, [slug]: file }));
    setPreviews(p => ({ ...p, [slug]: URL.createObjectURL(file) }));
  };

  const handleSave = async (slug: string) => {
    const file = files[slug];
    if (!file) return;
    setSaving(slug);
    const fd = new FormData();
    fd.append('slug', slug);
    fd.append('image', file);
    await fetch('/api/ppid/assets', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
    setFiles(f => { const n = { ...f }; delete n[slug]; return n; });
    setPreviews(p => { const n = { ...p }; delete n[slug]; return n; });
    await load();
    setSaving(null);
  };

  return (
    <div className="space-y-6">
      {ASSETS.map(({ slug, label }) => {
        const current = assets[slug];
        const preview = previews[slug];
        const file    = files[slug];
        const isSaving = saving === slug;
        return (
          <div key={slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-gray-900 mb-4">{label}</h2>
            {loading ? <div className="h-48 bg-gray-100 rounded-xl animate-pulse" /> : (
              <div className="space-y-4">
                {(preview || current) && <img src={preview || current} alt={label} className="w-full rounded-xl border border-gray-100 shadow-sm max-h-80 object-contain bg-gray-50" />}
                {!preview && !current && <div className="h-32 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center"><p className="text-gray-400 text-sm">Belum ada gambar</p></div>}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 cursor-pointer transition-colors">
                    <Upload size={15} />{current ? 'Ganti Gambar' : 'Upload Gambar'}
                    <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(slug, f); }} />
                  </label>
                  {file && <button onClick={() => handleSave(slug)} disabled={isSaving} className="px-4 py-2 bg-[#0a2744] text-white rounded-xl text-sm font-bold hover:bg-[#123b66] disabled:opacity-60">{isSaving ? 'Menyimpan...' : 'Simpan'}</button>}
                  {file && <button onClick={() => { setFiles(f => { const n = {...f}; delete n[slug]; return n; }); setPreviews(p => { const n = {...p}; delete n[slug]; return n; }); }} className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50">Batal</button>}
                </div>
                {file && <p className="text-xs text-gray-400">{file.name} ({(file.size / 1024).toFixed(0)} KB)</p>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Anggaran Section ────────────────────────────────────────────────────────
function AnggaranSection() {
  const [items, setItems]       = useState<Anggaran[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Anggaran | null>(null);
  const [form, setForm]         = useState({ title: '', tahun: new Date().getFullYear().toString(), order: 0 });
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError]       = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/ppid/anggaran');
    setItems(await res.json().catch(() => []));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ title: '', tahun: new Date().getFullYear().toString(), order: 0 }); setFileInput(null); setError(''); setShowForm(true); };
  const openEdit   = (item: Anggaran) => { setEditing(item); setForm({ title: item.title, tahun: item.tahun, order: item.order }); setFileInput(null); setError(''); setShowForm(true); };

  const handleSave = async () => {
    if (!form.title || !form.tahun) { setError('Judul dan tahun wajib diisi.'); return; }
    if (!editing && !fileInput) { setError('File wajib diupload.'); return; }
    setSaving(true); setError('');
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('tahun', form.tahun);
    fd.append('order', String(form.order));
    if (fileInput) fd.append('file', fileInput);
    const url    = editing ? `/api/ppid/anggaran/${editing.id}` : '/api/ppid/anggaran';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: fd });
    if (!res.ok) { const d = await res.json(); setError(d.message || 'Gagal menyimpan'); setSaving(false); return; }
    setShowForm(false); load();
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/ppid/anggaran/${deleteId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setDeleteId(null); load();
  };

  // Group by tahun
  const byTahun = items.reduce((acc, i) => { if (!acc[i.tahun]) acc[i.tahun] = []; acc[i.tahun].push(i); return acc; }, {} as Record<string, Anggaran[]>);
  const tahunList = Object.keys(byTahun).sort((a, b) => b.localeCompare(a));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">Kelola dokumen anggaran (PDF / Excel, maks. 15MB)</p>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#0a2744] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#123b66]"><Plus size={15} /> Tambah</button>
      </div>

      {loading ? <div className="space-y-2">{Array(3).fill(0).map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        : items.length === 0 ? <div className="text-center py-12 bg-white rounded-2xl border border-gray-100"><FileText size={36} className="mx-auto text-gray-200 mb-3" /><p className="text-gray-400 text-sm">Belum ada data anggaran</p></div>
        : tahunList.map(tahun => (
          <div key={tahun} className="mb-6">
            <h3 className="font-black text-gray-700 text-sm mb-2 flex items-center gap-2"><span className="bg-[#0a2744] text-white text-xs px-2.5 py-0.5 rounded-full">Tahun {tahun}</span></h3>
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
              {byTahun[tahun].map(item => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.fileType === 'excel' ? '#e8f5e9' : '#fef2f2' }}>
                    {item.fileType === 'excel' ? <FileSpreadsheet size={16} className="text-green-600" /> : <FileText size={16} className="text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 uppercase">{item.fileType}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={item.fileUrl} target="_blank" rel="noreferrer" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Unduh"><Upload size={14} className="rotate-180" /></a>
                    <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={14} /></button>
                    <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      }

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900">{editing ? 'Edit' : 'Tambah'} Data Anggaran</h3>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-3">{error}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Judul *</label>
                <input type="text" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: APBD Tahun 2025" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tahun *</label>
                  <input type="text" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="2025" value={form.tahun} onChange={e => setForm({ ...form, tahun: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Urutan</label>
                  <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">File (PDF / Excel) {!editing && '*'}</label>
                <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 cursor-pointer transition-colors w-fit">
                  <Upload size={15} />{fileInput ? fileInput.name : (editing ? 'Ganti File' : 'Pilih File')}
                  <input type="file" accept=".pdf,.xlsx,.xls,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setFileInput(f); }} />
                </label>
                {fileInput && <p className="text-xs text-gray-400 mt-1">{(fileInput.size / 1024 / 1024).toFixed(2)} MB</p>}
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 py-2 rounded-xl text-sm font-bold text-gray-600">Batal</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#0a2744] text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
                <Save size={14} />{saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
            <Trash2 size={32} className="mx-auto text-red-500 mb-3" />
            <h3 className="font-black text-gray-900 mb-2">Hapus dokumen ini?</h3>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 py-2 rounded-xl text-sm font-bold">Batal</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm font-bold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function PpidAdminPage() {
  const [tab, setTab] = useState<Tab>('gambar');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">PPID</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola konten halaman PPID</p>
        </div>
      </div>

      <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm w-fit">
        {([['gambar', 'Gambar'], ['anggaran', 'Data Anggaran']] as [Tab, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tab === key ? 'bg-[#0a2744] text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {tab === 'gambar'    && <GambarSection />}
        {tab === 'anggaran'  && <AnggaranSection />}
      </div>
    </div>
  );
}
