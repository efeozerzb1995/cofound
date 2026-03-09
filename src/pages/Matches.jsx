import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Heart,
  Briefcase,
  Clock,
  ArrowRight,
  ThumbsDown,
  UserSearch,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { projects, users, calculateMatchScore } from '@/components/mockData';

// Current user's profile for matching
const currentUserProfile = {
  skills: ['Python', 'Biyoinformatik', 'Veri Analizi', 'Hücre Kültürü'],
  interests: ['BioTech', 'Rejeneratif Tıp', 'Yapay Et']
};

export default function Matches() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('recommended');
  const [applicationStatuses, setApplicationStatuses] = useState({});

  // Handle decision returned from PublicProfile
  useEffect(() => {
    if (location.state?.decision) {
      const { applicationId, decision } = location.state;
      setApplicationStatuses(prev => ({ ...prev, [applicationId]: decision }));
      setActiveTab('applications');
      // Clear the state so it doesn't re-trigger
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  // Calculate match scores for projects
  const matchedProjects = projects
    .map(project => ({
      ...project,
      matchScore: calculateMatchScore(
        currentUserProfile.skills,
        currentUserProfile.interests,
        project.skills,
        project.tags
      )
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

  // Sample pending applications
  const pendingApplications = [
    {
      id: 1,
      type: 'sent',
      project: projects[0],
      status: 'pending',
      appliedAt: '2024-02-14'
    },
    {
      id: 2,
      type: 'received',
      user: users[1],
      project: projects[1],
      status: 'pending',
      appliedAt: '2024-02-13'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0d0f14] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Heart className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Eşleşmeler
            </h1>
          </div>
          <p className="text-slate-400">
            AI destekli öneriler ve başvuru durumlarını takip et
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#111318] border border-slate-800/60 p-1 rounded-xl">
            <TabsTrigger 
              value="recommended"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-500 rounded-lg px-6 py-2.5"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Önerilen
            </TabsTrigger>
            <TabsTrigger 
              value="applications"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-500 rounded-lg px-6 py-2.5"
            >
              <Clock className="w-4 h-4 mr-2" />
              Başvurular
            </TabsTrigger>
          </TabsList>

          {/* Recommended Tab */}
          <TabsContent value="recommended">
            {/* AI Banner */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-400 font-medium text-sm">AI Eşleştirme Sonuçları</p>
                <p className="text-slate-400 text-xs">Profiline en uygun projeler yeteneklerine ve ilgi alanlarına göre sıralandı</p>
              </div>
            </div>

            {/* Matched Projects */}
            <div className="space-y-4">
              {matchedProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-[#111318] border-slate-800/60 overflow-hidden hover:border-slate-700 transition-colors">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Project Owner Logo/Avatar Side */}
                        <div className="sm:w-24 bg-slate-800/40 p-4 flex items-center justify-center border-r border-slate-800/60">
                          <Avatar className="w-14 h-14 border-2 border-slate-600">
                            <AvatarImage src={project.owner.avatar} />
                            <AvatarFallback className="bg-slate-700 text-slate-300 text-lg">
                              {project.owner.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 p-4 sm:p-5">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600 text-xs">
                                  {project.program}
                                </Badge>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                                  {project.category}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-medium">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  %{project.matchScore} Uyum
                                </Badge>
                              </div>
                              <p className="text-slate-400 text-sm line-clamp-2 mb-3">{project.description}</p>
                              
                              {/* Matching Skills */}
                              <div className="flex flex-wrap gap-1.5">
                                {project.skills.slice(0, 3).map((skill, idx) => (
                                  <Badge 
                                    key={idx}
                                    className={`text-xs ${
                                      currentUserProfile.skills.some(s => 
                                        s.toLowerCase().includes(skill.toLowerCase()) || 
                                        skill.toLowerCase().includes(s.toLowerCase())
                                      )
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                        : 'bg-slate-700/50 text-slate-400'
                                    }`}
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            {/* Action */}
                            <div className="flex sm:flex-col gap-2">
                              <Button 
                                onClick={() => navigate(createPageUrl('ProjectDetails'), { state: { projectId: project.id } })}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1 sm:flex-none"
                              >
                                Başvur
                                <ArrowRight className="w-4 h-4 ml-1" />
                              </Button>
                              <Button variant="outline" size="icon" className="border-slate-600 text-slate-400 hover:bg-slate-700">
                                <ThumbsDown className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <div className="space-y-4">
              {pendingApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-[#111318] border-slate-800/60">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          {application.type === 'sent' ? (
                            <>
                              <div className="p-3 rounded-lg bg-blue-500/10">
                                <Briefcase className="w-5 h-5 text-blue-400" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">
                                    Gönderilen Başvuru
                                  </Badge>
                                  <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30 text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Beklemede
                                  </Badge>
                                </div>
                                <h4 className="text-white font-medium">{application.project.title}</h4>
                                <p className="text-slate-400 text-sm mt-1">{application.project.owner.name} • {application.project.university}</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <Avatar 
                                className="w-12 h-12 border border-slate-600 cursor-pointer hover:ring-2 hover:ring-emerald-500/50 transition-all"
                                onClick={() => navigate(createPageUrl('PublicProfile'), {
                                  state: { user: application.user, context: 'incoming_application', applicationId: application.id, projectId: application.project.id }
                                })}
                              >
                                <AvatarImage src={application.user.avatar} />
                                <AvatarFallback className="bg-slate-700 text-slate-300">
                                  {application.user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                                    Gelen Başvuru
                                  </Badge>
                                  {applicationStatuses[application.id] === 'accepted' ? (
                                    <Badge className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">Kabul Edildi</Badge>
                                  ) : applicationStatuses[application.id] === 'rejected' ? (
                                    <Badge className="bg-red-500/10 text-red-400 border-red-500/30 text-xs">Reddedildi</Badge>
                                  ) : (
                                    <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30 text-xs">
                                      <Clock className="w-3 h-3 mr-1" />
                                      Beklemede
                                    </Badge>
                                  )}
                                </div>
                                <h4 
                                  className="text-white font-medium hover:text-emerald-400 cursor-pointer"
                                  onClick={() => navigate(createPageUrl('PublicProfile'), {
                                    state: { user: application.user, context: 'incoming_application', applicationId: application.id, projectId: application.project.id }
                                  })}
                                >
                                  {application.user.name}
                                </h4>
                                <p className="text-slate-400 text-sm mt-1">{application.user.title} • {application.project.title} için başvurdu</p>
                              </div>
                            </>
                          )}
                        </div>
                        
                        {application.type === 'received' && (
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            {applicationStatuses[application.id] === 'accepted' ? (
                              <div className="flex items-center gap-1.5 text-green-400 text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4" />
                                Kabul Edildi
                              </div>
                            ) : applicationStatuses[application.id] === 'rejected' ? (
                              <div className="flex items-center gap-1.5 text-red-400 text-sm font-medium">
                                <XCircle className="w-4 h-4" />
                                Reddedildi
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                onClick={() => navigate(createPageUrl('PublicProfile'), {
                                  state: {
                                    user: application.user,
                                    context: 'incoming_application',
                                    applicationId: application.id,
                                    projectId: application.project.id,
                                    onAccept: true
                                  }
                                })}
                              >
                                <UserSearch className="w-4 h-4 mr-1.5" />
                                Profili İncele & Karar Ver
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {pendingApplications.length === 0 && (
                <div className="text-center py-16">
                  <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Henüz bekleyen başvuru yok</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}