import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

const fallbackProjects = [
  {
    id: 1,
    title: 'Yapay Et Ar-Ge',
    role: 'Takım Lideri',
    image: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    title: 'AI Sağlık Asistanı',
    role: 'Co-Founder',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    title: 'Sürdürülebilir Tarım',
    role: 'Yazılım Geliştirici',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    title: 'EdTech Platform',
    role: 'Product Designer',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
  }
];

export default function ProjectPortfolio() {
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) return;

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setProjects(
            data.map((row) => ({
              id: row.id,
              title: row.name,
              role: row.role,
              image: row.image_url,
            }))
          );
        }
      } catch (err) {
        console.error('Projeler yüklenemedi:', err);
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3">
      {projects.map((project, idx) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="group relative overflow-hidden rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/50 transition-all cursor-pointer"
        >
          {/* Project Image */}
          <div className="relative h-28 overflow-hidden">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          </div>
          
          {/* Project Info */}
          <div className="p-3">
            <h4 className="text-white text-sm font-semibold mb-1 truncate">{project.title}</h4>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
              {project.role}
            </Badge>
          </div>
        </motion.div>
      ))}
    </div>
  );
}