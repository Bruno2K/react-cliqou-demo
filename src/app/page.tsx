"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { LinkItem, ThemeSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ThemeEditor } from '@/components/dashboard/theme-editor';
import { ProfilePreview } from '@/components/dashboard/profile-preview';
import { EditableLinkItem } from '@/components/dashboard/editable-link-item';
import { LinkForm } from '@/components/dashboard/link-form';
import { ThemeToggle } from '@/components/theme-toggle';
import { PlusCircle, Smartphone, Tablet, Monitor, Settings, Link as LinkIconLucide, Eye } from '@/components/icons';
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

  const { toast } = useToast();

  useEffect(() => {
    // Load from localStorage on mount
    const savedLinks = localStorage.getItem('linkedup-links');
    const savedTheme = localStorage.getItem('linkedup-theme');
    if (savedLinks) setLinks(JSON.parse(savedLinks));
    else setLinks(initialLinks); // Set initial if nothing saved
    if (savedTheme) setTheme(JSON.parse(savedTheme));
    else setTheme(initialTheme);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Save to localStorage when links or theme change
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
    if (editingLink) { // Editing existing link
      setLinks(prevLinks => prevLinks.map(l => l.id === linkToSave.id ? linkToSave : l));
      toast({ title: "Link Updated", description: "Your link has been successfully updated." });
    } else { // Adding new link
      setLinks(prevLinks => [...prevLinks, linkToSave]);
      toast({ title: "Link Added", description: "New link successfully created." });
    }
    setIsLinkFormOpen(false);
    setEditingLink(null);
  };
  
  const linkIds = useMemo(() => links.map(link => link.id), [links]);

  if (!isMounted) {
    // Optional: show a loading skeleton or spinner
    return <div className="flex items-center justify-center min-h-screen bg-background"><p>Loading LinkedUp...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">LinkedUp</h1>
          <div className="flex items-center gap-2">
             <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel: Editor */}
          <div className="w-full lg:w-2/5 space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <LinkIconLucide size={24}/>
                  Manage Links
                </CardTitle>
                <Button onClick={handleOpenAddLink}>
                  <PlusCircle size={18} className="mr-2" /> Add Link
                </Button>
              </CardHeader>
              <CardContent>
                {links.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No links yet. Add your first link!</p>
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

          {/* Right Panel: Preview */}
          <div className="w-full lg:w-3/5 sticky top-24 self-start">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Eye size={24} />
                  Live Preview
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant={activeDeviceView === 'mobile' ? 'default' : 'outline'} size="icon" onClick={() => setActiveDeviceView('mobile')} aria-label="Mobile preview"> <Smartphone /> </Button>
                  <Button variant={activeDeviceView === 'tablet' ? 'default' : 'outline'} size="icon" onClick={() => setActiveDeviceView('tablet')} aria-label="Tablet preview"> <Tablet /> </Button>
                  <Button variant={activeDeviceView === 'desktop' ? 'default' : 'outline'} size="icon" onClick={() => setActiveDeviceView('desktop')} aria-label="Desktop preview"> <Monitor /> </Button>
                </div>
              </CardHeader>
              <CardContent className={activeDeviceView !== 'desktop' ? 'flex justify-center items-start p-4 overflow-auto' : 'p-0'}>
                 <ProfilePreview links={links} theme={theme} activeDeviceView={activeDeviceView} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={isLinkFormOpen} onOpenChange={setIsLinkFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <LinkForm 
            link={editingLink} 
            onSave={handleSaveLink} 
            onClose={() => { setIsLinkFormOpen(false); setEditingLink(null); }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
