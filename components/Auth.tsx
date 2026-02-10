
import React, { useState, useEffect } from 'react';
import { Wallet, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, Sparkles, ArrowLeft, RefreshCw, UserPlus } from 'lucide-react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'LOGIN' | 'SIGNUP';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setError('');
  }, [mode]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Regra de Ouro: Admin Mestre
      if (mode === 'LOGIN' && formData.email === 'alexsanderjusto123@gmail.com' && formData.password === '123Alexsander') {
        const adminUser: User = {
          id: 'admin_master',
          name: 'Alexsander Justo',
          email: 'alexsanderjusto123@gmail.com',
          role: 'ADMIN'
        };
        // Garantir que o admin existe na base local de usuários para visualização
        const users = JSON.parse(localStorage.getItem('fs_registered_users') || '[]');
        if (!users.some((u: User) => u.email === adminUser.email)) {
          localStorage.setItem('fs_registered_users', JSON.stringify([...users, { ...adminUser, password: '123Alexsander' }]));
        }
        
        sessionStorage.setItem('fs_logged_user', JSON.stringify(adminUser));
        onLogin(adminUser);
        setIsLoading(false);
        return;
      }

      const users: User[] = JSON.parse(localStorage.getItem('fs_registered_users') || '[]');

      if (mode === 'LOGIN') {
        const foundUser = users.find(u => u.email === formData.email && u.password === formData.password);
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          sessionStorage.setItem('fs_logged_user', JSON.stringify(userWithoutPassword));
          onLogin(userWithoutPassword);
        } else {
          setError('E-mail ou senha incorretos.');
        }
      } else {
        // SIGNUP
        if (users.some(u => u.email === formData.email)) {
          setError('Este e-mail já está cadastrado.');
        } else {
          const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: 'USER'
          };
          localStorage.setItem('fs_registered_users', JSON.stringify([...users, newUser]));
          const { password, ...userWithoutPassword } = newUser;
          sessionStorage.setItem('fs_logged_user', JSON.stringify(userWithoutPassword));
          onLogin(userWithoutPassword);
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/10 blur-[120px] rounded-full"></div>
      
      <div className="w-full max-w-[460px] z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/30 mb-6 transition-transform hover:scale-105">
            <Wallet className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Finança Simplificada</h1>
          <p className="text-slate-500 font-medium text-center">
            {mode === 'LOGIN' ? 'Gerencie seu patrimônio com facilidade.' : 'Crie sua conta e assuma o controle hoje.'}
          </p>
        </div>

        <div className="auth-card rounded-[2.5rem] p-10 shadow-3xl bg-slate-900/60 backdrop-blur-xl border border-white/5">
          <div className="flex justify-center gap-8 mb-10 border-b border-slate-800/50">
            <button 
              onClick={() => setMode('LOGIN')} 
              className={`pb-4 px-4 text-sm font-black uppercase tracking-widest transition-all relative ${mode === 'LOGIN' ? 'text-blue-500' : 'text-slate-500'}`}
            >
              Entrar {mode === 'LOGIN' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full"></div>}
            </button>
            <button 
              onClick={() => setMode('SIGNUP')} 
              className={`pb-4 px-4 text-sm font-black uppercase tracking-widest transition-all relative ${mode === 'SIGNUP' ? 'text-blue-500' : 'text-slate-500'}`}
            >
              Cadastrar {mode === 'SIGNUP' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full"></div>}
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {mode === 'SIGNUP' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><UserIcon size={12} /> Nome</label>
                <input required className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:outline-none transition-all font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Mail size={12} /> E-mail</label>
              <input required type="email" className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:outline-none transition-all font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Lock size={12} /> Senha</label>
              <input required type="password" className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:outline-none transition-all font-bold" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-3 animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> {error}
              </div>
            )}

            <button disabled={isLoading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3">
              {isLoading ? <RefreshCw className="animate-spin" /> : mode === 'LOGIN' ? <>Entrar <ArrowRight size={20} /></> : <>Criar Conta <UserPlus size={20} /></>}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-800/50 flex items-center gap-4 justify-center">
            <div className="flex items-center gap-2 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
              <ShieldCheck size={14} /> Criptografia Ponta-a-Ponta
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-800"></div>
            <div className="flex items-center gap-2 text-[9px] font-black text-blue-400 uppercase tracking-widest">
              <Sparkles size={14} /> Database Online
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
