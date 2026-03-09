import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Shield, 
  HelpCircle,
  Trash2,
  LogOut,
  Camera,
  Link as LinkIcon,
  Plus,
  X,
  Save,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const navigationItems = [
  { id: 'profile', label: 'Profil Ayarları', icon: User },
  { id: 'email', label: 'E-posta Ayarları', icon: Mail },
  { id: 'security', label: 'Güvenlik & Gizlilik', icon: Shield },
  { id: 'support', label: 'Destek Merkezi', icon: HelpCircle },
  { id: 'remove', label: 'Hesabı Sil', icon: Trash2 },
];

const regions = [
  { id: 'africa', label: 'Afrika' },
  { id: 'australia', label: 'Avustralya' },
  { id: 'north-america', label: 'Kuzey Amerika' },
  { id: 'asia', label: 'Asya' },
  { id: 'europe', label: 'Avrupa' },
  { id: 'south-america', label: 'Güney Amerika' },
];

const Section = ({ label, hint, children }) => (
  <div className="space-y-2">
    <div>
      <label className="text-sm font-medium text-slate-200">{label}</label>
      {hint && <p className="text-xs text-slate-500 mt-0.5">{hint}</p>}
    </div>
    {children}
  </div>
);

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isPublic, setIsPublic] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [emailNotifications, setEmailNotifications] = useState({
    projectInvitations: true,
    newMessages: true,
    marketingUpdates: false
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: '',
    title: '',
    university: '',
    location: 'İstanbul, Türkiye',
    bio: '',
    skills: [],
    interests: [],
    motivation: '',
    lookingFor: '',
    projectIdea: '',
    profileUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    avatarUrl: '',
  });
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const loadProfileFromSupabase = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          setIsLoadingProfile(false);
          return;
        }

        const userId = user.id;

        // Load profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (profileError) throw profileError;

        if (profile) {
          setProfileData(prev => ({
            ...prev,
            name: profile.full_name || '',
            title: profile.title || '',
            university: profile.university || '',
            location: profile.location || 'İstanbul, Türkiye',
            bio: profile.about || '',
            motivation: profile.motivation || '',
            lookingFor: profile.looking_for || '',
            projectIdea: prev.projectIdea,
            profileUrl: profile.website_url || '',
            githubUrl: profile.github_url || '',
            linkedinUrl: profile.linkedin_url || '',
            avatarUrl: profile.avatar_url || '',
          }));
          setIsPublic(profile.is_public ?? false);
        }

        // Load skills
        const { data: skillsRows, error: skillsError } = await supabase
          .from('skills')
          .select('name')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (skillsError) throw skillsError;

        if (skillsRows) {
          setProfileData(prev => ({
            ...prev,
            skills: skillsRows.map(row => row.name),
          }));
        }

        // Load experiences
        const { data: experiencesRows, error: experiencesError } = await supabase
          .from('experiences')
          .select('role, company, year, description')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (experiencesError) throw experiencesError;
        if (experiencesRows && experiencesRows.length > 0) {
          setExperiences(experiencesRows);
        }
      } catch (error) {
        console.error('Profil verileri yüklenemedi:', error);
        toast.error('Profil verileri yüklenemedi.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfileFromSupabase();
  }, []);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen bir resim dosyası seçin.');
      event.target.value = '';
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error('Maksimum dosya boyutu 2MB olmalıdır.');
      event.target.value = '';
      return;
    }

    try {
      setAvatarUploading(true);
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Profil fotoğrafı için oturum alınırken hata:', sessionError);
        throw sessionError;
      }

      const user = sessionData?.session?.user;
      if (!user) {
        console.error('Profil fotoğrafı için aktif oturum bulunamadı, kullanıcı yok.');
        toast.error('Profil fotoğrafı yüklemek için giriş yapmalısın.');
        return;
      }

      const filePath = `${user.id}/avatar.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) {
        throw new Error('Yüklenen dosyanın URL\'i alınamadı.');
      }

      setProfileData(prev => ({
        ...prev,
        avatarUrl: publicUrl,
      }));

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast.success('Profil fotoğrafı güncellendi!');
    } catch (error) {
      console.error('Profil fotoğrafı yüklenemedi:', error);
      toast.error(error.message || 'Profil fotoğrafı yüklenirken bir hata oluştu.');
    } finally {
      setAvatarUploading(false);
      event.target.value = '';
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Çıkış yapıldı');
    navigate(createPageUrl('Auth'));
  };

  const handleSaveAndExit = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Oturum alınırken hata:', sessionError);
        throw sessionError;
      }

      const user = sessionData?.session?.user;
      if (!user) {
        console.error('Aktif oturum bulunamadı, kullanıcı yok.');
        toast.error('Profil kaydetmek için giriş yapmalısın.');
        return;
      }

      const userId = user.id;

      // Insert or update profile (avoid onConflict issues in production)
      const profilePayload = {
        user_id: userId,
        full_name: profileData.name || null,
        title: profileData.title || null,
        university: profileData.university || null,
        location: profileData.location || null,
        about: profileData.bio || null,
        motivation: profileData.motivation || null,
        looking_for: profileData.lookingFor || null,
        has_project_idea: !!profileData.projectIdea,
        website_url: profileData.profileUrl || null,
        github_url: profileData.githubUrl || null,
        linkedin_url: profileData.linkedinUrl || null,
        is_public: isPublic,
        avatar_url: profileData.avatarUrl || null,
      };

      const { data: existingProfile, error: existingProfileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingProfileError) {
        console.error('Profil sorgulanırken hata:', existingProfileError);
        throw existingProfileError;
      }

      let profileError = null;
      if (existingProfile) {
        const { error } = await supabase
          .from('profiles')
          .update(profilePayload)
          .eq('user_id', userId);
        profileError = error;
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert(profilePayload);
        profileError = error;
      }

      if (profileError) {
        console.error('Profil upsert hatası:', profileError);
        throw profileError;
      }

      // Sync skills: delete existing then insert current list
      const { error: deleteError } = await supabase
        .from('skills')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      const skillsToInsert = profileData.skills
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name) => ({ user_id: userId, name }));

      if (skillsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('skills')
          .insert(skillsToInsert);

        if (insertError) throw insertError;
      }

      // Sync experiences: delete existing then insert current list
      const { error: deleteExpError } = await supabase
        .from('experiences')
        .delete()
        .eq('user_id', userId);

      if (deleteExpError) throw deleteExpError;

      const experiencesToInsert = experiences
        .filter((exp) => (exp.role?.trim() || exp.company?.trim() || exp.year?.trim() || exp.description?.trim()))
        .map((exp) => ({
          user_id: userId,
          role: (exp.role || '').trim() || null,
          company: (exp.company || '').trim() || null,
          year: (exp.year || '').trim() || null,
          description: (exp.description || '').trim() || null,
        }));

      if (experiencesToInsert.length > 0) {
        const { error: insertExpError } = await supabase
          .from('experiences')
          .insert(experiencesToInsert);

        if (insertExpError) throw insertExpError;
      }

      toast.success('Profil kaydedildi!');
      navigate(createPageUrl('Profile'));
    } catch (error) {
      console.error('Profil kaydedilirken hata:', error);
      toast.error(error.message || 'Profil kaydedilirken bir hata oluştu.');
    }
  };

  const toggleRegion = (regionId) => {
    setSelectedRegions(prev => 
      prev.includes(regionId) ? prev.filter(id => id !== regionId) : [...prev, regionId]
    );
  };

  const addSkill = () => {
    if (newSkillInput.trim() && !profileData.skills.includes(newSkillInput.trim())) {
      setProfileData({ ...profileData, skills: [...profileData.skills, newSkillInput.trim()] });
      setNewSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addExperience = () => {
    setExperiences(prev => [...prev, { role: '', company: '', year: '', description: '' }]);
  };

  const removeExperience = (index) => {
    setExperiences(prev => prev.filter((_, i) => i !== index));
  };

  const updateExperience = (index, field, value) => {
    setExperiences(prev => prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          {/* Sidebar Nav */}
          <div className="w-52 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-base font-bold text-white mb-5">Hesabım</h2>
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {isLoadingProfile ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
              </div>
            ) : (
              <>

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-xl font-bold text-white">Profilini Düzenle</h1>
                  <p className="text-slate-400 text-sm mt-1">Bilgilerini güncelleyerek daha iyi eşleşmeler elde et</p>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    disabled={avatarUploading}
                    className="relative w-20 h-20 rounded-full border-2 border-dashed border-slate-700 cursor-pointer hover:border-emerald-500/50 transition-colors overflow-hidden bg-slate-800 flex items-center justify-center"
                  >
                    {profileData.avatarUrl ? (
                      <img
                        src={profileData.avatarUrl}
                        alt="Profil fotoğrafı"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-6 h-6 text-slate-500" />
                    )}
                    {avatarUploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-slate-500 border-t-emerald-400 rounded-full animate-spin" />
                      </div>
                    )}
                  </button>
                  <div>
                    <p className="text-sm text-slate-300 font-medium">Profil fotoğrafı</p>
                    <p className="text-xs text-slate-500 mt-0.5">Fotoğraf yüklemek için tıkla (maks. 2MB)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                {/* Basic Info */}
                <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 space-y-5">
                  <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">Temel Bilgiler</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Section label="Ad Soyad" hint="Platformda gösterilecek ismin">
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder="Örn: Ad Soyad"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500/50"
                      />
                    </Section>

                    <Section label="Ünvan / Uzmanlık Alanı" hint="Kısa ve öz bir tanım">
                      <Input
                        value={profileData.title}
                        onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                        placeholder="Örn: Genetik & Biyomühendislik Öğrencisi"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500/50"
                      />
                    </Section>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Section label="Üniversite" hint="Mevcut ya da mezun olduğun kurum">
                      <Input
                        value={profileData.university}
                        onChange={(e) => setProfileData({ ...profileData, university: e.target.value })}
                        placeholder="Örn: Yeditepe Üniversitesi"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500/50"
                      />
                    </Section>

                    <Section label="Konum" hint="Şu an bulunduğun şehir">
                      <Input
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        placeholder="Örn: İstanbul, Türkiye"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500/50"
                      />
                    </Section>
                  </div>

                  <Section 
                    label="Hakkımda" 
                    hint="Ziyaretçilerin seni tanıması için 2-3 cümlelik bir özet"
                  >
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="Örn: CRISPR teknolojisi ve biyomedikal uygulamalar üzerine çalışan bir araştırmacıyım. Yapay et ve rejeneratif tıp projelerine ilgi duyuyorum."
                      className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500/50 min-h-[90px] resize-none"
                    />
                  </Section>
                </div>

                {/* Skills */}
                <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 space-y-5">
                  <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">Yetenekler & Teknolojiler</h3>
                  
                  <Section 
                    label="Yeteneklerin" 
                    hint="Projelerde sunabileceğin teknik ya da akademik becerilerini ekle"
                  >
                    <div className="flex gap-2 mb-3">
                      <Input
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                        placeholder="Örn: Python, CRISPR, Veri Analizi..."
                        className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500/50"
                      />
                      <Button onClick={addSkill} size="sm" className="bg-emerald-500 hover:bg-emerald-600 px-4">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, idx) => (
                        <Badge key={idx} className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1 text-sm">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-white transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                      {profileData.skills.length === 0 && (
                        <p className="text-slate-500 text-xs">Henüz yetenek eklenmedi</p>
                      )}
                    </div>
                  </Section>
                </div>

                {/* Experiences */}
                <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-emerald-400" />
                      Deneyimler
                    </h3>
                    <Button type="button" onClick={addExperience} size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                      <Plus className="w-4 h-4 mr-1.5" />
                      Deneyim Ekle
                    </Button>
                  </div>
                  <Section label="İş ve eğitim deneyimlerin" hint="Rol, şirket/kurum, yıl ve kısa açıklama ekle">
                    <div className="space-y-4">
                      {experiences.length === 0 && (
                        <p className="text-slate-500 text-xs">Henüz deneyim eklenmedi. &quot;Deneyim Ekle&quot; ile ekleyebilirsin.</p>
                      )}
                      {experiences.map((exp, index) => (
                        <div key={index} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500 font-medium">Deneyim #{index + 1}</span>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeExperience(index)} className="text-slate-400 hover:text-red-400 hover:bg-red-500/10">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs text-slate-400">Rol / Ünvan</label>
                              <Input
                                value={exp.role ?? ''}
                                onChange={(e) => updateExperience(index, 'role', e.target.value)}
                                placeholder="Örn: Stajyer Araştırmacı"
                                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 text-sm"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs text-slate-400">Şirket / Kurum</label>
                              <Input
                                value={exp.company ?? ''}
                                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                placeholder="Örn: TÜBİTAK MAM"
                                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 text-sm"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs text-slate-400">Yıl</label>
                            <Input
                              value={exp.year ?? ''}
                              onChange={(e) => updateExperience(index, 'year', e.target.value)}
                              placeholder="Örn: 2024 Yaz veya 2022 - 2024"
                              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs text-slate-400">Açıklama</label>
                            <Textarea
                              value={exp.description ?? ''}
                              onChange={(e) => updateExperience(index, 'description', e.target.value)}
                              placeholder="Kısa açıklama..."
                              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 text-sm min-h-[70px] resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>

                {/* Motivation & Goals */}
                <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 space-y-5">
                  <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">Motivasyon & Hedefler</h3>
                  
                  <Section 
                    label="Neden buradayım?" 
                    hint="CoFound'a katılma amacını anlat — ne öğrenmek ya da inşa etmek istiyorsun?"
                  >
                    <Textarea
                      value={profileData.motivation}
                      onChange={(e) => setProfileData({ ...profileData, motivation: e.target.value })}
                      placeholder="Örn: Biyoteknoloji alanında gerçek dünya deneyimi kazanmak ve etki bırakan projeler geliştirmek istiyorum. Özellikle erken aşama startup ekiplerine katkı sağlamak beni heyecanlandırıyor."
                      className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500/50 min-h-[90px] resize-none"
                    />
                  </Section>

                  <Section 
                    label="Ne arıyorum?" 
                    hint="İdeal projeyi, ekip arkadaşını veya iş birliği biçimini tanımla"
                  >
                    <Textarea
                      value={profileData.lookingFor}
                      onChange={(e) => setProfileData({ ...profileData, lookingFor: e.target.value })}
                      placeholder="Örn: Biyomedikal veya gıda teknolojisi alanında çalışan, uzun vadeli proje geliştirmeye istekli bir ekip arıyorum. Teknik olmayan ama vizyoner bir kurucu ile çalışmaya açığım."
                      className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500/50 min-h-[90px] resize-none"
                    />
                  </Section>

                  <Section 
                    label="Proje fikrim var mı?" 
                    hint="Aklında bir proje varsa kısaca anlat — takım aramak için harika bir başlangıç noktası"
                  >
                    <Textarea
                      value={profileData.projectIdea}
                      onChange={(e) => setProfileData({ ...profileData, projectIdea: e.target.value })}
                      placeholder="Örn: Hücresel protein sentezini optimize eden bir AI modeli geliştirmeyi düşünüyorum. Bunun için makine öğrenmesi bilen bir ekip arkadaşı arıyorum."
                      className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500/50 min-h-[90px] resize-none"
                    />
                  </Section>
                </div>

                {/* Links */}
                <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 space-y-5">
                  <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">Bağlantı & Portföy</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <Section label="GitHub" hint="github.com/kullanici-adin">
                      <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg px-3">
                        <span className="text-slate-500 text-xs">github.com/</span>
                        <Input
                          value={profileData.githubUrl}
                          onChange={(e) => setProfileData({ ...profileData, githubUrl: e.target.value })}
                          placeholder="kullanici-adin"
                          className="bg-transparent border-0 text-white placeholder-slate-500 focus-visible:ring-0 p-0 text-sm"
                        />
                      </div>
                    </Section>

                    <Section label="LinkedIn" hint="linkedin.com/in/kullanici-adin">
                      <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg px-3">
                        <span className="text-slate-500 text-xs">linkedin.com/in/</span>
                        <Input
                          value={profileData.linkedinUrl}
                          onChange={(e) => setProfileData({ ...profileData, linkedinUrl: e.target.value })}
                          placeholder="kullanici-adin"
                          className="bg-transparent border-0 text-white placeholder-slate-500 focus-visible:ring-0 p-0 text-sm"
                        />
                      </div>
                    </Section>

                    <Section label="Kişisel Web Sitesi / Portföy" hint="Portfolyon, araştırma sayfan veya kişisel siten">
                      <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg px-3">
                        <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                        <Input
                          value={profileData.profileUrl}
                          onChange={(e) => setProfileData({ ...profileData, profileUrl: e.target.value })}
                          placeholder="ornek.com"
                          className="bg-transparent border-0 text-white placeholder-slate-500 focus-visible:ring-0 p-0 text-sm"
                        />
                      </div>
                    </Section>
                  </div>
                </div>

                {/* Visibility */}
                <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 space-y-5">
                  <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">Görünürlük Ayarları</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-200">Profili herkese açık yap</p>
                      <p className="text-xs text-slate-500 mt-0.5">Açık olduğunda profil arama sonuçlarında görünür</p>
                    </div>
                    <Switch 
                      checked={isPublic} 
                      onCheckedChange={setIsPublic}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </div>

                  {isPublic && (
                    <div>
                      <p className="text-xs text-slate-400 mb-3">Profilin hangi bölgelerde görünsün?</p>
                      <div className="grid grid-cols-3 gap-3">
                        {regions.map((region) => (
                          <div key={region.id} className="flex items-center gap-2">
                            <Checkbox 
                              id={region.id}
                              checked={selectedRegions.includes(region.id)}
                              onCheckedChange={() => toggleRegion(region.id)}
                              className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                            />
                            <label htmlFor={region.id} className="text-slate-400 text-xs cursor-pointer">
                              {region.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-3 pb-8">
                  <Button variant="outline" onClick={() => navigate(-1)} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    İptal
                  </Button>
                  <Button onClick={handleSaveAndExit} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8">
                    <Save className="w-4 h-4 mr-2" />
                    Kaydet
                  </Button>
                </div>
              </div>
            )}

            {/* EMAIL TAB */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-bold text-white">E-posta Ayarları</h1>
                  <p className="text-slate-400 text-sm mt-1">Bildirim tercihlerini yönet</p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 space-y-5">
                  <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">Bildirim Tercihleri</h3>
                  
                  {[
                    { key: 'projectInvitations', label: 'Proje Davetleri', desc: 'Bir projeye davet edildiğinde e-posta al' },
                    { key: 'newMessages', label: 'Yeni Mesajlar', desc: 'Yeni mesaj geldiğinde bildirim al' },
                    { key: 'marketingUpdates', label: 'Pazarlama Güncellemeleri', desc: 'CoFound\'dan haberler ve kampanyalar' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-1">
                      <div>
                        <p className="text-sm text-slate-200">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      <Switch 
                        checked={emailNotifications[item.key]} 
                        onCheckedChange={(checked) => setEmailNotifications({...emailNotifications, [item.key]: checked})}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">E-posta Adresini Güncelle</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Mevcut E-posta</label>
                      <Input type="email" placeholder="mevcut@email.com" className="bg-slate-800/50 border-slate-700 text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-400">Yeni E-posta</label>
                      <Input type="email" placeholder="yeni@email.com" className="bg-slate-800/50 border-slate-700 text-white" />
                    </div>
                  </div>
                  <Button className="bg-emerald-500 hover:bg-emerald-600">E-postayı Güncelle</Button>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-bold text-white">Güvenlik & Gizlilik</h1>
                  <p className="text-slate-400 text-sm mt-1">Hesap güvenliğini yönet</p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 space-y-5">
                  <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">İki Faktörlü Doğrulama (2FA)</h3>
                  <p className="text-slate-400 text-sm">Hesabına ekstra bir güvenlik katmanı ekle. Giriş yaparken şifrene ek olarak doğrulama kodu istenir.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-200">2FA'yı Etkinleştir</span>
                    <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} className="data-[state=checked]:bg-emerald-500" />
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">Şifre Değiştir</h3>
                  <div className="space-y-3">
                    {[['Mevcut Şifre', 'Mevcut şifreni gir'], ['Yeni Şifre', 'En az 8 karakter'], ['Şifre Tekrar', 'Yeni şifreni tekrarla']].map(([label, placeholder]) => (
                      <div key={label} className="space-y-1.5">
                        <label className="text-xs text-slate-400">{label}</label>
                        <Input type="password" placeholder={placeholder} className="bg-slate-800/50 border-slate-700 text-white" />
                      </div>
                    ))}
                    <Button className="bg-emerald-500 hover:bg-emerald-600 mt-2">Şifreyi Güncelle</Button>
                  </div>
                </div>
              </div>
            )}

            {/* SUPPORT TAB */}
            {activeTab === 'support' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-bold text-white">Destek Merkezi</h1>
                  <p className="text-slate-400 text-sm mt-1">Sorunun varsa bize ulaş</p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">Mesaj Gönder</h3>
                  <Textarea placeholder="Sorunuzu ya da merak ettiğinizi yazın..." className="bg-slate-800/50 border-slate-700 text-white min-h-[180px]" />
                  <Button className="bg-emerald-500 hover:bg-emerald-600">Gönder</Button>
                </div>

                <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 space-y-3">
                  <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">Sık Sorulan Sorular</h3>
                  {['Nasıl proje oluşturabilirim?', 'Takım üyelerini nasıl davet ederim?', 'Abonelik planları nelerdir?', 'Hesabımı nasıl doğrularım?'].map(q => (
                    <a key={q} href="#" className="block text-emerald-400 text-sm hover:text-emerald-300 hover:underline">{q}</a>
                  ))}
                </div>
              </div>
            )}

            {/* REMOVE ACCOUNT TAB */}
            {activeTab === 'remove' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-bold text-red-400">Hesabı Sil</h1>
                  <p className="text-slate-400 text-sm mt-1">Bu işlem geri alınamaz</p>
                </div>

                <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-6 space-y-4">
                  <h3 className="text-red-400 text-sm font-semibold">Bu işlem sonucunda:</h3>
                  <ul className="text-slate-400 text-sm space-y-2">
                    <li>• Profil ve tüm veriler kalıcı olarak silinir</li>
                    <li>• Tüm projelerden ve ekiplerden çıkarsın</li>
                    <li>• Tüm mesajlar ve bağlantılar silinir</li>
                    <li>• Aktif abonelikler iptal edilir</li>
                  </ul>
                  <Button 
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white mt-2"
                    onClick={() => {
                      if (confirm('Hesabını silmek istediğinden emin misin? Bu işlem geri alınamaz.')) {
                        toast.error('Hesap silme işlemi gerçekleştirildi');
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hesabımı Sil
                  </Button>
                </div>

                <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-slate-200 mb-2">Hesabını silmek yerine...</h3>
                  <p className="text-slate-400 text-sm mb-4">Profilini geçici olarak gizleyebilir ya da bildirim tercihlerini düzenleyebilirsin.</p>
                  <Button variant="outline" onClick={() => setActiveTab('profile')} className="border-slate-700 text-slate-300 hover:bg-slate-800 text-sm">
                    Görünürlük Ayarlarına Git
                  </Button>
                </div>
              </div>
            )}

            </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}