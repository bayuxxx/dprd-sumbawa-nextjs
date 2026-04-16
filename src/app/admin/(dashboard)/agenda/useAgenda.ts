'use client';
import { useState, useCallback } from 'react';

export interface AgendaItem {
  id: string;
  title: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  category: string;
  color: string;
  isActive: boolean;
}

export const CATEGORY_COLORS: Record<string, string> = {
  'Paripurna':   '#c0392b',
  'Rapat Komisi':'#1a6bb5',
  'Kunker':      '#27ae60',
  'Bamus':       '#8e44ad',
  'Konsultasi':  '#16a085',
  'Kegiatan':    '#1a6bb5',
};

export const CATEGORIES = Object.keys(CATEGORY_COLORS);

const emptyForm = { title: '', tanggal: '', waktu: '09.00 WITA', lokasi: '', category: 'Kegiatan', color: '#1a6bb5', isActive: true };

const token = () => typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

export function useAgenda() {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AgendaItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/agenda', { headers: { Authorization: `Bearer ${token()}` } });
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (item: AgendaItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      tanggal: item.tanggal ? new Date(item.tanggal).toISOString().split('T')[0] : '',
      waktu: item.waktu,
      lokasi: item.lokasi,
      category: item.category,
      color: item.color,
      isActive: item.isActive,
    });
    setError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.tanggal || !form.lokasi) { setError('Judul, tanggal, dan lokasi wajib diisi.'); return; }
    setSaving(true); setError('');
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/agenda/${editing.id}` : '/api/agenda';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify(form),
    });
    if (!res.ok) { const d = await res.json(); setError(d.message || 'Gagal menyimpan'); setSaving(false); return; }
    setShowForm(false); load();
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/agenda/${deleteId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    setDeleteId(null); load();
  };

  const handleCategoryChange = (cat: string) => {
    setForm(f => ({ ...f, category: cat, color: CATEGORY_COLORS[cat] || '#1a6bb5' }));
  };

  return {
    items, loading, showForm, setShowForm, editing,
    form, setForm, saving, deleteId, setDeleteId, error,
    load, openCreate, openEdit, handleSave, handleDelete, handleCategoryChange,
  };
}
