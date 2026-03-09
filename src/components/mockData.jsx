// Mock Data for EkipBul Platform

export const projects = [
  {
    id: 1,
    title: "Yapay Et Üretimi İçin Biyoreaktör Tasarımı",
    description: "Sürdürülebilir gıda üretimi için hücresel tarım teknolojileri kullanarak ölçeklenebilir biyoreaktör sistemleri geliştiriyoruz.",
    category: "BioTech",
    program: "TÜBİTAK 2209",
    university: "Yeditepe Üniversitesi",
    verified: true,
    seeking: ["Makine Mühendisi", "Biyomühendis"],
    skills: ["Biyoloji", "Makine Tasarımı", "CAD", "Hücre Kültürü"],
    tags: ["BioTech", "TÜBİTAK", "Sürdürülebilirlik"],
    owner: {
      name: "Elif Yılmaz",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      university: "Yeditepe Üniversitesi",
      isVerified: false
    },
    createdAt: "2024-01-15",
    applicants: 12,
    location: "İstanbul",
    teamSize: "3-5",
    stage: "İdeation",
    aiRating: 4.8,
    isPaid: false
  },
  {
    id: 2,
    title: "AI Destekli Tarım Drone'u",
    description: "Yapay zeka ile hastalık tespiti ve hassas ilaçlama yapabilen otonom tarım drone'u geliştiriyoruz.",
    category: "AgriTech",
    program: "Teknofest",
    university: "ODTÜ",
    verified: true,
    seeking: ["AI Developer", "Drone Mühendisi", "Tarım Uzmanı"],
    skills: ["Python", "Computer Vision", "Drone Sistemleri", "Machine Learning"],
    tags: ["AgriTech", "Teknofest", "AI"],
    owner: {
      name: "Ahmet Kaya",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      university: "ODTÜ",
      isVerified: true
    },
    createdAt: "2024-02-01",
    applicants: 24,
    location: "Ankara",
    teamSize: "5-10",
    stage: "Prototype",
    aiRating: 4.9,
    isPaid: true
  },
  {
    id: 3,
    title: "Peer-to-Peer Öğrenci Not Paylaşımı",
    description: "Üniversite öğrencilerinin ders notlarını güvenli şekilde paylaşabileceği ve kazanç elde edebileceği platform.",
    category: "EdTech",
    program: "Startup",
    university: "İTÜ",
    verified: false,
    seeking: ["Marketing Co-founder", "Full Stack Developer"],
    skills: ["React", "Node.js", "Marketing", "UX Design"],
    tags: ["EdTech", "Startup", "Platform"],
    owner: {
      name: "Can Demir",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      university: "İTÜ",
      isVerified: false
    },
    createdAt: "2024-01-28",
    applicants: 8,
    location: "İstanbul",
    teamSize: "1-3",
    stage: "Launch",
    aiRating: 4.2,
    isPaid: false
  },
  {
    id: 4,
    title: "Rejeneratif Tıp için Doku Mühendisliği",
    description: "3D biyobasım teknolojisi ile fonksiyonel doku ve organ üretimi üzerine araştırma projesi.",
    category: "BioTech",
    program: "TÜBİTAK 2244",
    university: "Koç Üniversitesi",
    verified: true,
    seeking: ["Biyomühendis", "Hücre Biyoloğu", "3D Modelleme Uzmanı"],
    skills: ["Doku Mühendisliği", "Biyobasım", "Hücre Kültürü", "MATLAB"],
    tags: ["BioTech", "TÜBİTAK", "Rejeneratif Tıp"],
    owner: {
      name: "Dr. Zeynep Arslan",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      university: "Koç Üniversitesi",
      isVerified: true
    },
    createdAt: "2024-02-10",
    applicants: 18,
    location: "İstanbul",
    teamSize: "5-10",
    stage: "Prototype",
    aiRating: 4.7,
    isPaid: true
  },
  {
    id: 5,
    title: "Fintech Ödeme Altyapısı",
    description: "KOBİ'ler için blockchain tabanlı hızlı ve düşük maliyetli ödeme altyapısı geliştiriyoruz.",
    category: "Fintech",
    program: "Startup",
    university: "Bilkent Üniversitesi",
    verified: false,
    seeking: ["Blockchain Developer", "Finans Uzmanı", "Backend Developer"],
    skills: ["Solidity", "Web3", "Finans", "Node.js"],
    tags: ["Fintech", "Blockchain", "Startup"],
    owner: {
      name: "Mert Özkan",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      university: "Bilkent Üniversitesi",
      isVerified: false
    },
    createdAt: "2024-02-05",
    applicants: 15,
    location: "Ankara",
    teamSize: "3-5",
    stage: "Launch",
    aiRating: 4.5,
    isPaid: true
  },
  {
    id: 6,
    title: "Akıllı Protez Kol Projesi",
    description: "EMG sinyalleri ile kontrol edilen, düşük maliyetli ve modüler akıllı protez kol tasarımı.",
    category: "Hardware",
    program: "Teknofest",
    university: "Boğaziçi Üniversitesi",
    verified: true,
    seeking: ["Elektronik Mühendisi", "Makine Mühendisi", "Yazılım Geliştiricisi"],
    skills: ["Arduino", "3D Baskı", "Signal Processing", "C++"],
    tags: ["Hardware", "Teknofest", "Sağlık"],
    owner: {
      name: "Selin Aydın",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      university: "Boğaziçi Üniversitesi",
      isVerified: true
    },
    createdAt: "2024-01-20",
    applicants: 21,
    location: "İstanbul",
    teamSize: "5-10",
    stage: "Prototype",
    aiRating: 4.6,
    isPaid: false
  }
];

export const users = [
  {
    id: 1,
    name: "Örnek Kullanıcı",
    title: "Öğrenci",
    university: "Üniversite",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1500&h=500&fit=crop",
    bio: "Biyoteknoloji ve girişimcilik alanında projeler üzerinde çalışan bir öğrenciyim. Gerçek dünyada etki yaratacak takımlarla çalışmak istiyorum.",
    skills: ["Biyoinformatik", "Python", "Laboratuvar Deneyimi", "Hücre Kültürü", "CRISPR", "Veri Analizi"],
    interests: ["Rejeneratif Tıp", "Yapay Et", "Gen Terapisi", "Biyoteknoloji"],
    portfolio: [],
    experience: [
      { title: "Araştırma Stajyeri", company: "Yeditepe Moleküler Biyoloji Lab", duration: "6 ay" },
      { title: "Proje Asistanı", company: "TÜBİTAK 2209-A", duration: "1 yıl" }
    ],
    matchScore: 94,
    isVerified: false
  },
  {
    id: 2,
    name: "Emre Yıldız",
    title: "Yazılım Mühendisi",
    university: "ODTÜ",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    bio: "Full-stack developer olarak 3 yıllık tecrübem var. Startup ekosisteminde teknik kurucu ortak olarak yer almak istiyorum.",
    skills: ["React", "Node.js", "Python", "AWS", "Machine Learning", "TypeScript"],
    interests: ["Fintech", "EdTech", "AI Startups"],
    portfolio: [
      { type: "github", url: "github.com/emreyildiz" },
      { type: "linkedin", url: "linkedin.com/in/emreyildiz" }
    ],
    experience: [
      { title: "Software Engineer", company: "Getir", duration: "2 yıl" },
      { title: "Freelance Developer", company: "Çeşitli Projeler", duration: "1 yıl" }
    ],
    matchScore: 87
  },
  {
    id: 3,
    name: "Ayşe Çelik",
    title: "Biyomühendis",
    university: "Koç Üniversitesi",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    bio: "Doku mühendisliği ve biyomalzeme alanında doktora yapıyorum. Akademi ve endüstri arasında köprü kuracak projelerde yer almak istiyorum.",
    skills: ["Doku Mühendisliği", "Biyomalzemeler", "3D Biyobasım", "MATLAB", "Hücre Kültürü"],
    interests: ["Rejeneratif Tıp", "Biyobasım", "Medikal Cihazlar"],
    portfolio: [
      { type: "linkedin", url: "linkedin.com/in/aysecelik" },
      { type: "researchgate", url: "researchgate.net/aysecelik" }
    ],
    experience: [
      { title: "Araştırma Görevlisi", company: "Koç Üniversitesi", duration: "3 yıl" },
      { title: "Yaz Stajyeri", company: "Acıbadem Sağlık Grubu", duration: "3 ay" }
    ],
    matchScore: 91,
    isVerified: true
  }
];

export const universities = [
  "Tümü",
  // İstanbul
  "Boğaziçi Üniversitesi",
  "İTÜ",
  "Yeditepe Üniversitesi",
  "Koç Üniversitesi",
  "Sabancı Üniversitesi",
  "Marmara Üniversitesi",
  "İstanbul Üniversitesi",
  "Galatasaray Üniversitesi",
  "Bahçeşehir Üniversitesi",
  "İstanbul Teknik Üniversitesi",
  "Özyeğin Üniversitesi",
  "Medipol Üniversitesi",
  "İstanbul Bilgi Üniversitesi",
  // Ankara
  "ODTÜ",
  "Bilkent Üniversitesi",
  "Hacettepe Üniversitesi",
  "Ankara Üniversitesi",
  "Gazi Üniversitesi",
  "TOBB ETÜ",
  "Atılım Üniversitesi",
  "Çankaya Üniversitesi",
  "TED Üniversitesi",
  // İzmir
  "Ege Üniversitesi",
  "Dokuz Eylül Üniversitesi",
  "İzmir Yüksek Teknoloji Enstitüsü (İYTE)",
  "İzmir Ekonomi Üniversitesi",
  // Diğer
  "Erciyes Üniversitesi",
  "Selçuk Üniversitesi",
  "Uludağ Üniversitesi",
  "Karadeniz Teknik Üniversitesi",
  "Akdeniz Üniversitesi",
  "Eskişehir Teknik Üniversitesi",
  "Pamukkale Üniversitesi"
];

export const categories = [
  "Tümü",
  "BioTech",
  "AgriTech",
  "EdTech",
  "Fintech",
  "Hardware",
  "Software",
  "HealthTech",
  "CleanTech",
  "SpaceTech",
  "DeepTech",
  "GreenTech",
  "FoodTech",
  "MedTech",
  "LegalTech",
  "PropTech",
  "Robotics",
  "Yapay Zeka / AI",
  "Blockchain & Web3",
  "Siber Güvenlik",
  "AR / VR / Metaverse",
  "Oyun & GameTech",
  "Sosyal Girişim",
  "E-Ticaret",
  "Lojistik & Mobility"
];

export const programs = [
  "Tümü",
  // TÜBİTAK
  "TÜBİTAK 2209-A (Lisans Araştırma)",
  "TÜBİTAK 2209-B (Sanayiye Yönelik)",
  "TÜBİTAK 2242 (Lisans Yarışması)",
  "TÜBİTAK 2244 (Doktora Bursu)",
  "TÜBİTAK 1512 (BiGG Teknogirişim)",
  "TÜBİTAK 1601 (Yenilik Destek)",
  "TÜBİTAK STAR",
  // Teknofest
  "Teknofest – Serbest Kategori",
  "Teknofest – Yapay Zeka",
  "Teknofest – İnsansız Hava Araçları",
  "Teknofest – Sağlık",
  "Teknofest – Savunma Sanayi",
  "Teknofest – Tarım",
  // KOSGEB
  "KOSGEB Genç Girişimci",
  "KOSGEB Girişimcilik Destek",
  "KOSGEB Ar-Ge İnovasyon",
  // Üniversite & Kuluçka
  "Üniversite Araştırma Projesi",
  "Üniversite Teknopark / TTO Desteği",
  "Kuluçka Merkezi (Incubation)",
  "Hızlandırma Programı (Accelerator)",
  // Diğer Programlar
  "Hackathon Projesi",
  "Google for Startups",
  "Microsoft for Startups",
  "Endeavor Girişimi",
  "Y Combinator / Uluslararası Akseleratör",
  "Avrupa Birliği Horizon Programı",
  "Bağımsız Girişim (Startup)",
  "Diğer"
];

export const programOptions = [
  "TÜBİTAK 2209-A (Lisans Araştırma)",
  "TÜBİTAK 2209-B (Sanayiye Yönelik)",
  "TÜBİTAK 2244 (Doktora Bursu)",
  "TÜBİTAK 1512 (BiGG Teknogirişim)",
  "Teknofest",
  "KOSGEB Girişimcilik Destek",
  "KOSGEB Ar-Ge İnovasyon",
  "Üniversite Araştırma Projesi",
  "Üniversite Teknopark / TTO Desteği",
  "Kuluçka Merkezi (Incubation)",
  "Hızlandırma Programı (Accelerator)",
  "Hackathon Projesi",
  "Google for Startups",
  "Microsoft for Startups",
  "Avrupa Birliği Horizon Programı",
  "Bağımsız Girişim (Startup)",
  "Diğer"
];

export const locations = [
  "Tümü",
  // Büyük Şehirler
  "İstanbul (Avrupa)",
  "İstanbul (Anadolu)",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Konya",
  "Gaziantep",
  "Mersin",
  "Kayseri",
  "Eskişehir",
  "Trabzon",
  "Samsun",
  "Denizli",
  // Çalışma Modeli
  "Uzaktan (Remote)",
  "Hibrit",
  "Yurt Dışı"
];

export const teamSizes = [
  "Tümü",
  "Solo (1 kişi)",
  "1-3",
  "3-5",
  "5-10",
  "10-20",
  "20+"
];

export const stages = [
  "Tümü",
  "İdeation (Fikir Aşaması)",
  "Validation (Doğrulama)",
  "Prototype (Prototip)",
  "MVP (Minimum Ürün)",
  "Launch (Lansman)",
  "Growth (Büyüme)",
  "Scale-up (Ölçekleme)",
  "Exit / Satış Aşaması"
];

export const positionTypes = [
  "Tümü",
  "Ücretli (Tam Zamanlı)",
  "Ücretli (Yarı Zamanlı)",
  "Gönüllü",
  "Hisse Ortaklığı (Equity)",
  "Staj",
  "Freelance / Proje Bazlı"
];

// Calculate match score based on skills and interests overlap
export const calculateMatchScore = (userSkills, userInterests, projectSkills, projectTags) => {
  const skillOverlap = userSkills.filter(skill => 
    projectSkills.some(pSkill => pSkill.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(pSkill.toLowerCase()))
  ).length;
  
  const interestOverlap = userInterests.filter(interest =>
    projectTags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()) || interest.toLowerCase().includes(tag.toLowerCase()))
  ).length;
  
  const maxScore = Math.max(userSkills.length, projectSkills.length) + Math.max(userInterests.length, projectTags.length);
  const score = ((skillOverlap * 2 + interestOverlap * 1.5) / maxScore) * 100;
  
  return Math.min(Math.round(score + 60), 99); // Base score + calculated, max 99
};