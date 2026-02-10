
import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Eye, EyeOff, Search, Trash2, Key } from 'lucide-react';
import { User } from '../types.ts';

const AdminView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('fs_registered_users') || '[]');
    setUsers(savedUsers);
  }, []);

  const togglePassword = (userId: string) => {
    setShowPasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário? Todos os dados financeiros serão perdidos.')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('fs_registered_users', JSON.stringify(updatedUsers));
      localStorage.removeItem(`fs_data_${userId}`);
      setUsers(updatedUsers);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Buscar usuário ou email..." 
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-blue-500 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
          <ShieldCheck className="text-blue-500" size={20} />
          <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Painel de Controle Mestre</span>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">ID</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Nome Completo</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">E-mail</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Credenciais</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-blue-500/5 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-mono text-slate-500">#{u.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-400">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-200">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm text-slate-400">{u.email}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <code className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-blue-500 font-mono text-xs">
                        {showPasswords[u.id] ? u.password : '••••••••'}
                      </code>
                      <button 
                        onClick={() => togglePassword(u.id)}
                        className="text-slate-600 hover:text-white transition-colors"
                      >
                        {showPasswords[u.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => deleteUser(u.id)}
                      className="p-3 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                      title="Excluir Usuário"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">
                    Nenhum usuário encontrado na base de dados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
