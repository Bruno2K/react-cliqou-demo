
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { LinkItem, ThemeSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ThemeEditor } from '@/components/dashboard/theme-editor';
import { ProfilePreview } from '@/components/dashboard/profile-preview';
import { EditableLinkItem } from '@/components/dashboard/editable-link-item';
import { LinkForm } from '@/components/dashboard/link-form';
import { ThemeToggle } from '@/components/theme-toggle';
import { ProfilePictureModal } from '@/components/dashboard/profile-picture-modal';
import {
  PlusCircle, Palette, Share2, Settings, Copy, Edit, UserCircle,
  LogOut as LogOutIcon, DashboardIcon, HelpCircle, Megaphone, AppWindow, Edit2
} from '@/components/icons';
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
  SidebarSeparator,
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

  const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);

  const { toast } = useToast();
  const { user, logout } = useAuth();

  useEffect(() => {
    const savedLinks = localStorage.getItem('linkedup-links');
    const savedTheme = localStorage.getItem('linkedup-theme');
    if (savedLinks) setLinks(JSON.parse(savedLinks));
    else setLinks(initialLinks);

    let loadedTheme = initialTheme;
    if (savedTheme) {
      loadedTheme = { ...initialTheme, ...JSON.parse(savedTheme) };
    }
    if (user) {
      loadedTheme.username = savedTheme ? loadedTheme.username : user.name || initialTheme.username;
      loadedTheme.profileImageUrl = savedTheme 
                                      ? loadedTheme.profileImageUrl 
                                      : (user.profileImageUrl || initialTheme.profileImageUrl);
    }
    setTheme(loadedTheme);

    setIsMounted(true);
  }, [user]);

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
  
  const handleProfileImageSave = (newImageUrl: string) => {
    handleThemeChange({ profileImageUrl: newImageUrl });
    toast({ title: "Profile Picture Updated", description: "Your new profile picture has been saved." });
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

  const userProfileLink = user ? `https://cliqou.example.com/${theme.username?.toLowerCase().replace(/\s+/g, '-') || 'profile'}` : 'https://cliqou.example.com/profile';

  const copyLinkToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(userProfileLink);
      toast({ title: "URL Copied!", description: "Your Cliqou URL has been copied to the clipboard." });
    } else {
      toast({ title: "Error", description: "Could not copy URL to clipboard.", variant: "destructive" });
    }
  };

  if (!isMounted) {
    return <div className="flex items-center justify-center min-h-screen bg-background"><p>Loading Cliqou Editor...</p></div>;
  }

  return (
    <>
      <SidebarProvider defaultOpen>
        <Sidebar variant="sidebar" collapsible="icon" className="border-r">
          <SidebarHeader className="p-2 flex items-center justify-between">
             <div className="flex items-center overflow-hidden">
                <Avatar className="h-7 w-7 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5 flex-shrink-0">
                  <AvatarImage src={user?.profileImageUrl || theme.profileImageUrl || `https://placehold.co/80x80.png?text=${user?.name?.charAt(0) || 'U'}`} alt={user?.name || "User"} data-ai-hint="user avatar" />
                  <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || <UserCircle />}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold ml-1.5 group-data-[collapsible=icon]:hidden truncate" title={user?.name || "My Account"}>{user?.name || "My Account"}</span>
             </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard" passHref asChild>
                  <SidebarMenuButton isActive={true} tooltip="Cliqou editor">
                    <AppWindow />
                    Cliqou editor
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/analytics" passHref asChild>
                  <SidebarMenuButton tooltip="Dashboard">
                    <DashboardIcon />
                    Dashboard
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
            
            <SidebarSeparator className="my-3" />
            
          </SidebarContent>
          <SidebarFooter className="p-2 mt-auto">
            <SidebarMenu>
               <SidebarMenuItem>
                  <Link href="#" passHref asChild>
                      <SidebarMenuButton tooltip="Help">
                          <HelpCircle />
                          Help
                      </SidebarMenuButton>
                  </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                  <Link href="#" passHref asChild>
                      <SidebarMenuButton tooltip="Feedback">
                          <Megaphone />
                          Feedback
                      </SidebarMenuButton>
                  </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings" onClick={() => document.getElementById('user-avatar-dropdown-trigger')?.click()}>
                  <Settings />
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
            <h1 className="text-lg sm:text-xl font-semibold text-foreground flex-1">My LinkedUp</h1>
            <div className="flex items-center gap-1 sm:gap-2 ml-auto">
              <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => {}}>
                <Palette size={16} className="mr-1 sm:mr-2"/> Design
              </Button>
               <Button variant="outline" size="icon" className="sm:hidden" onClick={() => {}}>
                <Palette size={16}/>
                <span className="sr-only">Design</span>
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => {}}>
                <Share2 size={16} className="mr-1 sm:mr-2"/> Share
              </Button>
              <Button variant="outline" size="icon" className="sm:hidden" onClick={() => {}}>
                <Share2 size={16}/>
                <span className="sr-only">Share</span>
              </Button>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" id="user-avatar-dropdown-trigger" className="relative h-8 w-8 rounded-full p-0 sm:h-9 sm:w-9 md:h-10 md:w-10">
                    <Settings size={18} className="sm:size-5" />
                    <span className="sr-only">Settings</span>
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

          <main className="flex-1 overflow-y-auto p-0 bg-muted/30">
            <div className="container py-3 sm:py-4 px-3 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                {/* Left Panel: Editor */}
                <div className="w-full lg:flex-[3] xl:flex-[2] space-y-4 sm:space-y-6">

                  {/* Live Bar */}
                  <Card className="shadow-sm">
                    <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                      <p className="text-sm text-foreground">
                        Your LinkedUp is live: <Link href={userProfileLink} target="_blank" className="font-medium text-primary hover:underline">{userProfileLink.replace(/^https?:\/\//, '')}</Link>
                      </p>
                      <Button variant="outline" size="sm" onClick={copyLinkToClipboard}>
                        <Copy size={14} className="mr-2" /> Copy URL
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Profile Section */}
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="relative group">
                      <Avatar className="w-24 h-24 mb-3 border-2 border-border cursor-pointer" onClick={() => setIsProfilePicModalOpen(true)}>
                        <AvatarImage src={theme.profileImageUrl || `https://placehold.co/100x100.png?text=${theme.username?.charAt(0) || 'A'}`} alt={theme.username || "User"} data-ai-hint="user avatar profile"/>
                        <AvatarFallback>{theme.username?.charAt(0).toUpperCase() || <UserCircle />}</AvatarFallback>
                      </Avatar>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute bottom-2 right-0 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={() => setIsProfilePicModalOpen(true)}
                        aria-label="Edit profile picture"
                      >
                        <Edit2 size={14} />
                      </Button>
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">@{theme.username || user?.name || "username"}</h2>
                    <Button variant="link" size="sm" className="text-primary mt-1" onClick={() => { /* TODO: Implement Add/Edit Bio Modal or inline editing */ }}>
                      <Edit size={14} className="mr-1" /> {theme.bio ? "Edit Bio" : "Add Bio"}
                    </Button>
                  </div>

                  {/* Add Link Button */}
                  <Button
                    onClick={handleOpenAddLink}
                    size="lg"
                    className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-md"
                  >
                    <PlusCircle size={20} className="mr-2" /> Add Link
                  </Button>

                  {/* Links List */}
                  <div className="space-y-2 sm:space-y-3">
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
                  </div>

                  <ThemeEditor theme={theme} onThemeChange={handleThemeChange} />
                </div>

                {/* Right Panel: Preview (Desktop) */}
                <div className="hidden lg:block lg:flex-[2] xl:flex-[1] sticky top-[calc(5rem+1rem)] self-start">
                  <ProfilePreview
                    links={links}
                    theme={theme}
                  />
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

        {/* Mobile Preview Modal - Button removed from header, this modal trigger needs to be re-added if needed */}
        <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
          <DialogContent className="p-0 w-auto h-auto bg-transparent border-none shadow-none data-[state=open]:zoom-in-90 sm:rounded-lg flex items-center justify-center">
            <DialogTitle className="sr-only">Profile Page Preview</DialogTitle>
            <ProfilePreview links={links} theme={theme} />
          </DialogContent>
        </Dialog>

        {/* Profile Picture Modal */}
        <ProfilePictureModal
            isOpen={isProfilePicModalOpen}
            onClose={() => setIsProfilePicModalOpen(false)}
            onSave={handleProfileImageSave}
            currentImageUrl={theme.profileImageUrl}
            username={theme.username}
        />
      </SidebarProvider>
    </>
  );
}
