
import type React from 'react';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  imageUrl?: string;
  isActive: boolean;
  iconName?: string; // Store suggested/selected Lucide icon name
}

export interface ThemeSettings {
  primaryColor: string;
  backgroundColor: string;
  accentColor: string;
  buttonStyle: 'rounded-full' | 'rounded-lg' | 'rounded-md' | 'rounded-sm' | 'sharp';
  fontFamily: string; // e.g., 'Inter', 'Roboto', 'Geist Sans'
  backgroundImageUrl?: string;
  profileImageUrl?: string;
  username?: string;
  bio?: string;
}

export interface ProfilePreviewProps {
  links: LinkItem[];
  theme: ThemeSettings;
  // activeDeviceView?: 'mobile' | 'tablet' | 'desktop'; // Removed
  // showDeviceSelector?: boolean; // Removed
  // onDeviceChange?: (device: 'mobile' | 'tablet' | 'desktop') => void; // Removed
}

// For more detailed notifications page
export interface FullNotificationItem {
  id: string;
  icon: React.ReactNode; // Can be JSX element
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  category?: string; // e.g., 'reports', 'alerts', 'system', 'milestones', 'updates'
  link?: string; // Optional link for redirection
  // Potentially add other fields like sender, priority, etc.
}

export interface User {
  email: string;
  name?: string;
  profileImageUrl?: string; // Added for avatar in topbar
  // id?: string; // if you have a user ID
}
