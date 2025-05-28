
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { LinkItem, ThemeSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ThemeEditor } from '@/components/dashboard/theme-editor';
import { ProfilePreview } from '@/components/dashboard/profile-preview';
import { EditableLinkItem } from '@/components/dashboard/editable-link-item';
import { LinkForm } from '@/components/dashboard/link-form';
import { ThemeToggle } from '@/components/theme-toggle';
import { PlusCircle, Link as LinkIconLucide, Eye as EyeIconImport, LayoutDashboard, BellRing as NotificationsIcon, Settings as SettingsIcon, LogOut as LogOutIcon, Edit3, PieChartIcon, UserCircle } from '@/components/icons';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth-context';


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
  fontFamily: 'var(--font-inter)',
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


export default function EditorDashboardPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [theme, setTheme] = useState<ThemeSettings>(initialTheme);
  const [isMounted, setIsMounted] = useState(false);
  const [activeDeviceView, setActiveDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const { toast } = useToast();
  const { user, logout } = useAuth();

  useEffect(() => {
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
      setLinks(prevLinks => [...prevLinks, { ...linkToSave, id: Date.now().toString() }]);
      toast({ title: "Link Added", description: "New link successfully created." });
    }
    setIsLinkFormOpen(false);
    setEditingLink(null);
  };
  
  const linkIds = useMemo(() => links.map(link => link.id), [links]);

  if (!isMounted) {
    return <div className="flex items-center justify-center min-h-screen bg-background"><p>Loading LinkedUp Editor...</p></div>;
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r">
        <SidebarHeader className="p-4">
          <Edit3 size={28} className="text-primary" />
          <span className="text-xl font-semibold ml-2 group-data-[collapsible=icon]:hidden">LinkedUp</span>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={true} tooltip="Editor">
                <Edit3 />
                Editor
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/analytics">
                <SidebarMenuButton tooltip="Analytics">
                  <PieChartIcon /> 
                  Analytics
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/notifications">
                <SidebarMenuButton tooltip="Notifications">
                  <NotificationsIcon />
                  Notifications
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <SettingsIcon />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Logout" onClick={logout}>
                <LogOutIcon />
                Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:h-16 sm:px-6">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-foreground flex-1">Link Editor</h1>
          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            <Button onClick={() => setIsPreviewModalOpen(true)} className="lg:hidden" variant="outline" size="sm">
              <EyeIconImport size={16} className="mr-1 sm:mr-2" /> Preview
            </Button>
            <ThemeToggle />
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 sm:h-9 sm:w-9 md:h-10 md:w-10">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={user?.profileImageUrl || `https://placehold.co/80x80.png?text=${user?.name?.charAt(0) || 'U'}`} alt={user?.name || "User"} data-ai-hint="user avatar" />
                      <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || <UserCircle />}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/50 focus:text-red-700 dark:focus:text-red-300">
                    <LogOutIcon size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-0 bg-muted/30"> {/* Removed dashboard padding here */}
          <div className="container py-3 sm:py-4 px-3 sm:px-6 lg:px-8"> {/* Added original container back */}
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
              {/* Left Panel: Editor */}
              <div className="w-full lg:w-2/5 space-y-3 sm:space-y-4">
                <Card className="shadow-lg">
                  <CardHeader className="flex flex-col items-start gap-2 p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <LinkIconLucide size={16} className="sm:w-[18px] sm:h-[18px]" /> 
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
              <div className="hidden lg:block w-full lg:w-3/5 sticky top-[calc(5rem+1rem)] self-start"> {/* Adjusted sticky top due to header height */}
                <Card className="shadow-lg">
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
          </div>
        </main>
      </SidebarInset>

      {/* Link Form Dialog */}
      <Dialog open={isLinkFormOpen} onOpenChange={setIsLinkFormOpen}>
        <DialogContent className="w-[90vw] max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-lg">
          <DialogTitle className="sr-only">{editingLink ? 'Edit Link' : 'Add New Link'}</DialogTitle>
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
    </SidebarProvider>
  );
}
