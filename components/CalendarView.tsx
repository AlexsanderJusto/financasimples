
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Calendar as CalIcon, DollarSign, Clock } from 'lucide-react';
import { Transaction, FinancialReminder } from '../types';

interface CalendarViewProps {
  transactions: Transaction[];
  reminders: FinancialReminder[];
  onAddReminder: (r: Omit<FinancialReminder, 'id'>) => void;
  onDeleteReminder: (id: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ transactions, reminders, onAddReminder, onDeleteReminder }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: '', amount: '', date: new Date().toISOString().split('T')[0] });

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });

  const calendarDays = [];
  const totalDays = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);

  // Padding for start of month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  const getDayData = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTransactions = transactions.filter(t => t.date === dateStr);
    const dayReminders = reminders.filter(r => r.date === dateStr);
    return { transactions: dayTransactions, reminders: dayReminders };
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-8 backdrop-blur-md">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white capitalize">{monthName} <span className="text-slate-600 font-mono">{year}</span></h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-white"><ChevronLeft size={20}/></button>
            <button onClick={nextMonth} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-white"><ChevronRight size={20}/></button>
            <button onClick={() => setShowAddModal(true)} className="ml-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"><Plus size={18}/> Novo Lembrete</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest py-2">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} className="h-32 bg-slate-950/20 rounded-2xl border border-transparent"></div>;
            
            const data = getDayData(day);
            const hasActivity = data.transactions.length > 0 || data.reminders.length > 0;
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

            return (
              <div key={day} className={`h-32 p-3 rounded-2xl border transition-all ${isToday ? 'border-blue-500/50 bg-blue-500/5 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]' : 'border-slate-800/50 bg-slate-900/20 hover:bg-slate-800/40'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-black ${isToday ? 'text-blue-500' : 'text-slate-400'}`}>{day}</span>
                  {hasActivity && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>}
                </div>
                <div className="space-y-1 overflow-y-auto max-h-20">
                  {data.transactions.map(t => (
                    <div key={t.id} className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${t.type === 'INCOME' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'} truncate`}>
                      {t.description}
                    </div>
                  ))}
                  {data.reminders.map(r => (
                    <div key={r.id} className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 truncate flex justify-between group">
                      <span>{r.title}</span>
                      <button onClick={() => onDeleteReminder(r.id)} className="opacity-0 group-hover:opacity-100 text-rose-500"><Trash2 size={8}/></button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-8">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3"><Clock className="text-blue-500" /> Próximos Lembretes</h3>
          <div className="space-y-4">
            {reminders.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 4).map(r => (
              <div key={r.id} className="flex items-center justify-between bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center"><CalIcon size={18} className="text-blue-500"/></div>
                  <div>
                    <p className="font-bold text-white text-sm">{r.title}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{new Date(r.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {r.amount && <span className="font-mono text-xs font-bold text-slate-300">R${r.amount}</span>}
                  <button onClick={() => onDeleteReminder(r.id)} className="text-slate-600 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
            {reminders.length === 0 && <p className="text-slate-600 text-sm font-medium text-center py-8">Nenhum lembrete agendado.</p>}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-[2.5rem] p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-black text-white mb-4">Dica do Sistema</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Mantenha o sistema aberto ou "instale" como aplicativo no seu Android para receber alertas sonoros de contas que estão vencendo.
            </p>
            <div className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 transition-all cursor-pointer">
              Saiba como Instalar (PWA)
            </div>
          </div>
          <DollarSign className="absolute -bottom-10 -right-10 text-blue-500/5 w-64 h-64" />
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 w-full max-w-lg shadow-3xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-white mb-8">Agendar Lembrete</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase">Título</label>
                <input 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white font-bold"
                  placeholder="Ex: Pagar Internet"
                  value={newReminder.title}
                  onChange={e => setNewReminder({...newReminder, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Valor (Opcional)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white font-bold font-mono"
                    placeholder="0.00"
                    value={newReminder.amount}
                    onChange={e => setNewReminder({...newReminder, amount: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Data</label>
                  <input 
                    type="date"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-white font-bold"
                    value={newReminder.date}
                    onChange={e => setNewReminder({...newReminder, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => {
                    onAddReminder({ ...newReminder, amount: parseFloat(newReminder.amount) || 0, completed: false });
                    setShowAddModal(false);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-600/20"
                >
                  Salvar
                </button>
                <button onClick={() => setShowAddModal(false)} className="px-8 bg-slate-800 text-slate-400 font-bold rounded-xl">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
