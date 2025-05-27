
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
import { AnalyticsTopbar } from '@/components/dashboard/analytics/topbar';
import { KpiCard } from '@/components/dashboard/analytics/kpi-card';
import { AreaChart, BarChart3, Users, Link as LinkIcon, Percent, Clock, TrendingUp, TrendingDown, AlertCircle, FileText, Settings, LogOut, LayoutDashboard, PieChartIcon, Activity, MapPin, TargetIcon, ExternalLink, CalendarDays, Edit3, Filter, MoreHorizontal, ChevronDown, Radar } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Pie, Cell, Line, Bar } from 'recharts';
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
  clicksByDevice: string; // e.g., "M:150 D:300 T:50"
  clicksByRegion: string; // e.g., "BR:60% US:20% Outros:20%"
  status: 'active' | 'inactive';
}

const linkPerformanceData: LinkPerformanceItem[] = [
  { id: 'link1', name: 'Meu Portfólio Incrível', url: 'https://portfolio.example.com', totalClicks: 1250, clicksByDevice: 'M:700 D:500 T:50', clicksByRegion: 'BR:70% US:15% Outros:15%', status: 'active' },
  { id: 'link2', name: 'Produto X - Página de Vendas', url: 'https://produto-x.example.com', totalClicks: 870, clicksByDevice: 'M:400 D:450 T:20', clicksByRegion: 'BR:50% PT:30% Outros:20%', status: 'active' },
  { id: 'link3', name: 'Campanha de Natal (Expirada)', url: 'https://campanha-natal.example.com', totalClicks: 320, clicksByDevice: 'M:200 D:100 T:20', clicksByRegion: 'BR:90% Outros:10%', status: 'inactive' },
  { id: 'link4', name: 'Blog Post: Novidades', url: 'https://blog.example.com/novidades', totalClicks: 1500, clicksByDevice: 'M:800 D:600 T:100', clicksByRegion: 'Global:100%', status: 'active' },
  { id: 'link5', name: 'Linktree Antigo (Desativado)', url: 'https://linktr.ee/oldprofile', totalClicks: 50, clicksByDevice: 'M:30 D:15 T:5', clicksByRegion: 'N/A', status: 'inactive' },
];


// Helper for device size in PieChart
const getActiveDeviceView = () => {
    if (typeof window !== 'undefined') {
        return window.innerWidth < 768 ? 'mobile' : 'desktop';
    }
    return 'desktop'; // Default for SSR or non-browser environments
};

type ActiveView = 'overview' | 'engagement' | 'link-performance' | 'devices' | 'geolocation' | 'conversions' | 'technical-performance';


export default function AnalyticsDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [activePieChartSizeView, setActivePieChartSizeView] = useState<'mobile' | 'desktop'>('desktop');

  // Filters for Link Performance
  const [statusFilter, setStatusFilter] = useState<Record<LinkPerformanceItem['status'], boolean>>({ active: true, inactive: true });
  const [performanceFilter, setPerformanceFilter] = useState<string>('all'); // 'all', 'top', 'bottom'

  const handleStatusFilterChange = (status: LinkPerformanceItem['status']) => {
    setStatusFilter(prev => ({ ...prev, [status]: !prev[status] }));
  };

  const filteredLinkPerformanceData = linkPerformanceData.filter(link => {
    const isStatusMatch = (statusFilter.active && link.status === 'active') || (statusFilter.inactive && link.status === 'inactive');
    // Placeholder for performance filter logic
    return isStatusMatch;
  });


  useEffect(() => {
    const handleResize = () => {
      setActivePieChartSizeView(getActiveDeviceView());
    };
    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-r"
      >
        <SidebarHeader className="p-4">
          <LayoutDashboard size={28} className="text-primary" />
          <span className="text-xl font-semibold ml-2 group-data-[collapsible=icon]:hidden">Analytics</span>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={activeView === 'overview'} onClick={() => setActiveView('overview')} tooltip="Visão Geral">
                <LayoutDashboard />
                Visão Geral
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={activeView === 'engagement'} onClick={() => setActiveView('engagement')} tooltip="Engajamento">
                <Activity />
                Engajamento
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={activeView === 'link-performance'} onClick={() => setActiveView('link-performance')} tooltip="Desempenho por Link">
                <LinkIcon />
                Desempenho por Link
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={activeView === 'devices'} onClick={() => setActiveView('devices')} tooltip="Dispositivos">
                <PieChartIcon />
                Dispositivos
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={activeView === 'geolocation'} onClick={() => setActiveView('geolocation')} tooltip="Geolocalização">
                <MapPin />
                Geolocalização
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton isActive={activeView === 'conversions'} onClick={() => setActiveView('conversions')} tooltip="Conversões">
                <TargetIcon />
                Conversões
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={activeView === 'technical-performance'} onClick={() => setActiveView('technical-performance')} tooltip="Performance Técnica">
                <TrendingUp />
                Performance Técnica
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" asChild>
                <SidebarMenuButton tooltip="Back to Editor">
                  <Edit3 />
                  Back to Editor
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
              <SidebarMenuButton tooltip="Sair">
                <LogOut />
                Sair
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <AnalyticsTopbar
          username="Usuário Exemplo"
          notificationCount={3}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          onLogout={() => console.log('Logout clicked')}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/30">
          {activeView === 'overview' && (
            <>
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
              <section className="mb-8">
                 <Card>
                    <CardHeader>
                      <CardTitle>Mais Seções em Breve...</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Outras seções como Desempenho por Link, Geolocalização, etc., serão adicionadas aqui quando selecionadas na sidebar.</p>
                    </CardContent>
                 </Card>
              </section>
            </>
          )}

          {activeView === 'engagement' && (
            <section id="engagement" className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Engajamento dos Usuários</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Cliques por Dia (Últimos 30 dias) - Gráfico de Linha */}
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

                {/* Origem dos Acessos - Gráfico de Barras */}
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

                {/* Taxa de Retorno (Novos vs Recorrentes) - Gráfico de Pizza */}
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
                          outerRadius={Math.min(typeof window !== 'undefined' ? window.innerWidth : 300, typeof window !== 'undefined' ? window.innerHeight : 300) / (activePieChartSizeView === 'mobile' ? 7 : 9)}
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

                {/* Mapa de Calor por Horário - Placeholder */}
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
          )}

          {activeView === 'link-performance' && (
            <section id="link-performance" className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-foreground">Desempenho por Link</h2>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter size={16} /> Status <ChevronDown size={16} className="opacity-70" />
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
                  {/* Date filter is global from Topbar */}
                </div>
              </div>

              <Card className="shadow-lg">
                <CardContent className="p-0"> {/* Remove padding for full-width table */}
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
          )}

          {/* Placeholder for other views - you can add more else-if blocks for other activeView values */}
          {activeView !== 'overview' && activeView !== 'engagement' && activeView !== 'link-performance' && (
            <section className="mb-8">
               <Card>
                  <CardHeader>
                    <CardTitle className="capitalize">Conteúdo para "{activeView.replace('-', ' ')}" em breve...</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">O conteúdo desta seção será adicionado quando implementado.</p>
                  </CardContent>
               </Card>
            </section>
          )}

        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    