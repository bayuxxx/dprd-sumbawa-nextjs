'use client';
import { useState, useCallback } from 'react';
import { fetchAllDapil, createDapil, updateDapil, deleteDapil, createAnggotaDapil, updateAnggotaDapil, deleteAnggotaDapil } from '../../../services/api/dapil';
import type { DaerahPemilihan, AnggotaDapil } from '../../../services/api/dapil';

const token = () => typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

const emptyDapilForm = { nama: '', slug: '', wilayah: '', jumlahKursi: '0', deskripsi: '', isAktif: true, order: '0' };
const emptyAnggotaForm = { name: '', partai: '', order: '0', dapilId: '' };

export function useAdminDapil() {
  const [dapilList, setDapilList] = useState<DaerahPemilihan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState('');

  // Dapil form
  const [showDapilForm, setShowDapilForm] = useState(false);
  const [editingDapil, setEditingDapil] = useState<DaerahPemilihan | null>(null);
  const [dapilForm, setDapilForm] = useState(emptyDapilForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [savingDapil, setSavingDapil] = useState(false);

  // Anggota form
  const [showAnggotaForm, setShowAnggotaForm] = useState(false);
  const [editingAnggota, setEditingAnggota] = useState<AnggotaDapil | null>(null);
  const [anggotaForm, setAnggotaForm] = useState(emptyAnggotaForm);
  const [anggotaImageFile, setAnggotaImageFile] = useState<File | null>(null);
  const [anggotaImagePreview, setAnggotaImagePreview] = useState('');
  const [savingAnggota, setSavingAnggota] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllDapil();
      setDapilList(data);
      if (data.length > 0 && !expanded) setExpanded(data[0].id);
    } catch { setError('Gagal memuat data dapil'); }
    setLoading(false);
  }, [expanded]);

  const openCreateDapil = () => {
    setEditingDapil(null);
    setDapilForm(emptyDapilForm);
    setImageFile(null); setImagePreview('');
    setShowDapilForm(true);
  };

  const openEditDapil = (d: DaerahPemilihan) => {
    setEditingDapil(d);
    setDapilForm({ nama: d.nama, slug: d.slug, wilayah: d.wilayah || '', jumlahKursi: String(d.jumlahKursi), deskripsi: d.deskripsi || '', isAktif: d.isAktif, order: String(d.order) });
    setImageFile(null); setImagePreview(d.imageUrl || '');
    setShowDapilForm(true);
  };

  const handleSaveDapil = async () => {
    if (!dapilForm.nama.trim() || !dapilForm.slug.trim()) { setError('Nama dan slug wajib diisi'); return; }
    setSavingDapil(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(dapilForm).forEach(([k, v]) => fd.append(k, String(v)));
      if (imageFile) fd.append('image', imageFile);
      if (editingDapil) await updateDapil(editingDapil.id, fd, token());
      else await createDapil(fd, token());
      setShowDapilForm(false);
      await loadData();
    } catch (e: any) { setError(e.message); }
    setSavingDapil(false);
  };

  const openCreateAnggota = (dapilId: string) => {
    setEditingAnggota(null);
    setAnggotaForm({ ...emptyAnggotaForm, dapilId });
    setAnggotaImageFile(null); setAnggotaImagePreview('');
    setShowAnggotaForm(true);
  };

  const openEditAnggota = (a: AnggotaDapil) => {
    setEditingAnggota(a);
    setAnggotaForm({ name: a.name, partai: a.partai || '', order: String(a.order), dapilId: a.dapilId || '' });
    setAnggotaImageFile(null); setAnggotaImagePreview(a.imageUrl || '');
    setShowAnggotaForm(true);
  };

  const handleSaveAnggota = async () => {
    if (!anggotaForm.name.trim()) { setError('Nama wajib diisi'); return; }
    setSavingAnggota(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(anggotaForm).forEach(([k, v]) => fd.append(k, String(v)));
      if (anggotaImageFile) fd.append('image', anggotaImageFile);
      if (editingAnggota) await updateAnggotaDapil(editingAnggota.id, fd, token());
      else await createAnggotaDapil(fd, token());
      setShowAnggotaForm(false);
      await loadData();
    } catch (e: any) { setError(e.message); }
    setSavingAnggota(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'dapil') await deleteDapil(deleteTarget.id, token());
      else await deleteAnggotaDapil(deleteTarget.id, token());
      setDeleteTarget(null);
      await loadData();
    } catch (e: any) { setError(e.message); }
  };

  return {
    dapilList, loading, error, setError, expanded, setExpanded,
    showDapilForm, setShowDapilForm, editingDapil, dapilForm, setDapilForm,
    imageFile, setImageFile, imagePreview, setImagePreview, savingDapil,
    showAnggotaForm, setShowAnggotaForm, editingAnggota, anggotaForm, setAnggotaForm,
    anggotaImageFile, setAnggotaImageFile, anggotaImagePreview, setAnggotaImagePreview, savingAnggota,
    deleteTarget, setDeleteTarget,
    loadData, openCreateDapil, openEditDapil, handleSaveDapil,
    openCreateAnggota, openEditAnggota, handleSaveAnggota, handleDelete,
  };
}
