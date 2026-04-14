'use client';
import { useState, useCallback } from 'react';
import {
    fetchAllKomisiInfo, createKomisiInfoApi, updateKomisiInfoApi,
    deleteKomisiInfoApi, createAnggotaKomisi, updateAnggotaKomisi, deleteAnggotaKomisi,
} from '../../../services/api';
import type { KomisiInfo, AnggotaKomisi } from '../../../services/api';

export const emptyAnggotaForm = { name: '', jabatan: 'Anggota', faction: '', order: '0', komisiInfoId: '' };

export function useAdminKomisi() {
    const [infoList, setInfoList] = useState<KomisiInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedMasa, setExpandedMasa] = useState('');

    // Info form
    const [showInfoForm, setShowInfoForm] = useState(false);
    const [editingInfo, setEditingInfo] = useState<KomisiInfo | null>(null);
    const [infoForm, setInfoForm] = useState({ namaKomisi: '', masaJabatan: '', deskripsi: '', isAktif: true });
    const [savingInfo, setSavingInfo] = useState(false);

    // Anggota form
    const [showAnggotaForm, setShowAnggotaForm] = useState(false);
    const [editingAnggota, setEditingAnggota] = useState<AnggotaKomisi | null>(null);
    const [anggotaForm, setAnggotaForm] = useState(emptyAnggotaForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [savingAnggota, setSavingAnggota] = useState(false);

    // Delete
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'masa' | 'komisi' | 'anggota'; id?: string; ids?: string[]; name: string } | null>(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAllKomisiInfo();
            setInfoList(data);
            if (data.length > 0 && !expandedMasa) setExpandedMasa(data[0].masaJabatan);
        } catch { setError('Gagal memuat data Komisi'); }
        setLoading(false);
    }, [expandedMasa]);

    const openCreateInfo = () => {
        setEditingInfo(null);
        setInfoForm({ namaKomisi: '', masaJabatan: '', deskripsi: '', isAktif: true });
        setShowInfoForm(true);
    };

    const openEditInfo = (info: KomisiInfo) => {
        setEditingInfo(info);
        setInfoForm({ namaKomisi: info.namaKomisi, masaJabatan: info.masaJabatan, deskripsi: info.deskripsi || '', isAktif: info.isAktif });
        setShowInfoForm(true);
    };

    const handleSaveInfo = async () => {
        if (!infoForm.masaJabatan.trim()) { setError('Masa Jabatan wajib diisi'); return; }
        if (editingInfo && !infoForm.namaKomisi.trim()) { setError('Nama Komisi wajib diisi'); return; }
        setSavingInfo(true); setError('');
        try {
            if (editingInfo) {
                await updateKomisiInfoApi(editingInfo.id, infoForm, token);
            } else {
                const defaultKomisi = ['KOMISI 1', 'KOMISI 2', 'KOMISI 3'];
                await Promise.all(defaultKomisi.map(nama => createKomisiInfoApi({ namaKomisi: nama, masaJabatan: infoForm.masaJabatan, deskripsi: infoForm.deskripsi, isAktif: infoForm.isAktif }, token)));
                setExpandedMasa(infoForm.masaJabatan);
            }
            setShowInfoForm(false); loadData();
        } catch (e: any) { setError(e.message); }
        setSavingInfo(false);
    };

    const openCreateAnggota = (komisiInfoId: string) => {
        setEditingAnggota(null);
        setAnggotaForm({ ...emptyAnggotaForm, komisiInfoId });
        setImageFile(null); setImagePreview(''); setShowAnggotaForm(true);
    };

    const openEditAnggota = (anggota: AnggotaKomisi) => {
        setEditingAnggota(anggota);
        setAnggotaForm({ name: anggota.name, jabatan: anggota.jabatan, faction: anggota.faction || '', order: String(anggota.order), komisiInfoId: anggota.komisiInfoId || '' });
        setImageFile(null); setImagePreview(anggota.imageUrl || ''); setShowAnggotaForm(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
    };

    const handleSaveAnggota = async () => {
        if (!anggotaForm.name.trim() || !anggotaForm.jabatan) { setError('Nama dan jabatan wajib diisi'); return; }
        setSavingAnggota(true); setError('');
        try {
            const fd = new FormData();
            Object.entries(anggotaForm).forEach(([k, v]) => fd.append(k, v));
            if (imageFile) fd.append('image', imageFile);
            if (editingAnggota) await updateAnggotaKomisi(editingAnggota.id, fd, token);
            else await createAnggotaKomisi(fd, token);
            setShowAnggotaForm(false); loadData();
        } catch (e: any) { setError(e.message); }
        setSavingAnggota(false);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setError('');
        try {
            if (deleteTarget.type === 'masa' && deleteTarget.ids) await Promise.all(deleteTarget.ids.map(id => deleteKomisiInfoApi(id, token)));
            else if (deleteTarget.type === 'komisi' && deleteTarget.id) await deleteKomisiInfoApi(deleteTarget.id, token);
            else if (deleteTarget.type === 'anggota' && deleteTarget.id) await deleteAnggotaKomisi(deleteTarget.id, token);
            setDeleteTarget(null); loadData();
        } catch (e: any) { setError(e.message); }
    };

    return {
        infoList, loading, error, setError, expandedMasa, setExpandedMasa,
        showInfoForm, setShowInfoForm, editingInfo, infoForm, setInfoForm, savingInfo,
        showAnggotaForm, setShowAnggotaForm, editingAnggota, anggotaForm, setAnggotaForm,
        imageFile, imagePreview, savingAnggota,
        deleteTarget, setDeleteTarget,
        loadData, openCreateInfo, openEditInfo, handleSaveInfo,
        openCreateAnggota, openEditAnggota, handleImageChange, handleSaveAnggota, handleDelete,
    };
}
