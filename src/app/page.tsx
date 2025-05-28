'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactElement } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { LoadingScreen } from '@/components/loading-screen';

export default function HomePage(): ReactElement {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Ensure this only runs on the client after initial checks
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading screen while auth state is being determined or redirection is pending
  if (isLoading) {
    return <LoadingScreen message="Initializing..." />;
  }

  // Fallback loading screen during the brief moment before redirection takes effect
  return <LoadingScreen message="Redirecting..." />;
}
