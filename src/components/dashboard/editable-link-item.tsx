
"use client";

import React from 'react';
import type { LinkItem } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
// Removed Card and CardContent imports as we'll make it less card-like
import { GripVertical, Trash2, Edit3, IconRenderer } from '@/components/icons';
import { Label } from '@/components/ui/label'; 
import { cn } from '@/lib/utils';

interface EditableLinkItemProps {
  link: LinkItem;
  onEdit: (link: LinkItem) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id:string, isActive: boolean) => void;
}

export const EditableLinkItem: React.FC<EditableLinkItemProps> = ({ link, onEdit, onDelete, onToggleActive }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "mb-2 sm:mb-3 bg-card rounded-lg border border-border shadow-sm p-3", // Added padding here
        isDragging && "shadow-xl"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
        
        {/* Link Info Section (Drag, Icon, Title, URL) */}
        <div className="flex items-center gap-2 flex-grow min-w-0">
          <Button variant="ghost" size="icon" {...attributes} {...listeners} className="cursor-grab touch-none flex-shrink-0 h-8 w-8 sm:h-9 md:h-10 sm:w-9 md:w-10 p-1 text-muted-foreground hover:text-foreground" aria-label="Drag to reorder">
            <GripVertical size={16} className="sm:size-18 md:size-20" />
          </Button>
          
          <div className="flex-shrink-0 w-8 h-8 sm:w-9 md:w-10 sm:h-9 md:h-10 bg-muted rounded-md flex items-center justify-center">
              <IconRenderer name={link.iconName} size={16} className="text-muted-foreground sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px]" />
          </div>

          <div className="flex-grow min-w-0">
            <h3 className="font-semibold text-card-foreground truncate text-sm sm:text-base leading-tight">{link.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground truncate leading-tight">{link.url}</p>
          </div>
        </div>

        {/* Actions Section (Switch, Edit, Delete) */}
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-2 flex-shrink-0 mt-1 sm:mt-0 sm:pl-0">
          <div className="flex items-center justify-between gap-2 pl-10 sm:pl-0 sm:justify-start">
            <Label htmlFor={`link-active-${link.id}`} className="text-xs font-medium text-muted-foreground sm:hidden">
              Active:
            </Label>
            <Switch
              id={`link-active-${link.id}`}
              checked={link.isActive}
              onCheckedChange={(checked) => onToggleActive(link.id, checked)}
              aria-label={link.isActive ? `Deactivate link: ${link.title}` : `Activate link: ${link.title}`}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input scale-90 sm:scale-100"
            />
          </div>
          
          <div className="flex gap-1.5 sm:gap-2 justify-end pl-10 sm:pl-0 sm:justify-start">
            <Button variant="outline" size="icon" onClick={() => onEdit(link)} aria-label="Edit link" className="h-7 w-7 sm:h-8 sm:w-8 p-1">
              <Edit3 size={14} className="sm:size-16" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(link.id)} aria-label="Delete link" className="h-7 w-7 sm:h-8 sm:w-8 p-1 text-destructive hover:bg-destructive/10">
              <Trash2 size={14} className="sm:size-16" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
