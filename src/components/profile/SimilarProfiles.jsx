import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function SimilarProfiles() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const loadSimilarProfiles = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        const currentUser = sessionData?.session?.user;
        if (!currentUser) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('user_id, full_name, title, avatar_url, is_public')
          .neq('user_id', currentUser.id)
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setProfiles(
          (data || []).map((row) => ({
            id: row.user_id,
            name: row.full_name || 'Kullanıcı',
            title: row.title || '',
            avatar: row.avatar_url || '',
          }))
        );
      } catch (err) {
        console.error('Benzer profiller yüklenemedi:', err);
        setProfiles([]);
      }
    };

    loadSimilarProfiles();
  }, []);

  if (profiles.length === 0) {
    return (
      <p className="text-xs text-slate-500">
        Henüz benzer profil önerisi yok. Profilini doldurdukça burada öneriler göreceksin.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {profiles.map((person, idx) => (
        <motion.div
          key={person.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
        >
          <Avatar className="h-10 w-10 border border-slate-700">
            <AvatarImage src={person.avatar} />
            <AvatarFallback className="bg-slate-700 text-slate-300">
              {person.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-white text-sm font-medium truncate">{person.name}</h4>
            <p className="text-slate-400 text-xs truncate">{person.title}</p>
          </div>
          
          <Button 
            size="sm" 
            variant="outline"
            className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 h-7 px-2"
          >
            <UserPlus className="w-3 h-3" />
          </Button>
        </motion.div>
      ))}
    </div>
  );
}