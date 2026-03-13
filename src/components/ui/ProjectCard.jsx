import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Bookmark, ChevronDown, Link2, Plus, ArrowRight } from 'lucide-react';

const gradients = [
  'from-violet-600 to-indigo-700',
  'from-cyan-500 to-blue-700',
  'from-emerald-500 to-teal-700',
  'from-rose-500 to-pink-700',
  'from-amber-500 to-orange-700',
  'from-slate-500 to-slate-700',
  'from-purple-500 to-violet-700',
  'from-teal-500 to-cyan-700',
];

const phaseColors = {
  'Fikir Aşaması': 'text-yellow-400',
  'MVP': 'text-blue-400',
  'Büyüme': 'text-emerald-400',
  'Gelir Aşaması': 'text-purple-400',
  'default': 'text-slate-300',
};

// UUID veya sayıdan tutarlı bir index üret
const getGradientIndex = (id) => {
  if (!id) return 0;
  if (typeof id === 'number') return id % gradients.length;
  // UUID string → basit hash
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i)) % gradients.length;
  }
  return hash;
};

export default function ProjectCard({ project, matchScore, showAIBadge }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(createPageUrl('ProjectDetails'), { state: { projectId: project.id } });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const gradient = gradients[getGradientIndex(project.id)];
  const roleToApply = project.seeking?.[0] || 'Team Member';
  const phaseColor = phaseColors[project.program] || phaseColors['default'];

  // Supabase ve mockData uyumlu alan isimleri
  const imageUrl = project.imageUrl || project.image_url || null;
  const ownerName = project.owner?.name || null;
  const createdAt = project.createdAt || project.created_at;
  const updatedAt = project.updatedAt || project.updated_at;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3 }}
      className="h-full"
    >
      <div className="bg-[#111318] border border-slate-800/70 rounded-2xl overflow-hidden flex flex-col h-full hover:border-slate-700 transition-all duration-300">
        
        {/* Banner Area */}
        {imageUrl ? (
          <div className="h-36 overflow-hidden flex-shrink-0">
            <img 
              src={imageUrl} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className={`h-36 flex-shrink-0 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="text-white font-black text-3xl tracking-tight uppercase">
                {project.title?.slice(0, 4)}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-xl font-bold text-white mb-2 leading-tight">
            {project.title}
          </h3>

          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
            {project.description}
          </p>

          <p className="text-slate-500 text-xs font-medium mb-2">Recommended for you</p>

          <button
            onClick={handleViewDetails}
            className="w-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-white rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-200 group mb-4"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Plus className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm">
                Apply for{' '}
                <span className="text-indigo-400 font-medium">{roleToApply}</span>
                {' '}role
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </button>

          <div className="border-t border-slate-800/60 pt-3">
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="min-w-0">
                <span className="text-slate-600 block text-[10px] uppercase tracking-wide mb-0.5">
                  {createdAt ? 'Created' : 'Updated'}
                </span>
                <span className="text-slate-400 truncate block">
                  {ownerName ? `${ownerName} | ` : ''}{formatDate(createdAt || updatedAt)}
                </span>
              </div>

              <div className="text-center flex-shrink-0">
                <span className="text-slate-600 block text-[10px] uppercase tracking-wide mb-0.5">Category</span>
                <span className="text-slate-300">{project.category || '—'}</span>
              </div>

              <div className="text-center flex-shrink-0">
                <span className="text-slate-600 block text-[10px] uppercase tracking-wide mb-0.5">Phase</span>
                <span className={`font-medium ${phaseColor}`}>{project.program || '—'}</span>
              </div>

              {project.website && (
                <div className="text-center flex-shrink-0">
                  <span className="text-slate-600 block text-[10px] uppercase tracking-wide mb-0.5">Website</span>
                  <a
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <Link2 className="w-3 h-3" />
                    <span>Link</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-3">
              <button className="p-1.5 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-slate-800 transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
              <button 
                onClick={handleViewDetails}
                className="p-1.5 rounded-full border border-slate-700 text-slate-500 hover:text-white hover:border-slate-500 transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}