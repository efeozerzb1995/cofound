import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

export default function ProjectPortfolio() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        const user = sessionData?.session?.user;
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

  if (projects.length === 0) {
    return (
      <div className="py-4 text-sm text-slate-500">
        Henüz projeni eklemedin. İlk projen Profil &gt; Ayarlar bölümünden oluşturulduğunda burada görünecek.
      </div>
    );
  }

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
            {project.image ? (
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500 text-xs">
                Kapak görseli yok
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          </div>
          
          {/* Project Info */}
          <div className="p-3">
            <h4 className="text-white text-sm font-semibold mb-1 truncate">{project.title}</h4>
            {project.role && (
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                {project.role}
              </Badge>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}