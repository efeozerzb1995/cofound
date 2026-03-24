import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Github,
  Linkedin,
  Globe,
  MapPin,
  Briefcase,
  Settings as SettingsIcon,
  BookOpen,
  Zap,
  Search,
  Pencil,
  Check
} from 'lucide-react';
import ExperienceTimeline from '@/components/profile/ExperienceTimeline';
import ProjectPortfolio from '@/components/profile/ProjectPortfolio';
import SimilarProfiles from '@/components/profile/SimilarProfiles';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { supabase } from '@/lib/supabase';

const AuthGuard = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0d0f14]">
    <div className="w-8 h-8 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
  </div>
);

export default function Profile() {
  const navigate = useNavigate();
  const { isLoading: authLoading, user: authUser } = useRequireAuth();
  const isOwner = true; // This is the logged-in user's own profile
  const [profileData, setProfileData] = useState({
    name: '',
    title: '',
    university: '',
    location: '',
    bio: '',
    motivation: '',
    lookingFor: '',
    avatar: '',
    skills: [],
    interests: [],
    experience: [],
    portfolio: [],
  });
  const [lookingFor, setLookingFor] = useState('');
  const [editingLookingFor, setEditingLookingFor] = useState(false);
  const [lookingForDraft, setLookingForDraft] = useState('');

  useEffect(() => {
    const loadProfileFromSupabase = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Profil oturumu alınırken hata:', sessionError);
          throw sessionError;
        }

        const user = sessionData?.session?.user;
        if (!user) {
          navigate(createPageUrl('Auth'));
          return;
        }

        const userId = user.id;

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (profileError) throw profileError;

        const { data: skillsRows, error: skillsError } = await supabase
          .from('skills')
          .select('name')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (skillsError) throw skillsError;

        if (profile) {
          setProfileData(prev => ({
            ...prev,
            name: profile.full_name || prev.name,
            title: profile.title || prev.title,
            university: profile.university || prev.university,
            location: profile.location || prev.location,
            bio: profile.about || prev.bio,
            motivation: profile.motivation || prev.motivation,
            lookingFor: profile.looking_for || prev.lookingFor,
            avatar: profile.avatar_url || prev.avatar,
            portfolio: [
              ...(profile.website_url ? [{ type: 'website', url: profile.website_url }] : []),
              ...(profile.github_url ? [{ type: 'github', url: profile.github_url }] : []),
              ...(profile.linkedin_url ? [{ type: 'linkedin', url: profile.linkedin_url }] : []),
            ],
          }));
          setLookingFor(profile.looking_for || '');
        }

        if (skillsRows) {
          setProfileData(prev => ({
            ...prev,
            skills: skillsRows.map(row => row.name),
          }));
        }
      } catch (error) {
        console.error('Profil verileri yüklenemedi:', error);
      }
    };

    loadProfileFromSupabase();
  }, []);

  if (authLoading || !authUser) {
    return <AuthGuard />;
  }

  const startEditLookingFor = () => {
    setLookingForDraft(lookingFor);
    setEditingLookingFor(true);
  };

  const saveLookingFor = async () => {
    try {
      setLookingFor(lookingForDraft);
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Profil oturumu alınırken hata:', sessionError);
        throw sessionError;
      }

      const user = sessionData?.session?.user;
      if (!user) {
        navigate(createPageUrl('Auth'));
        return;
      }

      await supabase
        .from('profiles')
        .update({ looking_for: lookingForDraft })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Ne arıyorum alanı kaydedilemedi:', error);
    } finally {
      setEditingLookingFor(false);
    }
  };

  // Normalize user data to handle both string and array formats
  const user = {
    ...profileData,
    skills: Array.isArray(profileData.skills) 
      ? profileData.skills 
      : (profileData.skills || '').split(',').map(s => s.trim()).filter(Boolean),
    interests: Array.isArray(profileData.interests)
      ? profileData.interests
      : (profileData.interests || '').split(',').map(s => s.trim()).filter(Boolean),
    experience: Array.isArray(profileData.experience)
      ? profileData.experience
      : [],
    portfolio: Array.isArray(profileData.portfolio)
      ? profileData.portfolio
      : []
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0f14] relative overflow-hidden">
      {/* Dark Mesh Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-900/10 blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-3xl opacity-50"></div>
        <div className="absolute top-[40%] left-[50%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 3-Column Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT COLUMN (25%) - Identity & Skills */}
          <div className="lg:col-span-1 space-y-4">
            {/* Identity Card */}
            <Card className="bg-[#111318]/80 backdrop-blur-xl border-slate-800/60">
              <CardContent className="p-6">
                <div className="flex justify-end mb-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
                    onClick={() => navigate(createPageUrl('Settings'))}
                  >
                    <SettingsIcon className="w-3.5 h-3.5 mr-1.5" />
                    Profili Düzenle
                  </Button>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 border-2 border-emerald-500/30 mb-4">
                    <AvatarImage src={user.avatar || ''} />
                    <AvatarFallback className="bg-slate-800 text-white text-xl">
                      {user.name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
                  <p className="text-sm text-emerald-400 mb-3">
                    {[user.title, user.university].filter(Boolean).join(' @ ') || '\u00A0'}
                  </p>
                  
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    {user.location || 'Konum belirtilmedi'}
                  </div>

                  {/* Social Icons */}
                  <div className="flex gap-2">
                    {user.portfolio?.map((item, idx) => {
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
                          className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Cloud Card */}
            <Card className="bg-[#111318]/80 backdrop-blur-xl border-slate-800/60">
              <CardHeader>
                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Yetenekler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.skills?.length > 0 ? (
                    user.skills.map((skill, idx) => (
                      <Badge 
                        key={idx}
                        className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-slate-500 text-xs">Henüz yetenek eklenmedi</p>
                  )}
                </div>
              </CardContent>
            </Card>


          </div>

          {/* MIDDLE COLUMN (50%) - Journey & Portfolio */}
          <div className="lg:col-span-2 space-y-4">
            {/* About Section */}
            <Card className="bg-[#111318]/80 backdrop-blur-xl border-slate-800/60">
              <CardHeader>
                <CardTitle className="text-white text-sm font-semibold">Hakkımda</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm leading-relaxed">{user.bio}</p>
              </CardContent>
            </Card>

            {/* Ne Arıyorum */}
            <Card className="bg-[#111318]/80 backdrop-blur-xl border-slate-800/60">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                    <Search className="w-4 h-4 text-indigo-400" />
                    Ne Arıyorum?
                  </CardTitle>
                  {isOwner && !editingLookingFor && (
                    <button
                      onClick={startEditLookingFor}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-slate-800/50 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {isOwner && editingLookingFor && (
                    <button
                      onClick={saveLookingFor}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                    >
                      <Check className="w-3 h-3" />
                      Kaydet
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editingLookingFor ? (
                  <textarea
                    autoFocus
                    value={lookingForDraft}
                    onChange={(e) => setLookingForDraft(e.target.value)}
                    placeholder="Aradığınız kriterleri buraya yazın..."
                    rows={4}
                    className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 resize-none leading-relaxed"
                  />
                ) : lookingFor ? (
                  <p className="text-slate-300 text-sm leading-relaxed">{lookingFor}</p>
                ) : (
                  isOwner ? (
                    <button
                      onClick={startEditLookingFor}
                      className="w-full text-left text-slate-600 text-sm italic hover:text-slate-500 transition-colors"
                    >
                      Aradığınız kriterleri buraya yazın...
                    </button>
                  ) : (
                    <p className="text-slate-600 text-sm italic">Belirtilmemiş.</p>
                  )
                )}
              </CardContent>
            </Card>

            {/* Experience Timeline */}
            <Card className="bg-[#111318]/80 backdrop-blur-xl border-slate-800/60">
              <CardHeader>
                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  Profesyonel Yolculuğum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExperienceTimeline />
              </CardContent>
            </Card>

            {/* Project Grid */}
            <Card className="bg-[#111318]/80 backdrop-blur-xl border-slate-800/60">
              <CardHeader>
                <CardTitle className="text-white text-sm font-semibold">Proje Portföyü</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectPortfolio />
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN (25%) - Network */}
          <div className="lg:col-span-1 space-y-4">
            {/* Similar Profiles */}
            <Card className="bg-[#111318]/80 backdrop-blur-xl border-slate-800/60">
              <CardHeader>
                <CardTitle className="text-white text-sm font-semibold">Benzer Profilleri Keşfet</CardTitle>
              </CardHeader>
              <CardContent>
                <SimilarProfiles />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}