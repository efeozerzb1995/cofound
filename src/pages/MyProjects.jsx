import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Briefcase, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  MessageCircle,
  TrendingUp,
  BadgeCheck
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

// Mock data for projects and applications
const myProjects = [
  {
    id: 1,
    title: "Yapay Et Üretimi İçin Biyoreaktör Tasarımı",
    category: "BioTech",
    program: "TÜBİTAK 2209",
    applicants: [
      {
        id: 1,
        name: "Canan Yıldız",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        title: "Biyolog",
        university: "Koç Üniversitesi",
        pitch: "Hücre kültürü ve rejeneratif tıp alanında 2 yıl laboratuvar deneyimim var. TÜBİTAK 2209-A projesi yürüttüm.",
        matchScore: 92,
        status: "pending", // pending, accepted, rejected
        appliedAt: "2024-02-15",
        isVerified: true
      },
      {
        id: 2,
        name: "Mert Özkan",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        title: "Yazılımcı",
        university: "ODTÜ",
        pitch: "Python ve R ile biyoinformatik veri analizi yapabilirim. Machine learning modelleri geliştirebilirim.",
        matchScore: 85,
        status: "pending",
        appliedAt: "2024-02-14"
      },
      {
        id: 3,
        name: "Selin Aydın",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        title: "Grafik Tasarımcı",
        university: "İTÜ",
        pitch: "Bilimsel sunumlar ve poster tasarımı konusunda deneyimliyim. Projenizin görsel yönünü geliştirebilirim.",
        matchScore: 70,
        status: "pending",
        appliedAt: "2024-02-13"
      }
    ]
  }
];

export default function MyProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(myProjects);

  const handleAccept = (projectId, applicantId) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? {
              ...project,
              applicants: project.applicants.map(applicant =>
                applicant.id === applicantId
                  ? { ...applicant, status: 'accepted' }
                  : applicant
              )
            }
          : project
      )
    );

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    toast.success('Başvuru Kabul Edildi! 🎉', {
      description: 'Başvuruya otomatik mesaj gönderildi.'
    });
  };

  const handleReject = (projectId, applicantId) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? {
              ...project,
              applicants: project.applicants.map(applicant =>
                applicant.id === applicantId
                  ? { ...applicant, status: 'rejected' }
                  : applicant
              )
            }
          : project
      )
    );

    toast.info('Başvuru Reddedildi', {
      description: 'Başvuru sahibine bildirim gönderildi.'
    });
  };

  const handleViewApplicant = (applicant, projectId) => {
    navigate(createPageUrl('PublicProfile'), {
      state: {
        user: applicant,
        context: 'incoming_application',
        applicationId: applicant.id,
        projectId: projectId
      }
    });
  };

  const handleMessage = (applicantName) => {
    navigate(createPageUrl('Messages'));
    toast.success(`${applicantName} ile mesajlaşmaya yönlendiriliyorsunuz...`);
  };

  const getStats = (project) => {
    const total = project.applicants.length;
    const pending = project.applicants.filter(a => a.status === 'pending').length;
    const accepted = project.applicants.filter(a => a.status === 'accepted').length;

    return { total, pending, accepted };
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Bekliyor', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
      accepted: { label: 'Kabul Edildi', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
      rejected: { label: 'Reddedildi', className: 'bg-red-500/10 text-red-500 border-red-500/20' }
    };

    return badges[status];
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-8 h-8 text-emerald-400" />
            <h1 className="text-3xl font-bold text-white">Yönettiğim Projeler</h1>
          </div>
          <p className="text-slate-400">Başvuruları değerlendirin ve ekibinizi oluşturun</p>
        </motion.div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12 text-center">
              <Briefcase className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                Henüz proje yok
              </h3>
              <p className="text-slate-500 mb-6">İlk projenizi oluşturun ve ekip aramaya başlayın</p>
              <Button 
                onClick={() => navigate(createPageUrl('CreateProject'))}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                Proje Oluştur
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {projects.map((project) => {
              const stats = getStats(project);
              
              return (
                <AccordionItem 
                  key={project.id} 
                  value={`project-${project.id}`}
                  className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-800/50">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="outline" className="text-emerald-400 border-emerald-500/20">
                            {project.category}
                          </Badge>
                          <span className="text-slate-400">{project.program}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{stats.total}</div>
                          <div className="text-slate-400">Toplam</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
                          <div className="text-slate-400">Bekleyen</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">{stats.accepted}</div>
                          <div className="text-slate-400">Kabul</div>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-3 mt-4">
                      {project.applicants.map((applicant) => {
                        const statusBadge = getStatusBadge(applicant.status);
                        const isDecided = applicant.status !== 'pending';

                        return (
                          <motion.div
                            key={applicant.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Card className={`bg-slate-700/50 border-slate-600 ${isDecided ? 'opacity-75' : ''}`}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  {/* Avatar */}
                                  <Avatar 
                                    className="h-14 w-14 border-2 border-slate-600 cursor-pointer"
                                    onClick={() => handleViewApplicant(applicant, project.id)}
                                  >
                                    <AvatarImage src={applicant.avatar} />
                                    <AvatarFallback className="bg-slate-600 text-white">
                                      {applicant.name[0]}
                                    </AvatarFallback>
                                  </Avatar>

                                  {/* Info */}
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <h4 
                                          className="font-semibold text-white hover:text-emerald-400 cursor-pointer flex items-center gap-1"
                                          onClick={() => handleViewApplicant(applicant, project.id)}
                                        >
                                          {applicant.name}
                                          {applicant.isVerified && (
                                            <BadgeCheck className="w-4 h-4 text-blue-400" />
                                          )}
                                        </h4>
                                        <p className="text-sm text-slate-400">
                                          {applicant.title} • {applicant.university}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                          <TrendingUp className="w-3 h-3 mr-1" />
                                          %{applicant.matchScore} Match
                                        </Badge>
                                        <Badge className={statusBadge.className}>
                                          {statusBadge.label}
                                        </Badge>
                                      </div>
                                    </div>

                                    {/* Pitch */}
                                    <p className="text-sm text-slate-300 mb-3 italic">
                                      "{applicant.pitch}"
                                    </p>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                      {applicant.status === 'pending' && (
                                        <>
                                          <Button
                                            size="sm"
                                            onClick={() => handleAccept(project.id, applicant.id)}
                                            className="bg-green-500 hover:bg-green-600 text-white"
                                          >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Kabul Et
                                          </Button>
                                          <Button
                                            size="sm"
                                            onClick={() => handleReject(project.id, applicant.id)}
                                            variant="outline"
                                            className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                                          >
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Reddet
                                          </Button>
                                        </>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleMessage(applicant.name)}
                                        className="border-slate-600 text-slate-300 hover:bg-slate-600"
                                      >
                                        <MessageCircle className="w-4 h-4 mr-1" />
                                        Mesaj
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
}