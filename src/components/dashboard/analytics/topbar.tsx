
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, CalendarDays, LogOut, ChevronDown } from '@/components/icons';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface AnalyticsTopbarProps {
  username: string;
  notificationCount?: number;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  onLogout: () => void;
  className?: string;
}

const periodOptions = [
  { label: 'Hoje', value: 'today' },
  { label: 'Esta Semana', value: 'week' },
  { label: 'Este Mês', value: 'month' },
  { label: 'Este Ano', value: 'year' },
  { label: 'Customizado', value: 'custom' }, // Placeholder for custom date range picker
];

export const AnalyticsTopbar: React.FC<AnalyticsTopbarProps> = ({
  username,
  notificationCount = 0,
  selectedPeriod,
  onPeriodChange,
  onLogout,
  className,
}) => {
  const currentPeriodLabel = periodOptions.find(p => p.value === selectedPeriod)?.label || 'Selecionar Período';

  return (
    <header className={cn("sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:h-16 sm:px-6", className)}>
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      
      <div className="flex-1 text-lg font-semibold text-foreground hidden md:block">
        Dashboard Analítico
      </div>

      <div className="flex items-center gap-3 ml-auto sm:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 text-sm sm:text-base">
              <CalendarDays size={16} />
              <span>{currentPeriodLabel}</span>
              <ChevronDown size={16} className="opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Selecionar Período</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {periodOptions.map(option => (
              <DropdownMenuItem key={option.value} onClick={() => onPeriodChange(option.value)}>
                {option.label}
              </DropdownMenuItem>
            ))}
             {/* TODO: Add DateRangePicker for custom option */}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9 sm:h-10 sm:w-10">
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
          )}
          <span className="sr-only">Notificações</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 sm:h-10 sm:w-10">
              <Avatar className="h-full w-full">
                <AvatarImage src={`https://placehold.co/80x80.png?text=${username.charAt(0)}`} alt={username} data-ai-hint="user avatar" />
                <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{username}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {username.toLowerCase().replace(' ','')}@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/50 focus:text-red-700 dark:focus:text-red-300">
              <LogOut size={16} className="mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
