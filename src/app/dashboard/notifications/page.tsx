
// src/app/dashboard/notifications/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BellRing } from '@/components/icons';

export default function NotificationsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/30 p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <BellRing size={32} className="text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold text-foreground">
            Gerenciar Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Aqui você poderá visualizar, marcar como lidas e gerenciar todas as suas notificações.
          </p>
          <p className="text-muted-foreground mb-6">
            (Esta página está em desenvolvimento.)
          </p>
          <Link href="/dashboard/analytics" passHref>
            <Button variant="outline">
              <ArrowLeft size={16} className="mr-2" />
              Voltar para Analytics
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
