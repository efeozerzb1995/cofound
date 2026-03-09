import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Building2, Megaphone, ClipboardCheck, Users, Search, Send } from 'lucide-react';

const builderSteps = [
  {
    label: "Adım 1",
    title: "Profilini Oluştur",
    description: "~5 dakikada birkaç soruyu yanıtla ve AI'ın becerilerini, deneyimini ve aradıklarını öne çıkaran şık bir genel profil oluşturmasına izin ver.",
    icon: UserPlus,
    isFinal: false
  },
  {
    label: "Adım 2",
    title: "Şirket Sayfası Oluştur",
    description: "Bize fikrin/projen hakkında bilgi ver; problem, çözüm, linkler, medya ve bağlam dahil. Dilediğin zaman düzenleyebilirsin — doğru insanlarla eşleştirmek için bu bilgileri kullanıyoruz.",
    icon: Building2,
    isFinal: false
  },
  {
    label: "Adım 3",
    title: "Kampanya Kur",
    description: "İhtiyacın olan kişileri tanımla: beceriler, deneyim seviyesi, müsaitlik, çalışma stili. Oldukça hedefli bir liste oluşturup en iyi eşleşmelere otomatik ulaşacağız.",
    icon: Megaphone,
    isFinal: false
  },
  {
    label: "Adım 4",
    title: "En İyi Başvuranları Seç",
    description: "Kampanyan yayına girdiğinde nitelikli adaylar başvurur. Profilleri incele, başvuranları karşılaştır, en iyisini seç — ve tek tıkla toplantı ayarla.",
    icon: ClipboardCheck,
    isFinal: false
  },
  {
    label: "Son Adım",
    title: "Adaylarla Tanış",
    description: "Projeyi tartışmak, sorular sormak ve uyumunuzu görmek için en iyi adaylarla toplantı yap. Bu konuşmalar gerçek bir bağ kurmanı ve doğru kişiyi ekibe sorunsuzca dahil etmeni sağlar.",
    icon: Users,
    isFinal: true
  }
];

const joinerSteps = [
  {
    label: "Adım 1",
    title: "Profilini Oluştur",
    description: "~5 dakikada birkaç soruyu yanıtla ve AI'ın becerilerini, ilgi alanlarını ve deneyimini öne çıkaran şık bir profil oluşturmasına izin ver.",
    icon: UserPlus,
    isFinal: false
  },
  {
    label: "Adım 2",
    title: "Projeleri Keşfet",
    description: "AI eşleştirme ile sana en uygun projeleri bul. Üniversite, kategori, program gibi filtreler kullanarak hayalindeki projeye ulaş.",
    icon: Search,
    isFinal: false
  },
  {
    label: "Adım 3",
    title: "Projeye Başvur",
    description: "İlgini çeken projeye başvur. Proje sahipleri profilini inceleyerek seninle iletişime geçer.",
    icon: Send,
    isFinal: false
  },
  {
    label: "Son Adım",
    title: "Ekibe Katıl",
    description: "Proje sahibiyle tanış, sorularını sor ve uyumunuzu değerlendir. Hayalindeki ekibe katıl ve fikirlerini hayata geçirmeye başla.",
    icon: Users,
    isFinal: true
  }
];

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('builder');
  const steps = activeTab === 'builder' ? builderSteps : joinerSteps;

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            Sonraki Adımlar Neler?
          </h2>

          {/* Tab Toggle */}
          <div className="inline-flex items-center bg-slate-800/70 border border-slate-700/50 rounded-full p-1">
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'builder'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Proje Kuruyorum
            </button>
            <button
              onClick={() => setActiveTab('joiner')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'joiner'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Projeye Katılmak İstiyorum
            </button>
          </div>
        </motion.div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            {/* Dashed center line */}
            <div className="absolute left-1/2 top-6 bottom-6 w-px border-l-2 border-dashed border-slate-700/60 -translate-x-1/2 z-0" />

            <div className="relative z-10 flex flex-col gap-3">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* Step badge */}
                  <div className="mb-2">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
                      step.isFinal
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {step.label}
                    </span>
                  </div>

                  {/* Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className={`w-full rounded-2xl p-6 border ${
                      step.isFinal
                        ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-emerald-500/25'
                        : 'bg-slate-800/50 border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        step.isFinal ? 'bg-emerald-500/20' : 'bg-slate-700/60'
                      }`}>
                        <step.icon className={`w-6 h-6 ${step.isFinal ? 'text-emerald-400' : 'text-slate-300'}`} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-xl mb-2">{step.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Down arrow */}
                  {index < steps.length - 1 && (
                    <div className="my-0.5 text-slate-700">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                        <path d="M7 11L1.5 5h11L7 11z"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}