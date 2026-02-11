
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ArrowUpCircle, 
  Wallet, 
  BarChart3, 
  Calendar as CalendarIcon,
  LogOut,
  Cloud,
  CheckCircle2,
  Settings as SettingsIcon,
  ShieldCheck
} from 'lucide-react';
import { AppTab, Transaction, FinancialData, FinancialReminder, User } from './types.ts';
import Dashboard from './components/Dashboard.tsx';
import TransactionsView from './components/TransactionsView.tsx';
import BudgetsView from './components/BudgetsView.tsx';
import CalendarView from './components/CalendarView.tsx';
import SettingsView from './components/SettingsView.tsx';
import Auth from './components/Auth.tsx';

const INITIAL_DATA: FinancialData = {
  transactions: [],
  budgets: [
    { category: 'Alimentação', limit: 1000, spent: 0 },
    { category: 'Moradia', limit: 2000, spent: 0 },
    { category: 'Lazer', limit: 500, spent: 0 }
  ],
  reminders: []
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<FinancialData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [isSyncing, setIsSyncing] = useState(false);

  // Auth & Session Handling
  useEffect(() => {
    const savedUser = sessionStorage.getItem('fs_logged_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      loadUserData(userData.id);
    }
  }, []);

  const loadUserData = (userId: string) => {
    const savedData = localStorage.getItem(`fs_data_${userId}`);
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      setData(INITIAL_DATA);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('fs_logged_user');
    setUser(null);
    setData(INITIAL_DATA);
    setActiveTab(AppTab.DASHBOARD);
  };

  const handlePasswordChange = (newPassword: string) => {
    if (!user) return;
    const storedUsers: User[] = JSON.parse(localStorage.getItem('fs_fixed_users') || '[]');
    const updatedUsers = storedUsers.map(u => u.id === user.id ? { ...u, password: newPassword } : u);
    localStorage.setItem('fs_fixed_users', JSON.stringify(updatedUsers));
  };

  // Auto-save logic
  useEffect(() => {
    if (user) {
      localStorage.setItem(`fs_data_${user.id}`, JSON.stringify(data));
      setIsSyncing(true);
      const timer = setTimeout(() => setIsSyncing(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [data, user]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: Math.random().toString(36).substr(2, 9) };
    setData(prev => {
      const updatedTransactions = [newTransaction, ...prev.transactions];
      updatedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const updatedBudgets = prev.budgets.map(b => {
        if (b.category === t.category && t.type === 'EXPENSE') {
          return { ...b, spent: b.spent + t.amount };
        }
        return b;
      });
      return { ...prev, transactions: updatedTransactions, budgets: updatedBudgets };
    });
  };

  const deleteTransaction = (id: string) => {
    setData(prev => {
      const transactionToDelete = prev.transactions.find(t => t.id === id);
      const updatedTransactions = prev.transactions.filter(t => t.id !== id);
      const updatedBudgets = prev.budgets.map(b => {
        if (transactionToDelete && b.category === transactionToDelete.category && transactionToDelete.type === 'EXPENSE') {
          return { ...b, spent: Math.max(0, b.spent - transactionToDelete.amount) };
        }
        return b;
      });
      return { ...prev, transactions: updatedTransactions, budgets: updatedBudgets };
    });
  };

  const addReminder = (r: Omit<FinancialReminder, 'id'>) => {
    const newReminder = { ...r, id: Math.random().toString(36).substr(2, 9) };
    setData(prev => ({ ...prev, reminders: [...(prev.reminders || []), newReminder] }));
  };

  const deleteReminder = (id: string) => {
    setData(prev => ({ ...prev, reminders: prev.reminders.filter(r => r.id !== id) }));
  };

  const totals = useMemo(() => {
    const incomes = data.transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
    const expenses = data.transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
    return { incomes, expenses, balance: incomes - expenses };
  }, [data.transactions]);

  if (!user) {
    return <Auth onLogin={(u) => { setUser(u); loadUserData(u.id); }} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 selection:bg-blue-500/30">
      {/* Sidebar */}
      <nav className="w-20 md:w-72 border-r border-slate-800/50 bg-slate-900/40 backdrop-blur-xl flex flex-col items-center md:items-stretch transition-all duration-300">
        <div className="p-8 mb-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
            <Wallet className="text-white w-7 h-7" />
          </div>
          <div className="hidden md:block">
            <h2 className="font-black text-lg text-white leading-tight tracking-tight">Finança</h2>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Simplificada</p>
          </div>
        </div>

        <div className="flex-1 px-4 space-y-2 overflow-y-auto">
          <NavItem active={activeTab === AppTab.DASHBOARD} onClick={() => setActiveTab(AppTab.DASHBOARD)} icon={<LayoutDashboard size={22} />} label="Dashboard" />
          <NavItem active={activeTab === AppTab.TRANSACTIONS} onClick={() => setActiveTab(AppTab.TRANSACTIONS)} icon={<ArrowUpCircle size={22} />} label="Transações" />
          <NavItem active={activeTab === AppTab.BUDGETS} onClick={() => setActiveTab(AppTab.BUDGETS)} icon={<BarChart3 size={22} />} label="Orçamentos" />
          <NavItem active={activeTab === AppTab.CALENDAR} onClick={() => setActiveTab(AppTab.CALENDAR)} icon={<CalendarIcon size={22} />} label="Agenda" />
          
          <div className="pt-4 mt-4 border-t border-slate-800/50">
            <NavItem 
              active={activeTab === AppTab.SETTINGS} 
              onClick={() => setActiveTab(AppTab.SETTINGS)} 
              icon={<SettingsIcon size={22} />} 
              label="Configurações" 
            />
          </div>
        </div>

        <div className="p-4 mt-auto">
          <div className="hidden md:block bg-slate-900/60 rounded-3xl p-5 border border-slate-800/50 shadow-inner">
             <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white relative">
                  {user.name.charAt(0)}
                  {user.role === 'ADMIN' && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.role}</p>
                </div>
             </div>
             <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all text-xs font-black uppercase tracking-widest"
             >
               <LogOut size={14} /> Sair
             </button>
          </div>
          <button onClick={handleLogout} className="md:hidden p-4 text-rose-500"><LogOut size={24} /></button>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">
                {activeTab === AppTab.DASHBOARD && `Olá, ${user.name}!`}
                {activeTab === AppTab.TRANSACTIONS && "Histórico"}
                {activeTab === AppTab.BUDGETS && "Metas"}
                {activeTab === AppTab.CALENDAR && "Agenda"}
                {activeTab === AppTab.SETTINGS && "Perfil & Segurança"}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-slate-500 font-medium">
                  Controle total da sua vida financeira.
                </p>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg">
                  {isSyncing ? (
                    <>
                      <Cloud className="text-blue-500 animate-pulse" size={12} />
                      <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Sincronizando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="text-emerald-500" size={12} />
                      <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Base Conectada</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
            {activeTab === AppTab.DASHBOARD && <Dashboard data={data} totals={totals} />}
            {activeTab === AppTab.TRANSACTIONS && <TransactionsView transactions={data.transactions} onAdd={addTransaction} onDelete={deleteTransaction} />}
            {activeTab === AppTab.BUDGETS && <BudgetsView budgets={data.budgets} />}
            {activeTab === AppTab.CALENDAR && (
              <CalendarView 
                transactions={data.transactions} 
                reminders={data.reminders || []} 
                onAddReminder={addReminder}
                onDeleteReminder={deleteReminder}
              />
            )}
            {activeTab === AppTab.SETTINGS && <SettingsView user={user} onUpdatePassword={handlePasswordChange} />}
          </div>
        </div>
      </main>
    </div>
  );
}

const NavItem = ({ active, icon, label, onClick }: { active: boolean, icon: any, label: string, onClick: any }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
      active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-200'
    }`}
  >
    <div className="shrink-0">{icon}</div>
    <span className="hidden md:block font-bold tracking-tight text-sm">{label}</span>
  </button>
);
