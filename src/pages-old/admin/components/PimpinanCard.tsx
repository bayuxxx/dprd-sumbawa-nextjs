'use client';
import React from 'react';
import { Edit2, Trash2, User } from 'lucide-react';
import type { Pimpinan } from '../../../services/api';

interface PimpinanCardProps {
    item: Pimpinan;
    onEdit: (item: Pimpinan) => void;
    onDelete: () => void;
}

export const PimpinanCard: React.FC<PimpinanCardProps> = ({ item, onEdit, onDelete }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all duration-300 overflow-hidden group flex flex-col pt-3 px-3 relative">
        {item.isPast && (
            <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-sm shadow-sm">
                Terdahulu
            </div>
        )}
        <div className="relative h-48 overflow-hidden rounded-lg bg-slate-100 shrink-0">
            {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <User size={36} className="text-slate-300" />
                </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-bold text-sm leading-tight truncate">{item.name}</p>
                <p className="text-blue-200 font-medium text-xs truncate mt-0.5">{item.position}</p>
            </div>
            {item.faction && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-950 text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-sm shadow-sm">
                    {item.faction}
                </div>
            )}
        </div>
        <div className="flex items-center justify-between mt-3 mb-3">
            <div className="text-xs text-slate-400 font-medium">Urutan: {item.order}</div>
            <div className="flex items-center gap-1">
                <button onClick={() => onEdit(item)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Edit">
                    <Edit2 size={14} />
                </button>
                <button onClick={onDelete} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Hapus">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    </div>
);
