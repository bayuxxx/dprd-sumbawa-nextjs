'use client';
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { fetchAdmins, createAdmin, updateAdmin, deleteAdmin } from '../../services/api';
import type { AdminUser } from '../../services/api';
import { Plus, Edit, Trash2, ShieldAlert, Shield, Newspaper, Clock } from 'lucide-react';

const ROLE_INFO: Record<string, { label: string; color: string; icon: React.ReactNode; desc: string }> = {
    super_admin: {
        label: 'Super Administrator',
        color: 'bg-blue-100 text-blue-700',
        icon: <Shield size={13} />,
        desc: 'Akses penuh ke semua fitur',
    },
    admin: {
        label: 'Admin',
        color: 'bg-purple-100 text-purple-700',
        icon: <Newspaper size={13} />,
        desc: 'Berita, approve, komentar & banner — tidak bisa ubah data anggota',
    },
    news_editor: {
        label: 'News Editor',
        color: 'bg-amber-100 text-amber-700',
        icon: <Newspaper size={13} />,
        desc: 'Hanya input berita, perlu approval sebelum terbit',
    },
};

const AdminUsersPage: React.FC = () => {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
    const [formData, setFormData] = useState({ username: '', password: '', role: 'news_editor' });
    const getCurrentAdmin = () => {
        const userStr = localStorage.getItem('admin_user');
        return userStr ? JSON.parse(userStr) as AdminUser : null;
    };
    const currentAdmin = getCurrentAdmin();

    const loadAdmins = async () => {
        try {
            const token = localStorage.getItem('admin_token') || '';
            const data = await fetchAdmins(token);
            setAdmins(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadAdmins(); }, []);

    const handleOpenModal = (admin?: AdminUser) => {
        if (admin) {
            setEditingAdmin(admin);
            setFormData({ username: admin.username, password: '', role: (admin as any).role || 'news_editor' });
        } else {
            setEditingAdmin(null);
            setFormData({ username: '', password: '', role: 'news_editor' });
        }
        setIsModalOpen(true);
        setError(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAdmin(null);
        setFormData({ username: '', password: '', role: 'news_editor' });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const token = localStorage.getItem('admin_token') || '';
        try {
            if (editingAdmin) {
                await updateAdmin(editingAdmin.id, formData, token);
            } else {
                if (!formData.password) throw new Error('Password wajib diisi untuk admin baru');
                await createAdmin(formData, token);
            }
            await loadAdmins();
            handleCloseModal();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Yakin ingin menghapus admin ini?')) return;
        const token = localStorage.getItem('admin_token') || '';
        try {
            await deleteAdmin(id, token);
            await loadAdmins();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manajemen Admin</h1>
                    <p className="text-gray-500 text-sm">Kelola akun dan level akses administrator</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm"
                >
                    <Plus size={18} /> Tambah Admin
                </button>
            </div>

            {/* Role legend */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {Object.entries(ROLE_INFO).map(([key, info]) => (
                    <div key={key} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3">
                        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${info.color}`}>
                            {info.icon} {info.label}
                        </span>
                        <p className="text-xs text-gray-500 mt-0.5">{info.desc}</p>
                    </div>
                ))}
            </div>

            {error && !isModalOpen && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3">
                    <ShieldAlert size={20} /><span>{error}</span>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                                <th className="p-4 font-semibold">Username</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold hidden md:table-cell">Login Terakhir</th>
                                <th className="p-4 font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-400">Loading...</td></tr>
                            ) : admins.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-400">Tidak ada data admin</td></tr>
                            ) : admins.map((admin: any) => {
                                const isCurrent = currentAdmin?.id === admin.id;
                                const roleInfo = ROLE_INFO[admin.role] || ROLE_INFO.super_admin;
                                return (
                                    <tr key={admin.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                    {admin.username[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{admin.username}</p>
                                                    {isCurrent && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-1 inline-block">Sedang Login</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full w-fit ${roleInfo.color}`}>
                                                {roleInfo.icon} {roleInfo.label}
                                            </span>
                                        </td>
                                        <td className="p-4 hidden md:table-cell text-gray-500 text-sm">
                                            {admin.lastLoginAt ? (
                                                <span className="flex items-center gap-1 text-xs">
                                                    <Clock size={12} />
                                                    {new Date(admin.lastLoginAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            ) : <span className="text-gray-300 text-xs">Belum pernah login</span>}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleOpenModal(admin)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Admin">
                                                    <Edit size={18} />
                                                </button>
                                                {!isCurrent && (
                                                    <button onClick={() => handleDelete(admin.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Admin">
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4">{editingAdmin ? 'Edit Admin' : 'Tambah Admin Baru'}</h2>

                        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password {editingAdmin && <span className="text-gray-400 font-normal">(Kosongkan jika tidak ingin mengubah)</span>}
                                </label>
                                <input
                                    type="password"
                                    required={!editingAdmin}
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Level Akses</label>
                                <div className="space-y-2">
                                    {Object.entries(ROLE_INFO).map(([key, info]) => (
                                        <label key={key} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.role === key ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value={key}
                                                checked={formData.role === key}
                                                onChange={() => setFormData({ ...formData, role: key })}
                                                className="mt-0.5"
                                            />
                                            <div>
                                                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full w-fit mb-1 ${info.color}`}>
                                                    {info.icon} {info.label}
                                                </span>
                                                <p className="text-xs text-gray-500">{info.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-6">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">Batal</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminUsersPage;
