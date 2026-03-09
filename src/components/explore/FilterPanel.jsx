import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categories, stages, programs } from '@/components/mockData';

const roleOptions = [
  'Tümü',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'AI / ML Engineer',
  'Blockchain Developer',
  'Makine Mühendisi',
  'Biyomühendis',
  'Elektronik Mühendisi',
  'Drone Mühendisi',
  'Marketing Co-founder',
  'Finans Uzmanı',
  'Tarım Uzmanı',
  'Hücre Biyoloğu',
  'UX Designer',
  '3D Modelleme Uzmanı',
];

const stageShort = [
  'Tümü',
  'İdeation',
  'Validation',
  'Prototype',
  'MVP',
  'Launch',
  'Growth',
  'Scale-up',
];

const categoryOptions = ['Tümü', ...categories.filter(c => c !== 'Tümü')];

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
              value === opt
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600'
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FilterPanel({ filters, onChange, onClose }) {
  const set = (key) => (val) => onChange({ ...filters, [key]: val });

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#111318] border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 p-5 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          <span className="text-white font-semibold text-sm">Filtreler</span>
        </div>
        <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-300 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <FilterGroup
        label="Kategori"
        options={categoryOptions.slice(0, 16)}
        value={filters.category}
        onChange={set('category')}
      />
      <FilterGroup
        label="Aşama (Phase)"
        options={stageShort}
        value={filters.stage}
        onChange={set('stage')}
      />
      <FilterGroup
        label="Rol (Role)"
        options={roleOptions}
        value={filters.role}
        onChange={set('role')}
      />
    </div>
  );
}