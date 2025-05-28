
'use client';

import { useEffect, useState, type ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LoadingScreen } from '@/components/loading-screen';

const HomePage = (): ReactElement => {
  const { isAuthenticated, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  // isRedirecting state might not be strictly necessary if redirects are fast,
  // but it helps clarify the component's current phase.
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Ensure this only runs on the client after initial checks
    if (!authIsLoading) {
      setIsRedirecting(true); // Signal that redirection logic is active
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [authIsLoading, isAuthenticated, router]);

  let loadingMessage = "Initializing...";
  if (authIsLoading) {
    loadingMessage = "Initializing...";
  } else if (isRedirecting) {
    // This message might only flash briefly if redirection is quick.
    loadingMessage = "Redirecting...";
  }
  
  // The component always returns LoadingScreen.
  // The useEffect handles the actual navigation.
  return <LoadingScreen message={loadingMessage} />;
};

export default HomePage;
