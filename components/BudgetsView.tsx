
import React from 'react';
import { Target, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { BudgetGoal } from '../types.ts';

interface BudgetsViewProps {
  budgets: BudgetGoal[];
}

const BudgetsView: React.FC<BudgetsViewProps> = ({ budgets }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {budgets.map((budget) => {
        const percentage = Math.min(100, (budget.spent / budget.limit) * 100);
        const isOver = budget.spent > budget.limit;
        const isNear = percentage > 80 && !isOver;

        return (
          <div key={budget.category} className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-md relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
            {isOver && (
              <div className="absolute top-0 right-0 p-6">
                <div className="bg-rose-500 p-2 rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse">
                   <AlertTriangle className="text-white" size={24} />
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-6 mb-10">
              <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-lg ${isOver ? 'bg-rose-500/10' : 'bg-blue-600/10'}`}>
                <Target className={isOver ? 'text-rose-500' : 'text-blue-500'} size={32} />
              </div>
              <div>
                <h4 className="text-2xl font-black text-white tracking-tight">{budget.category}</h4>
                <div className="flex items-center gap-2 mt-1">
                   <Zap size={12} className="text-slate-500" />
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Planejamento Ativo</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">EXECUTADO</p>
                  <p className={`text-3xl font-mono font-black tracking-tighter ${isOver ? 'text-rose-400' : 'text-white'}`}>
                    R${budget.spent.toLocaleString()}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">TETO</p>
                  <p className="text-xl font-mono text-slate-400 font-bold tracking-tighter">
                    R${budget.limit.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* High-tech Progress Bar */}
              <div className="relative h-4 w-full bg-slate-950 rounded-full overflow-hidden p-1 border border-slate-800/50">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.3)] ${
                    isOver ? 'bg-rose-500 shadow-rose-500/40' : isNear ? 'bg-amber-500 shadow-amber-500/40' : 'bg-blue-600 shadow-blue-500/40'
                  }`}
                  style={{ width: `${percentage}%` }}
                >
                  <div className="w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className={`text-xs font-black uppercase tracking-tighter px-3 py-1 rounded-lg ${isOver ? 'bg-rose-500/10 text-rose-500' : isNear ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {percentage.toFixed(0)}% Utilizado
                </span>
                <span className="text-slate-500 text-xs font-bold font-mono">
                  {isOver ? "EXCEDIDO" : `R$${(budget.limit - budget.spent).toLocaleString()} Livres`}
                </span>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-800/50">
               <div className="flex gap-4 items-center bg-slate-950/50 p-5 rounded-2xl border border-slate-800/50">
                 <ShieldCheck size={20} className={isOver ? 'text-slate-600' : 'text-emerald-500'} />
                 <p className="text-xs text-slate-400 font-medium leading-relaxed">
                   {isOver 
                     ? "Alerta crítico: Limite ultrapassado. Sugerimos realocar verba de outras categorias para equilibrar o mês."
                     : "Meta sob controle. Seu comportamento financeiro nesta categoria está saudável."}
                 </p>
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetsView;
