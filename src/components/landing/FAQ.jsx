import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "Ekip ne kadar hızlı bulabilirim?",
    answer: "AI eşleştirme sistemimiz profilin ve proje gereksinimlerinle hemen eşleşme önerileri sunar. Çoğu kullanıcı ilk haftada uygun adaylarla iletişime geçiyor."
  },
  {
    question: "Mevcut araçlardan farkı ne?",
    answer: "CoFound, özellikle erken aşama startup ve öğrenci projelerine odaklanmış AI destekli bir eşleştirme platformudur. LinkedIn gibi genel platformların aksine, TÜBİTAK, Teknofest ve startup ekosistemi için özelleştirilmiştir."
  },
  {
    question: "Eşleştirme nasıl çalışır?",
    answer: "Yapay zeka algoritmamız becerilerini, ilgi alanlarını, deneyimini ve aradıklarını analiz ederek en uyumlu projeleri ve kişileri önerir. Eşleşme skoru ne kadar yüksekse uyum o kadar iyi demektir."
  },
  {
    question: "Projem olmadan da katılabilir miyim?",
    answer: "Evet! Mevcut projelere başvurabilir ve ekiplere katılabilirsin. 'Keşfet' sayfasında yüzlerce aktif proje seni bekliyor."
  },
  {
    question: "Önceden deneyim gerekiyor mu?",
    answer: "Hayır. CoFound her seviyeden katılımcıya açıktır. Öğrenci, mezun veya profesyonel olsan da sana uygun projeler ve ekipler bulunuyor."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-bold text-white text-center mb-12"
        >
          Sıkça Sorulan Sorular
        </motion.h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-4 bg-slate-800/50 border border-slate-700/40 rounded-2xl text-left hover:border-slate-600 transition-colors"
              >
                <span className="text-white text-sm font-medium pr-4">{faq.question}</span>
                <div className="flex-shrink-0 text-slate-400">
                  {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 text-slate-400 text-sm leading-relaxed bg-slate-800/30 border border-t-0 border-slate-700/40 rounded-b-2xl -mt-1">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}