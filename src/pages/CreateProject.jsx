import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Check, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import StepBasics from '@/components/createProject/StepBasics';
import StepDetails from '@/components/createProject/StepDetails';
import StepTeam from '@/components/createProject/StepTeam';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';

export default function CreateProject() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    program: '',
    description: '',
    tags: [],
    roles: []
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.title !== '' && formData.category !== '' && formData.program !== '';
      case 2:
        return formData.problem && formData.solution && formData.targetAudience &&
          formData.productStatus && formData.currentFocus && formData.whatMakesYouDifferent &&
          formData.whatLookingFor && formData.whatLookingFor.length > 0;
      case 3:
        return formData.roles.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handlePublish();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePublish = async () => {
    if (!user) {
      toast.error('Giriş yapman gerekiyor.');
      return;
    }

    setIsPublishing(true);

    const description = [
      formData.problem && `Problem: ${formData.problem}`,
      formData.solution && `Çözüm: ${formData.solution}`,
      formData.whatMakesYouDifferent && `Fark: ${formData.whatMakesYouDifferent}`,
      formData.description && formData.description,
    ].filter(Boolean).join('\n\n');

    const { data, error } = await supabase
      .from('projects')
      .insert({
        owner_id: user.id,
        title: formData.title,
        description,
        category: formData.category,
        program: formData.program === 'Diğer' ? formData.programOther : formData.program,
        location: null,
        stage: formData.productStatus || null,
        is_paid: false,
        is_verified: false,
        seeking: formData.roles.map(r => r.role),
        skills: formData.roles.flatMap(r => r.skills),
        tags: formData.tags,
      })
      .select()
      .single();

    console.log('insert result:', data, error);
    console.log('user id:', user?.id);

    setIsPublishing(false);

    if (error) {
      console.error(error);
      toast.error('Proje kaydedilemedi: ' + error.message);
      return;
    }

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    toast.success('Projen Yayında! 🚀', { description: 'Ekip üyeleri aramaya başla!' });

    setTimeout(() => {
      navigate(`/project/${data.id}`);
    }, 1500);
  };

  const stepTitles = {
    1: 'Temel Bilgiler',
    2: 'Detaylar & AI Magic',
    3: 'Aranan Yetenekler'
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-4"
          >
            <Rocket className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Yeni Proje</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Proje Oluştur</h1>
          <p className="text-slate-400">Hayalindeki ekibi bul, projeni gerçekleştir</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-emerald-400 font-medium">{stepTitles[step]}</span>
            <span className="text-sm text-slate-400">Adım {step}/{totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-700" />
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && <StepBasics data={formData} onChange={updateFormData} />}
              {step === 2 && <StepDetails data={formData} onChange={updateFormData} />}
              {step === 3 && <StepTeam data={formData} onChange={updateFormData} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isPublishing}
            className="bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50"
          >
            {step === totalSteps ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                {isPublishing ? 'Yayınlanıyor...' : 'Yayınla'}
              </>
            ) : (
              <>
                İleri
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}