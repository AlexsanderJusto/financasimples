
import React, { useState, useEffect } from 'react';
import { Wallet, Lock, User as UserIcon, ArrowRight, ShieldCheck, Sparkles, ArrowLeft, RefreshCw, Key } from 'lucide-react';
import { User } from '../types.ts';

interface AuthProps {
  onLogin: (user: User) => void;
}

const DEFAULT_USERS: User[] = [
  { id: 'alex_master', name: 'Alex', password: 'Alexfedex123@', role: 'ADMIN' },
  { id: 'gabriel_user', name: 'Gabriel', password: '123456', role: 'USER' },
  { id: 'matheus_user', name: 'Matheus', password: '123456', role: 'USER' }
];

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize fixed users if not exists
  useEffect(() => {
    const existing = localStorage.getItem('fs_fixed_users');
    if (!existing) {
      localStorage.setItem('fs_fixed_users', JSON.stringify(DEFAULT_USERS));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const storedUsers: User[] = JSON.parse(localStorage.getItem('fs_fixed_users') || '[]');
      const user = storedUsers.find(u => u.id === selectedUser.id);

      if (user && user.password === password) {
        const { password: _, ...safeUser } = user;
        sessionStorage.setItem('fs_logged_user', JSON.stringify(safeUser));
        onLogin(safeUser);
      } else {
        setError('Senha incorreta.');
      }
      setIsLoading(false);
    }, 800);
  };

  const storedUsers: User[] = JSON.parse(localStorage.getItem('fs_fixed_users') || JSON.stringify(DEFAULT_USERS));

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/10 blur-[120px] rounded-full"></div>
      
      <div className="w-full max-w-[500px] z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/30 mb-6 transition-transform hover:scale-105">
            <Wallet className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Finança Simplificada</h1>
          <p className="text-slate-500 font-medium text-center">Acesse seu painel financeiro exclusivo.</p>
        </div>

        <div className="auth-card rounded-[2.5rem] p-8 md:p-10 shadow-3xl bg-slate-900/60 backdrop-blur-xl border border-white/5">
          {!selectedUser ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white text-center mb-8">Quem está acessando?</h2>
              <div className="grid grid-cols-1 gap-4">
                {storedUsers.map(u => (
                  <button 
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className="flex items-center gap-5 p-5 bg-slate-800/40 hover:bg-blue-600/20 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                      <UserIcon size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-black text-white">{u.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Acessar Conta</p>
                    </div>
                    <ArrowRight className="ml-auto text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6 animate-in slide-in-from-right-10 duration-300">
              <button 
                type="button"
                onClick={() => { setSelectedUser(null); setPassword(''); setError(''); }}
                className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase mb-6"
              >
                <ArrowLeft size={14} /> Voltar à seleção
              </button>

              <div className="flex items-center gap-4 mb-8 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-black text-white">{selectedUser.name}</p>
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Insira sua senha</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Lock size={12} /> Senha</label>
                <div className="relative">
                   <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                   <input 
                    required 
                    autoFocus
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-12 py-4 text-white focus:border-blue-500 focus:outline-none transition-all font-bold placeholder:text-slate-800" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                   />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-3 animate-shake">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> {error}
                </div>
              )}

              <button disabled={isLoading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                {isLoading ? <RefreshCw className="animate-spin" /> : <>Entrar no Sistema <ArrowRight size={20} /></>}
              </button>
            </form>
          )}

          <div className="mt-10 pt-8 border-t border-slate-800/50 flex items-center gap-4 justify-center">
            <div className="flex items-center gap-2 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
              <ShieldCheck size={14} /> Sistema Protegido
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-800"></div>
            <div className="flex items-center gap-2 text-[9px] font-black text-blue-400 uppercase tracking-widest">
              <Sparkles size={14} /> Dados em Nuvem
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
