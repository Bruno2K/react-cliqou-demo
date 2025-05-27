import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getContrastColor(hexColor: string): string {
  if (!hexColor || hexColor.length < 4) return '#000000'; // Default to black for invalid input

  let r: number, g: number, b: number;

  if (hexColor.length === 4) { // Handle shorthand hex (e.g., #RGB)
    r = parseInt(hexColor[1] + hexColor[1], 16);
    g = parseInt(hexColor[2] + hexColor[2], 16);
    b = parseInt(hexColor[3] + hexColor[3], 16);
  } else if (hexColor.length === 7) { // Handle full hex (e.g., #RRGGBB)
    r = parseInt(hexColor.slice(1, 3), 16);
    g = parseInt(hexColor.slice(3, 5), 16);
    b = parseInt(hexColor.slice(5, 7), 16);
  } else {
    return '#000000'; // Default for other invalid lengths
  }
  
  // Calculate YIQ (luminance)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return black for light backgrounds, white for dark backgrounds
  return yiq >= 128 ? '#000000' : '#FFFFFF';
}
