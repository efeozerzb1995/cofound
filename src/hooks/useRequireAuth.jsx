import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/lib/AuthContext';

/**
 * Ensures the current route has an authenticated Supabase session.
 * If no session, redirects to Auth and returns user: null so no page content is shown.
 * @returns {{ isLoading: boolean, user: object | null }}
 */
export function useRequireAuth() {
  const navigate = useNavigate();
  const { user, isLoadingAuth, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('[useRequireAuth] auth state', {
      isLoadingAuth,
      isAuthenticated,
      hasUser: !!user,
    });
    if (!isLoadingAuth && !isAuthenticated) {
      navigate(createPageUrl('Auth'), { replace: true });
    }
  }, [isLoadingAuth, isAuthenticated, user, navigate]);

  return { isLoading: isLoadingAuth, user };
}
