
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { LogIn, Loader2 } from '@/components/icons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

 useEffect(() => {
    // If user is already authenticated and not loading, redirect from login page
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setIsLoggingIn(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      await login(email);
      // Login function in useAuth handles redirection
    } catch (err) {
      setError('Failed to login. Please try again.');
      console.error(err);
      setIsLoggingIn(false); // Ensure loggingIn state is reset on error
    }
    // No finally here, redirection or error handles setIsLoggingIn
  };
  
  // Don't render the form if we're still checking auth or already authenticated
  if (isLoading || (!isLoading && isAuthenticated)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">{isLoading ? "Loading..." : "Redirecting..."}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-xl">
        <CardHeader className="space-y-1 text-center p-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <LogIn size={32} className="text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Enter your credentials to access your LinkedUp dashboard.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoggingIn}
                className="h-11 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoggingIn}
                className="h-11 text-base"
              />
            </div>
            {error && <p className="text-sm text-destructive pt-1">{error}</p>}
          </CardContent>
          <CardFooter className="p-6 pt-2">
            <Button type="submit" className="w-full h-11 text-base" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        This is a demo login. Any non-empty email/password will work. <br /> No actual authentication is performed.
      </p>
    </div>
  );
}
