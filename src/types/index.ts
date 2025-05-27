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
