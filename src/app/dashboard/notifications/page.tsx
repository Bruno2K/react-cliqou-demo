
// src/app/dashboard/notifications/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, BellRing, FileText, AlertCircle, Info, Users, Settings, CheckCircle, XCircle, Eye, EyeOff, Trash2, Mail, MailOpen, FilterIcon, MoreHorizontal, Award, MessageSquare, ShoppingCart, TrendingUp } from '@/components/icons';
import type { FullNotificationItem } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const initialMockNotifications: FullNotificationItem[] = [
  { id: 'notif1', icon: <FileText size={20} className="text-blue-500" />, title: 'Relatório Semanal Gerado', description: 'Seu relatório de performance da semana passada já está disponível para visualização.', timestamp: new Date(Date.now() - 1000 * 60 * 5), isRead: false, category: 'reports', link: '/dashboard/analytics?section=reports' },
  { id: 'notif2', icon: <AlertCircle size={20} className="text-red-500" />, title: 'Alerta: CTR Baixo', description: 'A taxa de cliques (CTR) da campanha "Promoção de Verão" caiu 15% nas últimas 24 horas.', timestamp: new Date(Date.now() - 1000 * 60 * 60), isRead: false, category: 'alerts' },
  { id: 'notif3', icon: <Info size={20} className="text-yellow-500" />, title: 'Manutenção Programada', description: 'Haverá uma manutenção programada no sistema hoje, das 23:00 às 00:00.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), isRead: true, category: 'system' },
  { id: 'notif4', icon: <Users size={20} className="text-green-500" />, title: 'Marco Atingido: 10.000 Usuários!', description: 'Parabéns! Sua plataforma atingiu a marca de 10.000 usuários únicos cadastrados.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), isRead: true, category: 'milestones' },
  { id: 'notif5', icon: <Settings size={20} className="text-gray-500" />, title: 'Atualização de Política de Privacidade', description: 'Nossa política de privacidade foi atualizada. Revise os novos termos.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), isRead: false, category: 'updates' },
  { id: 'notif6', icon: <Award size={20} className="text-purple-500" />, title: 'Você ganhou um novo Badge!', description: 'Por sua atividade recente, você desbloqueou o badge "Mestre dos Links".', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), isRead: false, category: 'achievements' },
  { id: 'notif7', icon: <MessageSquare size={20} className="text-cyan-500" />, title: 'Nova Mensagem de Suporte', description: 'A equipe de suporte respondeu à sua solicitação #12345.', timestamp: new Date(Date.now() - 1000 * 60 * 30), isRead: false, category: 'support' },
  { id: 'notif8', icon: <ShoppingCart size={20} className="text-orange-500" />, title: 'Seu Pedido Foi Enviado', description: 'O pedido #S9876 referente ao plano premium foi processado e enviado.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), isRead: true, category: 'billing' },
  { id: 'notif9', icon: <TrendingUp size={20} className="text-lime-500" />, title: 'Dica de Performance', description: 'Notamos que o link "Meu Ebook Gratuito" tem alta visualização mas baixa conversão. Considere revisar o CTA.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), isRead: true, category: 'tips' },
  { id: 'notif10', icon: <FileText size={20} className="text-blue-500" />, title: 'Relatório Mensal (Maio) Disponível', description: 'O relatório consolidado do mês de Maio está pronto.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), isRead: true, category: 'reports' },
];


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<FullNotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    let loadedNotifications: FullNotificationItem[] = [];

    try {
      const storedNotificationsJSON = localStorage.getItem('linkedup-notifications');
      if (storedNotificationsJSON) {
        const parsedArray = JSON.parse(storedNotificationsJSON);
        if (Array.isArray(parsedArray) && parsedArray.length > 0) {
          loadedNotifications = parsedArray.map((storedNotif: any) => {
            const originalMock = initialMockNotifications.find(mock => mock.id === storedNotif.id);
            const icon = originalMock ? originalMock.icon : <BellRing size={22} />;
            return {
              ...storedNotif,
              timestamp: new Date(storedNotif.timestamp),
              icon: icon,
            };
          });
        }
        // If storedNotificationsJSON was "[]" (empty array string), 
        // or parsedArray was not an array, loadedNotifications remains [].
      }
    } catch (error) {
      console.error("Error loading or processing notifications from localStorage:", error);
      // loadedNotifications remains [] in case of error, will be handled by the check below.
    }

    // If, after attempting to load from localStorage, we have no notifications,
    // then re-populate with the initial mock data.
    if (loadedNotifications.length === 0) {
      loadedNotifications = initialMockNotifications.map(mock => ({
        ...mock,
        timestamp: new Date(mock.timestamp), // Ensure timestamps are Date objects
      }));
    }
    
    setNotifications(loadedNotifications);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // When saving, strip out JSX for icons as they don't stringify well.
      // They will be re-assigned on load based on initialMockNotifications.
      const notificationsToSave = notifications.map(notif => {
        const { icon, ...rest } = notif; // Destructure to remove icon
        return rest;
      });
      localStorage.setItem('linkedup-notifications', JSON.stringify(notificationsToSave));
    }
  }, [notifications, isMounted]);

  const toggleReadStatus = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: !notif.isRead } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
  };

  const deleteReadNotifications = () => {
    setNotifications(prev => prev.filter(notif => !notif.isRead));
  };


  const filteredNotifications = useMemo(() => {
    if (filter === 'read') return notifications.filter(n => n.isRead);
    if (filter === 'unread') return notifications.filter(n => !n.isRead);
    return notifications;
  }, [notifications, filter]);

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-muted/30 p-4 sm:p-6 md:p-8">
        <BellRing size={48} className="text-primary animate-pulse" />
        <p className="text-muted-foreground mt-4">Carregando notificações...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/analytics">
              <Button variant="outline" size="icon" aria-label="Voltar para Analytics">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <BellRing size={24} className="text-primary" />
              Central de Notificações
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <Card className="shadow-xl w-full">
            <CardHeader className="border-b">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl">Suas Notificações</CardTitle>
                  <CardDescription>Gerencie e acompanhe todas as suas atualizações aqui.</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>Todas</Button>
                  <Button variant={filter === 'unread' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('unread')}>
                    Não Lidas <Badge variant="secondary" className={cn("ml-2", filter === 'unread' ? 'bg-primary text-primary-foreground' : '')}>{notifications.filter(n => !n.isRead).length}</Badge>
                  </Button>
                  <Button variant={filter === 'read' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('read')}>Lidas</Button>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                              Ações <MoreHorizontal size={16} className="ml-1" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={markAllAsRead} disabled={notifications.every(n => n.isRead)}>
                              <MailOpen size={16} className="mr-2" /> Marcar todas como lidas
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={deleteReadNotifications} disabled={notifications.every(n => !n.isRead) || notifications.length === 0}>
                              <Trash2 size={16} className="mr-2" /> Excluir lidas
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={deleteAllNotifications} className="text-destructive focus:text-destructive" disabled={notifications.length === 0}>
                              <XCircle size={16} className="mr-2" /> Excluir todas
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px] sm:w-[60px] text-center">Status</TableHead>
                      <TableHead className="w-[60px] sm:w-[80px] text-center hidden sm:table-cell">Ícone</TableHead>
                      <TableHead>Detalhes</TableHead>
                      <TableHead className="w-[120px] sm:w-[150px] hidden md:table-cell text-right">Data</TableHead>
                      <TableHead className="w-[100px] sm:w-[120px] text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map(notif => (
                        <TableRow key={notif.id} className={cn(!notif.isRead && "bg-primary/5 dark:bg-primary/10")}>
                          <TableCell className="text-center">
                            {notif.isRead ? (
                              <CheckCircle size={20} className="text-green-500 mx-auto" />
                            ) : (
                              <Mail size={20} className="text-blue-500 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-center hidden sm:table-cell">
                            <div className="flex justify-center items-center h-full">
                              {notif.icon && React.isValidElement(notif.icon) ? React.cloneElement(notif.icon as React.ReactElement<any>, { size: 22 }) : <BellRing size={22}/>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className={cn("font-semibold", !notif.isRead && "text-primary")}>{notif.title}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">{notif.description}</p>
                            <p className="text-xs text-muted-foreground mt-1 md:hidden">
                                  {formatDistanceToNow(notif.timestamp, { addSuffix: true, locale: ptBR })}
                            </p>
                          </TableCell>
                          <TableCell className="text-right hidden md:table-cell">
                            <TooltipProvider>
                              <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-sm text-muted-foreground">
                                      {formatDistanceToNow(notif.timestamp, { addSuffix: true, locale: ptBR })}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{format(notif.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                                  </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => toggleReadStatus(notif.id)}>
                                      {notif.isRead ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{notif.isRead ? 'Marcar como não lida' : 'Marcar como lida'}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteNotification(notif.id)}>
                                      <Trash2 size={16} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Excluir notificação</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                          {filter === 'all' && notifications.length === 0 ? 'Você não tem nenhuma notificação.' : `Nenhuma notificação ${filter === 'read' ? 'lida' : filter === 'unread' ? 'não lida' : ''} no momento.`}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

    