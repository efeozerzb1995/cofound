import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { supabase } from '@/lib/supabase';

export default function EtherealBeamsHero() {
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      if (!cancelled && !error && typeof count === 'number') {
        setUserCount(count);
      }
    };
    fetchCount();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Gradient + beams background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#22c55e1a,_transparent_60%),radial-gradient(circle_at_bottom,_#22c55e26,_transparent_55%)]" />
        <div className="absolute -inset-x-40 -top-40 h-80 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-40 mix-blend-screen">
          <div className="absolute inset-y-[-20%] left-1/4 w-px bg-gradient-to-b from-transparent via-emerald-400/40 to-transparent" />
          <div className="absolute inset-y-[-30%] left-1/2 w-px bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent" />
          <div className="absolute inset-y-[-25%] left-3/4 w-px bg-gradient-to-b from-transparent via-violet-400/40 to-transparent" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_transparent_30%,_#020617)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 mb-5 backdrop-blur-md"
        >
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">
            CoFound ile kurucu ortak bul, ekibini büyüt
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-5"
        >
          <span className="block font-extrabold tracking-tight">
            Doğru Kurucu Ortağını Bul
          </span>
          <span className="mt-3 block text-lg sm:text-xl md:text-2xl font-normal text-slate-300">
            CoFound ile hayalindeki startup ekibini oluştur.
          </span>
        </motion.h1>

        {userCount !== null && userCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-8 text-sm text-slate-200"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-black/30 border border-white/10 px-4 py-2 backdrop-blur">
              <span className="text-emerald-400 font-semibold">
                {userCount.toLocaleString('tr-TR')}+
              </span>
              <span className="text-slate-300">kurucu adayı CoFound&apos;a katıldı</span>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <Link to={createPageUrl('Auth')}>
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 sm:px-14 py-5 sm:py-6 text-base sm:text-lg rounded-xl font-semibold shadow-xl shadow-emerald-500/30 inline-flex items-center gap-2"
            >
              <span>Kayıt Ol</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <div className="text-sm text-slate-400">
            Zaten hesabın var mı?{' '}
            <Link
              to={createPageUrl('Auth')}
              className="text-white hover:text-emerald-400 font-medium transition-colors underline underline-offset-2"
            >
              Giriş Yap
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

