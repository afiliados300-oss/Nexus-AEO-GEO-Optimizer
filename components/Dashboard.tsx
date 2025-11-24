import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { AnalysisResult } from '../types';
import { TrendingUp, Search, Bot, Cpu, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface DashboardProps {
  history: AnalysisResult[];
}

const Dashboard: React.FC<DashboardProps> = ({ history }) => {
  // Mock data generator for empty states
  const generateData = () => {
    if (history.length > 0) return history.slice(-7).map((item, idx) => ({
        name: `Job ${idx + 1}`,
        seo: item.seoScore,
        aeo: item.aeoScore,
        geo: item.geoScore,
      }));
      
    return [
      { name: 'Seg', seo: 65, aeo: 50, geo: 60 },
      { name: 'Ter', seo: 75, aeo: 70, geo: 65 },
      { name: 'Qua', seo: 82, aeo: 75, geo: 78 },
      { name: 'Qui', seo: 88, aeo: 85, geo: 82 },
      { name: 'Sex', seo: 95, aeo: 92, geo: 90 },
    ];
  };

  const data = generateData();

  const avgScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.seoScore, 0) / history.length) 
    : 0;

  const totalOptimized = history.length;
  const pieData = [
    { name: 'Google/Bing (SEO)', value: 400 },
    { name: 'ChatGPT/Claude (AEO)', value: 300 },
    { name: 'Search Generative (GEO)', value: 300 },
  ];
  const COLORS = ['#3b82f6', '#6366f1', '#a855f7'];

  return (
    <div className="p-10 bg-slate-50/50 min-h-screen">
      {/* Header Section */}
      <div className="mb-10 flex justify-between items-end">
        <div>
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">Dashboard Executivo</h2>
            <p className="text-slate-500 mt-2 text-lg font-light">Visão em tempo real da performance em <span className="font-semibold text-blue-600">AEO, GEO e SEO</span>.</p>
        </div>
        <div className="flex gap-2">
             <span className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Sistema Online
             </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 hover:shadow-xl transition-shadow duration-300 group">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <Cpu size={24} />
             </div>
             <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                <ArrowUpRight size={12} /> +12%
             </span>
          </div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Otimizações Totais</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalOptimized}</h3>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 hover:shadow-xl transition-shadow duration-300 group">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
               <Search size={24} />
             </div>
             <span className="text-xs font-bold text-slate-400 px-2 py-1">Avg</span>
          </div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Pontuação SEO</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">{avgScore > 0 ? avgScore : '--'}%</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 hover:shadow-xl transition-shadow duration-300 group">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
               <Bot size={24} />
             </div>
             <ShieldCheck size={16} className="text-purple-400" />
          </div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Rankeamento IA (AEO)</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">Alta Prioridade</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 hover:shadow-xl transition-shadow duration-300 group">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
               <TrendingUp size={24} />
             </div>
          </div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Tráfego Projetado</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">3.5x</h3>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Large Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-card border border-slate-100">
          <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-800">Curva de Evolução Semântica</h3>
              <p className="text-sm text-slate-500">Análise comparativa da qualidade do conteúdo ao longo do tempo.</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSeo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAeo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="seo" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSeo)" name="SEO Tradicional" />
                <Area type="monotone" dataKey="aeo" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAeo)" name="AEO (Voice/AI)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-card border border-slate-100 flex flex-col">
           <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800">Distribuição de Impacto</h3>
              <p className="text-sm text-slate-500">Onde seu conteúdo performa melhor.</p>
          </div>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-2xl font-bold text-slate-800">100%</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Otimizado</div>
            </div>
          </div>
          <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> SEO Tradicional</div>
                  <span className="font-bold text-slate-700">40%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div> AEO (ChatGPT)</div>
                  <span className="font-bold text-slate-700">30%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div> GEO (SGE)</div>
                  <span className="font-bold text-slate-700">30%</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;