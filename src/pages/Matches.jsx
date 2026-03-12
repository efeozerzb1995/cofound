import React, { useState } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sparkles,
  Heart,
  Clock,
  UserSearch
} from 'lucide-react';

export default function Matches() {
  const { isLoading, user } = useRequireAuth();
  const [activeTab, setActiveTab] = useState('recommended');

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Heart className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Eşleşmeler
            </h1>
          </div>
          <p className="text-slate-400">
            AI destekli öneriler ve başvuru durumlarını takip et
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#111318] border border-slate-800/60 p-1 rounded-xl">
            <TabsTrigger 
              value="recommended"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-500 rounded-lg px-6 py-2.5"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Önerilen
            </TabsTrigger>
            <TabsTrigger 
              value="applications"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-500 rounded-lg px-6 py-2.5"
            >
              <Clock className="w-4 h-4 mr-2" />
              Başvurular
            </TabsTrigger>
          </TabsList>

          {/* Önerilen Tab */}
          <TabsContent value="recommended">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Henüz eşleşmen yok
              </h2>
              <p className="text-slate-400 max-w-md">
                Profilini ve projelerini güncel tut. Yakında burada senin için önerilen eşleşmeleri göreceksin.
              </p>
            </div>
          </TabsContent>

          {/* Başvurular Tab */}
          <TabsContent value="applications">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Henüz eşleşmen yok
              </h2>
              <p className="text-slate-400 max-w-md">
                Başvuruların ve gelen eşleşmelerin burada görünecek. Yakında Supabase üzerinden gerçek verilerle bağlanacak.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}