
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
import { AreaChart, BarChart3, Users, Link as LinkIcon, Percent, Clock, TrendingUp, TrendingDown, AlertCircle, FileText, Settings, LogOut, LayoutDashboard, PieChartIcon, Activity, MapPin, TargetIcon, ExternalLink } from '@/components/icons'; // Corrected PieChart import
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Pie, Cell, Line } from 'recharts'; // Using recharts directly for more control

// Mock Data
const kpiData = [
  { title: 'Total de Acessos', value: '125,678', change: '+12.5%', changeType: 'positive', icon: <AreaChart size={24} className="text-primary" /> },
  { title: 'Usuários Únicos', value: '88,321', change: '+8.2%', changeType: 'positive', icon: <Users size={24} className="text-primary" /> },
  { title: 'Links Clicados', value: '310,987', change: '-2.1%', changeType: 'negative', icon: <LinkIcon size={24} className="text-primary" /> },
  { title: 'CTR Médio', value: '24.7%', change: '+0.5%', changeType: 'positive', icon: <Percent size={24} className="text-primary" /> },
  { title: 'Tempo Médio de Sessão', value: '3m 45s', change: '+30s', changeType: 'positive', icon: <Clock size={24} className="text-primary" /> },
  { title: 'Bounce Rate', value: '33.1%', change: '-1.8%', changeType: 'positive', icon: <TrendingDown size={24} className="text-primary" /> },
];

const engagementData = [
  { name: 'Dia 1', cliques: 400 }, { name: 'Dia 5', cliques: 189 }, { name: 'Dia 10', cliques: 239 },
  { name: 'Dia 15', cliques: 349 }, { name: 'Dia 20', cliques: 200 }, { name: 'Dia 25', cliques: 278 },
  { name: 'Dia 30', cliques: 450 },
];

const deviceData = [
  { name: 'Mobile', value: 65, color: 'hsl(var(--chart-1))' },
  { name: 'Desktop', value: 30, color: 'hsl(var(--chart-2))' },
  { name: 'Tablet', value: 5, color: 'hsl(var(--chart-3))' },
];

// Helper for device size in PieChart
const getActiveDeviceView = () => {
    if (typeof window !== 'undefined') {
        return window.innerWidth < 768 ? 'mobile' : 'desktop';
    }
    return 'desktop'; // Default for SSR or non-browser environments
};


export default function AnalyticsDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeDeviceView, setActiveDeviceView] = useState<'mobile' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      setActiveDeviceView(getActiveDeviceView());
    };
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        variant="sidebar" // "sidebar", "floating", "inset"
        collapsible="icon" // "offcanvas", "icon", "none"
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
              <SidebarMenuButton tooltip="Engajamento">
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

          {/* Engajamento dos usuários - Gráfico de linha e Gráfico de Pizza */}
          <section id="engagement" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Engajamento dos Usuários</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 size={20} />
                    Cliques por Dia (Últimos 30 dias)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementData}>
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
                      <Line type="monotone" dataKey="cliques" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <PieChartIcon size={20} />
                    Tipos de Dispositivo
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[350px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={Math.min(typeof window !== 'undefined' ? window.innerWidth : 300, typeof window !== 'undefined' ? window.innerHeight : 300) / (activeDeviceView === 'mobile' ? 7 : 9)}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {deviceData.map((entry, index) => (
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
