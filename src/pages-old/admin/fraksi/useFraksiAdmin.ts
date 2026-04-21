'use client';
import { useState, useCallback } from 'react';
import {
    fetchAllFraksiInfo, createFraksiInfo, updateFraksiInfo, deleteFraksiInfo,
    createAnggotaFraksi, updateAnggotaFraksi, deleteAnggotaFraksi,
    fetchMasaJabatanFraksi, createMasaJabatanFraksi, updateMasaJabatanFraksi, deleteMasaJabatanFraksi,
} from '../../../services/api';
import type { FraksiInfo, AnggotaFraksi, MasaJabatanFraksi } from '../../../services/api';

export const JABATAN_OPTIONS = ['Ketua Fraksi', 'Wakil Ketua', 'Sekretaris', 'Anggota'];

export const NAMA_FRAKSI_OPTIONS = [
    { name: 'Fraksi Partai Gerakan Indonesia Raya', shortName: 'Gerindra' },
    { name: 'Fraksi Partai Golongan Karya', shortName: 'Golkar' },
    { name: 'Fraksi Partai Kebangkitan Bangsa', shortName: 'PKB' },
    { name: 'Fraksi Partai Keadilan Sejahtera', shortName: 'PKS' },
    { name: 'Fraksi Partai Demokrat', shortName: 'Demokrat' },
    { name: 'Fraksi Partai NasDem', shortName: 'NasDem' },
    { name: 'Fraksi Partai Persatuan Pembangunan', shortName: 'PPP' },
    { name: 'Fraksi Partai Amanat Nasional', shortName: 'PAN' },
    { name: 'Fraksi Partai Demokrasi Indonesia Perjuangan', shortName: 'PDI-P' },
    { name: 'Fraksi Partai Hanura', shortName: 'Hanura' },
    { name: 'Fraksi Partai Bulan Bintang', shortName: 'PBB' },
    { name: 'Fraksi Partai Solidaritas Indonesia', shortName: 'PSI' },
    { name: 'Fraksi Gabungan', shortName: 'Gabungan' },
];

export const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const token = () => typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

const emptyMjForm = { periode: '', tahunMulai: '', tahunSelesai: '', isAktif: false, keterangan: '', order: '0' };
const emptyAnggotaForm = { name: '', jabatan: 'Anggota', faction: '', order: '0', fraksiInfoId: '' };
const emptyInfoForm = { name: '', shortName: '', slug: '', color: '#c8102e', kursi: '0', masaJabatanId: '', deskripsi: '', isAktif: true };

export function useFraksiAdmin() {
    const [fraksiList, setFraksiList] = useState<FraksiInfo[]>([]);
    const [masaJabatanList, setMasaJabatanList] = useState<MasaJabatanFraksi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedMj, setExpandedMj] = useState('');
    const [expandedInfo, setExpandedInfo] = useState('');

    // Info form
    const [showInfoForm, setShowInfoForm] = useState(false);
    const [editingInfo, setEditingInfo] = useState<FraksiInfo | null>(null);
    const [infoForm, setInfoForm] = useState(emptyInfoForm);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [savingInfo, setSavingInfo] = useState(false);

    // Anggota form
    const [showAnggotaForm, setShowAnggotaForm] = useState(false);
    const [editingAnggota, setEditingAnggota] = useState<AnggotaFraksi | null>(null);
    const [anggotaForm, setAnggotaForm] = useState(emptyAnggotaForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [savingAnggota, setSavingAnggota] = useState(false);

    // MJ form
    const [showMjForm, setShowMjForm] = useState(false);
    const [editingMj, setEditingMj] = useState<MasaJabatanFraksi | null>(null);
    const [mjForm, setMjForm] = useState(emptyMjForm);
    const [savingMj, setSavingMj] = useState(false);

    // Delete
    const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [df, dmj] = await Promise.all([fetchAllFraksiInfo(), fetchMasaJabatanFraksi()]);
            setFraksiList(df);
            setMasaJabatanList(dmj);
            if (dmj.length > 0 && !expandedMj) setExpandedMj(dmj[0].id);
        } catch { setError('Gagal memuat data fraksi'); }
        setLoading(false);
    }, [expandedMj]);

    const openCreateInfo = (mjList: MasaJabatanFraksi[]) => {
        setEditingInfo(null);
        setInfoForm({ ...emptyInfoForm, masaJabatanId: mjList.find(m => m.isAktif)?.id || '' });
        setLogoFile(null); setLogoPreview(''); setShowInfoForm(true);
    };

    const openEditInfo = (info: FraksiInfo) => {
        setEditingInfo(info);
        setInfoForm({ name: info.name, shortName: info.shortName, slug: info.slug, color: info.color, kursi: String(info.kursi), masaJabatanId: info.masaJabatan?.id || '', deskripsi: info.deskripsi || '', isAktif: info.isAktif });
        setLogoFile(null); setLogoPreview(info.logoUrl || ''); setShowInfoForm(true);
    };

    const handleSaveInfo = async () => {
        if (!infoForm.name.trim() || !infoForm.shortName.trim()) { setError('Nama dan nama singkat wajib diisi'); return; }
        setSavingInfo(true); setError('');
        try {
            const fd = new FormData();
            Object.entries(infoForm).forEach(([k, v]) => fd.append(k, String(v)));
            if (!infoForm.slug) fd.set('slug', generateSlug(infoForm.shortName));
            if (logoFile) fd.append('logo', logoFile);
            if (editingInfo) await updateFraksiInfo(editingInfo.id, fd, token());
            else await createFraksiInfo(fd, token());
            setShowInfoForm(false); loadData();
        } catch (e: any) { setError(e.message); }
        setSavingInfo(false);
    };

    const openCreateAnggota = (fraksiInfoId: string) => {
        setEditingAnggota(null); setAnggotaForm({ ...emptyAnggotaForm, fraksiInfoId });
        setImageFile(null); setImagePreview(''); setShowAnggotaForm(true);
    };

    const openEditAnggota = (a: AnggotaFraksi) => {
        setEditingAnggota(a);
        setAnggotaForm({ name: a.name, jabatan: a.jabatan, faction: a.faction || '', order: String(a.order), fraksiInfoId: a.fraksiInfoId || '' });
        setImageFile(null); setImagePreview(a.imageUrl || ''); setShowAnggotaForm(true);
    };

    const handleSaveAnggota = async () => {
        if (!anggotaForm.name.trim()) { setError('Nama wajib diisi'); return; }
        setSavingAnggota(true); setError('');
        try {
            const fd = new FormData();
            Object.entries(anggotaForm).forEach(([k, v]) => fd.append(k, v));
            if (imageFile) fd.append('image', imageFile);
            if (editingAnggota) await updateAnggotaFraksi(editingAnggota.id, fd, token());
            else await createAnggotaFraksi(fd, token());
            setShowAnggotaForm(false); loadData();
        } catch (e: any) { setError(e.message); }
        setSavingAnggota(false);
    };

    const openCreateMj = () => { setEditingMj(null); setMjForm(emptyMjForm); setShowMjForm(true); };
    const openEditMj = (mj: MasaJabatanFraksi) => {
        setEditingMj(mj);
        setMjForm({ periode: mj.periode, tahunMulai: String(mj.tahunMulai), tahunSelesai: String(mj.tahunSelesai), isAktif: mj.isAktif, keterangan: mj.keterangan || '', order: String(mj.order) });
        setShowMjForm(true);
    };

    const handleSaveMj = async () => {
        if (!mjForm.periode || !mjForm.tahunMulai || !mjForm.tahunSelesai) { setError('Semua kolom wajib diisi'); return; }
        setSavingMj(true); setError('');
        try {
            const payload = { ...mjForm, tahunMulai: parseInt(mjForm.tahunMulai), tahunSelesai: parseInt(mjForm.tahunSelesai), order: parseInt(mjForm.order) || 0 };
            if (editingMj) await updateMasaJabatanFraksi(editingMj.id, payload, token());
            else await createMasaJabatanFraksi(payload, token());
            setShowMjForm(false); loadData();
        } catch (e: any) { setError(e.message); }
        setSavingMj(false);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setError('');
        try {
            if (deleteTarget.type === 'masaJabatan') await deleteMasaJabatanFraksi(deleteTarget.id, token());
            else if (deleteTarget.type === 'info') await deleteFraksiInfo(deleteTarget.id, token());
            else await deleteAnggotaFraksi(deleteTarget.id, token());
            setDeleteTarget(null); loadData();
        } catch (e: any) { setError(e.message); }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]; if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); }
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); }
    };

    return {
        fraksiList, masaJabatanList, loading, error, setError,
        expandedMj, setExpandedMj, expandedInfo, setExpandedInfo,
        showInfoForm, setShowInfoForm, editingInfo, infoForm, setInfoForm, logoFile, logoPreview, savingInfo,
        showAnggotaForm, setShowAnggotaForm, editingAnggota, anggotaForm, setAnggotaForm, imageFile, imagePreview, savingAnggota,
        showMjForm, setShowMjForm, editingMj, mjForm, setMjForm, savingMj,
        deleteTarget, setDeleteTarget,
        loadData, openCreateInfo, openEditInfo, handleSaveInfo,
        openCreateAnggota, openEditAnggota, handleSaveAnggota,
        openCreateMj, openEditMj, handleSaveMj, handleDelete,
        handleLogoChange, handleImageChange,
    };
}
