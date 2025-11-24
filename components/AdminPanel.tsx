import React, { useState, useEffect } from 'react';
import { Download, Users, Search, Shield, Eye, RefreshCw, KeyRound, FileText, X } from 'lucide-react';
import { User, AnalysisResult } from '../types';
import { getUsers, exportDatabase, getProjectsByUserEmail, updateUserPassword } from '../services/storageService';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userProjects, setUserProjects] = useState<AnalysisResult[]>([]);
  const [resetMode, setResetMode] = useState<string | null>(null); // email of user to reset
  const [newPass, setNewPass] = useState('');

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setUserProjects(getProjectsByUserEmail(selectedUser.email));
    }
  }, [selectedUser]);

  const handleResetPassword = (email: string) => {
    if (!newPass) return alert("Digite uma nova senha.");
    updateUserPassword(email, newPass);
    setResetMode(null);
    setNewPass('');
    alert("Senha atualizada com sucesso!");
    // Refresh users to ensure local state sync (optional here as localStorage is source of truth)
    setUsers(getUsers());
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
             <Shield className="text-blue-600" /> God Mode (Admin)
          </h2>
          <p className="text-slate-500 mt-1">Monitoramento total de usuários e projetos.</p>
        </div>
        <button 
          onClick={exportDatabase}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-green-600/20 transition-all"
        >
          <Download size={18} /> Backup Completo
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Usuários Totais</p>
            <h3 className="text-2xl font-bold text-slate-800">{users.length}</h3>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* User List */}
        <div className={`flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all ${selectedUser ? 'w-1/2' : 'w-full'}`}>
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar usuário..." 
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>
            
            <div className="overflow-y-auto max-h-[600px]">
                <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider sticky top-0 z-10">
                    <th className="p-4 font-medium">Usuário</th>
                    <th className="p-4 font-medium">Função</th>
                    <th className="p-4 font-medium text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user, idx) => (
                    <tr key={idx} className={`hover:bg-slate-50 transition-colors ${selectedUser?.email === user.email ? 'bg-blue-50/50' : ''}`}>
                        <td className="p-4">
                            <div className="font-bold text-slate-700">{user.name}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                        </td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold border uppercase ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                            }`}>
                                {user.role}
                            </span>
                        </td>
                        <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <button 
                                    onClick={() => setSelectedUser(user)}
                                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Ver Atividade"
                                >
                                    <Eye size={18} />
                                </button>
                                <button 
                                    onClick={() => setResetMode(resetMode === user.email ? null : user.email)}
                                    className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                    title="Resetar Senha"
                                >
                                    <KeyRound size={18} />
                                </button>
                            </div>
                            
                            {/* Quick Reset Password Form inline */}
                            {resetMode === user.email && (
                                <div className="mt-2 flex gap-2 items-center justify-end animate-in fade-in zoom-in duration-200">
                                    <input 
                                        type="text" 
                                        placeholder="Nova senha" 
                                        className="w-32 px-2 py-1 text-sm border border-slate-300 rounded text-black"
                                        value={newPass}
                                        onChange={(e) => setNewPass(e.target.value)}
                                    />
                                    <button 
                                        onClick={() => handleResetPassword(user.email)}
                                        className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded hover:bg-amber-600"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            )}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>

        {/* Detail View (Inspector) */}
        {selectedUser && (
            <div className="w-1/2 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col animate-in slide-in-from-right-5 duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50 rounded-t-2xl">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Atividade do Usuário</h3>
                        <p className="text-sm text-slate-500">Projetos de <span className="font-bold text-blue-600">{selectedUser.name}</span></p>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-red-500">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    {userProjects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <FileText size={48} className="mb-4 opacity-20" />
                            <p>Nenhum projeto criado por este usuário.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {userProjects.map((proj) => (
                                <div key={proj.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-700 text-sm line-clamp-1">{proj.title}</h4>
                                        <span className="text-[10px] text-slate-400">{new Date(proj.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-3 line-clamp-2 italic">"{proj.originalContentPreview}..."</p>
                                    
                                    <div className="flex gap-2">
                                        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded">SEO: {proj.seoScore}</span>
                                        <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded">AEO: {proj.aeoScore}</span>
                                    </div>
                                    
                                    <div className="mt-3 pt-3 border-t border-slate-50">
                                        <div className="text-[10px] text-slate-400 font-mono">ID: {proj.id}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;