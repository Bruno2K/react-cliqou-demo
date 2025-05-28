
"use client";

import React from 'react';
import type { LinkItem, ThemeSettings, ProfilePreviewProps } from '@/types';
import { Card, CardContent } from '@/components/ui/card'; // Removed CardHeader
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, getContrastColor } from '@/lib/utils';
import { IconRenderer, UserCircle } from '@/components/icons';
import Image from 'next/image';
// Removed Button and device icons as they are no longer used here

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  links,
  theme,
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

  const profileName = theme.username || "Your Name";
  const profileBio = theme.bio || "Your catchy bio goes here! ✨";

  return (
    <div className="flex items-center justify-center py-4">
      {/* iPhone-like Frame */}
      <div className="relative mx-auto border-black dark:border-gray-800 bg-black border-[10px] rounded-[2.5rem] h-[712px] w-[352px] shadow-xl">
        <div className="w-[148px] h-[18px] bg-black top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[13px] top-[124px] rounded-l-lg"></div>
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[13px] top-[178px] rounded-l-lg"></div>
        <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[13px] top-[142px] rounded-r-lg"></div>
        <div className="rounded-[2rem] overflow-hidden w-[332px] h-[692px] bg-white dark:bg-gray-800">
          {/* Screen Content */}
          <Card
            className="w-full h-full overflow-y-auto shadow-none border-none rounded-none"
            style={{
              backgroundColor: theme.backgroundColor,
              fontFamily: theme.fontFamily,
              color: pageTextColor,
            }}
          >
            <CardContent className="p-0 flex flex-col items-center justify-start relative h-full">
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
              <div className="relative z-10 flex flex-col items-center p-6 pt-10 w-full max-w-md mx-auto">
                <Avatar className="w-24 h-24 mb-4 border-4" style={{ borderColor: theme.primaryColor }}>
                  <AvatarImage src={theme.profileImageUrl || "https://placehold.co/100x100.png"} alt={profileName} data-ai-hint="avatar user"/>
                  <AvatarFallback style={{ backgroundColor: theme.accentColor, color: getContrastColor(theme.accentColor) }}>
                    {profileName.substring(0, 2).toUpperCase() || <UserCircle size={48} />}
                  </AvatarFallback>
                </Avatar>

                <h1 className="text-2xl font-bold mb-1 text-center" style={{ color: pageTextColor }}>
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
        </div>
      </div>
    </div>
  );
};
