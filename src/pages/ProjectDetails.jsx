import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle,
  MapPin,
  Calendar,
  Users,
  MessageCircle,
  Send,
  Award,
  Target,
  Briefcase,
  FileText,
  Download,
  Lock,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';
import { supabase } from '@/lib/supabase';
import confetti from 'canvas-confetti';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [applicationText, setApplicationText] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [includeProfile, setIncludeProfile] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('Geçersiz proje adresi');
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (cancelled) return;
        if (projectError) {
          setError(projectError.message);
          setProject(null);
          setLoading(false);
          return;
        }
        setProject(projectData || null);
        if (projectData?.owner_id) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('user_id, full_name, avatar_url, university')
            .eq('user_id', projectData.owner_id)
            .maybeSingle();
          if (!cancelled) setOwner(profileData || null);
        } else {
          if (!cancelled) setOwner(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Proje yüklenemedi');
          setProject(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-600 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">{error || 'Proje bulunamadı'}</p>
          <Button
            onClick={() => navigate(createPageUrl('Explore'))}
            className="mt-4 bg-emerald-500 hover:bg-emerald-600"
          >
            Keşfete Dön
          </Button>
        </div>
      </div>
    );
  }

  const seeking = Array.isArray(project.seeking) ? project.seeking : [];
  const skills = Array.isArray(project.skills) ? project.skills : [];
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const ownerDisplay = {
    name: owner?.full_name || 'Proje Sahibi',
    avatar: owner?.avatar_url || '',
    university: owner?.university || '',
  };

  const handleApply = () => {
    setIsApplicationModalOpen(false);
    setHasApplied(true);
    
    // Confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    toast.success('Başvurun iletildi! Proje sahibi seninle iletişime geçecek.');
    setApplicationText('');
  };

  const handleMessageOwner = () => {
    navigate(createPageUrl('Messages'), {
      state: {
        user: {
          name: ownerDisplay.name,
          email: `${ownerDisplay.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          avatar: ownerDisplay.avatar,
          title: 'Proje Sahibi'
        }
      }
    });
  };

  const teamMembers = [
    { name: ownerDisplay.name, avatar: ownerDisplay.avatar, role: 'Proje Sahibi' },
  ];

  const detailedRequirements = {
    technical: skills.slice(0, 3),
    soft: ['Takım Çalışması', 'Problem Çözme', 'İletişim'],
    experience: ['Laboratuvar deneyimi', 'Proje yönetimi']
  };

  const applicantsCount = project.applicants ?? 0;
  const isVerified = project.is_verified ?? project.verified ?? false;

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-white mb-3">{project.title}</h1>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <Sparkles className="w-3 h-3 mr-1" />
                          %99 Uyum Skoru
                        </Badge>
                        <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          {project.category}
                        </Badge>
                        <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/30">
                          {project.program}
                        </Badge>
                        {isVerified && (
                          <Badge className="bg-green-500/10 text-green-400 border border-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Doğrulanmış
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      İstanbul / Hibrit
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {applicantsCount} başvuru
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Son Başvuru: 15 Mart 2026
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Tabs defaultValue="about" className="space-y-6">
                <TabsList className="bg-slate-900/60 border border-slate-700/40 p-1.5 rounded-2xl w-full grid grid-cols-4 shadow-lg">
                  <TabsTrigger 
                    value="about"
                    className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-400 rounded-xl py-3 font-medium transition-all"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Hakkında
                  </TabsTrigger>
                  <TabsTrigger 
                    value="requirements"
                    className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-400 rounded-xl py-3 font-medium transition-all"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Gereksinimler
                  </TabsTrigger>
                  <TabsTrigger 
                    value="team"
                    className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-400 rounded-xl py-3 font-medium transition-all"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Takım
                  </TabsTrigger>
                  <TabsTrigger 
                    value="documents"
                    className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-400 rounded-xl py-3 font-medium transition-all"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Dokümanlar
                  </TabsTrigger>
                </TabsList>

                {/* About Tab */}
                <TabsContent value="about">
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white">Proje Hakkında</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-300 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="pt-4 border-t border-slate-700/50">
                        <h4 className="text-white font-medium mb-3">Proje Hedefleri</h4>
                        <ul className="space-y-2 text-slate-300">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>Sürdürülebilir ve ölçeklenebilir bir çözüm geliştirmek</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>Akademik araştırma ve endüstri uygulamalarını birleştirmek</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>Patent başvurusu ve yayın hedefleri doğrultusunda ilerlemek</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Requirements Tab */}
                <TabsContent value="requirements">
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-white">Aranan Pozisyonlar ve Yetenekler</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                          <Award className="w-5 h-5 text-emerald-400" />
                          Teknik Yetenekler
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {detailedRequirements.technical.map((skill, idx) => (
                            <Badge key={idx} className="bg-slate-700/50 text-slate-200 px-4 py-2">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-3">Aranan Roller</h4>
                        <div className="space-y-3">
                          {seeking.map((role, idx) => (
                            <div key={idx} className="p-4 rounded-lg bg-slate-700/30 border border-slate-700/50">
                              <h5 className="text-emerald-400 font-medium">{role}</h5>
                              <p className="text-sm text-slate-400 mt-1">
                                {role} olarak projede aktif rol alacak, takım ile işbirliği yapacak kişiler arıyoruz.
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-3">Yumuşak Beceriler</h4>
                        <div className="flex flex-wrap gap-2">
                          {detailedRequirements.soft.map((skill, idx) => (
                            <Badge key={idx} className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-4 py-2">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Team Tab */}
                <TabsContent value="team">
                  <Card className="bg-slate-800/50 border-slate-700/50 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-white">Takım Üyeleri</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {teamMembers.map((member, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-slate-700/30 border border-slate-700/50">
                            <Avatar className="w-12 h-12 border-2 border-slate-600">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="bg-slate-700 text-slate-300">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="text-white font-medium">{member.name}</h4>
                              <p className="text-sm text-slate-400">{member.role}</p>
                            </div>
                          </div>
                        ))}
                        <div className="p-6 rounded-xl bg-slate-700/20 border-2 border-dashed border-slate-700/50 text-center">
                          <p className="text-slate-400 mb-2">Takıma sen de katıl!</p>
                          <p className="text-sm text-slate-500">Daha {seeking.length} pozisyon açık</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Documents & Finance Tab */}
                <TabsContent value="documents">
                  <div className="space-y-6">
                    {/* Pitch Deck */}
                    <Card className="bg-slate-800/50 border-slate-700/50 rounded-2xl overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <FileText className="w-5 h-5 text-indigo-400" />
                          Pitch Deck
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-400/20 hover:border-indigo-400/40 transition-all group cursor-pointer">
                          <div className="p-4 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-all">
                            <FileText className="w-7 h-7 text-indigo-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-lg">MyoGenix_Pitch_v2.pdf</h4>
                            <p className="text-slate-400 text-sm mt-1">2.4 MB • Son güncelleme: 2 gün önce</p>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 rounded-xl px-5 py-2.5"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            İndir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Financial Projection */}
                    <Card className="bg-slate-800/50 border-slate-700/50 rounded-2xl overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-emerald-400" />
                          Finansal Projeksiyon
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative rounded-2xl overflow-hidden">
                          {/* Blurred Chart Preview */}
                          <div className="h-64 bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center backdrop-blur-xl border-2 border-slate-700/30">
                            <div className="text-center z-10 relative">
                              <Lock className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                              <h4 className="text-white font-semibold text-xl mb-3">Yatırımcı Erişimi Gerekli</h4>
                              <p className="text-slate-400 text-sm mb-5 max-w-sm mx-auto leading-relaxed">
                                5 yıllık finansal projeksiyon, gelir modeli ve büyüme stratejisi
                              </p>
                              <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg rounded-xl px-6 py-3">
                                <Lock className="w-4 h-4 mr-2" />
                                Erişim İste
                              </Button>
                            </div>
                          </div>
                          
                          {/* Simulated blurred chart in background */}
                          <div className="absolute inset-0 opacity-30 blur-3xl pointer-events-none">
                            <div className="h-full w-full bg-gradient-to-tr from-emerald-500/40 via-blue-500/40 to-purple-500/40" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* Project Owner Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Proje Sahibi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-12 h-12 border-2 border-slate-600">
                        <AvatarImage src={ownerDisplay.avatar} />
                        <AvatarFallback className="bg-slate-700 text-slate-300">
                          {ownerDisplay.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-white font-medium">{ownerDisplay.name}</h4>
                        <p className="text-sm text-slate-400">{ownerDisplay.university}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={handleMessageOwner}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Mesaj At
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Apply Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/30">
                  <CardContent className="p-6">
                    <Button 
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-lg py-6"
                      onClick={() => setIsApplicationModalOpen(true)}
                      disabled={hasApplied}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {hasApplied ? 'Başvuru Gönderildi' : 'Projeye Başvur'}
                    </Button>
                    
                    <div className="mt-4 pt-4 border-t border-emerald-500/20 space-y-3 text-sm">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">Son Başvuru</span>
                        <span className="font-medium">15 Mart 2026</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">Konum</span>
                        <span className="font-medium">İstanbul / Hibrit</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">Başvuru Sayısı</span>
                        <span className="font-medium">{applicantsCount} kişi</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Etiketler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, idx) => (
                        <Badge key={idx} className="bg-slate-700/50 text-slate-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Application Modal */}
        <Dialog open={isApplicationModalOpen} onOpenChange={setIsApplicationModalOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-white">Projeye Başvuru Yap</DialogTitle>
            </DialogHeader>

            <div className="space-y-5 py-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-slate-300">Başvurulacak Pozisyon</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Bir pozisyon seç..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {seeking.map((role, idx) => (
                      <SelectItem 
                        key={idx} 
                        value={`role_${idx}`}
                        className="text-slate-200 focus:bg-slate-700 focus:text-white"
                      >
                        Aranan Pozisyon: {role}
                      </SelectItem>
                    ))}
                    <SelectItem 
                      value="general"
                      className="text-slate-200 focus:bg-slate-700 focus:text-white"
                    >
                      Genel Başvuru (Açık Pozisyon Dışı)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cover Letter */}
              <div className="space-y-2">
                <Label className="text-slate-300">Neden bu projeye katılmak istiyorsun? <span className="text-slate-500">(Opsiyonel)</span></Label>
                <Textarea
                  value={applicationText}
                  onChange={(e) => setApplicationText(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white min-h-[130px]"
                  placeholder="Kısaca kendinden ve projeye katabileceğin değerden bahset..."
                />
              </div>

              <div className="flex items-center space-x-2 p-4 rounded-lg bg-slate-700/30 border border-slate-700/50">
                <Checkbox 
                  id="includeProfile" 
                  checked={includeProfile}
                  onCheckedChange={setIncludeProfile}
                  className="border-slate-500"
                />
                <Label 
                  htmlFor="includeProfile" 
                  className="text-slate-300 cursor-pointer"
                >
                  Profilimi ve CV'mi başvuruya ekle
                </Label>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsApplicationModalOpen(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                İptal
              </Button>
              <Button
                onClick={handleApply}
                disabled={!selectedRole}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Başvuruyu Tamamla
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}