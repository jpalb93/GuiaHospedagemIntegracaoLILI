import React, { useState, useEffect } from 'react';
import { Copy, Check, User as UserIcon, Lock, ExternalLink, AlertCircle, CheckCircle2, Send, Sparkles, Loader2, CalendarDays, Clock, LayoutGrid, LogIn, Trash2, Link as LinkIcon, Share2, History, UserCheck, ChevronDown, ChevronUp, Search, X, StickyNote, Eraser, LogOut, ArrowRightCircle, Pencil, Save, MessageSquare, CalendarOff, Ban, Phone, BellRing, Sun, Moon, ArrowDownCircle } from 'lucide-react';
import { isApiConfigured } from '../services/geminiService';
import { fetchOfficialTime, TINY_URL_TOKEN } from '../constants';
import { saveReservation, deleteReservation, loginCMS, subscribeToAuth, logoutCMS, updateReservation, addBlockedDate, deleteBlockedDate, subscribeToBlockedDates, subscribeToActiveReservations, fetchHistoryReservations } from '../services/firebase';
import { Reservation, BlockedDateRange } from '../types';
import ToastContainer, { ToastMessage, ToastType } from './Toast';
import { User } from 'firebase/auth'; 

interface AdminViewProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ theme, toggleTheme }) => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  // Form State
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'blocks'>('create');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState(''); 
  const [lockCode, setLockCode] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState(''); 
  const [adminNotes, setAdminNotes] = useState(''); 
  
  // NOVO: Alerta Específico
  const [guestAlertActive, setGuestAlertActive] = useState(false);
  const [guestAlertText, setGuestAlertText] = useState('');

  const [checkInDate, setCheckInDate] = useState(''); 
  const [checkoutDate, setCheckoutDate] = useState(''); 
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [checkOutTime, setCheckOutTime] = useState('11:00');
  
  // Blocked Dates State
  const [blockedStartDate, setBlockedStartDate] = useState('');
  const [blockedEndDate, setBlockedEndDate] = useState('');
  const [blockedReason, setBlockedReason] = useState('');
  const [blockedDates, setBlockedDates] = useState<BlockedDateRange[]>([]);
  const [isBlocking, setIsBlocking] = useState(false);

  // EDIT STATE
  const [editingId, setEditingId] = useState<string | null>(null);

  // Logic State
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [listCopiedId, setListCopiedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isShortening, setIsShortening] = useState(false);
  const [isShortened, setIsShortened] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'ok' | 'missing'>('checking');
  
  // --- DATA STATE (OTIMIZADO) ---
  // Separação entre ativas (realtime) e histórico (paginado)
  const [activeReservations, setActiveReservations] = useState<Reservation[]>([]);
  const [historyReservations, setHistoryReservations] = useState<Reservation[]>([]);
  const [lastHistoryDoc, setLastHistoryDoc] = useState<any>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);

  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null); 
  
  // History Accordion State
  const [openHistoryGroups, setOpenHistoryGroups] = useState<number[]>([0]);

  // TOAST STATE
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const isSearching = searchTerm.length > 0;

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = subscribeToAuth((u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Reservations & Blocked Dates Listener (OTIMIZADO)
  useEffect(() => {
    if (user) {
      // A) Escuta apenas as reservas ATIVAS (Futuras ou Presentes) em tempo real
      const unsubActive = subscribeToActiveReservations((data) => {
        setActiveReservations(data);
      });
      
      // B) Carrega o primeiro lote do histórico manualmente
      loadMoreHistory(true);

      // C) Bloqueios (Mantido realtime pois são poucos)
      const unsubBlocked = subscribeToBlockedDates((data) => {
        setBlockedDates(data);
      });

      return () => {
        unsubActive();
        unsubBlocked();
      };
    }
  }, [user]);

  // Função para carregar histórico paginado
  const loadMoreHistory = async (reset = false) => {
      if (loadingHistory) return;
      setLoadingHistory(true);
      try {
          const lastDoc = reset ? null : lastHistoryDoc;
          const { data, lastVisible, hasMore } = await fetchHistoryReservations(lastDoc);
          
          setHistoryReservations(prev => reset ? data : [...prev, ...data]);
          setLastHistoryDoc(lastVisible);
          setHasMoreHistory(hasMore);
      } catch (e) {
          console.error("Erro ao carregar histórico", e);
          showToast("Erro ao carregar histórico", "error");
      } finally {
          setLoadingHistory(false);
      }
  };

  // 3. Init Dates
  useEffect(() => {
    resetForm(); 
  }, []);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  useEffect(() => {
    if (listCopiedId) {
      const timeout = setTimeout(() => setListCopiedId(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [listCopiedId]);

  useEffect(() => {
    if (isApiConfigured) setApiKeyStatus('ok');
    else setApiKeyStatus('missing');
  }, []);

  // --- HELPER: SHOW TOAST ---
  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove após 4s
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- RESET FORM & DATES ---
  const resetForm = async () => {
    const officialNow = await fetchOfficialTime();
    const yyyy = officialNow.getFullYear();
    const mm = String(officialNow.getMonth() + 1).padStart(2, '0');
    const dd = String(officialNow.getDate()).padStart(2, '0');
    
    const tomorrow = new Date(officialNow);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const t_yyyy = tomorrow.getFullYear();
    const t_mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const t_dd = String(tomorrow.getDate()).padStart(2, '0');

    setCheckInDate(`${yyyy}-${mm}-${dd}`);
    setCheckoutDate(`${t_yyyy}-${t_mm}-${t_dd}`);
    setCheckInTime('14:00');
    setCheckOutTime('11:00');
    setGuestName('');
    setGuestPhone('');
    setLockCode('');
    setWelcomeMessage('');
    setAdminNotes('');
    setGuestAlertActive(false);
    setGuestAlertText('');
    setGeneratedLink('');
    setIsShortened(false);
    setEditingId(null);
    
    setBlockedStartDate(`${yyyy}-${mm}-${dd}`);
    setBlockedEndDate(`${t_yyyy}-${t_mm}-${t_dd}`);
    setBlockedReason('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginCMS(email, password);
      showToast("Bem-vindo de volta!", "success");
    } catch (e) {
      showToast("Erro ao entrar. Verifique email e senha.", "error");
    }
  };

  // --- LÓGICA DE DIGITAÇÃO DE HORA INTELIGENTE ---
  const handleTimeChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setter(val);
  };

  const handleTimeBlur = (currentVal: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    let clean = currentVal.replace(/\D/g, '');
    if (clean.length === 3) clean = '0' + clean;
    if (clean.length === 4) {
      const hh = clean.substring(0, 2);
      const mm = clean.substring(2, 4);
      if (parseInt(hh) < 24 && parseInt(mm) < 60) {
        setter(`${hh}:${mm}`);
      } else {
        showToast("Hora inválida! Use o formato 24h (ex: 1400)", "warning");
        setter('12:00'); 
      }
    }
  };

  // --- LÓGICA DE BLOQUEIO DE DATAS ---
  const handleAddBlock = async () => {
    if (!blockedStartDate || !blockedEndDate) {
        showToast("Selecione as datas de início e fim.", "warning");
        return;
    }
    if (blockedEndDate < blockedStartDate) {
        showToast("A data final deve ser depois da data inicial.", "warning");
        return;
    }

    setIsBlocking(true);
    try {
        await addBlockedDate({
            startDate: blockedStartDate,
            endDate: blockedEndDate,
            reason: blockedReason
        });
        setBlockedReason('');
        showToast("Datas bloqueadas com sucesso!", "success");
    } catch (e) {
        showToast("Erro ao bloquear datas.", "error");
    } finally {
        setIsBlocking(false);
    }
  };

  const handleDeleteBlock = async (id?: string) => {
      if (!id) return;
      if (confirm("Tem certeza que deseja desbloquear estas datas?")) {
          await deleteBlockedDate(id);
          showToast("Datas desbloqueadas.", "success");
      }
  };

  // --- LÓGICA DE RESERVA ---
  const handleStartEdit = (res: Reservation) => {
    setEditingId(res.id!);
    setGuestName(res.guestName);
    setGuestPhone(res.guestPhone || '');
    setLockCode(res.lockCode);
    setWelcomeMessage(res.welcomeMessage || '');
    setAdminNotes(res.adminNotes || '');
    setGuestAlertActive(res.guestAlertActive || false);
    setGuestAlertText(res.guestAlertText || '');
    setCheckInDate(res.checkInDate || '');
    setCheckoutDate(res.checkoutDate || '');
    setCheckInTime(res.checkInTime || '14:00');
    setCheckOutTime(res.checkOutTime || '11:00');
    
    setActiveTab('create');
    setGeneratedLink('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast("Editando reserva de " + res.guestName, "info");
  };

  const handleSave = async () => {
    if (!guestName.trim()) { showToast("Preencha o nome do hóspede.", "warning"); return; }
    if (!lockCode.trim()) { showToast("Defina a senha da porta.", "warning"); return; }
    if (!checkInDate || !checkoutDate) { showToast("Verifique as datas de entrada e saída.", "warning"); return; }
    if (!checkInTime.includes(':') || !checkOutTime.includes(':')) { showToast("Verifique os horários.", "warning"); return; }

    const start = new Date(checkInDate);
    const end = new Date(checkoutDate);
    start.setHours(0,0,0,0); end.setHours(0,0,0,0);

    if (end <= start) {
      showToast("O Check-out deve ser DEPOIS do Check-in.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const payload: Reservation = {
        guestName: guestName.trim(), 
        guestPhone: guestPhone.replace(/\D/g, ''), // Salva apenas números
        lockCode: lockCode.trim(),
        welcomeMessage: welcomeMessage.trim(), adminNotes: adminNotes.trim(),
        guestAlertActive: guestAlertActive,
        guestAlertText: guestAlertText.trim(),
        checkInDate: checkInDate, checkoutDate: checkoutDate, 
        checkInTime: checkInTime, checkOutTime: checkOutTime,
        status: 'active', createdAt: '' 
      };

      if (editingId) {
         // MODO ATUALIZAÇÃO
         await updateReservation(editingId, payload);
         showToast("Reserva atualizada com sucesso!", "success");
         resetForm();
      } else {
         // MODO CRIAÇÃO
         const reservationId = await saveReservation(payload);
         const baseUrl = window.location.origin + '/'; 
         const link = `${baseUrl}?rid=${reservationId}`;
         setGeneratedLink(link);
         setIsShortened(false);
         showToast("Reserva criada! Link gerado.", "success");
      }

    } catch (e) {
      showToast("Erro ao salvar reserva.", "error");
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if(!id) return;
    if(confirm("ATENÇÃO: Isso apaga permanentemente. Confirmar?")) {
      await deleteReservation(id);
      if (selectedReservation?.id === id) setSelectedReservation(null);
      // Atualização local otimista (se for do histórico, precisa remover manualmente)
      setHistoryReservations(prev => prev.filter(r => r.id !== id));
      showToast("Reserva excluída.", "success");
    }
  };

  const getLinkForReservation = (id?: string) => {
    if (!id) return '';
    const baseUrl = window.location.origin + '/';
    return `${baseUrl}?rid=${id}`;
  };

  const handleCopyListLink = (id?: string) => {
    if (!id) return;
    const link = getLinkForReservation(id);
    navigator.clipboard.writeText(link);
    setListCopiedId(id);
    showToast("Link copiado!", "success");
  };

  const handleShareListWhatsApp = (res: Reservation) => {
    if (!res.id) return;
    const link = getLinkForReservation(res.id);
    const message = `Olá, ${res.guestName}!\n\nPreparei um Guia Digital exclusivo para sua estadia no Flat.\n\nAqui você encontra a senha da porta, wi-fi e dicas de Petrolina:\n${link}`;
    const phone = res.guestPhone ? res.guestPhone : '';
    
    const whatsappUrl = phone 
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const sendReminder = (res: Reservation, type: 'checkin' | 'checkout') => {
      if (!res.id) return;
      const link = getLinkForReservation(res.id);
      const phone = res.guestPhone || ''; 
      let message = '';

      if (type === 'checkin') {
          message = `Olá, ${res.guestName}! Tudo pronto para sua chegada amanhã? ✈️\n\nJá deixei tudo preparado no seu Guia Digital (Senha da porta, Wi-Fi e Localização).\n\nAcesse aqui: ${link}\n\nQualquer dúvida, estou por aqui!`;
      } else {
          message = `Oi, ${res.guestName}! Espero que a estadia esteja sendo ótima. 🌵\n\nComo seu check-out é amanhã, deixei as instruções de saída facilitadas aqui no guia: ${link}\n\nBoa viagem de volta!`;
      }

      const whatsappUrl = phone 
        ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
        : `https://wa.me/?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
  };

  const shortenLink = async () => {
    if (!generatedLink) return;
    if (!TINY_URL_TOKEN) { showToast("Configure o Token do TinyURL!", "error"); return; }
    setIsShortening(true);
    try {
      const response = await fetch('https://api.tinyurl.com/create', {
        method: 'POST', headers: { 'Authorization': `Bearer ${TINY_URL_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: generatedLink, domain: "tiny.one" })
      });
      const data = await response.json();
      if (data.data && data.data.tiny_url) {
        setGeneratedLink(data.data.tiny_url); setIsShortened(true);
        showToast("Link encurtado com sucesso!", "success");
      } else { showToast("Erro ao encurtar link.", "error"); }
    } catch (error) { showToast("Erro de conexão ao encurtar.", "error"); } finally { setIsShortening(false); }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    showToast("Link copiado!", "success");
  };

  const shareOnWhatsApp = () => {
    if (!generatedLink) return;
    const formattedName = guestName.trim();
    const message = `Olá, ${formattedName}!\n\nPreparei um Guia Digital exclusivo para sua estadia no Flat.\n\nAqui você encontra a senha da porta, wi-fi e dicas de Petrolina:\n${generatedLink}`;
    const whatsappUrl = guestPhone 
      ? `https://wa.me/${guestPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleNumericInput = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value.replace(/\D/g, ''));
  };

  const toggleHistoryGroup = (index: number) => {
    setOpenHistoryGroups(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  // --- FILTROS E COMBINAÇÃO DE DADOS ---
  const getFilteredAndSplitReservations = () => {
    // Combina ativas e histórico carregado para filtragem
    const allReservations = [...activeReservations, ...historyReservations];
    
    // Remove duplicatas (caso ocorra)
    const uniqueReservations = Array.from(new Map(allReservations.map(item => [item.id, item])).values());

    const today = new Date();
    const todayStr = today.toLocaleDateString('en-CA'); 
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString('en-CA');

    const filteredList = uniqueReservations.filter(res => {
      const term = searchTerm.toLowerCase();
      const nameMatch = res.guestName.toLowerCase().includes(term);
      const notesMatch = res.adminNotes?.toLowerCase().includes(term); 
      return nameMatch || notesMatch;
    });

    const leavingToday: Reservation[] = [];
    const staying: Reservation[] = [];
    const upcoming: Reservation[] = [];
    const historyList: Reservation[] = [];

    filteredList.forEach(res => {
      if (!res.checkoutDate || !res.checkInDate) return;

      if (res.checkoutDate < todayStr) {
        historyList.push(res);
      } else if (res.checkoutDate === todayStr) {
        leavingToday.push(res);
      } else if (res.checkInDate > todayStr) {
        upcoming.push(res);
      } else {
        staying.push(res);
      }
    });

    // Ordenações
    leavingToday.sort((a, b) => a.guestName.localeCompare(b.guestName));
    staying.sort((a, b) => (a.checkoutDate ?? '').localeCompare(b.checkoutDate ?? ''));
    upcoming.sort((a, b) => (a.checkInDate ?? '').localeCompare(b.checkInDate ?? ''));
    historyList.sort((a, b) => (b.checkoutDate ?? '').localeCompare(a.checkoutDate ?? ''));

    return { leavingToday, staying, upcoming, historyList, tomorrowStr };
  };

  const { leavingToday, staying, upcoming, historyList, tomorrowStr } = getFilteredAndSplitReservations();
  const activeCount = leavingToday.length + staying.length + upcoming.length;

  const groupedHistory = historyList.reduce((groups, res) => {
    if (!res.checkoutDate) return groups;
    const [y, m] = res.checkoutDate.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, 1);
    const labelRaw = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const label = labelRaw.charAt(0).toUpperCase() + labelRaw.slice(1);
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.label === label) { lastGroup.items.push(res); } else { groups.push({ label, items: [res] }); }
    return groups;
  }, [] as { label: string; items: Reservation[] }[]);


  // --- CARD DE LISTA (HELPER FUNCTION) ---
  const renderReservationListItem = (res: Reservation, statusColor: string, statusLabel?: string) => {
    const isCheckinTomorrow = res.checkInDate === tomorrowStr;
    const isCheckoutTomorrow = res.checkoutDate === tomorrowStr;

    return (
      <div 
        key={res.id}
        onClick={() => setSelectedReservation(res)}
        className={`bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border-l-4 ${statusColor} flex flex-col gap-3 group relative cursor-pointer hover:shadow-md transition-all mb-3`}
      >
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {res.guestName}
                  {statusLabel && <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${statusColor.replace('border-', 'bg-').replace('500', '100')} text-gray-700 dark:text-gray-900`}>{statusLabel}</span>}
                </h3>
                <div className="flex flex-col mt-1.5 gap-1">
                  <span className="text-xs text-gray-500 flex items-center gap-1"><CalendarDays size={12} /> In: {res.checkInDate?.split('-').reverse().join('/')}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1"><History size={12} /> Out: {res.checkoutDate?.split('-').reverse().join('/')}</span>
                </div>
                {res.adminNotes && (
                  <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-[10px] px-2 py-1 rounded-md inline-flex items-center gap-1 font-medium">
                    <StickyNote size={10} /> Nota
                  </div>
                )}
                {res.guestAlertActive && (
                  <div className="mt-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[10px] px-2 py-1 rounded-md inline-flex items-center gap-1 font-medium">
                    <MessageSquare size={10} /> Recado para {res.guestName}
                  </div>
                )}
            </div>
            
            <div className="flex flex-col gap-2">
               <button 
                  onClick={(e) => { e.stopPropagation(); handleStartEdit(res); }}
                  className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                  title="Editar"
               >
                  <Pencil size={16} />
               </button>
               <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(res.id); }}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  title="Excluir"
               >
                  <Trash2 size={16} />
               </button>
            </div>
        </div>

        {isCheckinTomorrow && (
            <button 
              onClick={(e) => { e.stopPropagation(); sendReminder(res, 'checkin'); }}
              className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm animate-pulse"
            >
               <BellRing size={14} /> Enviar Lembrete de Chegada
            </button>
        )}

        {isCheckoutTomorrow && (
            <button 
              onClick={(e) => { e.stopPropagation(); sendReminder(res, 'checkout'); }}
              className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
               <LogOut size={14} /> Enviar Instruções de Saída
            </button>
        )}

        <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button 
              onClick={(e) => { e.stopPropagation(); handleCopyListLink(res.id); }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors border ${listCopiedId === res.id ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100'}`}
            >
                {listCopiedId === res.id ? <Check size={12} /> : <LinkIcon size={12} />}
                {listCopiedId === res.id ? 'Copiado' : 'Copiar'}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleShareListWhatsApp(res); }}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors"
            >
                <Share2 size={12} /> Convite
            </button>
        </div>
      </div>
    );
  }


  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white"><Loader2 className="animate-spin" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <div className="bg-gray-800 p-8 rounded-3xl w-full max-w-sm border border-gray-700 shadow-2xl">
           <div className="flex justify-center mb-6 text-orange-500"><Lock size={40} /></div>
           <h2 className="text-2xl font-bold text-white text-center mb-6">Acesso Administrativo</h2>
           <form onSubmit={handleLogin} className="space-y-4">
             <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none" />
             <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha" className="w-full bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none" />
             <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">Entrar</button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center p-6 font-sans text-gray-900 dark:text-gray-100 relative">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="w-full max-w-lg flex justify-between items-center mb-6">
         <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-orange-500" /> Gestão de Reservas
         </h1>
         <div className="flex gap-2">
             <button 
               onClick={toggleTheme} 
               className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" 
               title="Alternar Tema"
             >
               {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>

             <a href="/?mode=cms" className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" title="Gerenciar Conteúdo"><LayoutGrid size={20} /></a>
             <button onClick={logoutCMS} className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full text-red-500 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" title="Sair"><LogIn className="rotate-180" size={20} /></button>
         </div>
      </div>

      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[32px] shadow-2xl shadow-gray-200/50 dark:shadow-black/5 overflow-hidden border border-white/50 dark:border-gray-700 backdrop-blur-sm">
        
        <div className="flex border-b border-gray-100 dark:border-gray-700">
           <button 
             onClick={() => setActiveTab('create')}
             className={`flex-1 py-4 font-bold text-xs uppercase tracking-wide transition-colors ${activeTab === 'create' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/50 dark:bg-orange-900/10' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
           >
             {editingId ? 'Editando' : 'Nova Reserva'}
           </button>
           <button 
             onClick={() => setActiveTab('list')}
             className={`flex-1 py-4 font-bold text-xs uppercase tracking-wide transition-colors flex items-center justify-center gap-1 ${activeTab === 'list' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/50 dark:bg-orange-900/10' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
           >
             Lista <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full text-[9px]">{activeCount}</span>
           </button>
           <button 
             onClick={() => setActiveTab('blocks')}
             className={`flex-1 py-4 font-bold text-xs uppercase tracking-wide transition-colors flex items-center justify-center gap-1 ${activeTab === 'blocks' ? 'text-red-500 border-b-2 border-red-500 bg-red-50/50 dark:bg-red-900/10' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
           >
             Bloqueios <CalendarOff size={14} />
           </button>
        </div>

        {/* CONTENT - FORM */}
        {activeTab === 'create' && (
          // ... (Código do Formulário Mantido Igual) ...
          <div className="p-8 space-y-6 relative">
            <button onClick={resetForm} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors z-10" title="Limpar/Cancelar">
                {editingId ? <X size={18} className="text-red-500"/> : <Eraser size={18} />}
            </button>

            {editingId ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30">
                    <Pencil size={14} /> Você está editando a reserva de <strong>{guestName}</strong>.
                </div>
            ) : (
               <div className={`p-3 rounded-2xl border flex items-center gap-3 text-xs ${apiKeyStatus === 'ok' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900 text-green-700 dark:text-green-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
                 {apiKeyStatus === 'ok' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                 <span className="font-bold">{apiKeyStatus === 'ok' ? 'IA Concierge Ativa' : 'IA Inativa'}</span>
               </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Hóspede</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500" size={20} />
                  <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} onBlur={() => setGuestName(prev => prev.trim())} className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-500" placeholder="Nome Completo" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">WhatsApp (Opcional)</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500" size={20} />
                  <input 
                    type="tel" 
                    value={guestPhone} 
                    onChange={handleNumericInput(setGuestPhone)} 
                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-green-500" 
                    placeholder="87999998888" 
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Senha Porta</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500" size={20} />
                <input type="text" inputMode="numeric" value={lockCode} onChange={handleNumericInput(setLockCode)} className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-widest" placeholder="123456" />
              </div>
              <p className="text-[10px] text-gray-400 mt-1 ml-1">* A senha do cofre é gerenciada no CMS.</p>
            </div>

            <div className="space-y-4 bg-gray-50 dark:bg-gray-900/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
               <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1"><CalendarDays size={12} className="text-green-500"/> Check-in (Data)</label>
                  <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-green-500" />
               </div>
               <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1"><Clock size={12} className="text-green-500"/> Check-in (Hora)</label>
                  <input type="text" inputMode="numeric" value={checkInTime} onFocus={() => setCheckInTime('')} onChange={handleTimeChange(setCheckInTime)} onBlur={() => handleTimeBlur(checkInTime, setCheckInTime)} placeholder="Ex: 1400" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-green-500 font-mono tracking-wider" />
               </div>
               <div className="h-px bg-gray-200 dark:bg-gray-700 my-2 border-dashed"></div>
               <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1"><History size={12} className="text-orange-500"/> Check-out (Data)</label>
                  <input type="date" value={checkoutDate} onChange={(e) => setCheckoutDate(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-orange-500" />
               </div>
               <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1"><Clock size={12} className="text-orange-500"/> Check-out (Hora)</label>
                  <input type="text" inputMode="numeric" value={checkOutTime} onFocus={() => setCheckOutTime('')} onChange={handleTimeChange(setCheckOutTime)} onBlur={() => handleTimeBlur(checkOutTime, setCheckOutTime)} placeholder="Ex: 1100" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-wider" />
               </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 space-y-3">
               <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2 uppercase tracking-wider">
                     <MessageSquare size={14} /> Recado para {guestName || 'o Hóspede'}
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={guestAlertActive}
                        onChange={(e) => setGuestAlertActive(e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                  </label>
               </div>
               
               {guestAlertActive && (
                 <textarea 
                    value={guestAlertText} 
                    onChange={(e) => setGuestAlertText(e.target.value)} 
                    className="w-full bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800/50 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm h-20 resize-none text-gray-700 dark:text-gray-200" 
                    placeholder="Ex: Sua encomenda chegou na portaria." 
                 />
               )}
            </div>

            <div>
               <label className="text-xs font-bold text-gray-400 uppercase ml-1">Boas-vindas (Hóspede vê)</label>
               <textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} onBlur={() => setWelcomeMessage(prev => prev.trim())} className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-orange-500 text-sm h-20 resize-none" placeholder="Mensagem personalizada..." />
            </div>

            <div>
               <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1"><StickyNote size={12} /> Observações Internas</label>
               <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} onBlur={() => setAdminNotes(prev => prev.trim())} className="w-full bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-yellow-500 text-sm h-20 resize-none text-gray-700 dark:text-gray-300" placeholder="Ex: Falta pagar 50%, pediu berço extra..." />
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 shadow-xl flex items-center justify-center gap-2 ${editingId ? 'bg-orange-500 text-white' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'}`}
            >
              {isSaving ? <Loader2 className="animate-spin" /> : (editingId ? <Save size={20} /> : <Sparkles className="text-yellow-400" />)}
              {isSaving ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Gerar Magic Link')}
            </button>

            {generatedLink && !editingId && (
              <div className="animate-fadeIn mt-4 bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100 dark:border-orange-800/30">
                <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase text-center mb-2">Reserva Criada!</p>
                <div onClick={copyToClipboard} className="bg-white dark:bg-gray-800 p-3 rounded-xl text-xs font-mono text-center break-all cursor-pointer border border-gray-200 dark:border-gray-600 mb-3">{generatedLink}</div>
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={copyToClipboard} className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors border ${copied ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-gray-700 border-gray-200'}`}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copiado' : 'Copiar'}</button>
                   <button onClick={shareOnWhatsApp} className="py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 bg-green-50 text-green-600 border border-green-200 hover:bg-green-600 shadow-sm"><Send size={14} /> WhatsApp</button>
                </div>
                <button onClick={shortenLink} disabled={isShortening || isShortened} className="w-full mt-2 py-2 text-xs font-bold text-orange-600 hover:underline flex items-center justify-center gap-1">{isShortening ? <Loader2 size={12} className="animate-spin"/> : <ExternalLink size={12} />} {isShortened ? 'Encurtado!' : 'Encurtar (TinyURL)'}</button>
              </div>
            )}
          </div>
        )}

        {/* CONTENT - BLOCKS */}
        {activeTab === 'blocks' && (
            // ... (Código de Bloqueio Mantido Igual) ...
            <div className="p-6 space-y-6 bg-white dark:bg-gray-800 min-h-[400px]">
                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-800/30 text-center">
                    <h2 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center justify-center gap-2 uppercase tracking-wide mb-2">
                        <Ban size={16} /> Bloquear Datas
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        Use isso para fechar o calendário para manutenção ou uso próprio. 
                        <strong> Isso não impede você de criar reservas manuais.</strong>
                    </p>
                </div>

                <div className="space-y-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Início</label>
                            <input type="date" value={blockedStartDate} onChange={(e) => setBlockedStartDate(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Fim</label>
                            <input type="date" value={blockedEndDate} onChange={(e) => setBlockedEndDate(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Motivo (Opcional)</label>
                        <input type="text" value={blockedReason} onChange={(e) => setBlockedReason(e.target.value)} placeholder="Ex: Reforma, Férias..." className="w-full p-2 text-xs rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800" />
                    </div>
                    <button 
                        onClick={handleAddBlock} 
                        disabled={isBlocking}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                        {isBlocking ? <Loader2 size={14} className="animate-spin"/> : <CalendarOff size={14} />}
                        Bloquear no Calendário
                    </button>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Bloqueios Ativos</h3>
                    {blockedDates.length === 0 && <p className="text-center text-gray-400 text-xs py-4">Nenhum bloqueio ativo.</p>}
                    
                    {blockedDates.map(block => (
                        <div key={block.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div>
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
                                    {block.startDate.split('-').reverse().join('/')} até {block.endDate.split('-').reverse().join('/')}
                                </p>
                                {block.reason && <p className="text-[10px] text-gray-500 dark:text-gray-400 italic mt-0.5">{block.reason}</p>}
                            </div>
                            <button onClick={() => handleDeleteBlock(block.id)} className="text-gray-400 hover:text-red-500 p-2 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* CONTENT - LIST */}
        {activeTab === 'list' && (
           <div className="p-4 bg-gray-50 dark:bg-gray-900/50 min-h-[400px] space-y-6">
             <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500" size={18} />
               <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-12 pr-10 text-sm outline-none focus:ring-2 focus:ring-orange-500" placeholder="Buscar (apenas carregados)..." />
               {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"><X size={16} /></button>}
             </div>
             
             {leavingToday.length > 0 && (
               <div>
                 <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3 flex items-center gap-2 ml-1 animate-pulse"><LogOut size={14} /> Check-out Hoje</h3>
                 {leavingToday.map(res => renderReservationListItem(res, "border-red-500", "Sai Hoje"))}
               </div>
             )}
             {staying.length > 0 && (
               <div>
                 <h3 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center gap-2 ml-1"><UserCheck size={14} /> Hospedados Agora</h3>
                 {staying.map(res => renderReservationListItem(res, "border-green-500"))}
               </div>
             )}
             {upcoming.length > 0 && (
               <div>
                 <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-3 flex items-center gap-2 ml-1"><ArrowRightCircle size={14} /> Chegando em Breve</h3>
                 {upcoming.map(res => renderReservationListItem(res, "border-blue-500", "Futuro"))}
               </div>
             )}

             {leavingToday.length === 0 && staying.length === 0 && upcoming.length === 0 && (
                <div className="text-center py-6 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400 text-xs font-medium">
                  {isSearching ? 'Nada encontrado nos ativos.' : 'Nenhuma reserva ativa.'}
                </div>
             )}

             <div className="pt-4 border-t border-gray-200 dark:border-gray-700 border-dashed">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2 ml-1"><History size={14} /> Histórico</h3>
               {groupedHistory.length === 0 && !loadingHistory ? <div className="text-center py-4 text-gray-400 text-[10px]">Vazio.</div> : (
                 <div className="space-y-4">
                   {groupedHistory.map((group, idx) => {
                     const isOpen = openHistoryGroups.includes(idx) || isSearching;
                     return (
                       <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                         <button onClick={() => toggleHistoryGroup(idx)} className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/20">
                            <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{group.label}</span>
                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                         </button>
                         {isOpen && (
                           <div className="p-3 space-y-2 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                             {group.items.map(res => renderReservationListItem(res, "border-gray-300"))}
                           </div>
                         )}
                       </div>
                     );
                   })}
                 </div>
               )}

               {/* BOTÃO DE CARREGAR MAIS */}
               {hasMoreHistory && (
                   <button 
                        onClick={() => loadMoreHistory()}
                        disabled={loadingHistory}
                        className="w-full mt-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                   >
                        {loadingHistory ? <Loader2 className="animate-spin" size={14} /> : <ArrowDownCircle size={14} />}
                        {loadingHistory ? 'Carregando...' : 'Carregar Mais Antigos'}
                   </button>
               )}
             </div>
           </div>
        )}
      </div>

      {/* MODAL DETALHES (MANTIDO IGUAL) */}
      {selectedReservation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedReservation(null)}></div>
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[28px] overflow-hidden shadow-2xl relative z-10 animate-scaleIn flex flex-col max-h-[90vh] border border-white/10">
             <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
               <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white">Detalhes da Reserva</h2>
               <button onClick={() => setSelectedReservation(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"><X size={18} /></button>
             </div>
             <div className="p-6 overflow-y-auto space-y-6">
               <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-orange-600 dark:text-orange-400"><UserIcon size={32} /></div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedReservation.guestName}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Hóspede</p>
                  {selectedReservation.guestPhone && (
                    <p className="text-xs text-green-600 font-mono mt-1">{selectedReservation.guestPhone}</p>
                  )}
               </div>
               
               {/* RECADOS NO MODAL */}
               {(selectedReservation.adminNotes || selectedReservation.guestAlertActive) && (
                 <div className="space-y-2">
                    {selectedReservation.adminNotes && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 p-4 rounded-xl relative">
                          <p className="text-[10px] font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wider mb-2 flex items-center gap-1"><StickyNote size={12} /> Observações Internas</p>
                          <p className="text-sm text-gray-800 dark:text-gray-200">{selectedReservation.adminNotes}</p>
                      </div>
                    )}
                    {selectedReservation.guestAlertActive && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 p-4 rounded-xl relative">
                          <p className="text-[10px] font-bold text-blue-700 dark:text-blue-500 uppercase tracking-wider mb-2 flex items-center gap-1"><MessageSquare size={12} /> Recado ao Hóspede (Ativo)</p>
                          <p className="text-sm text-gray-800 dark:text-gray-200">{selectedReservation.guestAlertText}</p>
                      </div>
                    )}
                 </div>
               )}

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-600">
                     <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Check-in</p>
                     <p className="font-bold text-gray-900 dark:text-white text-sm">{selectedReservation.checkInDate?.split('-').reverse().join('/')}</p>
                     <p className="text-xs text-gray-500">{selectedReservation.checkInTime}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-600">
                     <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Check-out</p>
                     <p className="font-bold text-gray-900 dark:text-white text-sm">{selectedReservation.checkoutDate?.split('-').reverse().join('/')}</p>
                     <p className="text-xs text-gray-500">{selectedReservation.checkOutTime}</p>
                  </div>
               </div>
               <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-600 flex justify-between items-center">
                  <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Senha Porta</p><p className="font-mono font-bold text-lg text-gray-900 dark:text-white tracking-widest">{selectedReservation.lockCode}</p></div>
                  <Lock size={20} className="text-gray-300" />
               </div>
               <div className="flex flex-col gap-2">
                  <button onClick={() => handleCopyListLink(selectedReservation.id)} className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2"><LinkIcon size={16} /> Copiar Link</button>
                  <button onClick={() => handleShareListWhatsApp(selectedReservation)} className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"><Send size={16} /> WhatsApp</button>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button onClick={() => { handleStartEdit(selectedReservation); setSelectedReservation(null); }} className="w-full py-3 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-blue-100 dark:border-blue-900/30"><Pencil size={16} /> Editar</button>
                    <button onClick={() => handleDelete(selectedReservation.id)} className="w-full py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/30"><Trash2 size={16} /> Excluir</button>
                  </div>
               </div>
            </div>
         </div>
       </div>
      )}
    </div>
  );
};

export default AdminView;