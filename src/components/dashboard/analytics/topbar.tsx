
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, CalendarDays, LogOut, ChevronDown, Info, AlertCircle, FileText, Users } from '@/components/icons'; // Added Users
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from '@/lib/utils';

interface AnalyticsTopbarProps {
  username: string;
  notificationCount?: number;
  selectedPeriod: string;
  onPeriodChange: (period: string, dateRange?: DateRange) => void;
  onLogout: () => void;
  className?: string;
}

const periodOptions = [
  { label: 'Hoje', value: 'today' },
  { label: 'Esta Semana', value: 'week' },
  { label: 'Este Mês', value: 'month' },
  { label: 'Este Ano', value: 'year' },
  { label: 'Customizado', value: 'custom' },
];

// Mock notification data
const mockNotifications = [
  { id: '1', title: 'Novo relatório semanal pronto!', description: 'O relatório de performance da semana passada já está disponível.', time: '5m atrás', icon: <FileText size={16} className="text-blue-500" /> },
  { id: '2', title: 'Alerta de Métrica', description: 'CTR caiu 15% nas últimas 24h.', time: '1h atrás', icon: <AlertCircle size={16} className="text-red-500" /> },
  { id: '3', title: 'Manutenção Programada', description: 'Sistema estará em manutenção hoje às 23h.', time: '3h atrás', icon: <Info size={16} className="text-yellow-500" /> },
  { id: '4', title: 'Novo Usuário Marco Atingido', description: 'Parabéns! Você atingiu 10.000 usuários únicos.', time: 'Ontem', icon: <Users size={16} className="text-green-500" /> },
];


export const AnalyticsTopbar: React.FC<AnalyticsTopbarProps> = ({
  username,
  notificationCount = 0, // Default to 0 if not provided
  selectedPeriod,
  onPeriodChange,
  onLogout,
  className,
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [currentNotifications, setCurrentNotifications] = useState(mockNotifications);

  useEffect(() => {
    if (selectedPeriod !== 'custom' && dateRange) {
      setDateRange(undefined);
    }
  }, [selectedPeriod, dateRange]);

  const handlePeriodSelect = (value: string) => {
    if (value === 'custom') {
      onPeriodChange(value);
    } else {
      onPeriodChange(value);
      setDateRange(undefined);
    }
  };

  const handleDateRangeApply = () => {
    setIsDatePopoverOpen(false);
    if (dateRange?.from && dateRange?.to) {
      onPeriodChange('custom', dateRange);
    } else if (dateRange?.from && !dateRange?.to) {
      onPeriodChange('custom', { from: dateRange.from, to: dateRange.from });
    }
  };
  
  const getPeriodLabel = () => {
    if (selectedPeriod === 'custom' && dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, "dd/MM/yy")} - ${format(dateRange.to, "dd/MM/yy")}`;
    }
    return periodOptions.find(p => p.value === selectedPeriod)?.label || 'Selecionar Período';
  };

  const getDateRangeButtonLabel = () => {
    if (dateRange?.from) {
      if (dateRange.to) {
        return `${format(dateRange.from, "dd/MM/yy")} - ${format(dateRange.to, "dd/MM/yy")}`;
      }
      return format(dateRange.from, "dd/MM/yy");
    }
    return "Selecionar Datas";
  };

  const displayedNotificationCount = currentNotifications.length > 0 ? currentNotifications.length : notificationCount;


  return (
    <header className={cn("sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:h-16 sm:px-6", className)}>
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      
      <div className="flex-1 text-lg font-semibold text-foreground hidden md:block">
        Dashboard Analítico
      </div>

      <div className="flex items-center gap-2 ml-auto sm:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1.5 text-xs sm:text-sm min-w-[120px] justify-between">
              <CalendarDays size={14} className="sm:size-16" />
              <span className="truncate">{getPeriodLabel()}</span>
              <ChevronDown size={14} className="opacity-70 sm:size-16" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Selecionar Período</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {periodOptions.map(option => (
              <DropdownMenuItem key={option.value} onClick={() => handlePeriodSelect(option.value)}>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedPeriod === 'custom' && (
          <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1.5 text-xs sm:text-sm min-w-[150px] justify-between">
                <CalendarDays size={14} className="text-muted-foreground sm:size-16" /> 
                <span className="truncate">{getDateRangeButtonLabel()}</span>
                 <ChevronDown size={14} className="opacity-70 sm:size-16" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
              />
              <div className="p-2 border-t flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsDatePopoverOpen(false)}>Cancelar</Button>
                <Button size="sm" onClick={handleDateRangeApply} disabled={!dateRange?.from}>Aplicar</Button> {/* Allow applying with only one date or ensure both selected */}
              </div>
            </PopoverContent>
          </Popover>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10">
              <Bell size={18} className="sm:size-20" />
              {displayedNotificationCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2.5 sm:h-2.5 sm:w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-full w-full bg-primary"></span>
                </span>
              )}
              <span className="sr-only">Notificações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 sm:w-96">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notificações</span>
              {currentNotifications.length > 0 && (
                <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => setCurrentNotifications([])}>Limpar todas</Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {currentNotifications.length > 0 ? (
              currentNotifications.map(notification => (
                <DropdownMenuItem key={notification.id} className="flex items-start gap-2.5 py-2.5 px-3 cursor-pointer hover:bg-muted/50">
                  {notification.icon && <div className="mt-0.5">{notification.icon}</div>}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">{notification.time}</p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled className="text-center text-muted-foreground py-3">
                Nenhuma notificação nova.
              </DropdownMenuItem>
            )}
             <DropdownMenuSeparator />
             <DropdownMenuItem className="justify-center text-sm text-primary hover:underline">
                Ver todas as notificações
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 sm:h-9 sm:w-9 md:h-10 md:w-10">
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

