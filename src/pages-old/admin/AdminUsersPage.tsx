'use client';
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { fetchAdmins, createAdmin, updateAdmin, deleteAdmin } from '../../services/api';
import type { AdminUser } from '../../services/api';
import { Plus, Edit, Trash2, ShieldAlert } from 'lucide-react';

const AdminUsersPage: React.FC = () => {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
    const [formData, setFormData] = useState({ username: '', password: '' });

    const getCurrentAdmin = () => {
        const userStr = localStorage.getItem('admin_user');
        if (userStr) {
            return JSON.parse(userStr) as AdminUser;
        }
        return null;
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

    useEffect(() => {
        loadAdmins();
    }, []);

    const handleOpenModal = (admin?: AdminUser) => {
        if (admin) {
            setEditingAdmin(admin);
            setFormData({ username: admin.username, password: '' }); // password empty on edit
        } else {
            setEditingAdmin(null);
            setFormData({ username: '', password: '' });
        }
        setIsModalOpen(true);
        setError(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAdmin(null);
        setFormData({ username: '', password: '' });
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
                if (!formData.password) {
                    throw new Error("Password wajib diisi untuk admin baru");
                }
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
                    <p className="text-gray-500 text-sm">Kelola akun administrator website</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm"
                >
                    <Plus size={18} />
                    Tambah Admin
                </button>
            </div>

            {error && !isModalOpen && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3">
                    <ShieldAlert size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                                <th className="p-4 font-semibold">Username</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-gray-400">Loading...</td>
                                </tr>
                            ) : admins.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-gray-400">Tidak ada data admin</td>
                                </tr>
                            ) : (
                                admins.map((admin) => {
                                    const isCurrent = currentAdmin?.id === admin.id;
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
                                            <td className="p-4 text-gray-500 text-sm">Aktif</td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(admin)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit Admin"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    {!isCurrent && (
                                                        <button
                                                            onClick={() => handleDelete(admin.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Hapus Admin"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4">{editingAdmin ? 'Edit Admin' : 'Tambah Admin Baru'}</h2>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password {editingAdmin && <span className="text-gray-400 font-normal">(Biarkan kosong jika tidak ingin mengubah)</span>}
                                </label>
                                <input
                                    type="password"
                                    required={!editingAdmin}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>

                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminUsersPage;
