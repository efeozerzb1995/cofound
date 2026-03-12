import React, { useEffect, useState } from 'react';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function ExperienceTimeline() {
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        const user = sessionData?.session?.user;
        if (!user) return;

        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setTimelineData(
            data.map((row) => ({
              year: row.year,
              title: row.role,
              company: row.company,
              description: row.description,
              icon: Briefcase,
              color: 'emerald',
            }))
          );
        }
      } catch (err) {
        console.error('Deneyimler yüklenemedi:', err);
      }
    };

    loadExperiences();
  }, []);

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/50 via-blue-500/50 to-purple-500/50" />
      
      {timelineData.length === 0 ? (
        <div className="pl-16 py-4">
          <p className="text-xs text-slate-500">
            Henüz deneyim eklenmemiş. İlk deneyimini Profil &gt; Ayarlar bölümünden ekleyebilirsin.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {timelineData.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative flex items-start gap-4 pl-16"
            >
              {/* Icon */}
              <div className="absolute left-3 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                <Briefcase className="w-3 h-3" />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="text-xs text-slate-500 mb-1">{item.year}</div>
                <h4 className="text-white font-semibold">{item.title}</h4>
                <div className="text-sm text-emerald-400 mb-2">@ {item.company}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}