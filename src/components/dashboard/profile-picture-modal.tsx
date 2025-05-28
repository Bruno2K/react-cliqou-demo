
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UploadCloud, UserCircle, X } from '@/components/icons';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newImageUrl: string) => void;
  currentImageUrl?: string;
  username?: string;
}

export const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentImageUrl,
  username,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Update preview if currentImageUrl changes while modal is open (e.g. saved elsewhere)
    if (isOpen) {
        setPreviewUrl(currentImageUrl || null);
        setSelectedFile(null); // Reset selected file if current image changes
    }
  }, [currentImageUrl, isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Max 2MB
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 2MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    if (previewUrl && previewUrl !== currentImageUrl) {
        // In a real app, you would upload 'selectedFile' here and get back a URL.
        // For this demo, we are using the data URL directly.
        onSave(previewUrl);
    }
    onClose();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null); 
    // To actually remove, onSave would pass null or an empty string
    // For now, just clears preview. User can save this cleared state.
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>
            Choose a new profile picture. Recommended size: 200x200px. Max 2MB.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
                <Avatar className="w-32 h-32 text-6xl border-2 border-border">
                    <AvatarImage src={previewUrl || undefined} alt={username || "User"} data-ai-hint="user avatar profile" />
                    <AvatarFallback>
                        {username ? username.charAt(0).toUpperCase() : <UserCircle size={60} />}
                    </AvatarFallback>
                </Avatar>
                {previewUrl && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute -top-2 -right-2 h-7 w-7 bg-background rounded-full group-hover:opacity-100 opacity-60 transition-opacity"
                        onClick={handleRemoveImage}
                        aria-label="Remove image"
                    >
                        <X size={16} />
                    </Button>
                )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/gif, image/webp"
              className="hidden"
            />
            <Button variant="outline" onClick={triggerFileInput} className="w-full sm:w-auto">
              <UploadCloud size={18} className="mr-2" />
              {selectedFile ? "Change Image" : "Select Image"}
            </Button>
            {selectedFile && (
              <p className="text-xs text-muted-foreground text-center">
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
