
import React, { useState } from 'react';
import { Key, ShieldCheck, CheckCircle2, User as UserIcon } from 'lucide-react';
import { User } from '../types.ts';

interface SettingsViewProps {
  user: User;
  onUpdatePassword: (newPassword: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdatePassword }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    onUpdatePassword(newPassword);
    setSuccess(true);
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-10 backdrop-blur-md">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
            <UserIcon size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{user.name}</h3>
            <p className="text-slate-500 font-medium">Informações da Conta Privada</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Key size={12} /> Nova Senha
            </label>
            <input 
              type="password"
              placeholder="Digite a nova senha"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Key size={12} /> Confirmar Nova Senha
            </label>
            <input 
              type="password"
              placeholder="Repita a nova senha"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-3">
              <CheckCircle2 size={16} /> Senha alterada com sucesso!
            </div>
          )}

          <button type="submit" className="w-full bg-white hover:bg-slate-100 text-black font-black py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98]">
            Atualizar Credenciais
          </button>
        </form>
      </div>

      <div className="bg-blue-600/5 border border-blue-500/10 rounded-3xl p-8 flex items-start gap-5">
        <ShieldCheck className="text-blue-500 shrink-0" size={24} />
        <div>
          <h4 className="text-white font-bold mb-2">Segurança dos Dados</h4>
          <p className="text-slate-500 text-sm leading-relaxed">
            Sua senha é armazenada localmente e criptografada pelo navegador. 
            Como não utilizamos e-mail para recuperação, certifique-se de não esquecer sua nova combinação.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
