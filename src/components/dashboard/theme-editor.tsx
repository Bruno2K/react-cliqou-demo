"use client";

import React from 'react';
import type { ThemeSettings } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Palette } from '@/components/icons';
import { ColorInput } from '@/components/shared/color-input';

interface ThemeEditorProps {
  theme: ThemeSettings;
  onThemeChange: (newTheme: Partial<ThemeSettings>) => void;
}

const fontOptions = [
  { label: 'Geist Sans (Modern)', value: 'var(--font-geist-sans)' },
  { label: 'Inter (Clean & Legible)', value: 'var(--font-inter)' },
  { label: 'System Default', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' },
  { label: 'Monospace', value: 'var(--font-geist-mono)'},
];

const buttonStyleOptions: { label: string; value: ThemeSettings['buttonStyle'] }[] = [
  { label: 'Sharp', value: 'sharp' },
  { label: 'Slightly Rounded', value: 'rounded-sm' },
  { label: 'Rounded', value: 'rounded-md' },
  { label: 'Very Rounded', value: 'rounded-lg' },
  { label: 'Pill Shaped', value: 'rounded-full' },
];


export const ThemeEditor: React.FC<ThemeEditorProps> = ({ theme, onThemeChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onThemeChange({ [e.target.name]: e.target.value });
  };
  
  const handleColorChange = (name: keyof ThemeSettings, value: string) => {
    onThemeChange({ [name]: value });
  };

  const handleSelectChange = (name: keyof ThemeSettings, value: string) => {
    onThemeChange({ [name]: value });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Palette size={24} />
          Customize Your Page
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ColorInput
            label="Primary Color"
            id="primaryColor"
            value={theme.primaryColor}
            onChange={(value) => handleColorChange('primaryColor', value)}
          />
          <ColorInput
            label="Background Color"
            id="backgroundColor"
            value={theme.backgroundColor}
            onChange={(value) => handleColorChange('backgroundColor', value)}
          />
        </div>
        <ColorInput
            label="Accent Color (e.g. link hover)"
            id="accentColor"
            value={theme.accentColor}
            onChange={(value) => handleColorChange('accentColor', value)}
          />

        <div>
          <Label htmlFor="fontFamily" className="mb-1.5 block text-sm font-medium">Font Family</Label>
          <Select
            name="fontFamily"
            value={theme.fontFamily}
            onValueChange={(value) => handleSelectChange('fontFamily', value)}
          >
            <SelectTrigger id="fontFamily">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map(font => (
                <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="buttonStyle" className="mb-1.5 block text-sm font-medium">Button Style</Label>
          <Select
            name="buttonStyle"
            value={theme.buttonStyle}
            onValueChange={(value) => handleSelectChange('buttonStyle', value as ThemeSettings['buttonStyle'])}
          >
            <SelectTrigger id="buttonStyle">
              <SelectValue placeholder="Select button style" />
            </SelectTrigger>
            <SelectContent>
              {buttonStyleOptions.map(style => (
                <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="username" className="mb-1.5 block text-sm font-medium">Username</Label>
          <Input 
            id="username" 
            name="username" 
            value={theme.username || ''} 
            onChange={handleInputChange}
            placeholder="Your Unique Username"
          />
        </div>
        <div>
          <Label htmlFor="bio" className="mb-1.5 block text-sm font-medium">Bio</Label>
          <Input 
            id="bio" 
            name="bio" 
            value={theme.bio || ''} 
            onChange={handleInputChange}
            placeholder="Tell us about yourself"
          />
        </div>
        <div>
          <Label htmlFor="profileImageUrl" className="mb-1.5 block text-sm font-medium">Profile Image URL</Label>
          <Input 
            id="profileImageUrl" 
            name="profileImageUrl" 
            value={theme.profileImageUrl || ''} 
            onChange={handleInputChange}
            placeholder="https://example.com/image.png"
            data-ai-hint="profile picture"
          />
        </div>
        <div>
          <Label htmlFor="backgroundImageUrl" className="mb-1.5 block text-sm font-medium">Background Image URL</Label>
          <Input 
            id="backgroundImageUrl" 
            name="backgroundImageUrl" 
            value={theme.backgroundImageUrl || ''} 
            onChange={handleInputChange}
            placeholder="https://example.com/background.png"
            data-ai-hint="background abstract"
          />
        </div>
      </CardContent>
    </Card>
  );
};
