
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import type { DateRange } from "react-day-picker";
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
import { AnalyticsTopbar } from '@/components/dashboard/analytics/topbar';
import { KpiCard } from '@/components/dashboard/analytics/kpi-card';
import { 
  AreaChart, BarChart3, Users, Link as LinkIcon, Percent, Clock, TrendingUp, TrendingDown, 
  AlertCircle, FileText, Settings, LogOut, AppWindow, PieChartIcon, Activity, 
  MapPin, TargetIcon, ExternalLink, CalendarDays, Edit3, FilterIcon, MoreHorizontal, 
  ChevronDown, RadarIcon, Smartphone, MapIcon, MousePointerClick, HelpCircle, Megaphone
} from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Pie, Cell, Line, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar } from 'recharts';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle } from '@/components/icons';


// Mock Data
const kpiData = [
  { title: 'Total de Acessos', value: '125,678', change: '+12.5%', changeType: 'positive', icon: <AreaChart size={24} className="text-primary" /> },
  { title: 'Usuários Únicos', value: '88,321', change: '+8.2%', changeType: 'positive', icon: <Users size={24} className="text-primary" /> },
  { title: 'Links Clicados', value: '310,987', change: '-2.1%', changeType: 'negative', icon: <LinkIcon size={24} className="text-primary" /> },
  { title: 'CTR Médio', value: '24.7%', change: '+0.5%', changeType: 'positive', icon: <Percent size={24} className="text-primary" /> },
  { title: 'Tempo Médio de Sessão', value: '3m 45s', change: '+30s', changeType: 'positive', icon: <Clock size={24} className="text-primary" /> },
  { title: 'Bounce Rate', value: '33.1%', change: '-1.8%', changeType: 'positive', icon: <TrendingDown size={24} className="text-primary" /> },
];

const dailyClicksData = [
  { name: 'Dia 1', cliques: 400 }, { name: 'Dia 5', cliques: 189 }, { name: 'Dia 10', cliques: 239 },
  { name: 'Dia 15', cliques: 349 }, { name: 'Dia 20', cliques: 200 }, { name: 'Dia 25', cliques: 278 },
  { name: 'Dia 30', cliques: 450 },
];

const accessOriginData = [
  { name: 'Orgânico', acessos: 1234, fill: 'hsl(var(--chart-1))' },
  { name: 'Social', acessos: 987, fill: 'hsl(var(--chart-2))' },
  { name: 'Direto', acessos: 765, fill: 'hsl(var(--chart-3))' },
  { name: 'Referência', acessos: 321, fill: 'hsl(var(--chart-4))' },
];

const returnRateData = [
  { name: 'Novos Usuários', value: 65, color: 'hsl(var(--chart-1))' },
  { name: 'Usuários Recorrentes', value: 35, color: 'hsl(var(--chart-2))' },
];

interface LinkPerformanceItem {
  id: string;
  name: string;
  url: string;
  totalClicks: number;
  clicksByDevice: string; 
  clicksByRegion: string; 
  status: 'active' | 'inactive';
}

const linkPerformanceData: LinkPerformanceItem[] = [
  { id: 'link1', name: 'Meu Portfólio Incrível', url: 'https://portfolio.example.com', totalClicks: 1250, clicksByDevice: 'M:700 D:500 T:50', clicksByRegion: 'BR:70% US:15% Outros:15%', status: 'active' },
  { id: 'link2', name: 'Produto X - Página de Vendas', url: 'https://produto-x.example.com', totalClicks: 870, clicksByDevice: 'M:400 D:450 T:20', clicksByRegion: 'BR:50% PT:30% Outros:20%', status: 'active' },
  { id: 'link3', name: 'Campanha de Natal (Expirada)', url: 'https://campanha-natal.example.com', totalClicks: 320, clicksByDevice: 'M:200 D:100 T:20', clicksByRegion: 'BR:90% Outros:10%', status: 'inactive' },
  { id: 'link4', name: 'Blog Post: Novidades', url: 'https://blog.example.com/novidades', totalClicks: 1500, clicksByDevice: 'M:800 D:600 T:100', clicksByRegion: 'Global:100%', status: 'active' },
  { id: 'link5', name: 'Linktree Antigo (Desativado)', url: 'https://linktr.ee/oldprofile', totalClicks: 50, clicksByDevice: 'M:30 D:15 T:5', clicksByRegion: 'N/A', status: 'inactive' },
];

const deviceUsageData = [
  { name: 'Mobile', value: 65, fill: 'hsl(var(--chart-1))' },
  { name: 'Desktop', value: 25, fill: 'hsl(var(--chart-2))' },
  { name: 'Tablet', value: 10, fill: 'hsl(var(--chart-3))' },
];

const browserUsageData = [
  { subject: 'Chrome', usage: 60, fullMark: 100 },
  { subject: 'Safari', usage: 20, fullMark: 100 },
  { subject: 'Edge', usage: 10, fullMark: 100 },
  { subject: 'Firefox', usage: 5, fullMark: 100 },
  { subject: 'Outros', usage: 5, fullMark: 100 },
];

const regionAccessData = [
    { region: 'São Paulo, BR', accesses: 15200, change: '+5%' },
    { region: 'Rio de Janeiro, BR', accesses: 10800, change: '+2%' },
    { region: 'Minas Gerais, BR', accesses: 8500, change: '-1%' },
    { region: 'Lisboa, PT', accesses: 7200, change: '+8%' },
    { region: 'California, US', accesses: 6100, change: '+3%' },
];

const conversionRateByLinkData = [
  { id: 'linkA', name: 'Link de Venda Principal', views: 5230, conversions: 261, rate: '5.0%' },
  { id: 'linkB', name: 'Ebook Gratuito', views: 12050, conversions: 1807, rate: '15.0%' },
  { id: 'linkC', name: 'Inscrição Webinar', views: 2500, conversions: 375, rate: '15.0%' },
  { id: 'linkD', name: 'Link Afiliado X', views: 850, conversions: 42, rate: '4.9%' },
];

const ctaInteractionsData = [
  { name: 'Botão "Comprar Agora"', interactions: 750, fill: 'hsl(var(--chart-1))' },
  { name: 'Link "Saiba Mais"', interactions: 1230, fill: 'hsl(var(--chart-2))' },
  { name: 'Banner "Promoção"', interactions: 450, fill: 'hsl(var(--chart-3))' },
  { name: 'Pop-up "Newsletter"', interactions: 980, fill: 'hsl(var(--chart-4))' },
];

const externalLinkClicksData = [
  { id: 'ext1', name: 'Contato WhatsApp', clicks: 320 },
  { id: 'ext2', name: 'Perfil Instagram', clicks: 1500 },
  { id: 'ext3', name: 'Loja Parceira', clicks: 88 },
  { id: 'ext4', name: 'Canal YouTube', clicks: 650 },
];

export default function AnalyticsDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined);

  const [statusFilter, setStatusFilter] = useState<Record<LinkPerformanceItem['status'], boolean>>({ active: true, inactive: true });
  const [performanceFilter, setPerformanceFilter] = useState<string>('all'); // Added for consistency, not fully implemented
  const { user, logout } = useAuth();

  const handlePeriodChange = (period: string, dateRange?: DateRange) => {
    setSelectedPeriod(period);
    if (period === 'custom' && dateRange) {
      setCustomDateRange(dateRange);
      console.log("Custom date range selected:", dateRange);
    } else if (period !== 'custom') {
      setCustomDateRange(undefined);
      console.log("Selected period:", period);
    }
  };

  const handleStatusFilterChange = (status: LinkPerformanceItem['status']) => {
    setStatusFilter(prev => ({ ...prev, [status]: !prev[status] }));
  };

  const filteredLinkPerformanceData = linkPerformanceData.filter(link => {
    const isStatusMatch = (statusFilter.active && link.status === 'active') || (statusFilter.inactive && link.status === 'inactive');
    // Placeholder for performance filter logic
    // const isPerformanceMatch = performanceFilter === 'all' || (performanceFilter === 'top' && link.totalClicks > 1000) || (performanceFilter === 'bottom' && link.totalClicks < 500);
    return isStatusMatch; // && isPerformanceMatch;
  });


  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-r"
      >
        <SidebarHeader className="p-2 flex items-center justify-between">
             <div className="flex items-center overflow-hidden">
                <Avatar className="h-7 w-7 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5 flex-shrink-0">
                  <AvatarImage src={user?.profileImageUrl || `https://placehold.co/80x80.png?text=${user?.name?.charAt(0) || 'U'}`} alt={user?.name || "User"} data-ai-hint="user avatar" />
                  <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || <UserCircle />}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold ml-1.5 group-data-[collapsible=icon]:hidden truncate" title={user?.name || "My Account"}>{user?.name || "My Account"}</span>
             </div>
          </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard" passHref asChild>
                <SidebarMenuButton tooltip="Cliqou editor">
                  <AppWindow />
                  Cliqou editor
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/dashboard/analytics" passHref asChild>
                    <SidebarMenuButton isActive={true} tooltip="Dashboard">
                        <BarChart3 />
                        Dashboard
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          </SidebarMenu>
          
          <SidebarSeparator className="my-3" />
            
          {/* Tools section removed */}

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
              <SidebarMenuButton tooltip="Configurações">
                <Settings />
                Configurações
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Sair" onClick={logout}>
                <LogOut />
                Sair
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <AnalyticsTopbar
          username={user?.name || "Usuário"}
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/30">
          {/* Visão Geral Section */}
          <section id="overview" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Visão Geral</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
              {kpiData.map((kpi) => (
                <KpiCard
                  key={kpi.title}
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  changeType={kpi.changeType as 'positive' | 'negative'}
                  icon={kpi.icon}
                  tooltipText={`Detalhes sobre ${kpi.title}`}
                />
              ))}
            </div>
          </section>

          {/* Engajamento dos Usuários Section */}
          <section id="engagement" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Engajamento dos Usuários</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp size={20} />
                    Cliques por Dia (Últimos 30 dias)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyClicksData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12}/>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--primary))' }}
                      />
                      <Legend wrapperStyle={{fontSize: '12px'}}/>
                      <Line type="monotone" dataKey="cliques" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} name="Cliques"/>
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ExternalLink size={20} />
                    Origem dos Acessos
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={accessOriginData} layout="vertical" margin={{ right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} />
                      <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} width={80} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value, name, props) => [value, props.payload.name]}
                      />
                      <Legend wrapperStyle={{fontSize: '12px'}}/>
                      <Bar dataKey="acessos" name="Acessos" barSize={20}>
                        {accessOriginData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users size={20} />
                    Taxa de Retorno
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[350px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={returnRateData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {returnRateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                         formatter={(value, name) => [`${value}%`, name]}
                      />
                       <Legend wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} layout="horizontal" verticalAlign="bottom" align="center" />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CalendarDays size={20} />
                    Atividade por Horário (Heatmap)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[350px] flex items-center justify-center">
                  <div className="text-center">
                    <Activity size={48} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Mapa de calor de atividade por horário em breve.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Desempenho por Link Section */}
          <section id="link-performance" className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-semibold text-foreground">Desempenho por Link</h2>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <FilterIcon size={16} /> Status <ChevronDown size={16} className="opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={statusFilter.active}
                      onCheckedChange={() => handleStatusFilterChange('active')}
                    >
                      Ativo
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter.inactive}
                      onCheckedChange={() => handleStatusFilterChange('inactive')}
                    >
                      Inativo
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <TrendingUp size={16} /> Performance <ChevronDown size={16} className="opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filtrar por Performance</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setPerformanceFilter('all')}>Todos</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setPerformanceFilter('top')}>Mais Clicados</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setPerformanceFilter('bottom')}>Menos Clicados</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Card className="shadow-lg">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Nome do Link</TableHead>
                        <TableHead className="min-w-[150px]">URL</TableHead>
                        <TableHead className="text-right">Cliques Totais</TableHead>
                        <TableHead className="min-w-[150px]">Cliques/Dispositivo</TableHead>
                        <TableHead className="min-w-[150px]">Cliques/Região</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLinkPerformanceData.length > 0 ? (
                        filteredLinkPerformanceData.map((link) => (
                          <TableRow key={link.id}>
                            <TableCell className="font-medium truncate max-w-xs" title={link.name}>{link.name}</TableCell>
                            <TableCell className="truncate max-w-xs" title={link.url}><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{link.url}</a></TableCell>
                            <TableCell className="text-right">{link.totalClicks.toLocaleString()}</TableCell>
                            <TableCell>{link.clicksByDevice}</TableCell>
                            <TableCell>{link.clicksByRegion}</TableCell>
                            <TableCell>
                              <Badge variant={link.status === 'active' ? 'default' : 'secondary'}
                                className={cn(link.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' : 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100')}
                              >
                                {link.status === 'active' ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => console.log('Detalhar link:', link.id)} aria-label="Detalhar link">
                                <MoreHorizontal size={18} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center h-24">
                            Nenhum link encontrado com os filtros atuais.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Dispositivos e Plataformas Section */}
          <section id="devices" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Dispositivos e Plataformas</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Smartphone size={20} />
                    Tipos de Dispositivo (%)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[350px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={deviceUsageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {deviceUsageData.map((entry, index) => (
                          <Cell key={`cell-device-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                        formatter={(value, name) => [`${value}%`, name]}
                      />
                      <Legend wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} layout="horizontal" verticalAlign="bottom" align="center" />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <RadarIcon size={20} />
                    Navegadores Utilizados (%)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={browserUsageData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={10} />
                      <RechartsRadar name="Uso" dataKey="usage" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value, name, props) => [`${value}%`, props.payload.subject]}
                      />
                      <Legend wrapperStyle={{fontSize: '12px'}}/>
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Geolocalização Section */}
          <section id="geolocation" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Geolocalização</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="shadow-lg lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapIcon size={20} />
                    Mapa de Calor de Acessos
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px] sm:h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <MapIcon size={48} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Componente de mapa de calor em breve.</p>
                    <p className="text-xs text-muted-foreground mt-1">(Ex: Integração com Google Maps API, Leaflet, etc.)</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp size={20} />
                    Ranking de Regiões por Acesso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Região</TableHead>
                            <TableHead className="text-right">Acessos</TableHead>
                            <TableHead className="text-right">Variação</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {regionAccessData.map((region) => (
                            <TableRow key={region.region}>
                              <TableCell className="font-medium">{region.region}</TableCell>
                              <TableCell className="text-right">{region.accesses.toLocaleString()}</TableCell>
                              <TableCell className={cn("text-right", region.change.startsWith('+') ? 'text-green-600' : 'text-red-600')}>
                                {region.change}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 text-center">Tabela interativa com paginação e ordenação em breve.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Conversões e Interações Section */}
          <section id="conversions" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Conversões e Interações</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TargetIcon size={20} />
                    Taxa de Conversão por Link
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Link</TableHead>
                        <TableHead className="text-right">Visualizações</TableHead>
                        <TableHead className="text-right">Conversões</TableHead>
                        <TableHead className="text-right">Taxa (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {conversionRateByLinkData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">{item.views.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{item.conversions.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{item.rate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                   <p className="text-xs text-muted-foreground mt-4 text-center">Tabela com mais detalhes e filtros em breve.</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MousePointerClick size={20} />
                    Interações com Botões CTA
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[350px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ctaInteractionsData} layout="horizontal" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                         <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                         <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={10} interval={0} angle={-30} textAnchor="end" height={60}/>
                         <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12}/>
                         <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                          }}
                          labelStyle={{ color: 'hsl(var(--foreground))' }}
                         />
                         <Legend wrapperStyle={{fontSize: '12px'}}/>
                         <Bar dataKey="interactions" name="Interações">
                          {ctaInteractionsData.map((entry, index) => (
                              <Cell key={`cell-cta-${index}`} fill={entry.fill} />
                          ))}
                         </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ExternalLink size={20} />
                    Cliques em Links Externos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome/Destino do Link</TableHead>
                        <TableHead className="text-right">Cliques</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {externalLinkClicksData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">{item.clicks.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <p className="text-xs text-muted-foreground mt-4 text-center">Detalhes e agrupamento por tipo em breve.</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                     <Activity size={20}/>
                    Eventos Personalizados
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <Activity size={40} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Acompanhamento de eventos customizados (ex: scroll depth, hover em elementos chave, visualização de vídeo) em breve.</p>
                    <p className="text-xs text-muted-foreground mt-1">Isso permitirá uma análise mais granular do comportamento do usuário.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
