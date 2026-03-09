import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const suggestions = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    title: 'Yazılım Mühendisi',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
  },
  {
    id: 2,
    name: 'Elif Demir',
    title: 'Ürün Tasarımcı',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  },
  {
    id: 3,
    name: 'Can Öztürk',
    title: 'Veri Bilimci',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  }
];

export default function SimilarProfiles() {
  return (
    <div className="space-y-3">
      {suggestions.map((person, idx) => (
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