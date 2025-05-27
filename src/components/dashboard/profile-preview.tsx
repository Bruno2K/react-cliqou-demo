"use client";

import React from 'react';
import type { LinkItem, ThemeSettings } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, getContrastColor } from '@/lib/utils';
import { IconRenderer, UserCircle } from '@/components/icons';
import Image from 'next/image';

interface ProfilePreviewProps {
  links: LinkItem[];
  theme: ThemeSettings;
  activeDeviceView?: 'mobile' | 'tablet' | 'desktop';
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({ links, theme, activeDeviceView = 'desktop' }) => {
  const textColor = getContrastColor(theme.primaryColor);
  const pageTextColor = getContrastColor(theme.backgroundColor);

  const getButtonClassName = () => {
    switch (theme.buttonStyle) {
      case 'rounded-full': return 'rounded-full';
      case 'rounded-lg': return 'rounded-lg';
      case 'rounded-md': return 'rounded-md';
      case 'rounded-sm': return 'rounded-sm';
      case 'sharp': return 'rounded-none';
      default: return 'rounded-lg';
    }
  };

  const deviceWidthClasses = {
    mobile: 'w-[360px] h-[640px]',
    tablet: 'w-[768px] h-[1024px]',
    desktop: 'w-full h-full min-h-[600px]',
  };
  
  const profileName = theme.username || "Your Name";
  const profileBio = theme.bio || "Your catchy bio goes here! ✨";

  return (
    <Card className={cn("shadow-lg overflow-hidden", deviceWidthClasses[activeDeviceView])}>
      <CardContent 
        className="h-full p-0 flex flex-col items-center justify-start relative"
        style={{ 
          backgroundColor: theme.backgroundColor,
          fontFamily: theme.fontFamily,
          color: pageTextColor,
        }}
      >
        {theme.backgroundImageUrl && (
          <Image
            src={theme.backgroundImageUrl}
            alt="Profile background"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0 opacity-80"
            data-ai-hint="background pattern"
          />
        )}
        <div className="relative z-10 flex flex-col items-center p-6 pt-12 w-full max-w-md mx-auto">
          <Avatar className="w-24 h-24 mb-4 border-4" style={{ borderColor: theme.primaryColor }}>
            <AvatarImage src={theme.profileImageUrl || "https://placehold.co/100x100.png"} alt={profileName} data-ai-hint="avatar user" />
            <AvatarFallback style={{ backgroundColor: theme.accentColor, color: getContrastColor(theme.accentColor) }}>
              {profileName.substring(0,2).toUpperCase() || <UserCircle size={48}/>}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="text-2xl font-bold mb-1" style={{ color: pageTextColor }}>
            {profileName}
          </h1>
          <p className="text-center text-sm mb-6" style={{ color: pageTextColor, opacity: 0.9 }}>
            {profileBio}
          </p>

          <div className="w-full space-y-3">
            {links.filter(link => link.isActive).map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center justify-center w-full p-4 text-center font-medium transition-transform duration-150 ease-in-out hover:scale-[1.02] focus:outline-none focus:ring-2",
                  getButtonClassName()
                )}
                style={{ 
                  backgroundColor: theme.primaryColor, 
                  color: textColor,
                  ringColor: theme.accentColor,
                 }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.accentColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.primaryColor}

              >
                {link.iconName && <IconRenderer name={link.iconName} className="mr-2" size={20} />}
                {link.title}
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
