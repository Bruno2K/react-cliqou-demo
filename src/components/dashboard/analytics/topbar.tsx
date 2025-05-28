
"use client";

import React, { useState, useEffect } from 'react';
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
  onPeriodChange: (period: string, dateRange?: DateRange) => void; // Modified to optionally accept dateRange
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

export const AnalyticsTopbar: React.FC<AnalyticsTopbarProps> = ({
  username,
  notificationCount = 0,
  selectedPeriod,
  onPeriodChange,
  onLogout,
  className,
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);

  useEffect(() => {
    // Reset date range if period changes away from custom
    if (selectedPeriod !== 'custom' && dateRange) {
      setDateRange(undefined);
    }
  }, [selectedPeriod, dateRange]);

  const handlePeriodSelect = (value: string) => {
    if (value === 'custom') {
      onPeriodChange(value); // Inform parent that mode is custom
      // Optionally, open the date picker popover immediately
      // setIsDatePopoverOpen(true); 
    } else {
      onPeriodChange(value);
      setDateRange(undefined); // Clear date range for non-custom periods
    }
  };

  const handleDateRangeApply = () => {
    setIsDatePopoverOpen(false);
    if (dateRange?.from && dateRange?.to) {
      onPeriodChange('custom', dateRange); // Pass the selected range to the parent
    } else if (dateRange?.from && !dateRange?.to) {
      // If only 'from' is selected, treat it as a single day range for now, or adjust as needed
      onPeriodChange('custom', {from: dateRange.from, to: dateRange.from });
    }
  };
  
  const getPeriodLabel = () => {
    if (selectedPeriod === 'custom') {
      return periodOptions.find(p => p.value === 'custom')?.label || 'Customizado';
    }
    return periodOptions.find(p => p.value === selectedPeriod)?.label || 'Selecionar Período';
  };

  const getDateRangeLabel = () => {
    if (dateRange?.from) {
      if (dateRange.to) {
        return `${format(dateRange.from, "dd/MM/yy")} - ${format(dateRange.to, "dd/MM/yy")}`;
      }
      return format(dateRange.from, "dd/MM/yy");
    }
    return "Selecionar Datas";
  };


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
                <span className="truncate">{getDateRangeLabel()}</span>
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
                <Button size="sm" onClick={handleDateRangeApply} disabled={!dateRange?.from || !dateRange?.to}>Aplicar</Button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        <Button variant="ghost" size="icon" className="relative rounded-full h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10">
          <Bell size={18} className="sm:size-20" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2.5 sm:h-2.5 sm:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-primary"></span>
            </span>
          )}
          <span className="sr-only">Notificações</span>
        </Button>

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
