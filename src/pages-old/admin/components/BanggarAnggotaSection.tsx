'use client';
import React from 'react';
import { Edit2, Trash2, User } from 'lucide-react';
import type { AnggotaBanggar } from '../../../services/api';

interface AnggotaSectionProps {
    title: string;
    items: AnggotaBanggar[];
    onEdit: (a: AnggotaBanggar) => void;
    onDelete: (a: AnggotaBanggar) => void;
}

export const BanggarAnggotaSection: React.FC<AnggotaSectionProps> = ({ title, items, onEdit, onDelete }) => (
    <div>
        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{title}</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((anggota) => (
                <div key={anggota.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all group">
                    <div className="w-12 h-14 rounded-lg bg-white border border-gray-100 overflow-hidden flex-shrink-0">
                        {anggota.imageUrl ? (
                            <img src={anggota.imageUrl} alt={anggota.name} className="w-full h-full object-cover object-top" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                <User size={18} className="text-gray-300" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{anggota.name}</p>
                        <p className="text-xs text-gray-500">{anggota.faction || '-'}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit(anggota)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={() => onDelete(anggota)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
