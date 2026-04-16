'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Save, BookOpen, Link2, Info } from 'lucide-react';
import EmojiPicker from '../../../../components/EmojiPicker';

// ── Types ──────────────────────────────────────────────────────────────────
interface Magazine { id: string; title: string; edisi: string; imageUrl: string | null; fileUrl: string | null; isActive: boolean; order: number; }
interface InfoItem { id: string; title: string; icon: string; url: string; isActive: boolean; order: number; }
interface TautanItem { id: string; title: string; url: string; isActive: boolean; order: number; }

type Tab = 'emagazine' | 'infopublik' | 'tautan';

const token = () => typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

// ── Generic simple list CRUD (InfoPublik & Tautan) ─────────────────────────
function SimpleListSection<T extends { id: string; title: string; url: string; isActive: boolean; order: number }>({
    title, icon, endpoint, extraField,
}: {
    title: string; icon: React.ReactNode; endpoint: string;
    extraField?: { key: string; label: string; placeholder: string };
}) {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<T | null>(null);
    const [form, setForm] = useState<any>({ title: '', url: '', isActive: true, order: 0 });
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token()}` } });
        setItems(await res.json());
        setLoading(false);
    }, [endpoint]);

    useEffect(() => { load(); }, [load]);

    const openCreate = () => { setEditing(null); setForm({ title: '', url: '', isActive: true, order: 0, ...(extraField ? { [extraField.key]: '' } : {}) }); setShowForm(true); };
    const openEdit = (item: T) => { setEditing(item); setForm({ ...item }); setShowForm(true); };

    const handleSave = async () => {
        setSaving(true);
        const method = editing ? 'PUT' : 'POST';
        const url = editing ? `${endpoint}/${editing.id}` : endpoint;
        await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }, body: JSON.stringify(form) });
        setShowForm(false); load();
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        await fetch(`${endpoint}/${deleteId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
        setDeleteId(null); load();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">{icon}{title}</h2>
                <button onClick={openCreate} className="flex items-center gap-1.5 bg-[#0a2744] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#123b66] transition-colors">
                    <Plus size={15} /> Tambah
                </button>
            </div>

            {loading ? <div className="space-y-2">{Array(3).fill(0).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}</div>
                : items.length === 0 ? <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-xl border border-gray-100">Belum ada data</div>
                : (
                    <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                        {items.map(item => (
                            <div key={item.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 group">
                                {extraField && <span className="text-xl">{(item as any)[extraField.key]}</span>}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate">{item.title}</p>
                                    <p className="text-xs text-gray-400 truncate">{item.url}</p>
                                </div>
                                {!item.isActive && <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Nonaktif</span>}
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={14} /></button>
                                    <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black text-gray-900">{editing ? 'Edit' : 'Tambah'} {title}</h3>
                            <button onClick={() => setShowForm(false)}><X size={18} /></button>
                        </div>
                        <div className="space-y-3">
                            {extraField && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">{extraField.label}</label>
                                    <EmojiPicker value={form[extraField.key] || '📄'} onChange={emoji => setForm({ ...form, [extraField.key]: emoji })} />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nama / Judul *</label>
                                <input type="text" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">URL *</label>
                                <input type="url" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Urutan</label>
                                    <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                                </div>
                                <div className="flex items-end pb-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">Aktif</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Batal</button>
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
                        <h3 className="font-black text-gray-900 mb-2">Hapus item ini?</h3>
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

// ── e-Magazine Section ─────────────────────────────────────────────────────
function EMagazineSection() {
    const [items, setItems] = useState<Magazine[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Magazine | null>(null);
    const [form, setForm] = useState({ title: '', edisi: '', isActive: true, order: 0 });
    const [imgFile, setImgFile] = useState<File | null>(null);
    const [imgPreview, setImgPreview] = useState('');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        const res = await fetch('/api/emagazine', { headers: { Authorization: `Bearer ${token()}` } });
        setItems(await res.json());
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const openCreate = () => { setEditing(null); setForm({ title: '', edisi: '', isActive: true, order: 0 }); setImgFile(null); setImgPreview(''); setPdfFile(null); setShowForm(true); };
    const openEdit = (item: Magazine) => { setEditing(item); setForm({ title: item.title, edisi: item.edisi, isActive: item.isActive, order: item.order }); setImgFile(null); setImgPreview(item.imageUrl || ''); setPdfFile(null); setShowForm(true); };

    const handleSave = async () => {
        setSaving(true);
        const fd = new FormData();
        fd.append('title', form.title); fd.append('edisi', form.edisi);
        fd.append('isActive', String(form.isActive)); fd.append('order', String(form.order));
        if (imgFile) fd.append('image', imgFile);
        if (pdfFile) fd.append('file', pdfFile);
        const url = editing ? `/api/emagazine/${editing.id}` : '/api/emagazine';
        await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd });
        setShowForm(false); load(); setSaving(false);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        await fetch(`/api/emagazine/${deleteId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
        setDeleteId(null); load();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2"><BookOpen size={18} className="text-red-600" /> e-Magazine</h2>
                <button onClick={openCreate} className="flex items-center gap-1.5 bg-[#0a2744] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#123b66]"><Plus size={15} /> Tambah</button>
            </div>

            {loading ? <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">{Array(4).fill(0).map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse" />)}</div>
                : items.length === 0 ? <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-xl border border-gray-100">Belum ada e-Magazine</div>
                : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {items.map(mag => (
                            <div key={mag.id} className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                {mag.imageUrl ? <img src={mag.imageUrl} alt={mag.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-bold p-2 text-center">{mag.edisi}</div>}
                                {!mag.isActive && <div className="absolute top-1 left-1 bg-gray-800/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Nonaktif</div>}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button onClick={() => openEdit(mag)} className="p-2 bg-white rounded-lg text-blue-600"><Edit2 size={14} /></button>
                                    <button onClick={() => setDeleteId(mag.id)} className="p-2 bg-white rounded-lg text-red-500"><Trash2 size={14} /></button>
                                </div>
                                <div className="absolute bottom-0 inset-x-0 bg-red-600/90 py-1 text-center">
                                    <span className="text-white text-[10px] font-bold">{mag.edisi}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black text-gray-900">{editing ? 'Edit' : 'Tambah'} e-Magazine</h3>
                            <button onClick={() => setShowForm(false)}><X size={18} /></button>
                        </div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Judul *</label>
                                    <input type="text" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Edisi *</label>
                                    <input type="text" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Edisi 1" value={form.edisi} onChange={e => setForm({ ...form, edisi: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Cover (gambar)</label>
                                <div className="flex items-center gap-3">
                                    {imgPreview && <img src={imgPreview} alt="" className="w-16 h-20 object-cover rounded-lg border" />}
                                    <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-200">
                                        Pilih Gambar
                                        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setImgFile(f); setImgPreview(URL.createObjectURL(f)); } }} />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">File PDF</label>
                                <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-200 w-fit">
                                    {pdfFile ? pdfFile.name : (editing?.fileUrl ? 'Ganti PDF' : 'Pilih PDF')}
                                    <input type="file" accept=".pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setPdfFile(f); }} />
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Urutan</label>
                                    <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                                </div>
                                <div className="flex items-end pb-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">Aktif</span>
                                    </label>
                                </div>
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
                        <h3 className="font-black text-gray-900 mb-2">Hapus e-Magazine ini?</h3>
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

// ── Main Page ──────────────────────────────────────────────────────────────
const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'emagazine', label: 'e-Magazine', icon: <BookOpen size={15} /> },
    { key: 'infopublik', label: 'Info Publik', icon: <Info size={15} /> },
    { key: 'tautan', label: 'Tautan', icon: <Link2 size={15} /> },
];

export default function KontenPublikPage() {
    const [tab, setTab] = useState<Tab>('emagazine');

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-xl font-black text-gray-900">Konten Publik</h1>
                <p className="text-sm text-gray-500 mt-0.5">Kelola e-Magazine, Info Publik, dan Tautan yang tampil di halaman utama</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm w-fit">
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tab === t.key ? 'bg-[#0a2744] text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}>
                        {t.icon}{t.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                {tab === 'emagazine' && <EMagazineSection />}
                {tab === 'infopublik' && (
                    <SimpleListSection
                        title="Info Publik" icon={<Info size={18} className="text-blue-600" />}
                        endpoint="/api/info-publik"
                        extraField={{ key: 'icon', label: 'Emoji Icon', placeholder: '📄' }}
                    />
                )}
                {tab === 'tautan' && (
                    <SimpleListSection
                        title="Tautan" icon={<Link2 size={18} className="text-green-600" />}
                        endpoint="/api/tautan"
                    />
                )}
            </div>
        </div>
    );
}
