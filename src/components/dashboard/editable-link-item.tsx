"use client";

import React from 'react';
import type { LinkItem } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical, Trash2, Edit3, IconRenderer } from '@/components/icons';

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
    zIndex: isDragging ? 10 : undefined, // Elevate while dragging
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="mb-3 bg-card shadow-sm">
      <CardContent className="p-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" {...attributes} {...listeners} className="cursor-grab touch-none" aria-label="Drag to reorder">
          <GripVertical />
        </Button>
        
        <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-md flex items-center justify-center">
            <IconRenderer name={link.iconName} size={24} className="text-muted-foreground" />
        </div>

        <div className="flex-grow">
          <h3 className="font-semibold text-card-foreground truncate">{link.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{link.url}</p>
        </div>

        <Switch
          checked={link.isActive}
          onCheckedChange={(checked) => onToggleActive(link.id, checked)}
          aria-label={link.isActive ? "Deactivate link" : "Activate link"}
        />
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => onEdit(link)} aria-label="Edit link">
            <Edit3 />
          </Button>
          <Button variant="destructive" size="icon" onClick={() => onDelete(link.id)} aria-label="Delete link">
            <Trash2 />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
