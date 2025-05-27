"use client";

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Shadcn input for text field
import { cn } from '@/lib/utils';

interface ColorInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (newColor: string) => void;
  className?: string;
}

export const ColorInput: React.FC<ColorInputProps> = ({ label, id, value, onChange, className }) => {
  const handleColorPickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleHexInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    if (!newValue.startsWith('#')) {
      newValue = `#${newValue}`;
    }
    // Basic validation for hex format (allowing incomplete input during typing)
    if (/^#([0-9A-Fa-f]{0,6})$/.test(newValue)) {
      onChange(newValue);
    } else if (newValue === "#") {
      onChange(newValue); // Allow typing starting with #
    }
  };
  
  const isValidHex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/i.test(value);

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="flex items-center gap-2 rounded-md border border-input p-2 focus-within:ring-2 focus-within:ring-ring">
        <input
          type="color"
          id={`${id}-picker`}
          value={isValidHex ? value : '#000000'} // Ensure color picker always has a valid hex
          onChange={handleColorPickerChange}
          className="h-8 w-10 cursor-pointer appearance-none rounded-sm border-none bg-transparent p-0 focus:outline-none"
          aria-label={`${label} color picker`}
        />
        <Input
          id={id}
          type="text"
          value={value.toUpperCase()}
          onChange={handleHexInputChange}
          className="h-8 flex-1 border-none bg-transparent p-0 text-sm focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          aria-label={`${label} hex code`}
          placeholder="#RRGGBB"
        />
      </div>
    </div>
  );
};
