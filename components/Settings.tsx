import React, { useState } from 'react';
import { Lock, User as UserIcon, Save, ShieldAlert } from 'lucide-react';
import { User } from '../types';
import { updateUserPassword } from '../services/storageService';

interface SettingsProps {
  user: User;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [status, setStatus] = useState<{type: 'success' | 'error' | null, msg: string}>({ type: null, msg: '' });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (passwords.new !== passwords.confirm) {
      setStatus({ type: 'error', msg: 'As novas senhas não coincidem.' });
      return;
    }
    
    if (passwords.new.length < 6) {
      setStatus({ type: 'error', msg: 'A nova senha deve ter pelo menos 6 caracteres.' });
      return;
    }

    // Simulate checking old password (in a real app this is backend logic)
    if (passwords.current !== user.password) {
        setStatus({ type: 'error', msg: 'Senha atual incorreta.' });
        return;
    }

    const success = updateUserPassword(user.email, passwords.new);
    if (success) {
      setStatus({ type: 'success', msg: 'Senha atualizada com sucesso! Use a nova senha no próximo login.' });
      setPasswords({ current: '', new: '', confirm: '' });
    } else {
      setStatus({ type: 'error', msg: 'Erro ao atualizar perfil.' });
    }
  };

  return (
    <div className="p-10 min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Configurações da Conta</h2>
        <p className="text-slate-500 mb-8">Gerencie suas credenciais de acesso.</p>

        {/* Profile Info Card (Read Only) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <UserIcon className="text-blue-600" size={20} /> Informações Pessoais
           </h3>
           <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Nome Completo</label>
                <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium">
                   {user.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Endereço de E-mail (Imutável)</label>
                <div className="px-4 py-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-500 font-mono flex items-center justify-between">
                   {user.email}
                   <Lock size={14} className="text-slate-400" />
                </div>
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                  <ShieldAlert size={12} />
                  O e-mail é seu identificador único no sistema e não pode ser alterado.
                </p>
              </div>
           </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Lock className="text-blue-600" size={20} /> Alterar Senha (Refazer)
           </h3>
           
           <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Senha Atual</label>
                <input 
                  type="password" 
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                  value={passwords.current}
                  onChange={e => setPasswords({...passwords, current: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nova Senha</label>
                    <input 
                    type="password" 
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                    value={passwords.new}
                    onChange={e => setPasswords({...passwords, new: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirmar Nova Senha</label>
                    <input 
                    type="password" 
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                    value={passwords.confirm}
                    onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                    />
                </div>
              </div>

              {status.msg && (
                <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {status.msg}
                </div>
              )}

              <div className="pt-4">
                <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all"
                >
                    <Save size={18} /> Atualizar Credenciais
                </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;