import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null); // Kept for compatibility

  useEffect(() => {
    const initAuth = async () => {
      try {
        // On first load (including after OAuth redirect), hydrate from existing session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Initial session fetch failed:', sessionError);
        } else {
          const currentUser = sessionData?.session?.user ?? null;
          setUser(currentUser);
          setIsAuthenticated(!!currentUser);
        }
      } catch (error) {
        console.error('Unexpected error while initializing auth session:', error);
      } finally {
        // Continue with the existing app state checks
        await checkAppState();
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      // Do not set authError here; just reflect session state
      if (!currentUser) {
        setAuthError(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      await checkUserAuth();
      setIsLoadingPublicSettings(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      });
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
      checkAppState
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
