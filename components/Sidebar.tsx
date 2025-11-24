import React from 'react';
import { LayoutDashboard, Zap, History, Database, LogOut, Command, Sparkles, Settings } from 'lucide-react';
import { ViewState, User } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onLogout, user }) => {
  const navItems = [
    { id: 'dashboard', label: 'Painel de Controle', icon: LayoutDashboard, desc: 'Métricas Gerais' },
    { id: 'optimizer', label: 'Nexus Otimizador', icon: Zap, desc: 'IA Engine Core' },
    { id: 'history', label: 'Arquivo de Análises', icon: History, desc: 'Meus Projetos' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin (God Mode)', icon: Database, desc: 'Gestão Global' });
  }

  // Settings is available for everyone
  navItems.push({ id: 'settings', label: 'Configurações', icon: Settings, desc: 'Senha e Perfil' });

  return (
    <aside className="w-72 bg-nexus-dark text-slate-300 flex flex-col h-full fixed left-0 top-0 border-r border-nexus-border z-50 shadow-2xl">
      {/* Header */}
      <div className="p-8 flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-glow text-white">
          <Command size={20} />
        </div>
        <div>
          <h1 className="font-bold text-xl text-white tracking-tight">NEXUS <span className="text-blue-500">CORE</span></h1>
          <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase mt-0.5">
             <Sparkles size={10} className="text-amber-400" /> SEO • AEO • GEO
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 mb-4 flex-1 overflow-y-auto custom-scrollbar">
         <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Navegação Principal</div>
         <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeView(item.id as ViewState)}
                  className={`w-full group flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 border ${
                    isActive
                      ? 'bg-blue-600/10 border-blue-600/50 text-white shadow-glow'
                      : 'border-transparent hover:bg-nexus-card hover:text-white'
                  }`}
                >
                  <Icon size={22} className={`${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'} transition-colors`} />
                  <div className="text-left">
                    <span className="block font-semibold text-sm">{item.label}</span>
                    <span className={`block text-[10px] ${isActive ? 'text-blue-300' : 'text-slate-600 group-hover:text-slate-400'}`}>{item.desc}</span>
                  </div>
                </button>
              );
            })}
         </nav>
      </div>

      {/* Footer / User Profile */}
      <div className="mt-auto p-6 border-t border-nexus-border bg-nexus-card/30">
        <div className="flex items-center gap-3 mb-4 bg-nexus-dark p-3 rounded-lg border border-nexus-border">
             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 flex items-center justify-center text-xs text-white font-bold">
                {user?.name.charAt(0)}
             </div>
             <div className="overflow-hidden">
                 <p className="text-sm text-white font-medium truncate">{user?.name}</p>
                 <p className="text-[10px] text-slate-500 truncate uppercase">{user?.role}</p>
             </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-950/30 hover:text-red-300 border border-transparent hover:border-red-900/50 transition-all text-sm font-medium"
        >
          <LogOut size={16} />
          Encerrar Sessão
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;