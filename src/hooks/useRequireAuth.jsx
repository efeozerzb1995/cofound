import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { supabase } from '@/lib/supabase';

/**
 * Ensures the current route has an authenticated Supabase session.
 * If no session, redirects to Auth and returns user: null so no page content is shown.
 * @returns {{ isLoading: boolean, user: object | null }}
 */
export function useRequireAuth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Log whenever loading state changes (helps debug prod hangs)
  useEffect(() => {
    console.log('[useRequireAuth] isLoading changed:', isLoading);
  }, [isLoading]);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const { data: sessionData, error } = await supabase.auth.getSession();
        if (cancelled) return;
        if (error) {
          console.error('useRequireAuth: session error', error);
          navigate(createPageUrl('Auth'), { replace: true });
          setIsLoading(false);
          return;
        }
        const sessionUser = sessionData?.session?.user ?? null;
        if (!sessionUser) {
          navigate(createPageUrl('Auth'), { replace: true });
          setUser(null);
        } else {
          setUser(sessionUser);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('useRequireAuth:', err);
          navigate(createPageUrl('Auth'), { replace: true });
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          console.log('[useRequireAuth] setIsLoading(false) after getSession');
          setIsLoading(false);
        }
      }
    };

    check();
    return () => { cancelled = true; };
  }, [navigate]);

  // Fallback: if for any reason loading never flips, force it off after 3s
  useEffect(() => {
    if (!isLoading) return;
    const timeout = setTimeout(() => {
      console.warn('[useRequireAuth] Fallback timeout reached, forcing isLoading=false');
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  return { isLoading, user };
}
