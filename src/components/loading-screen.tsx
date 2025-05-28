
'use client';

import { Loader2 } from 'lucide-react';

export function LoadingScreen({ message = "Loading application..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg">{message}</p>
    </div>
  );
}
