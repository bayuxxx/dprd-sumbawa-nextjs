'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Upload, RefreshCw } from 'lucide-react';

const ASSETS = [
  { slug: 'struktur-organisasi', label: 'Struktur Organisasi' },
  { slug: 'maklumat-pelayanan',  label: 'Maklumat Pelayanan'  },
];

interface Asset { slug: string; imageUrl: string; }

export default function PpidAdminPage() {
  const [assets, setAssets]   = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState<string | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [files, setFiles]     = useState<Record<string, File>>({});

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/ppid/assets');
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">PPID — Gambar</h1>
          <p className="text-sm text-gray-500 mt-0.5">Upload atau ganti gambar Struktur Organisasi dan Maklumat Pelayanan</p>
        </div>
        <button onClick={load} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><RefreshCw size={16} /></button>
      </div>

      {ASSETS.map(({ slug, label }) => {
        const current  = assets[slug];
        const preview  = previews[slug];
        const file     = files[slug];
        const isSaving = saving === slug;

        return (
          <div key={slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-gray-900 mb-4">{label}</h2>

            {loading ? (
              <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
            ) : (
              <div className="space-y-4">
                {/* Preview */}
                {(preview || current) && (
                  <img src={preview || current} alt={label}
                    className="w-full rounded-xl border border-gray-100 shadow-sm max-h-80 object-contain bg-gray-50" />
                )}

                {!preview && !current && (
                  <div className="h-32 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center">
                    <p className="text-gray-400 text-sm">Belum ada gambar</p>
                  </div>
                )}

                {/* Upload */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 cursor-pointer transition-colors">
                    <Upload size={15} />
                    {current ? 'Ganti Gambar' : 'Upload Gambar'}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(slug, f); }} />
                  </label>

                  {file && (
                    <button onClick={() => handleSave(slug)} disabled={isSaving}
                      className="px-4 py-2 bg-[#0a2744] text-white rounded-xl text-sm font-bold hover:bg-[#123b66] disabled:opacity-60 transition-colors">
                      {isSaving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  )}

                  {file && (
                    <button onClick={() => { setFiles(f => { const n = {...f}; delete n[slug]; return n; }); setPreviews(p => { const n = {...p}; delete n[slug]; return n; }); }}
                      className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50">
                      Batal
                    </button>
                  )}
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
