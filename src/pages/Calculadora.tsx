import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronRight, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  Car,
  Heart,
  Wallet,
  ArrowLeft,
  Trash2,
  List,
  Edit2
} from 'lucide-react';
import { format, differenceInDays, addDays, parseISO, isWednesday, getDay, startOfDay, isBefore, isEqual, isAfter, nextDay, Day } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// --- TYPES ---
type DayRecord = {
  date: string; // YYYY-MM-DD
  netEarnings: number;
};

type Commitment = {
  id: string;
  name: string;
  amount: number;
  date: string | null; // YYYY-MM-DD or null if flexible
  isRecurrent: boolean; 
  recurrenceDay?: number; // 0-6 (0 = Sunday, 3 = Wednesday)
  priority: 'high' | 'medium' | 'low';
};

type AppState = {
  records: DayRecord[];
  commitments: Commitment[];
  currentBalance: number;
  historyVersion: number;
};

// --- INITIAL STATE ---
const INITIAL_STATE: AppState = {
  records: [],
  commitments: [
    { id: 'car', name: 'Aluguel do Carro', amount: 700, date: null, isRecurrent: true, recurrenceDay: 3, priority: 'high' },
  ],
  currentBalance: 0,
  historyVersion: 2, // Bumped version to force a reset if they had the old one, but we'll handle gracefully
};

// --- STORE LOGIC ---
const useStore = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('@UberFinancas:state_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse state', e);
      }
    } else {
      localStorage.removeItem('@UberFinancas:state');
    }
    return INITIAL_STATE;
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('@UberFinancas:state_v2', JSON.stringify(state));
    }
  }, [state, loaded]);

  return { state, setState, loaded };
};

// --- CORE CALCULATIONS ---

type FutureCommitment = {
  date: string; // YYYY-MM-DD
  name: string;
  amount: number;
  originalId: string;
};

// Gera a lista de compromissos para os próximos 30 dias
const generateTimeline = (commitments: Commitment[], startDate: Date = new Date(), daysToLookAhead: number = 30) => {
  const timeline: FutureCommitment[] = [];
  const start = startOfDay(startDate);
  const end = addDays(start, daysToLookAhead);

  commitments.forEach(c => {
    if (c.isRecurrent && c.recurrenceDay !== undefined) {
      // Se hoje já é o dia e ainda não passou (ou mesmo se for hoje, a gente conta pra projetar),
      // Vamos adicionar todas as ocorrências nos próximos X dias.
      for (let i = 0; i <= daysToLookAhead; i++) {
        const checkDate = addDays(start, i);
        if (getDay(checkDate) === c.recurrenceDay) {
          timeline.push({
            date: format(checkDate, 'yyyy-MM-dd'),
            name: c.name,
            amount: c.amount,
            originalId: c.id
          });
        }
      }
    } else if (c.date) {
      const cDate = parseISO(c.date);
      if ((isAfter(cDate, start) || isEqual(cDate, start)) && isBefore(cDate, end)) {
        timeline.push({
          date: c.date,
          name: c.name,
          amount: c.amount,
          originalId: c.id
        });
      }
    }
  });

  return timeline.sort((a, b) => a.date.localeCompare(b.date));
};

// --- COMPONENTS ---

export default function Calculadora() {
  const { state, setState, loaded } = useStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'register' | 'commitments' | 'history'>('dashboard');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  if (!loaded) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;

  // Para registrar o ganho e aumentar o caixa:
  const handleSaveDay = (amount: number, dateStr: string) => {
    const isExisting = state.records.find(r => r.date === dateStr);
    const diff = isExisting ? amount - isExisting.netEarnings : amount;

    const newRecords = isExisting 
      ? state.records.map(r => r.date === dateStr ? { ...r, netEarnings: amount } : r)
      : [...state.records, { date: dateStr, netEarnings: amount }];

    setState(prev => ({
      ...prev,
      records: newRecords,
      currentBalance: prev.currentBalance + diff
    }));

    if (amount >= 200) {
      setFeedbackMsg(`Excelente! R$ ${amount.toFixed(2)} pro caixa. Você tá voando! 🚀`);
    } else if (amount > 0) {
      setFeedbackMsg(`Muito bem! R$ ${amount.toFixed(2)} salvos pro caixa. 👍`);
    }
    
    setTimeout(() => {
      setActiveTab('dashboard');
      setFeedbackMsg('');
    }, 4000);
  };

  const handleDeleteDay = (dateStr: string) => {
    const isExisting = state.records.find(r => r.date === dateStr);
    if (!isExisting) return;

    const newRecords = state.records.filter(r => r.date !== dateStr);

    setState(prev => ({
      ...prev,
      records: newRecords,
      currentBalance: prev.currentBalance - isExisting.netEarnings
    }));

    setFeedbackMsg('Registro apagado com sucesso.');
    setTimeout(() => {
      setFeedbackMsg('');
    }, 3000);
  };

  const handleUpdateBalance = (newBalance: number) => {
    setState(prev => ({ ...prev, currentBalance: newBalance }));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 font-sans">
      <header className="bg-[#8A05BE] text-white p-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold tracking-tight">Copiloto Financeiro</h1>
        <p className="opacity-90 text-sm mt-1">Previsão e segurança</p>
      </header>

      {feedbackMsg && (
        <div className="fixed top-4 left-4 right-4 bg-green-600 text-white p-4 rounded-2xl shadow-2xl z-50 animate-bounce">
          <p className="font-bold text-lg">{feedbackMsg}</p>
        </div>
      )}

      <main className="p-4 space-y-4">
        {activeTab === 'dashboard' && <Dashboard state={state} onNav={setActiveTab} onUpdateBalance={handleUpdateBalance} />}
        {activeTab === 'register' && <DayRegister onSave={handleSaveDay} onCancel={() => setActiveTab('dashboard')} />}
        {activeTab === 'commitments' && <CommitmentsManager state={state} setState={setState} onBack={() => setActiveTab('dashboard')} />}
        {activeTab === 'history' && <HistoryTab state={state} onDelete={handleDeleteDay} onBack={() => setActiveTab('dashboard')} />}
      </main>

      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-3 pb-safe z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <NavItem icon={<TrendingUp size={24} />} label="Início" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavItem icon={<Plus size={24} />} label="Lançar" active={activeTab === 'register'} onClick={() => setActiveTab('register')} />
        <NavItem icon={<List size={24} />} label="Histórico" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        <NavItem icon={<CalendarIcon size={24} />} label="Contas" active={activeTab === 'commitments'} onClick={() => setActiveTab('commitments')} />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center p-2 rounded-xl transition-colors ${active ? 'text-[#8A05BE]' : 'text-gray-400'}`}>
      {icon}
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  );
}

// --- DASHBOARD COMPONENT ---
function Dashboard({ state, onNav, onUpdateBalance }: { state: AppState, onNav: (v: 'dashboard' | 'register' | 'commitments' | 'history') => void, onUpdateBalance: (val: number) => void }) {
  const [editingBalance, setEditingBalance] = useState(false);
  const [tempBalance, setTempBalance] = useState(state.currentBalance.toString());

  // Média de 7 dias
  const sortedRecords = [...state.records].sort((a, b) => b.date.localeCompare(a.date));
  const last7Days = sortedRecords.slice(0, 7);
  const sum7Days = last7Days.reduce((acc, r) => acc + r.netEarnings, 0);
  const avg7Days = last7Days.length > 0 ? sum7Days / last7Days.length : 0;

  const timeline = useMemo(() => generateTimeline(state.commitments, new Date(), 30), [state.commitments]);

  // Cálculos de Copiloto Financeiro
  let requiredAverage = 0;
  let minSimulatedBalance = Infinity;
  let totalCommitments = 0;
  let status: 'green' | 'yellow' | 'red' = 'green';

  if (timeline.length > 0) {
    // Calcular "X" necessário por dia
    // Para cada compromisso no futuro, X >= (Soma compromissos até dia D - Saldo Atual) / Dias até D
    let accCommitments = 0;
    let maxRequiredPerDay = 0;

    timeline.forEach(t => {
      accCommitments += t.amount;
      const daysUntil = differenceInDays(parseISO(t.date), startOfDay(new Date()));
      if (daysUntil > 0) {
        const requiredForThis = (accCommitments - state.currentBalance) / daysUntil;
        if (requiredForThis > maxRequiredPerDay) {
          maxRequiredPerDay = requiredForThis;
        }
      } else if (daysUntil === 0) {
        // Se vence hoje, tem que ter o dinheiro hoje.
        const shortfall = accCommitments - state.currentBalance;
        if (shortfall > 0) {
          // Se falta dinheiro pra hoje, tem que fazer tudo hoje!
          if (shortfall > maxRequiredPerDay) maxRequiredPerDay = shortfall;
        }
      }
    });

    requiredAverage = Math.max(0, maxRequiredPerDay);
    totalCommitments = accCommitments;

    // Simulação com a média atual (avg7Days) para ver se ele sobrevive
    let simBalance = state.currentBalance;
    let currentSimDate = startOfDay(new Date());

    timeline.forEach(t => {
      const tDate = parseISO(t.date);
      const daysPassed = differenceInDays(tDate, currentSimDate);
      if (daysPassed > 0) {
        simBalance += (daysPassed * avg7Days);
      }
      simBalance -= t.amount;
      if (simBalance < minSimulatedBalance) minSimulatedBalance = simBalance;
      currentSimDate = tDate;
    });

    if (minSimulatedBalance < 0) {
      status = 'red';
    } else if (minSimulatedBalance < (totalCommitments * 0.15)) {
      status = 'yellow';
    } else {
      status = 'green';
    }
  }

  const saveBalance = () => {
    const val = parseFloat(tempBalance) || 0;
    onUpdateBalance(val);
    setEditingBalance(false);
  };

  const getStatusConfig = () => {
    switch(status) {
      case 'red': return { bg: 'bg-red-500', icon: <AlertCircle className="text-white" size={24}/>, label: 'Risco Elevado', text: `Atenção: No ritmo atual, faltarão aproximadamente R$ ${Math.abs(minSimulatedBalance).toFixed(0)} para as próximas contas.` };
      case 'yellow': return { bg: 'bg-orange-500', icon: <AlertCircle className="text-white" size={24}/>, label: 'Apertado', text: 'Você vai conseguir pagar as contas, mas a margem de sobra está muito pequena.' };
      case 'green': return { bg: 'bg-green-500', icon: <CheckCircle2 className="text-white" size={24}/>, label: 'Seguro', text: 'Tudo tranquilo! Você conseguirá pagar todos os compromissos com folga.' };
    }
  };

  const statusConf = getStatusConfig();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* STATUS HEADER */}
      <div className={`${statusConf.bg} p-4 rounded-3xl shadow-md text-white flex items-center gap-4`}>
        {statusConf.icon}
        <div>
          <h3 className="font-bold text-lg">{statusConf.label}</h3>
          <p className="text-sm opacity-90 leading-tight">{statusConf.text}</p>
        </div>
      </div>

      {/* SALDO ATUAL */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-gray-500 font-bold text-sm uppercase mb-1">Saldo em Caixa (Hoje)</h2>
          {editingBalance ? (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-black text-gray-900">R$</span>
              <input 
                type="number" 
                value={tempBalance} 
                onChange={(e) => setTempBalance(e.target.value)}
                className="text-3xl font-black text-gray-900 w-32 border-b-2 border-[#8A05BE] outline-none bg-transparent"
                autoFocus
              />
            </div>
          ) : (
            <div className="text-4xl font-black text-gray-900 flex items-center gap-2">
              R$ {state.currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          )}
        </div>
        <div>
          {editingBalance ? (
            <button onClick={saveBalance} className="bg-[#8A05BE] text-white p-3 rounded-xl font-bold">Salvar</button>
          ) : (
            <button onClick={() => setEditingBalance(true)} className="p-3 bg-gray-50 rounded-xl text-gray-500"><Edit2 size={20}/></button>
          )}
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-xs font-bold uppercase mb-1">Ritmo Necessário</div>
          <div className="text-2xl font-black text-blue-600">R$ {requiredAverage.toFixed(0)}<span className="text-sm font-medium text-gray-500">/dia</span></div>
          <p className="text-[10px] text-gray-400 mt-1 leading-tight">Para fechar todas as contas no azul</p>
        </div>
        
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-xs font-bold uppercase mb-1">Sua Média (7 dias)</div>
          <div className="text-2xl font-black text-[#8A05BE]">R$ {avg7Days.toFixed(0)}<span className="text-sm font-medium text-gray-500">/dia</span></div>
          <p className="text-[10px] text-gray-400 mt-1 leading-tight">Ritmo que você está fazendo</p>
        </div>
      </div>

      {/* PROJEÇÃO DE CAIXA */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-gray-900 font-bold mb-4 flex items-center gap-2"><TrendingUp className="text-[#8A05BE]"/> Próximos Pagamentos</h2>
        
        {timeline.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum compromisso para os próximos 30 dias.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-bold text-gray-400 mb-2 border-b pb-2">
              <span>Data</span>
              <span>Saída</span>
            </div>
            {timeline.slice(0, 3).map((t, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">{t.name}</span>
                  <span className="text-gray-500 text-xs">{format(parseISO(t.date), "dd/MMM")} ({differenceInDays(parseISO(t.date), new Date())} dias)</span>
                </div>
                <span className="font-black text-red-500">−R$ {t.amount}</span>
              </div>
            ))}
            {timeline.length > 3 && (
              <div className="text-center text-xs font-bold text-gray-400 pt-2 border-t mt-2">
                + {timeline.length - 3} outros compromissos no mês
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-gray-100 rounded-3xl p-5 mb-4 text-center">
        <p className="text-gray-700 font-medium text-sm">
          {status === 'red' ? 
            `Dica: Se fizer R$ ${(requiredAverage + 10).toFixed(0)} líquidos por dia até os próximos pagamentos, você paga tudo tranquilo.` : 
            status === 'yellow' ? 
            `Dica: Mantenha a média acima de R$ ${requiredAverage.toFixed(0)} para sair do sufoco.` : 
            `Dica: Mantenha o ritmo! Sua projeção de saldo é positiva.`
          }
        </p>
      </div>

      {/* ACTION BUTTONS */}
      <button 
        onClick={() => onNav('register')}
        className="w-full bg-[#8A05BE] text-white py-5 rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 mb-4"
      >
        <Plus size={28} /> LANÇAR DIA DE HOJE
      </button>

    </div>
  );
}

// --- DAY REGISTER COMPONENT ---
function DayRegister({ onSave, onCancel }: { onSave: (amount: number, date: string) => void, onCancel: () => void }) {
  const [amountStr, setAmountStr] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleKeypad = (num: string) => {
    if (num === 'back') {
      setAmountStr(prev => prev.slice(0, -1));
    } else {
      setAmountStr(prev => prev + num);
    }
  };

  const handleSave = () => {
    const val = parseFloat(amountStr) / 100;
    if (val > 0) {
      onSave(val, selectedDate);
    }
  };

  const displayVal = (parseFloat(amountStr || '0') / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  return (
    <div className="animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="p-2 bg-gray-200 rounded-full"><ArrowLeft size={24} /></button>
        <h2 className="text-2xl font-black text-gray-900">Novo Ganho</h2>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 flex flex-col items-center">
        <span className="text-gray-500 font-bold mb-2">Quanto você fez líquido?</span>
        <div className="text-5xl font-black text-[#8A05BE] my-4">
          R$ {displayVal}
        </div>
        <input 
          type="date" 
          value={selectedDate}
          max={format(new Date(), 'yyyy-MM-dd')}
          onChange={e => setSelectedDate(e.target.value)}
          className="mt-4 bg-gray-50 border-none rounded-xl p-3 text-sm font-bold outline-none text-gray-600"
        />
      </div>

      {/* NUMPAD */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} onClick={() => handleKeypad(n.toString())} className="bg-white py-4 text-2xl font-bold rounded-2xl shadow-sm active:bg-gray-100 transition-colors border border-gray-50">
            {n}
          </button>
        ))}
        <div />
        <button onClick={() => handleKeypad('0')} className="bg-white py-4 text-2xl font-bold rounded-2xl shadow-sm active:bg-gray-100 transition-colors border border-gray-50">0</button>
        <button onClick={() => handleKeypad('back')} className="bg-white py-4 text-2xl font-bold rounded-2xl shadow-sm active:bg-gray-100 transition-colors border border-gray-50 text-red-500">⌫</button>
      </div>

      <button 
        onClick={handleSave}
        disabled={!amountStr || amountStr === '0'}
        className="w-full bg-[#8A05BE] disabled:bg-gray-300 disabled:text-gray-500 text-white py-5 rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-transform"
      >
        ADICIONAR AO CAIXA
      </button>
    </div>
  );
}

// --- COMMITMENTS MANAGER COMPONENT ---
function CommitmentsManager({ state, setState, onBack }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>>, onBack: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  
  // New commitment form state
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [date, setDate] = useState('');
  const [recurrenceDay, setRecurrenceDay] = useState(3); // Default Wednesday

  const handleAdd = () => {
    if (!newName || !newAmount) return;
    
    const newComm: Commitment = {
      id: Math.random().toString(36).substring(7),
      name: newName,
      amount: parseFloat(newAmount),
      date: isRecurrent ? null : (date || null),
      isRecurrent,
      recurrenceDay: isRecurrent ? recurrenceDay : undefined,
      priority: 'high'
    };

    setState(prev => ({
      ...prev,
      commitments: [...prev.commitments, newComm]
    }));

    setShowAdd(false);
    setNewName(''); setNewAmount(''); setDate(''); setIsRecurrent(false);
  };

  const handleDelete = (id: string) => {
    setState(prev => ({
      ...prev,
      commitments: prev.commitments.filter(c => c.id !== id)
    }));
  };

  const getDayName = (d: number) => ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][d];

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-gray-200 rounded-full"><ArrowLeft size={24} /></button>
          <h2 className="text-2xl font-black text-gray-900">Contas a Pagar</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="p-2 bg-[#8A05BE] text-white rounded-full"><Plus size={24}/></button>
      </div>

      {showAdd && (
        <div className="bg-white p-5 rounded-3xl shadow-lg border border-purple-100 mb-6 animate-in slide-in-from-top-4">
          <h3 className="font-bold mb-4">Novo Compromisso</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Nome (Ex: Prestação Casa)" value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl" />
            <input type="number" placeholder="Valor (R$)" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl" />
            
            <div className="flex items-center gap-2 p-2">
              <input type="checkbox" checked={isRecurrent} onChange={e => setIsRecurrent(e.target.checked)} id="rec" className="w-5 h-5 accent-[#8A05BE]" />
              <label htmlFor="rec" className="font-bold text-gray-700">Se repete toda semana?</label>
            </div>

            {isRecurrent ? (
              <select value={recurrenceDay} onChange={e => setRecurrenceDay(Number(e.target.value))} className="w-full p-3 bg-gray-50 rounded-xl font-bold">
                {[0,1,2,3,4,5,6].map(d => <option key={d} value={d}>Toda {getDayName(d)}</option>)}
              </select>
            ) : (
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl" />
            )}

            <button onClick={handleAdd} className="w-full bg-[#8A05BE] text-white p-4 rounded-xl font-bold mt-2">Salvar Conta</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {state.commitments.length === 0 && <p className="text-gray-500 text-center py-10">Nenhuma conta cadastrada.</p>}
        {state.commitments.map(comm => (
          <div key={comm.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <div className="font-bold text-gray-900 text-lg">{comm.name}</div>
              <div className="text-sm font-medium text-gray-500">
                {comm.isRecurrent ? `Toda ${getDayName(comm.recurrenceDay!)}` : comm.date ? format(parseISO(comm.date), "dd/MM/yyyy") : 'Sem data fixa'}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-black text-xl text-gray-900">R$ {comm.amount}</div>
              </div>
              <button onClick={() => { if(window.confirm('Apagar conta?')) handleDelete(comm.id); }} className="p-2 text-red-300 hover:text-red-500 transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- HISTORY TAB COMPONENT ---
function HistoryTab({ state, onDelete, onBack }: { state: AppState, onDelete: (date: string) => void, onBack: () => void }) {
  const sortedRecords = [...state.records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 bg-gray-200 rounded-full"><ArrowLeft size={24} /></button>
        <h2 className="text-2xl font-black text-gray-900">Histórico de Ganhos</h2>
      </div>
      
      {sortedRecords.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">Nenhum registro ainda.</div>
      ) : (
        <div className="space-y-3">
          {sortedRecords.map(r => (
            <div key={r.date} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-900">{format(parseISO(r.date), "dd 'de' MMMM", { locale: ptBR })}</div>
                <div className="text-green-600 font-black text-lg">+ R$ {r.netEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </div>
              <button 
                onClick={() => {
                   if(window.confirm('Tem certeza que deseja apagar este ganho do caixa?')) {
                     onDelete(r.date);
                   }
                }}
                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
