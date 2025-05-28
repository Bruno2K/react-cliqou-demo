
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, ArrowLeft, Loader2, MailCheck } from '@/components/icons';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email) {
      setError('Email address is required.');
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    // For this demo, we'll just show a success message.
    setMessage('If an account with that email exists, a password reset link has been sent.');
    setEmail(''); // Clear the input
    setIsSubmitting(false);
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-muted/40 p-4 min-h-screen">
      <Card className="w-full max-w-md shadow-xl rounded-xl">
        <CardHeader className="space-y-1 text-center p-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <KeyRound size={32} className="text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Forgot Your Password?</CardTitle>
          <CardDescription>
            No worries! Enter your email address below and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-6">
            {message ? (
              <div className="flex flex-col items-center text-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md">
                <MailCheck size={48} className="text-green-600 dark:text-green-400 mb-3" />
                <p className="text-sm text-green-700 dark:text-green-300">{message}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="h-11 text-base"
                />
              </div>
            )}
            {error && !message && <p className="text-sm text-destructive pt-1">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4 p-6 pt-0">
            {!message && (
              <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            )}
            <Link href="/login" passHref>
              <Button variant="link" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                <ArrowLeft size={14} /> Back to Login
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
