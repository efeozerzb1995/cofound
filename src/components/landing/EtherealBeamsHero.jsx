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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0">
        {/* Large central radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.22)_0,_transparent_55%),radial-gradient(circle_at_top,_rgba(34,211,238,0.2)_0,_transparent_60%)]" />

        {/* Moving gradient beams */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute -inset-x-40 -top-64 h-[420px] bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-violet-500/15 blur-3xl"
        />
        <div className="absolute inset-0 opacity-60 mix-blend-screen" />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.18] mix-blend-soft-light">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.18)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        {/* Slow floating gradient blobs */}
        <motion.div
          className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl"
          initial={{ opacity: 0.1, x: -20, y: 0 }}
          animate={{ opacity: 0.15, x: [-20, 20, -20], y: [0, 10, 0] }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
        {/* Right-side blob removed to avoid vertical line edge */}
        <motion.div
          className="absolute left-1/2 bottom-[-160px] h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-400/12 blur-3xl"
          initial={{ opacity: 0.08, y: 10 }}
          animate={{ opacity: 0.13, y: [10, -10, 10] }}
          transition={{
            duration: 24,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        {/* Dark vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_transparent_30%,_#020617)]" />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 32 }).map((_, i) => (
            <motion.span
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className="absolute h-1 w-1 rounded-full bg-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0.3, y: 10 }}
              animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4], y: [-10, 10, -10] }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                repeatType: 'mirror',
                delay: Math.random() * 4,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 mb-6 backdrop-blur-md shadow-[0_0_30px_rgba(45,212,191,0.35)]"
        >
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">
            CoFound ile kurucu ortak bul, ekibini büyüt
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mb-7"
        >
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[3.75rem] xl:text-[4.25rem] font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-200 to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(45,212,191,0.35)]">
              Doğru Kurucu Ortağını Bul
            </span>
          </span>
          <span className="mt-4 block text-base sm:text-lg md:text-xl lg:text-2xl font-normal text-slate-200/90 max-w-2xl mx-auto">
            CoFound ile hayalindeki startup ekibini oluştur. Teknik ve iş tarafında seni
            tamamlayacak kurucu ortaklarla tanış.
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

