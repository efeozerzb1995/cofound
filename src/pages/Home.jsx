import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import HeroSection from '@/components/landing/HeroSection';
import FeatureCards from '@/components/landing/FeatureCards';
import TrendingProjects from '@/components/landing/TrendingProjects';
import HowItWorks from '@/components/landing/HowItWorks';
import FAQ from '@/components/landing/FAQ';
import CTASection from '@/components/landing/CTASection';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('ekipbul_user_authenticated') === 'true';
    const onboardingComplete = localStorage.getItem('ekipbul_onboarding_complete') === 'true';
    
    if (isAuthenticated && onboardingComplete) {
      navigate(createPageUrl('Explore'));
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950">
      <HeroSection />
      <FeatureCards />
      <TrendingProjects />
      <HowItWorks />
      <FAQ />
      <CTASection />
    </div>
  );
}