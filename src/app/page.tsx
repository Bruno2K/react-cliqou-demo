
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { LinkItem, ThemeSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'; // Added DialogTitle
import { ThemeEditor } from '@/components/dashboard/theme-editor';
import { ProfilePreview } from '@/components/dashboard/profile-preview';
import { EditableLinkItem } from '@/components/dashboard/editable-link-item';
import { LinkForm } from '@/components/dashboard/link-form';
import { ThemeToggle } from '@/components/theme-toggle';
import { PlusCircle, Link as LinkIconLucide, Eye as EyeIcon } from '@/components/icons'; // Renamed Eye to EyeIcon to avoid conflict
import { useToast } from "@/hooks/use-toast";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';


const initialTheme: ThemeSettings = {
  primaryColor: '#3F51B5', // Deep Indigo
  backgroundColor: '#F0F2F5', // Light Gray
  accentColor: '#9575CD', // Soft Violet
  buttonStyle: 'rounded-lg',
  fontFamily: 'var(--font-inter)', // Default to Inter
  username: 'Your Name',
  bio: 'Your catchy bio goes here! ✨',
  profileImageUrl: 'https://placehold.co/100x100.png?text=Avatar',
  backgroundImageUrl: '',
};

const initialLinks: LinkItem[] = [
  { id: '1', title: 'My Portfolio Website', url: 'https://example.com', isActive: true, iconName: 'Briefcase' },
  { id: '2', title: 'Follow me on Twitter', url: 'https://twitter.com/username', isActive: true, iconName: 'Twitter' },
  { id: '3', title: 'Connect on LinkedIn', url: 'https://linkedin.com/in/username', isActive: false, iconName: 'Linkedin' },
];


export default function DashboardPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [theme, setTheme] = useState<ThemeSettings>(initialTheme);
  const [isMounted, setIsMounted] = useState(false);
  const [activeDeviceView, setActiveDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    // Load from localStorage on mount
    const savedLinks = localStorage.getItem('linkedup-links');
    const savedTheme = localStorage.getItem('linkedup-theme');
    if (savedLinks) setLinks(JSON.parse(savedLinks));
    else setLinks(initialLinks);
    if (savedTheme) setTheme(JSON.parse(savedTheme));
    else setTheme(initialTheme);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('linkedup-links', JSON.stringify(links));
      localStorage.setItem('linkedup-theme', JSON.stringify(theme));
    }
  }, [links, theme, isMounted]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleThemeChange = (newThemeSettings: Partial<ThemeSettings>) => {
    setTheme(prevTheme => ({ ...prevTheme, ...newThemeSettings }));
  };

  const handleOpenAddLink = () => {
    setEditingLink(null);
    setIsLinkFormOpen(true);
  };

  const handleEditLink = (linkToEdit: LinkItem) => {
    setEditingLink(linkToEdit);
    setIsLinkFormOpen(true);
  };

  const handleDeleteLink = (id: string) => {
    setLinks(prevLinks => prevLinks.filter(link => link.id !== id));
    toast({ title: "Link Deleted", description: "The link has been successfully removed." });
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    setLinks(prevLinks => prevLinks.map(link => link.id === id ? { ...link, isActive } : link));
  };
  
  const handleSaveLink = (linkToSave: LinkItem) => {
    if (editingLink) {
      setLinks(prevLinks => prevLinks.map(l => l.id === linkToSave.id ? linkToSave : l));
      toast({ title: "Link Updated", description: "Your link has been successfully updated." });
    } else { 
      setLinks(prevLinks => [...prevLinks, { ...linkToSave, id: Date.now().toString() }]); // Ensure new links get an ID
      toast({ title: "Link Added", description: "New link successfully created." });
    }
    setIsLinkFormOpen(false);
    setEditingLink(null);
  };
  
  const linkIds = useMemo(() => links.map(link => link.id), [links]);

  if (!isMounted) {
    return <div className="flex items-center justify-center min-h-screen bg-background"><p>Loading LinkedUp...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-12 sm:h-14 items-center justify-between px-3 sm:px-6 lg:px-8">
          <h1 className="text-lg sm:text-xl font-bold text-primary">LinkedUp</h1>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button onClick={() => setIsPreviewModalOpen(true)} className="lg:hidden" variant="outline" size="sm">
              <EyeIcon size={16} className="mr-1 sm:mr-2" /> Preview
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container py-3 sm:py-4 px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          {/* Left Panel: Editor */}
          <div className="w-full lg:w-2/5 space-y-3 sm:space-y-4">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-col items-start gap-2 p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <LinkIconLucide size={18} className="sm:size-20" /> 
                  Manage Links
                </CardTitle>
                <Button onClick={handleOpenAddLink} size="sm" className="text-xs px-2 py-1 h-auto sm:text-sm sm:px-3 sm:py-1.5 sm:h-auto self-start sm:self-center">
                  <PlusCircle size={14} className="mr-1 sm:mr-1.5" /> Add Link
                </Button>
              </CardHeader>
              <CardContent className="p-2 sm:p-3">
                {links.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4 text-sm sm:text-base">No links yet. Add your first link!</p>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
                  >
                    <SortableContext items={linkIds} strategy={verticalListSortingStrategy}>
                      {links.map(link => (
                        <EditableLinkItem
                          key={link.id}
                          link={link}
                          onEdit={handleEditLink}
                          onDelete={handleDeleteLink}
                          onToggleActive={handleToggleActive}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>
            <ThemeEditor theme={theme} onThemeChange={handleThemeChange} />
          </div>

          {/* Right Panel: Preview (Desktop) */}
          <div className="hidden lg:block w-full lg:w-3/5 sticky top-[calc(3rem+0.75rem)] sm:top-[calc(3.5rem+1rem)] self-start">
            <Card className="shadow-lg">
              {/* The CardHeader was removed from here to avoid duplication with ProfilePreview's own header */}
              <CardContent className={activeDeviceView !== 'desktop' ? 'flex justify-center items-start p-2 sm:p-4 overflow-auto' : 'p-0'}>
                 <ProfilePreview 
                    links={links} 
                    theme={theme} 
                    activeDeviceView={activeDeviceView} 
                    showDeviceSelector={true} 
                    onDeviceChange={setActiveDeviceView} 
                 />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Link Form Dialog */}
      <Dialog open={isLinkFormOpen} onOpenChange={setIsLinkFormOpen}>
        <DialogContent className="w-[90vw] max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-lg">
          <LinkForm 
            link={editingLink} 
            onSave={handleSaveLink} 
            onClose={() => { setIsLinkFormOpen(false); setEditingLink(null); }} 
          />
        </DialogContent>
      </Dialog>

      {/* Preview Modal (Mobile) */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="p-0 w-auto h-auto bg-transparent border-none shadow-none data-[state=open]:zoom-in-90 sm:rounded-lg">
          <DialogTitle className="sr-only">Profile Page Preview</DialogTitle>
          <ProfilePreview links={links} theme={theme} activeDeviceView="mobile" showDeviceSelector={false} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
