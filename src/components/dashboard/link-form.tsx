"use client";

import React, { useState, useEffect } from 'react';
import type { LinkItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ImageIcon, Sparkles, IconRenderer } from '@/components/icons';
import { suggestLinkIcons, type SuggestLinkIconsInput, type SuggestLinkIconsOutput } from '@/ai/flows/suggest-link-icons';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '@/components/ui/scroll-area';

interface LinkFormProps {
  link?: LinkItem | null; // if null, it's a new link
  onSave: (link: LinkItem) => void;
  onClose: () => void;
}

export const LinkForm: React.FC<LinkFormProps> = ({ link, onSave, onClose }) => {
  const [title, setTitle] = useState(link?.title || '');
  const [url, setUrl] = useState(link?.url || '');
  const [isActive, setIsActive] = useState(link ? link.isActive : true);
  const [iconName, setIconName] = useState(link?.iconName || '');
  const [imageUrl, setImageUrl] = useState(link?.imageUrl || ''); // Not used in preview for now
  
  const [suggestedIcons, setSuggestedIcons] = useState<string[]>([]);
  const [isSuggestingIcons, setIsSuggestingIcons] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (link) {
      setTitle(link.title);
      setUrl(link.url);
      setIsActive(link.isActive);
      setIconName(link.iconName || '');
      setImageUrl(link.imageUrl || '');
    } else {
      // Reset for new link
      setTitle('');
      setUrl('');
      setIsActive(true);
      setIconName('');
      setImageUrl('');
    }
    setSuggestedIcons([]);
  }, [link]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) {
      toast({ title: "Error", description: "Title and URL are required.", variant: "destructive" });
      return;
    }
    onSave({
      id: link?.id || Date.now().toString(), // Simple ID generation for new links
      title,
      url,
      isActive,
      iconName,
      imageUrl,
    });
  };

  const handleSuggestIcons = async () => {
    if (!title) {
      toast({ title: "Info", description: "Please enter a link title to suggest icons.", variant: "default" });
      return;
    }
    setIsSuggestingIcons(true);
    setSuggestedIcons([]);
    try {
      const result = await suggestLinkIcons({ linkText: title } as SuggestLinkIconsInput);
      setSuggestedIcons(result.icons || []);
      if (!result.icons || result.icons.length === 0) {
        toast({ title: "No Suggestions", description: "AI couldn't find specific icons for this title.", variant: "default" });
      }
    } catch (error) {
      console.error("Error suggesting icons:", error);
      toast({ title: "Error", description: "Failed to suggest icons.", variant: "destructive" });
    } finally {
      setIsSuggestingIcons(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{link ? 'Edit Link' : 'Add New Link'}</DialogTitle>
        <DialogDescription>
          {link ? 'Update the details of your link.' : 'Fill in the details for your new link.'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Awesome Link" required />
        </div>
        <div>
          <Label htmlFor="url">URL</Label>
          <Input id="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="iconName">Icon (Lucide Name)</Label>
          <div className="flex items-center gap-2">
            <Input id="iconName" value={iconName} onChange={(e) => setIconName(e.target.value)} placeholder="e.g., Home, Briefcase" />
            {iconName && <IconRenderer name={iconName} className="text-foreground" />}
            <Button type="button" variant="outline" size="icon" onClick={handleSuggestIcons} disabled={isSuggestingIcons} aria-label="Suggest Icons">
              <Sparkles className={isSuggestingIcons ? "animate-pulse" : ""} />
            </Button>
          </div>
          {isSuggestingIcons && <p className="text-sm text-muted-foreground">Suggesting icons...</p>}
          {suggestedIcons.length > 0 && (
            <ScrollArea className="h-24 rounded-md border p-2">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {suggestedIcons.map((icon, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    variant="outline"
                    className="flex flex-col items-center justify-center h-16 p-1"
                    onClick={() => { setIconName(icon); setSuggestedIcons([]); }}
                    title={`Use ${icon} icon`}
                  >
                    <IconRenderer name={icon} size={20} />
                    <span className="mt-1 text-xs truncate w-full text-center">{icon}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Image URL input (optional, for future use) */}
        {/*
        <div>
          <Label htmlFor="imageUrl">Image URL (Optional)</Label>
          <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.png" />
        </div>
        */}

        <div className="flex items-center justify-between">
          <Label htmlFor="isActive" className="flex items-center gap-2">
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
            Active
          </Label>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </DialogClose>
          <Button type="submit">Save Link</Button>
        </DialogFooter>
      </form>
    </>
  );
};
