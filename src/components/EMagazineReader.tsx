'use client';
import React, { useEffect, useState } from 'react';
import { X, ExternalLink, BookOpen, Download } from 'lucide-react';

interface Props {
  magazine: { title: string; edisi: string; fileUrl: string | null; imageUrl: string | null };
  onClose: () => void;
}

export default function EMagazineReader({ magazine, onClose }: Props) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!magazine.fileUrl) return;

    // Fetch PDF sebagai blob — IDM tidak bisa intercept fetch() API
    fetch(magazine.fileUrl)
      .then(res => {
        if (!res.ok) throw new Error('Gagal memuat PDF');
        return res.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [magazine.fileUrl]);

  if (!magazine.fileUrl) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center relative" onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={18} /></button>
          {magazine.imageUrl && <img src={magazine.imageUrl} alt={magazine.title} className="w-40 mx-auto rounded-xl shadow-lg mb-4" />}
          <h3 className="font-black text-gray-900">{magazine.title}</h3>
          <p className="text-gray-500 text-sm mt-1 mb-4">{magazine.edisi}</p>
          <p className="text-gray-400 text-sm">File PDF belum tersedia untuk edisi ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col" onClick={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/70 backdrop-blur-sm flex-shrink-0"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 text-white min-w-0">
          <BookOpen size={18} className="text-red-400 flex-shrink-0" />
          <span className="font-bold text-sm truncate">{magazine.title} — {magazine.edisi}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <a href={magazine.fileUrl} download
            className="flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <Download size={13} /> Unduh
          </a>
          <a href={magazine.fileUrl} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <ExternalLink size={13} /> Tab Baru
          </a>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors ml-1">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-hidden bg-gray-800" onClick={e => e.stopPropagation()}>
        {loading && (
          <div className="flex flex-col items-center justify-center h-full text-white/60 gap-3">
            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="text-sm">Memuat PDF...</span>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-full text-white/60 gap-4">
            <p className="font-bold text-white">Gagal memuat PDF</p>
            <a href={magazine.fileUrl} target="_blank" rel="noreferrer"
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700">
              Buka di Tab Baru
            </a>
          </div>
        )}

        {/* Blob URL tidak di-intercept IDM */}
        {blobUrl && (
          <iframe
            src={`${blobUrl}#toolbar=1`}
            className="w-full h-full border-0"
            title={`${magazine.title} - ${magazine.edisi}`}
          />
        )}
      </div>
    </div>
  );
}
