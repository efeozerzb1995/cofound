import React, { useState, useRef, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, X } from 'lucide-react';

const interestOptions = [
  // Bio & Health
  'Biyoteknoloji', 'CRISPR', 'Rejeneratif Tıp', 'Biyoinformatik', 'Medikal Cihazlar', 
  'Nörobilim', 'Genetik', 'Gen Mühendisliği', 'Hücresel Tarım', 'İlaç Geliştirme',
  'Biyomühendislik', 'Doku Mühendisliği', 'Kanser Araştırmaları', 'Sağlık Teknolojileri',
  'Dijital Sağlık', 'Teletıp', 'Biyosensörler', 'Protez Teknolojileri',
  
  // Engineering
  'Gömülü Sistemler', 'IoT', 'Savunma Sanayi', 'Robotik', 'Malzeme Bilimi', 
  '3D Yazıcılar', 'Otonom Sistemler', 'Drone Teknolojisi', 'Elektrik-Elektronik',
  'Makine Öğrenmesi Donanımı', 'FPGA', 'Arduino', 'Raspberry Pi', 'PCB Tasarımı',
  'Mekatronik', 'Havacılık', 'Uzay Teknolojileri', 'Enerji Sistemleri',
  
  // Software
  'Frontend', 'Backend', 'Full Stack', 'Mobile App', 'DevOps', 'Siber Güvenlik',
  'Oyun Geliştirme', 'Unity', 'Unreal Engine', 'Yapay Zeka', 'Makine Öğrenmesi',
  'Derin Öğrenme', 'Doğal Dil İşleme', 'Bilgisayarlı Görü', 'Veri Bilimi',
  'Big Data', 'Cloud Computing', 'Blockchain', 'Web3', 'AR/VR', 'React', 'Python',
  'Node.js', 'Flutter', 'Swift', 'Kotlin', 'API Geliştirme', 'Veritabanı',
  
  // Business & Creative
  'Dijital Pazarlama', 'E-Ticaret', 'UI/UX Tasarım', 'Video Kurgu', 'Sosyal Girişimcilik',
  'İçerik Üretimi', 'SEO/SEM', 'Growth Hacking', 'Marka Yönetimi', 'Sosyal Medya',
  'Grafik Tasarım', '3D Modelleme', 'Animasyon', 'Fotoğrafçılık', 'Podcast',
  'Copywriting', 'PR & İletişim', 'Satış', 'İş Geliştirme', 'Finans',
  
  // Industries
  'Fintech', 'EdTech', 'AgriTech', 'CleanTech', 'PropTech', 'LegalTech',
  'FoodTech', 'TravelTech', 'SportsTech', 'FashionTech', 'InsurTech',
  'Sürdürülebilirlik', 'Yeşil Enerji', 'Elektrikli Araçlar', 'Akıllı Şehirler',
  'Lojistik', 'Tedarik Zinciri', 'Perakende', 'Medya'
];

const goalOptions = [
  { id: 'tubitak', label: 'TÜBİTAK Projesi', emoji: '🔬' },
  { id: 'teknofest', label: 'Teknofest', emoji: '🚀' },
  { id: 'incubator', label: 'Kuluçka Merkezi', emoji: '🏢' },
  { id: 'global', label: 'Global Startup', emoji: '🌍' },
  { id: 'academic', label: 'Akademik Araştırma', emoji: '📚' },
  { id: 'social', label: 'Sosyal Girişim', emoji: '💚' },
  { id: 'investment', label: 'Yatırım Bulmak', emoji: '💰' },
  { id: 'network', label: 'Network Yapmak', emoji: '🤝' },
  { id: 'internship', label: 'Staj Yeri Bulmak', emoji: '👔' },
  { id: 'freelance', label: 'Freelance İş', emoji: '💻' },
  { id: 'hackathon', label: 'Hackathon', emoji: '⚡' }
];

export default function StepInterests({ interests, goals, onChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const filteredInterests = interestOptions.filter(interest =>
    interest.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !interests.includes(interest)
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addInterest = (interest) => {
    onChange({ interests: [...interests, interest] });
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const removeInterest = (interest) => {
    onChange({ interests: interests.filter(i => i !== interest) });
  };

  const toggleGoal = (goalId) => {
    const newGoals = goals.includes(goalId)
      ? goals.filter(g => g !== goalId)
      : [...goals, goalId];
    onChange({ goals: newGoals });
  };

  return (
    <div>
      {/* Interests Multi-Select */}
      <div className="mb-6">
        <h3 className="text-lg text-white font-medium mb-2">
          Hangi alanlarda proje geliştirmek istiyorsun?
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          En az bir alan seç (birden fazla seçebilirsin)
        </p>
        
        {/* Searchable Input */}
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="İlgi alanı ara... (Örn: Biyoteknoloji, React, Pazarlama)"
              className="bg-slate-800/50 border-slate-700 text-white h-12 pl-10 placeholder:text-slate-500"
            />
          </div>

          {/* Dropdown */}
          {isOpen && (searchQuery.length > 0 || filteredInterests.length > 0) && (
            <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-48 overflow-y-auto">
              {filteredInterests.length > 0 ? (
                filteredInterests.slice(0, 8).map((interest) => (
                  <button
                    key={interest}
                    onClick={() => addInterest(interest)}
                    className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-slate-700 transition-colors flex items-center justify-between"
                  >
                    {interest}
                    <span className="text-emerald-400 text-xs">+ Ekle</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-slate-400">
                  Sonuç bulunamadı
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Interests Tags */}
        {interests.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {interests.map((interest) => (
              <Badge
                key={interest}
                className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 pl-3 pr-1.5 py-1.5 flex items-center gap-1.5"
              >
                {interest}
                <button
                  onClick={() => removeInterest(interest)}
                  className="p-0.5 rounded hover:bg-emerald-500/30 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {interests.length === 0 && (
          <p className="text-slate-500 text-xs mt-2">
            Yukarıdan arama yaparak ilgi alanı ekle
          </p>
        )}
      </div>

      {/* Goals */}
      <div>
        <h3 className="text-lg text-white font-medium mb-2">
          Özel bir hedefin var mı?
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          İsteğe bağlı - hedeflerine göre projeler önereceğiz
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {goalOptions.map((goal) => (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={cn(
                "px-3 py-2.5 rounded-lg text-sm font-medium transition-all border text-left flex items-center gap-2",
                goals.includes(goal.id)
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                  : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600"
              )}
            >
              <span>{goal.emoji}</span>
              <span className="truncate">{goal.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}