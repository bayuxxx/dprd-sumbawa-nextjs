'use client';
import React, { useState, useRef, useEffect } from 'react';

const EMOJI_LIST = [
  '📄','📃','📋','📁','📂','🗂️','📑','📊','📈','📉',
  '⚖️','🔍','🔎','🏛️','🏥','🏫','🏢','🏗️','🏠','🌐',
  '👔','👤','👥','🤝','💼','🎓','📚','📖','📝','✏️',
  '📞','📱','☎️','📡','💻','🖥️','🖨️','⌨️','🖱️','💾',
  '💰','💳','🏦','💹','🪙','💵','🔐','🔒','🔓','🛡️',
  '⭐','🌟','✅','❌','⚠️','ℹ️','❓','❗','🔔','📢',
  '🗳️','🗺️','📍','📌','🚩','🏴','🏳️','🎯','🔖','🏷️',
  '🌿','🌱','♻️','🌍','🌏','🌎','☀️','🌤️','🌧️','❄️',
];

interface Props {
  value: string;
  onChange: (emoji: string) => void;
}

export default function EmojiPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-12 h-10 text-xl border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center"
        title="Pilih emoji"
      >
        {value || '📄'}
      </button>

      {open && (
        <div className="absolute left-0 top-12 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl p-3 w-64">
          <p className="text-xs font-bold text-gray-400 mb-2 px-1">Pilih Icon</p>
          <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
            {EMOJI_LIST.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => { onChange(emoji); setOpen(false); }}
                className={`text-xl p-1 rounded-lg hover:bg-blue-50 transition-colors ${value === emoji ? 'bg-blue-100 ring-2 ring-blue-400' : ''}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
