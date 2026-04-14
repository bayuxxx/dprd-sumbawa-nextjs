'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { loginAdmin } from '../../services/api';

const AdminLoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { token, admin } = await loginAdmin(username, password);
            localStorage.setItem('admin_token', token);
            localStorage.setItem('admin_user', JSON.stringify(admin));
            router.push('/admin/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login gagal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f2349] via-[#1a3a6e] to-[#0f2349] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo / Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20 p-3 shadow-lg">
                        <img src="/LOGO DPRD KSB.png" alt="Logo DPRD KSB" className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                    <h1 className="text-2xl font-black text-white">Admin Panel</h1>
                    <p className="text-blue-300 text-sm mt-1">DPRD Kabupaten Sumbawa Barat</p>
                </div>

                {/* Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                    <h2 className="text-white font-bold text-lg mb-6">Masuk ke Sistem</h2>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-sm rounded-lg p-3 mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-blue-200 text-sm font-medium mb-1.5">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                                placeholder="Masukkan username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-blue-200 text-sm font-medium mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                                    placeholder="Masukkan password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#0f2349] font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-[#0f2349]/40 border-t-[#0f2349] rounded-full animate-spin" />
                            ) : (
                                <LogIn size={16} />
                            )}
                            {loading ? 'Masuk...' : 'Masuk'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-white/30 text-xs mt-6">
                    © 2025 DPRD Kabupaten Sumbawa Barat
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
