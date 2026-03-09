import React from 'react';
import { motion } from 'framer-motion';
import { Users, Rocket, Lightbulb } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: "Hayalindeki Ekibi Bul",
    description: "AI eşleştirme sistemimizle projen için mükemmel yeteneği bul. Erken aşama ekipler için tasarlanmış çoklu eşleştirme yöntemleri."
  },
  {
    icon: Rocket,
    title: "Harika Projelerde Çalış",
    description: "Gerçek etki bırakabileceğin, hızlı öğrenebileceğin ve geleceğin şekillenmesine katkıda bulunabileceğin projelerle buluşuyoruz."
  },
  {
    icon: Lightbulb,
    title: "Fikrini Hayata Geçir",
    description: "Zaten bir fikrin mi var? Doğru insanları bul, projeyi riske atmadan ekibini kur ve girişimini büyüt."
  }
];

export default function FeatureCards() {
  return (
    <section className="py-14 bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/40 hover:border-slate-600/60 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}