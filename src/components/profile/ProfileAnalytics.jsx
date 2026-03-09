import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, Search, FileDown, TrendingUp, ArrowRight } from 'lucide-react';

const mockVisitors = [
  {
    id: 1,
    name: 'Prof. Dr. Ahmet Yılmaz',
    title: 'Danışman',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  },
  {
    id: 2,
    name: 'Selin Demir',
    title: 'İK Uzmanı',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
  {
    id: 3,
    name: 'Can Özkan',
    title: 'Yazılımcı',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  },
  {
    id: 4,
    name: 'Ayşe Kaya',
    title: 'Proje Yöneticisi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    id: 5,
    name: 'Mert Arslan',
    title: 'Biyolog',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
];

const stats = [
  {
    icon: Eye,
    label: 'Profil Görüntülenme',
    value: '142',
    change: '+12%',
    sublabel: 'Son 7 gün',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Search,
    label: 'Aramalarda Görünme',
    value: '85',
    change: '+8%',
    sublabel: 'Son 7 gün',
    color: 'from-emerald-500 to-green-500',
  },
  {
    icon: FileDown,
    label: 'CV İndirilme',
    value: '14',
    change: '+23%',
    sublabel: 'Bu ay',
    color: 'from-purple-500 to-pink-500',
  },
];

export default function ProfileAnalytics() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="bg-slate-900/40 backdrop-blur-xl border-slate-800/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              Profilini Ziyaret Edenler
            </CardTitle>
            <span className="text-xs text-slate-400">Son 24 Saat</span>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {mockVisitors.map((visitor, index) => (
              <motion.div
                key={visitor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.07 }}
                className="flex-shrink-0 cursor-pointer"
              >
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 hover:border-emerald-500/40 transition-all w-40">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Avatar className="w-9 h-9 ring-2 ring-emerald-500/20">
                      <AvatarImage src={visitor.avatar} />
                      <AvatarFallback className="bg-slate-700 text-white text-xs">
                        {visitor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{visitor.name}</p>
                      <p className="text-xs text-slate-400 truncate">{visitor.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-400">
                    <Eye className="w-3 h-3" />
                    <span>Görüntüledi</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}