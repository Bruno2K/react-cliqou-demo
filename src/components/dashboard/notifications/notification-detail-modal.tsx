
// src/components/dashboard/notifications/notification-detail-modal.tsx
"use client";

import type React from 'react';
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
import { BellRing, Trash2, Eye, EyeOff, ExternalLink, X } from '@/components/icons'; // Added X for close button

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
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
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

        <ScrollArea className="flex-1 pr-2 -mr-6 pl-1"> {/* Adjust padding for scrollbar */}
          <DialogDescription className="text-sm text-foreground whitespace-pre-wrap py-2">
            {notification.description}
          </DialogDescription>
        </ScrollArea>
        
        <DialogFooter className="mt-auto pt-4 border-t sm:justify-between gap-2 flex-wrap">
          <div className="flex gap-2 flex-wrap justify-start">
            <Button variant="outline" onClick={handleToggleRead} size="sm">
              {notification.isRead ? <EyeOff size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
              {notification.isRead ? 'Marcar como Não Lida' : 'Marcar como Lida'}
            </Button>
            <Button variant="destructive" onClick={handleDelete} size="sm">
              <Trash2 size={16} className="mr-2" />
              Excluir
            </Button>
            {notification.link && (
              <Button variant="secondary" size="sm" asChild>
                <a href={notification.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} className="mr-2" />
                  Ir para Link
                </a>
              </Button>
            )}
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="sm">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
