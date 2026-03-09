import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80"
          alt="Team working"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/65" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Mixed-weight headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6"
        >
          <span className="font-light">Ekip Arkadaşlarını Bul ve </span>
          <br />
          <span className="font-extrabold">Girişim Fikrini </span>
          <span className="font-light">Büyüt</span>
        </motion.h1>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="flex -space-x-2">
            {[
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
            ].map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="w-9 h-9 rounded-full border-2 border-slate-900 object-cover"
              />
            ))}
          </div>
          <div className="text-left text-sm">
            <span className="text-white font-bold">2.500+</span>
            <span className="text-slate-300"> aktif kullanıcı </span>
            <span className="text-emerald-400 font-bold">CoFound</span>
            <span className="text-slate-300">'a katıldı</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <Link to={createPageUrl('Auth')}>
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-14 py-6 text-lg rounded-xl font-semibold shadow-xl shadow-emerald-500/20"
            >
              Kayıt Ol
            </Button>
          </Link>
          <div className="mt-3 text-sm text-slate-400">
            Zaten hesabın var mı?{' '}
            <Link to={createPageUrl('Auth')} className="text-white hover:text-emerald-400 font-medium transition-colors underline underline-offset-2">
              Giriş Yap
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}