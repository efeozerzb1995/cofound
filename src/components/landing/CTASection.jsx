import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CTASection() {
  return (
    <section className="relative py-28 overflow-hidden bg-slate-950">
      {/* Colorful blurred background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-r from-emerald-600/25 via-indigo-500/20 to-purple-600/25 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-bold text-white mb-10"
        >
          Bize Katılmaya Hazır mısın?
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Link to={createPageUrl('Auth')}>
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-16 py-6 text-lg rounded-xl font-semibold shadow-xl shadow-emerald-500/20"
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