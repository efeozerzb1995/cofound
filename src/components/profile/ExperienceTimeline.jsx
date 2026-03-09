import React, { useEffect, useState } from 'react';
import { Briefcase, GraduationCap, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const fallbackTimelineData = [
  {
    year: '2025 - Günümüz',
    title: 'Kurucu Ortak',
    company: 'CoFound Project',
    description: 'Üniversite öğrencilerini projeler ve girişimler üzerinden buluşturan platform.',
    icon: Rocket,
    color: 'emerald'
  },
  {
    year: '2024 Yaz',
    title: 'Stajyer Araştırmacı',
    company: 'TÜBİTAK MAM',
    description: 'Genetik laboratuvarında CRISPR-Cas9 gen düzenleme teknolojileri üzerine çalışma.',
    icon: Briefcase,
    color: 'blue'
  },
  {
    year: '2022',
    title: 'Biyomühendislik Başlangıç',
    company: 'Yıldız Teknik Üniversitesi',
    description: 'Biyomühendislik bölümünde lisans eğitimine başlama.',
    icon: GraduationCap,
    color: 'purple'
  }
];

export default function ExperienceTimeline() {
  const [timelineData, setTimelineData] = useState(fallbackTimelineData);

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
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
      
      <div className="space-y-6">
        {timelineData.map((item, idx) => {
          const Icon = item.icon;
          const colorClasses = {
            emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
            blue: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
            purple: 'bg-purple-500/20 text-purple-400 border-purple-500/50'
          };
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative flex items-start gap-4 pl-16"
            >
              {/* Icon */}
              <div className={`absolute left-3 w-6 h-6 rounded-full border-2 flex items-center justify-center ${colorClasses[item.color]}`}>
                <Icon className="w-3 h-3" />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="text-xs text-slate-500 mb-1">{item.year}</div>
                <h4 className="text-white font-semibold">{item.title}</h4>
                <div className="text-sm text-emerald-400 mb-2">@ {item.company}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}