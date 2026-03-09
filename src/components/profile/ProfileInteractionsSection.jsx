import React, { useState } from 'react';
import { Eye, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus } from 'lucide-react';

const similarProfiles = [
  { id: 1, name: 'Ahmet Yılmaz', title: 'Yazılım Mühendisi', skills: ['Python', 'AI'], avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' },
  { id: 2, name: 'Elif Demir', title: 'Biyoinformatik', skills: ['CRISPR', 'Veri Analizi'], avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: 3, name: 'Can Öztürk', title: 'Veri Bilimci', skills: ['Python', 'ML'], avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 4, name: 'Zeynep Ak', title: 'Biyolog', skills: ['Hücre Kültürü', 'Lab'], avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { id: 5, name: 'Burak Şahin', title: 'Genetik Uzmanı', skills: ['CRISPR', 'Biyoinformatik'], avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: 6, name: 'Merve Koç', title: 'Araştırmacı', skills: ['Rejeneratif Tıp', 'Python'], avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop' },
  { id: 7, name: 'Tarık Güneş', title: 'Biyomühendis', skills: ['Hücre Kültürü', 'AI'], avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { id: 8, name: 'İpek Yıldız', title: 'ML Araştırmacısı', skills: ['Python', 'Biyoinformatik'], avatar: 'https://images.unsplash.com/photo-1530577197743-7adf14294584?w=100&h=100&fit=crop' },
];

function MetricCard({ icon: Icon, title, value, subtitle, iconColor, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 cursor-pointer hover:border-emerald-500/40 transition-all group"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${iconColor}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{title}</span>
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </motion.div>
  );
}

function SimilarProfilesModal({ open, onClose }) {
  const [connected, setConnected] = useState({});

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white">Seninle Eşleşen Yetenekler</h2>
                <p className="text-sm text-slate-400 mt-0.5">Aynı yeteneklere sahip {similarProfiles.length} profil bulundu</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Scrollable Profile List */}
            <div className="p-5 max-h-[420px] overflow-y-auto space-y-3">
              {similarProfiles.map((person, idx) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 transition-colors"
                >
                  <Avatar className="h-11 w-11 border border-slate-700 flex-shrink-0">
                    <AvatarImage src={person.avatar} />
                    <AvatarFallback className="bg-slate-700 text-slate-300 text-sm">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">{person.name}</h4>
                    <p className="text-slate-400 text-xs truncate mb-1.5">{person.title}</p>
                    <div className="flex gap-1 flex-wrap">
                      {person.skills.map((skill, i) => (
                        <Badge key={i} className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs px-2 py-0">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={connected[person.id]}
                    onClick={() => setConnected(prev => ({ ...prev, [person.id]: true }))}
                    className={connected[person.id]
                      ? "border-slate-600 text-slate-500 cursor-not-allowed text-xs"
                      : "border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 text-xs"
                    }
                  >
                    {connected[person.id] ? 'Beklemede' : <><UserPlus className="w-3 h-3 mr-1" />Bağlan</>}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ProfileInteractionsSection() {
  const [showSimilarModal, setShowSimilarModal] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          icon={Eye}
          title="Profilimi Ziyaret Edenler"
          value="12"
          subtitle="Son 7 gün içinde"
          iconColor="bg-gradient-to-br from-blue-500 to-cyan-500"
        />
        <MetricCard
          icon={Users}
          title="Benzer Profiller"
          value="8"
          subtitle="Seninle aynı yeteneklere sahip"
          iconColor="bg-gradient-to-br from-emerald-500 to-green-500"
          onClick={() => setShowSimilarModal(true)}
        />
      </div>

      <SimilarProfilesModal open={showSimilarModal} onClose={() => setShowSimilarModal(false)} />
    </>
  );
}