import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Zap, Quote, Mail, Lock, Github, Apple } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';

export default function Auth() {
  const navigate = useNavigate();
  const { needsOnboarding, markOnboardingComplete, isAuthenticated } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState('');

  useEffect(() => {
    const applySessionDecision = async (user) => {
      console.log('[Auth] applySessionDecision called', { hasUser: !!user, userId: user?.id });
      if (!user) return;
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log('[Auth] profiles query result', { userId: user.id, profile, profileError: profileError?.message ?? null });

        if (profileError) {
          console.error('Profil sorgulanırken hata:', profileError);
          return;
        }

        if (!profile) {
          console.log('[Auth] No profile found → allowing navigation without chat onboarding');
        } else {
          console.log('[Auth] Profile exists → navigating to Explore');
          navigate(createPageUrl('Explore'));
        }
      } catch (error) {
        console.error('Oturum sonrası karar verilirken hata:', error);
      }
    };

    const runCheck = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('[Auth] runCheck (initial getSession)', { hasSession: !!sessionData?.session, userId: sessionData?.session?.user?.id, sessionError: sessionError?.message ?? null });
      if (sessionError) {
        console.error('Oturum alınırken hata:', sessionError);
        return;
      }
      const user = sessionData?.session?.user ?? null;
      await applySessionDecision(user);
    };

    runCheck();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth] onAuthStateChange', { event, hasSession: !!session, userId: session?.user?.id });
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const user = session?.user ?? null;
        applySessionDecision(user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSocialLogin = async (provider) => {
    setLoadingProvider(provider);
    setIsLoading(true);

    try {
      let supabaseProvider;
      switch (provider) {
        case 'Google':
          supabaseProvider = 'google';
          break;
        case 'GitHub':
          supabaseProvider = 'github';
          break;
        default:
          toast.error(`${provider} ile giriş henüz desteklenmiyor.`);
          return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: supabaseProvider,
      });

      if (error) {
        toast.error(error.message || 'Giriş sırasında bir hata oluştu.');
      } else {
        toast.success('Yönlendiriliyorsun, lütfen bekle.');
      }
    } catch (err) {
      toast.error(err.message || 'Beklenmeyen bir hata oluştu.');
    } finally {
      setIsLoading(false);
      setLoadingProvider('');
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });

        if (error) {
          toast.error(error.message || 'Kayıt sırasında bir hata oluştu.');
        } else {
          toast.success('Kayıt başarılı! E-postanı kontrol et ve profilini tamamlayalım.');
          // Optionally start onboarding after email confirmation
          setShowOnboarding(true);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast.error(error.message || 'Giriş sırasında bir hata oluştu.');
        } else {
          toast.success('Giriş başarılı! Hoş geldin.');
          navigate(createPageUrl('Explore'));
        }
      }
    } catch (err) {
      toast.error(err.message || 'Beklenmeyen bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand & Testimonial (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">CoFound</span>
          </div>

          {/* Testimonial (generic placeholder) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-lg"
          >
            <Quote className="w-12 h-12 text-emerald-400 mb-6 opacity-50" />
            <blockquote className="space-y-6">
              <p className="text-3xl font-semibold leading-relaxed text-white">
                "Doğru ekibi bulmak, fikirleri hayata geçirme hızını katlıyor. CoFound ile benzer hedeflere sahip insanlarla bir araya gelebilirsin."
              </p>
              <footer className="text-sm text-slate-300">
                Bir CoFound kullanıcısının deneyiminden ilhamla.
              </footer>
            </blockquote>
          </motion.div>

          {/* Footer */}
          <div className="text-sm text-slate-500">
            © 2026 CoFound A.Ş. Tüm hakları saklıdır.
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">CoFound</span>
          </div>

          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              {isSignUp ? 'Hesap Oluştur' : 'Hoş Geldin'}
            </h1>
            <p className="text-slate-600 text-lg">
              {isSignUp ? 'Ekibini bul, projeni hayata geçir' : 'Devam etmek için giriş yap'}
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              className="w-full h-12 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 font-medium transition-all shadow-sm rounded-xl"
            >
              {loadingProvider === 'Google' ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Google ile {isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
            </Button>

            <Button
              type="button"
              onClick={() => handleSocialLogin('LinkedIn')}
              disabled={isLoading}
              className="w-full h-12 bg-[#0A66C2] hover:bg-[#004182] text-white font-medium transition-all shadow-sm rounded-xl"
            >
              {loadingProvider === 'LinkedIn' ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              )}
              LinkedIn ile {isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
            </Button>

            {/* GitHub & Apple Row */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => handleSocialLogin('GitHub')}
                disabled={isLoading}
                className="h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium transition-all shadow-sm rounded-xl"
              >
                {loadingProvider === 'GitHub' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Github className="w-5 h-5 mr-2" />
                    GitHub
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={() => handleSocialLogin('Apple')}
                disabled={isLoading}
                className="h-12 bg-black hover:bg-slate-900 text-white font-medium transition-all shadow-sm rounded-xl"
              >
                {loadingProvider === 'Apple' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Apple className="w-5 h-5 mr-2" />
                    Apple
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">veya e-posta ile</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">
                  Ad Soyad
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Adınız Soyadınız"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl pl-4"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                E-posta
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Şifre
                </Label>
                {!isSignUp && (
                  <button
                    type="button"
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Şifremi Unuttum
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl pl-11"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-base rounded-xl shadow-lg shadow-emerald-500/30 transition-all"
            >
              {isLoading && loadingProvider === '' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isSignUp ? 'Hesap oluşturuluyor...' : 'Giriş yapılıyor...'}
                </>
              ) : (
                isSignUp ? 'Hesap Oluştur' : 'Giriş Yap'
              )}
            </Button>
          </form>

          {/* Toggle Sign Up / Login */}
          <div className="mt-6 text-center text-sm text-slate-600">
            {isSignUp ? 'Zaten hesabın var mı?' : 'Hesabın yok mu?'}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              {isSignUp ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </div>

          {/* Mobile Footer */}
          <div className="lg:hidden mt-12 text-center text-sm text-slate-500">
            © 2026 CoFound A.Ş.
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}