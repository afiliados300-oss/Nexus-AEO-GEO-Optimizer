import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { authenticateUser, addUser, initDatabase } from '../services/storageService';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    initDatabase();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    const cleanEmail = email.trim();
    const cleanPass = password.trim();

    if (isLoginMode) {
      // Login Logic
      const user = authenticateUser(cleanEmail, cleanPass);
      if (user) {
        onLogin(user);
      } else {
        setError('E-mail ou senha inválidos.');
      }
    } else {
      // Register Logic
      const created = addUser(cleanEmail, cleanPass, name || 'Novo Usuário');
      if (created) {
        setSuccessMsg('Conta criada! Entrando...');
        setTimeout(() => {
           const user = authenticateUser(cleanEmail, cleanPass);
           onLogin(user);
        }, 1000);
      } else {
        setError('Este e-mail já está cadastrado.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
        <div className="p-8 bg-slate-50 border-b border-slate-100 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Nexus Core</h1>
          <p className="text-slate-500 text-sm mt-2">
            {isLoginMode ? 'Acesso Seguro ao Sistema Enterprise' : 'Registro de Novo Membro'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black placeholder-slate-400"
                placeholder="João da Silva"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Endereço de E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black placeholder-slate-400"
                placeholder="nome@empresa.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg border border-red-100">{error}</p>}
          {successMsg && <p className="text-green-500 text-sm text-center font-medium bg-green-50 py-2 rounded-lg border border-green-100">{successMsg}</p>}

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            {isLoginMode ? 'Acessar Sistema' : 'Criar Conta'} 
            <ArrowRight size={20} />
          </button>
        </form>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <button 
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center gap-2 w-full"
          >
            {isLoginMode ? (
              <>Novo aqui? <UserPlus size={16} /> Criar uma conta</>
            ) : (
              <>Já tem uma conta? <LogIn size={16} /> Entrar</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;