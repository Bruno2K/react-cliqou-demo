
"use client";

import React from 'react';
import type { LinkItem, ThemeSettings, ProfilePreviewProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, getContrastColor } from '@/lib/utils';
import { IconRenderer, UserCircle, Eye, Smartphone, Tablet, Monitor } from '@/components/icons';
import Image from 'next/image';
import { Button } from '@/components/ui/button';


export const ProfilePreview: React.FC<ProfilePreviewProps> = ({ 
  links, 
  theme, 
  activeDeviceView = 'desktop',
  showDeviceSelector = true,
  onDeviceChange 
}) => {
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
    <Card className={cn(
        "shadow-lg overflow-hidden", 
        activeDeviceView === 'desktop' && !showDeviceSelector ? 'w-full h-full min-h-[600px]' : deviceWidthClasses[activeDeviceView]
      )}
    >
       <CardHeader className={cn(
        "flex flex-col items-start gap-2 p-3 sm:p-4 md:p-6 sm:flex-row sm:items-center sm:justify-between",
        !showDeviceSelector && "hidden" // Hide header if device selector is off
      )}>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Eye size={18} className="sm:w-5 sm:h-5"/>
          Live Preview
        </CardTitle>
        {showDeviceSelector && onDeviceChange && (
          <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto">
            <Button variant={activeDeviceView === 'mobile' ? 'default' : 'outline'} size="icon" className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10" onClick={() => onDeviceChange('mobile')} aria-label="Mobile preview"> <Smartphone size={16} className="sm:size-18 md:size-20"/> </Button>
            <Button variant={activeDeviceView === 'tablet' ? 'default' : 'outline'} size="icon" className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10" onClick={() => onDeviceChange('tablet')} aria-label="Tablet preview"> <Tablet size={16} className="sm:size-18 md:size-20"/> </Button>
            <Button variant={activeDeviceView === 'desktop' ? 'default' : 'outline'} size="icon" className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10" onClick={() => onDeviceChange('desktop')} aria-label="Desktop preview"> <Monitor size={16} className="sm:size-18 md:size-20"/> </Button>
          </div>
        )}
      </CardHeader>
      <CardContent 
        className={cn(
          "h-full p-0 flex flex-col items-center justify-start relative",
          activeDeviceView === 'desktop' && showDeviceSelector ? "pt-0" : "", // Adjust padding if header is shown
          !showDeviceSelector ? "pt-0" : "pt-0" // Ensure no top padding if header is hidden for modal view
        )}
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
        <div className={cn(
            "relative z-10 flex flex-col items-center p-6 w-full max-w-md mx-auto",
            showDeviceSelector ? "pt-6" : "pt-12" // More top padding if no header
        )}>
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
                  ringColor: theme.accentColor, // For focus ring, if needed via Tailwind utility
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

