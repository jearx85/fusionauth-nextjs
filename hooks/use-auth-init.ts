import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export const useAuthInit = () => {
  const router = useRouter();
  const { 
    isAuthenticated, 
    isLoading, 
    setLoading, 
    fetchUserData, 
    clearAuth 
  } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const userId = localStorage.getItem('fusionauth_userId');
      const token = localStorage.getItem('fusionauth_token');
      
      if (!userId || !token) {
        clearAuth();
        router.push('/login');
        return;
      }

      await fetchUserData(userId, token);
      setLoading(false);
    };

    initAuth();
  }, [router, fetchUserData, clearAuth, setLoading]);

  return { isAuthenticated, isLoading };
};