
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowUpRight, ArrowDownRight, Info } from '@/components/icons'; // Assuming Info icon for tooltip trigger
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  tooltipText: string;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  tooltipText,
  className,
}) => {
  const changeColor = changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const ChangeIcon = changeType === 'positive' ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        <div className="flex items-center text-xs mt-1">
          <span className={cn("flex items-center", changeColor)}>
            <ChangeIcon size={14} className="mr-1" />
            {change}
          </span>
          <span className="text-muted-foreground ml-1">vs último período</span>
        </div>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground focus:outline-none p-1 rounded-full hover:bg-muted/50">
                <Info size={16} />
                <span className="sr-only">Mais informações sobre {title}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" align="end" className="max-w-xs text-sm">
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};
