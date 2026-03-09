import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { createPageUrl } from '@/utils';
import StepBasics from './StepBasics';
import StepAcademic from './StepAcademic';
import StepInterests from './StepInterests';

export default function OnboardingWizard({ open, onComplete }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userType: '',
    university: '',
    department: '',
    isGraduate: false,
    interests: [],
    goals: []
  });

  const handleSkipToLogin = () => {
    localStorage.setItem('ekipbul_onboarding_complete', 'true');
    navigate(createPageUrl('Auth'));
  };

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.userType !== '';
      case 2: return formData.university !== '' && formData.department !== '';
      case 3: return formData.interests.length > 0;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const stepTitles = {
    1: 'Temel Bilgiler',
    2: 'Akademik Geçmiş',
    3: 'İlgi Alanları ve Hedefler'
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-xl p-0 gap-0 [&>button]:hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Profilini Tamamla</h2>
            <button 
              onClick={handleSkipToLogin}
              className="text-sm text-slate-400 hover:text-emerald-400 transition-colors underline"
            >
              Zaten hesabın var mı? Giriş Yap
            </button>
          </div>
          <div className="flex items-center justify-between mb-3">
            <Progress value={progress} className="h-2 bg-slate-800 flex-1" />
            <span className="text-sm text-slate-400 ml-3">Adım {step}/{totalSteps}</span>
          </div>
          <p className="text-emerald-400 font-medium">{stepTitles[step]}</p>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && (
                <StepBasics 
                  value={formData.userType} 
                  onChange={(val) => updateFormData({ userType: val })} 
                />
              )}
              {step === 2 && (
                <StepAcademic 
                  university={formData.university}
                  department={formData.department}
                  isGraduate={formData.isGraduate}
                  onChange={updateFormData}
                />
              )}
              {step === 3 && (
                <StepInterests 
                  interests={formData.interests}
                  goals={formData.goals}
                  onChange={updateFormData}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex items-center justify-between">
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
            disabled={!canProceed()}
            className="bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50"
          >
            {step === totalSteps ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Tamamla
              </>
            ) : (
              <>
                İleri
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}