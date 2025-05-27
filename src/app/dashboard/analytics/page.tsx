
"use client";

import React, { useState, useEffect } from 'react';
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
import { AreaChart, BarChart3, Users, Link as LinkIcon, Percent, Clock, TrendingUp, TrendingDown, AlertCircle, FileText, Settings, LogOut, LayoutDashboard, PieChartIcon, Activity, MapPin, TargetIcon, ExternalLink, CalendarDays } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Pie, Cell, Line, Bar } from 'recharts'; // Using recharts directly for more control

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


// Helper for device size in PieChart (can be removed if device chart is moved)
const getActiveDeviceView = () => {
    if (typeof window !== 'undefined') {
        return window.innerWidth < 768 ? 'mobile' : 'desktop';
    }
    return 'desktop'; // Default for SSR or non-browser environments
};


export default function AnalyticsDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  // This state might be reused for other charts if needed for responsiveness
  const [activePieChartSizeView, setActivePieChartSizeView] = useState<'mobile' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      setActivePieChartSizeView(getActiveDeviceView());
    };
    handleResize(); // Set initial value
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
              <SidebarMenuButton isActive tooltip="Visão Geral">
                <LayoutDashboard />
                Visão Geral
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Engajamento" isActive>
                <Activity />
                Engajamento
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Desempenho por Link">
                <LinkIcon />
                Desempenho por Link
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Dispositivos">
                <PieChartIcon />
                Dispositivos
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Geolocalização">
                <MapPin />
                Geolocalização
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton tooltip="Conversões">
                <TargetIcon />
                Conversões
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Performance Técnica">
                <TrendingUp />
                Performance Técnica
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <SidebarMenu>
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
          {/* Visão Geral (Top KPIs) */}
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

          {/* Engajamento dos usuários */}
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
                    <PieChart>
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
                    </PieChart>
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
          
          {/* Placeholder for other sections */}
          <section className="mb-8">
             <Card>
                <CardHeader>
                  <CardTitle>Mais Seções em Breve...</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Outras seções como Desempenho por Link, Geolocalização, etc., serão adicionadas aqui.</p>
                </CardContent>
             </Card>
          </section>

        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

