
import React, { useState } from 'react';
// Added missing DollarSign icon import from lucide-react
import { Plus, Trash2, Search, Calendar, Tag, CreditCard, ChevronDown, DollarSign } from 'lucide-react';
import { Transaction, TransactionType } from '../types.ts';

interface TransactionsViewProps {
  transactions: Transaction[];
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
}

const TransactionsView: React.FC<TransactionsViewProps> = ({ transactions, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Lazer',
    type: 'EXPENSE' as TransactionType,
    date: new Date().toISOString().split('T')[0]
  });

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.date) return;
    
    onAdd({
      description: formData.description,
      amount: Math.abs(parseFloat(formData.amount)),
      category: formData.category,
      type: formData.type,
      date: formData.date
    });
    setFormData({
      description: '',
      amount: '',
      category: 'Lazer',
      type: 'EXPENSE',
      date: new Date().toISOString().split('T')[0]
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:w-[400px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar histórico..." 
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="w-full md:w-auto bg-white hover:bg-slate-100 text-black px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-95"
        >
          {isAdding ? "Fechar Painel" : "Nova Movimentação"}
          <Plus size={22} className={isAdding ? "rotate-45 transition-transform" : "transition-transform"} />
        </button>
      </div>

      {isAdding && (
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-3xl animate-in slide-in-from-top-10 duration-500 ease-out">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <CreditCard className="text-white" size={20} />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">Registro Manual</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Tag size={12} /> O que foi?
              </label>
              <input 
                required
                placeholder="Ex: Aluguel, Uber, Jantar..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold placeholder:font-normal placeholder:text-slate-700"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <DollarSign size={12} /> Quanto custou?
              </label>
              <input 
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-mono font-bold"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} /> Quando foi?
              </label>
              <input 
                required
                type="date"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Categoria</label>
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Lazer">Lazer</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Moradia">Moradia</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Salário">Salário</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Educação">Educação</option>
                  <option value="Outros">Outros</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fluxo</label>
              <div className="flex bg-slate-950 border border-slate-800 rounded-2xl p-1.5 h-[62px]">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'EXPENSE'})}
                  className={`flex-1 rounded-xl font-bold text-sm transition-all ${formData.type === 'EXPENSE' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Gasto
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'INCOME'})}
                  className={`flex-1 rounded-xl font-bold text-sm transition-all ${formData.type === 'INCOME' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Ganho
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all transform active:scale-[0.98]">
                Confirmar Registro
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800/50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Data</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Descrição</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Categoria</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Valor</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Controle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-blue-500/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                      <span className="text-sm text-slate-400 font-mono font-bold tracking-tighter">
                        {new Date(t.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-slate-200">{t.description}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 text-slate-400 rounded-lg font-black uppercase tracking-wider">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`font-black font-mono text-lg tracking-tighter ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.type === 'INCOME' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="p-3 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center text-slate-600">
                    <div className="flex flex-col items-center gap-4">
                      <CreditCard size={48} className="text-slate-800 mb-2" />
                      <p className="text-lg font-bold tracking-tight">O silêncio é ouro, mas aqui é apenas falta de dados.</p>
                      <p className="text-sm font-medium">Crie sua primeira transação manual no botão acima.</p>
                    </div>
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

export default TransactionsView;
