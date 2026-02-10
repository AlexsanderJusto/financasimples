
import React, { useMemo } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { FinancialData } from '../types.ts';

interface DashboardProps {
  data: FinancialData;
  totals: { incomes: number; expenses: number; balance: number };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard: React.FC<DashboardProps> = ({ data, totals }) => {
  // Aggregate data for category pie chart
  const categoryData = useMemo(() => {
    return data.transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc: any[], t) => {
        const existing = acc.find(item => item.name === t.category);
        if (existing) {
          existing.value += t.amount;
        } else {
          acc.push({ name: t.category, value: t.amount });
        }
        return acc;
      }, [])
      .sort((a, b) => b.value - a.value);
  }, [data.transactions]);

  // Calculate real trend data based on the last 7 days of transactions
  const trendData = useMemo(() => {
    const last7Days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayTransactions = data.transactions.filter(t => t.date === dateStr);
      const income = dayTransactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
      const expense = dayTransactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
      
      last7Days.push({
        name: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
        fullDate: dateStr,
        income,
        expense
      });
    }
    return last7Days;
  }, [data.transactions]);

  return (
    <div className="space-y-8">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Entradas" 
          value={totals.incomes} 
          color="green" 
          icon={<ArrowUpRight className="text-emerald-400" />} 
        />
        <StatCard 
          title="Saídas" 
          value={totals.expenses} 
          color="red" 
          icon={<ArrowDownRight className="text-rose-400" />} 
        />
        <StatCard 
          title="Patrimônio" 
          value={totals.balance} 
          color="blue" 
          icon={<TrendingUp className="text-blue-400" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Chart */}
        <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="text-blue-500" size={24} /> Atividade Recente
              </h3>
              <p className="text-slate-500 text-sm mt-1 font-medium">Últimos 7 dias de movimentação real</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(val) => `R$${val}`} tick={{fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="income" name="Entrada" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={4} />
                <Area type="monotone" dataKey="expense" name="Saída" stroke="#3b82f6" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <h3 className="text-xl font-bold text-white mb-2">Onde está o dinheiro?</h3>
          <p className="text-slate-500 text-sm mb-8 font-medium">Distribuição por categorias de gasto</p>
          
          <div className="h-72 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">GASTO TOTAL</span>
              <span className="text-3xl font-black text-white font-mono tracking-tighter">
                R${totals.expenses.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
             {categoryData.slice(0, 4).map((item, idx) => (
               <div key={item.name} className="flex items-center gap-3 bg-slate-800/30 p-2.5 rounded-xl border border-slate-700/30">
                 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                 <span className="text-xs text-slate-300 font-bold truncate uppercase tracking-tighter">{item.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  color: 'green' | 'red' | 'blue';
  icon: React.ReactNode;
}

const StatCard = ({ title, value, color, icon }: StatCardProps) => {
  const bgColors = {
    green: 'bg-emerald-500/5 border-emerald-500/10',
    red: 'bg-rose-500/5 border-rose-500/10',
    blue: 'bg-blue-500/5 border-blue-500/10',
  };

  return (
    <div className={`p-8 rounded-[2rem] border ${bgColors[color]} shadow-xl group hover:scale-[1.02] transition-transform duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</p>
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner group-hover:rotate-12 transition-transform">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-3xl font-black text-white font-mono tracking-tighter">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
        </p>
        <div className="flex items-center gap-1 mt-2">
          <div className={`w-1 h-1 rounded-full ${color === 'green' ? 'bg-emerald-500' : color === 'red' ? 'bg-rose-500' : 'bg-blue-500'}`}></div>
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Consolidado</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
