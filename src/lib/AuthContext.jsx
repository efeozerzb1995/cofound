import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null); // Kept for compatibility
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Clear legacy localStorage auth/user data from older implementations
        try {
          localStorage.removeItem('user_session');
          localStorage.removeItem('ekipbul_onboarding_complete');
          localStorage.removeItem('ekipbul_user_authenticated');
          localStorage.removeItem('ekipbul_auth_provider');
          localStorage.removeItem('userProfile');
          localStorage.removeItem('onboardingCompleted');
        } catch (storageError) {
          console.error('Legacy auth storage cleanup failed:', storageError);
        }

        // On first load (including after OAuth redirect), hydrate from existing session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Initial session fetch failed:', sessionError);
        } else {
          const currentUser = sessionData?.session?.user ?? null;
          setUser(currentUser);
          setIsAuthenticated(!!currentUser);
          if (currentUser) {
            await checkNeedsOnboarding(currentUser);
          } else {
            setNeedsOnboarding(false);
          }
        }
      } catch (error) {
        console.error('Unexpected error while initializing auth session:', error);
      } finally {
        // Continue with the existing app state checks
        await checkAppState();
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsLoadingAuth(false);
      }

      // Do not set authError here; just reflect session state
      if (!currentUser) {
        setAuthError(null);
        setNeedsOnboarding(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        await checkNeedsOnboarding(currentUser);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  const checkNeedsOnboarding = async (currentUser) => {
    try {
      if (!currentUser) {
        setNeedsOnboarding(false);
        return;
      }
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (profileError) {
        console.error('Onboarding profile check failed:', profileError);
        // On error, don't force onboarding; fail soft
        setNeedsOnboarding(false);
        return;
      }

      setNeedsOnboarding(!profile);
    } catch (error) {
      console.error('Onboarding check unexpected error:', error);
      setNeedsOnboarding(false);
    }
  };

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);
      await checkUserAuth();
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      const currentUser = sessionData?.session?.user ?? null;
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      if (!currentUser) {
        setNeedsOnboarding(false);
      }
      // No hard error when not authenticated; routes can handle public vs private access
      setAuthError(null);
      setIsLoadingAuth(false);
    } catch (error) {
      console.error('User auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);

      setAuthError({
        type: 'unknown',
        message: error.message || 'Failed to check authentication'
      });
    }
  };

  const logout = (shouldRedirect = true) => {
    supabase.auth.signOut().finally(() => {
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);

      if (shouldRedirect) {
        window.location.href = '/Auth';
      }
    });
  };

  const navigateToLogin = () => {
    window.location.href = '/Auth';
  };

  const markOnboardingComplete = () => {
    setNeedsOnboarding(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState,
      needsOnboarding,
      markOnboardingComplete
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
