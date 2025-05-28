
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
  
  let formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  if (formattedName === "Github") formattedName = "GitHub"; 
  if (formattedName === "Linkedin") formattedName = "Linkedin"; 


  if (formattedName in LucideIcons) {
    return <DynamicIcon name={formattedName as IconName} className={className} size={size} />;
  }
  
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
  ToggleRight,
  ChevronDown,
  Bell,
  BellRing,
  ArrowLeft,
  CalendarDays,
  LogOut,
  LogIn, 
  Loader2, 
  AreaChart,
  Users,
  Percent,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  AlertCircle,
  LayoutDashboard,
  Activity,
  PieChartIcon, 
  BarChart3, 
  MapPin,
  TargetIcon, 
  ExternalLink,
  FileText,
  Mail,
  MailOpen,
  EyeOff,
  CheckCircle,
  XCircle,
  FilterIcon,
  MoreHorizontal,
  RadarIcon, 
  MapIcon, 
  MousePointerClick,
  Award,
  MessageSquare,
  ShoppingCart,
  Search,
  X,
  KeyRound, 
  MailCheck, 
  Copy, // Added Copy
  Edit, // Added Edit (distinct from Edit3)
  Share2, // Added Share2 for Share functionality
} = LucideIcons;

// Export Image as ImageIcon separately
export const { Image: ImageIcon } = LucideIcons;

// Export Edit3 as EditorIcon for clarity if needed elsewhere, Edit3 is already exported
export const { Edit3: EditorIcon } = LucideIcons;
