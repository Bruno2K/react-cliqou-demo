
"use client";

import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import React from 'react';

// Create a type for all Lucide icon names
export type IconName = keyof typeof LucideIcons;

// A more specific list if needed, or use all available icons
const DynamicIcon = ({ name, ...props }: { name: IconName } & LucideProps) => {
  const IconComponent = LucideIcons[name] as React.FC<LucideProps>;

  if (!IconComponent) {
    // Fallback icon if the name is not found
    return <LucideIcons.Link {...props} />;
  }

  return <IconComponent {...props} />;
};

export const IconRenderer: React.FC<{ name?: string; className?: string; size?: number }> = ({ name, className, size = 20 }) => {
  if (!name) return <LucideIcons.Link className={className} size={size} />;
  
  // Capitalize first letter and ensure camelCase for icon names if needed (e.g., "linkedin" -> "Linkedin")
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

  if (formattedName in LucideIcons) {
    return <DynamicIcon name={formattedName as IconName} className={className} size={size} />;
  }
  
  // Fallback for icons not directly in Lucide or simple custom SVGs
  // For now, default to a generic link icon
  return <LucideIcons.Link className={className} size={size} />;
};

// Export commonly used icons for convenience if needed
export const { 
  Link, 
  Briefcase, 
  Linkedin, 
  Github, 
  Palette, 
  Sparkles, 
  GripVertical, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Settings, 
  UserCircle, 
  ArrowDown, 
  ArrowUp, 
  ToggleLeft, 
  ToggleRight 
} = LucideIcons;

// Export Image as ImageIcon separately
export const { Image: ImageIcon } = LucideIcons;
