import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  GraduationCap,
  Github,
  Linkedin,
  Globe,
  MapPin,
  Calendar,
  Briefcase,
  Sparkles,
  Award,
  BookOpen,
  UserPlus,
  MessageCircle,
  ArrowLeft,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function PublicProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const user = location.state?.user;
  const profileUserId = user?.id;
  const context = location.state?.context;
  const applicationId = location.state?.applicationId;
  const projectId = location.state?.projectId;
  const isIncomingApplication = context === 'incoming_application';
  const [connectionSent, setConnectionSent] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('pending'); // pending, accepted, rejected

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Kullanıcı bulunamadı</p>
          <Button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-emerald-500 hover:bg-emerald-600"
          >
            Geri Dön
          </Button>
        </div>
      </div>
    );
  }

  const handleConnect = () => {
    setConnectionSent(true);
    toast.success('Bağlantı isteği başarıyla gönderildi. Karşı taraf onayladığında mesajlaşabilirsiniz.', {
      duration: 3000
    });
  };

  const handleAcceptApplication = () => {
    setApplicationStatus('accepted');
    toast.success('Başvuru kabul edildi! 🎉');
    setTimeout(() => navigate(createPageUrl('Matches'), {
      state: { decision: 'accepted', applicationId }
    }), 1000);
  };

  const handleRejectApplication = () => {
    setApplicationStatus('rejected');
    toast.info('Başvuru reddedildi.');
    setTimeout(() => navigate(createPageUrl('Matches'), {
      state: { decision: 'rejected', applicationId }
    }), 1000);
  };

  const handleMessage = () => {
    navigate(createPageUrl('Messages'), { state: { user } });
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri
        </Button>

        {/* Incoming Application Banner */}
        {isIncomingApplication && (
          <div className={`mb-4 rounded-xl p-4 border flex items-center justify-between gap-4 ${
            applicationStatus === 'accepted' ? 'bg-green-500/10 border-green-500/30' :
            applicationStatus === 'rejected' ? 'bg-red-500/10 border-red-500/30' :
            'bg-emerald-500/10 border-emerald-500/30'
          }`}>
            <div>
              <p className="text-sm font-medium text-white">
                {applicationStatus === 'accepted' ? '✅ Bu başvuruyu kabul ettiniz.' :
                 applicationStatus === 'rejected' ? '❌ Bu başvuruyu reddettiniz.' :
                 `${user.name} projenize başvurdu`}
              </p>
              {applicationStatus === 'pending' && (
                <p className="text-xs text-slate-400 mt-0.5">Profili inceledikten sonra kabul ya da reddedin</p>
              )}
            </div>
            {applicationStatus === 'pending' && (
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleAcceptApplication}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Kabul Et
                </Button>
                <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={handleRejectApplication}>
                  <XCircle className="w-4 h-4 mr-1" />
                  Reddet
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden">
            {/* Banner */}
            <div className="h-32 sm:h-40 bg-gradient-to-r from-emerald-600/20 via-emerald-500/10 to-slate-800" />
            
            <CardContent className="relative px-6 pb-6">
              {/* Avatar */}
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-slate-800 -mt-12 sm:-mt-16 ring-4 ring-emerald-500/20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-slate-700 text-slate-300 text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              {/* Action Buttons - only show when viewing someone else's profile */}
              {profileUserId !== currentUser?.id && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    onClick={handleMessage}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Mesaj Gönder
                  </Button>
                  <Button 
                    size="sm" 
                    style={connectionSent ? { backgroundColor: '#4B5563' } : {}}
                    className={connectionSent 
                      ? "text-slate-300 cursor-not-allowed" 
                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                    }
                    onClick={!connectionSent ? handleConnect : undefined}
                    disabled={connectionSent}
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    {connectionSent ? 'İstek Beklemede' : 'Bağlantı Kur'}
                  </Button>
                </div>
              )}

              {/* Profile Info */}
              <div className="mt-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{user.name}</h1>
                  {user.matchScore && (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-sm font-medium">
                      <Sparkles className="w-3 h-3 mr-1" />
                      %{user.matchScore} Uyum
                    </Badge>
                  )}
                </div>
                <p className="text-emerald-400 font-medium mt-1">{user.title}</p>
                
                <div className="flex flex-wrap items-center gap-4 mt-3 text-slate-400 text-sm">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    {user.university}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    İstanbul, Türkiye
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Ocak 2024'te katıldı
                  </div>
                </div>

                {/* Bio */}
                <p className="text-slate-300 mt-4 leading-relaxed">
                  {user.bio}
                </p>

                {/* Portfolio Links */}
                {user.portfolio && user.portfolio.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {user.portfolio.map((item, idx) => {
                      const icons = {
                        github: Github,
                        linkedin: Linkedin,
                        website: Globe,
                        researchgate: BookOpen
                      };
                      const Icon = icons[item.type] || Globe;
                      
                      return (
                        <a
                          key={idx}
                          href={`https://${item.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-lg bg-slate-700/50 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition-colors"
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6"
        >
          <Tabs defaultValue="skills" className="space-y-6">
            <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1 rounded-xl">
              <TabsTrigger 
                value="skills"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-slate-400 rounded-lg px-6 py-2.5"
              >
                Yetenekler
              </TabsTrigger>
              {user.experience && user.experience.length > 0 && (
                <TabsTrigger 
                  value="experience"
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-slate-400 rounded-lg px-6 py-2.5"
                >
                  Deneyim
                </TabsTrigger>
              )}
              {user.interests && user.interests.length > 0 && (
                <TabsTrigger 
                  value="interests"
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-slate-400 rounded-lg px-6 py-2.5"
                >
                  İlgi Alanları
                </TabsTrigger>
              )}
            </TabsList>

            {/* Skills Tab */}
            <TabsContent value="skills">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    Yetenekler ve Uzmanlık Alanları
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.skills && user.skills.map((skill, idx) => (
                      <Badge 
                        key={idx}
                        className="bg-slate-700/50 text-slate-200 hover:bg-slate-700 px-4 py-2 text-sm"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience Tab */}
            {user.experience && user.experience.length > 0 && (
              <TabsContent value="experience">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-emerald-400" />
                      Deneyimler
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.experience.map((exp, idx) => (
                      <div 
                        key={idx}
                        className="flex items-start gap-4 p-4 rounded-xl bg-slate-700/30 border border-slate-700/50"
                      >
                        <div className="p-3 rounded-lg bg-emerald-500/10">
                          <Briefcase className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{exp.title}</h4>
                          <p className="text-slate-400 text-sm">{exp.company}</p>
                          <p className="text-slate-500 text-xs mt-1">{exp.duration}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Interests Tab */}
            {user.interests && user.interests.length > 0 && (
              <TabsContent value="interests">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      İlgi Alanları
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.interests.map((interest, idx) => (
                        <Badge 
                          key={idx}
                          className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-4 py-2 text-sm"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}