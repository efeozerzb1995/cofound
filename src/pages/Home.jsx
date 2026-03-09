import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import HeroSection from '@/components/landing/HeroSection';
import FeatureCards from '@/components/landing/FeatureCards';
import TrendingProjects from '@/components/landing/TrendingProjects';
import HowItWorks from '@/components/landing/HowItWorks';
import FAQ from '@/components/landing/FAQ';
import CTASection from '@/components/landing/CTASection';
import { useAuth } from '@/lib/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoadingAuth } = useAuth();

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated) {
      navigate(createPageUrl('Explore'));
    }
  }, [isLoadingAuth, isAuthenticated, navigate]);

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