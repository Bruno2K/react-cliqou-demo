
// src/components/dashboard/notifications/notification-detail-modal.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { FullNotificationItem } from '@/types';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BellRing, Trash2, Eye, EyeOff, ExternalLink, X } from '@/components/icons';

interface NotificationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: FullNotificationItem | null;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  isOpen,
  onClose,
  notification,
  onToggleRead,
  onDelete,
}) => {
  if (!notification) {
    return null;
  }

  const handleToggleRead = () => {
    onToggleRead(notification.id);
    // onClose(); // Optionally close modal after action
  };

  const handleDelete = () => {
    onDelete(notification.id);
    onClose(); // Close modal after delete
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        // Base ShadCN DialogContent classes (for positioning, animation, etc.)
        "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        // Custom responsive width and height constraints
        "w-[95vw] md:w-full md:max-w-xl lg:max-w-2xl",
        "max-h-[85vh] flex flex-col"
      )}>
        <DialogHeader className="pr-10"> {/* Add padding for the close button */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {notification.icon && React.isValidElement(notification.icon)
                ? React.cloneElement(notification.icon as React.ReactElement<any>, { size: 28, className: cn(notification.icon.props.className, "opacity-80") })
                : <BellRing size={28} className="opacity-80" />}
            </div>
            <div>
              <DialogTitle className="text-xl text-left">{notification.title}</DialogTitle>
              <p className="text-xs text-muted-foreground text-left">
                {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: ptBR })}
                {notification.category && (
                  <span className="ml-2 capitalize border px-1.5 py-0.5 rounded-sm text-xs bg-muted">
                    {notification.category}
                  </span>
                )}
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-[150px]"> {/* Ensured min-height for content */}
          <DialogDescription className="text-sm text-foreground whitespace-pre-wrap py-2">
            {notification.description}
          </DialogDescription>
        </ScrollArea>
        
        <DialogFooter className="mt-auto pt-4 border-t flex flex-col-reverse gap-y-2 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-col-reverse gap-y-2 sm:flex-row sm:gap-x-2 sm:items-center">
            <Button variant="outline" onClick={handleToggleRead} size="sm" className="w-full sm:w-auto">
              {notification.isRead ? <EyeOff size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
              {notification.isRead ? 'Marcar como Não Lida' : 'Marcar como Lida'}
            </Button>
            <Button variant="destructive" onClick={handleDelete} size="sm" className="w-full sm:w-auto">
              <Trash2 size={16} className="mr-2" />
              Excluir
            </Button>
            {notification.link && (
              <Button variant="secondary" size="sm" asChild className="w-full sm:w-auto">
                <a href={notification.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} className="mr-2" />
                  Ir para Link
                </a>
              </Button>
            )}
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="sm" className="w-full sm:w-auto">Fechar</Button>
          </DialogClose>
        </DialogFooter>
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogContent>
    </Dialog>
  );
};

// Need to import DialogPrimitive for the explicit close button to work as intended
import * as DialogPrimitive from "@radix-ui/react-dialog";
