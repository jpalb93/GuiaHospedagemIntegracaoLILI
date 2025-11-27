import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Trash2, Plus, LogIn, Save, X, LayoutGrid, Image as ImageIcon, MapPin, Phone, Tag, Link as LinkIcon, AlertCircle, Settings, Store, Wifi, Megaphone, Check, Box, Lock, Sparkles, Coffee, Utensils, Sunset, Moon, Edit, Calendar, Clock, Lightbulb, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { PlaceRecommendation, PlaceCategory, AppConfig, SmartSuggestionsConfig, TimeOfDaySuggestion, GuestReview } from '../types';
import { loginCMS, logoutCMS, subscribeToAuth, getDynamicPlaces, addDynamicPlace, updateDynamicPlace, deleteDynamicPlace, isFirebaseConfigured, getHeroImages, updateHeroImages, getAppSettings, saveAppSettings, getSmartSuggestions, saveSmartSuggestions, getGuestReviews, addGuestReview, deleteGuestReview, cleanupExpiredEvents } from '../services/firebase';
import OptimizedImage from './OptimizedImage';
import { DEFAULT_SYSTEM_INSTRUCTION } from '../constants';
// REMOVIDA: import { User } from 'firebase/compat/auth'; 

const CATEGORIES: { id: PlaceCategory; label: string }[] = [
  { id: 'burgers', label: 'Hambúrgueres' },
  { id: 'skewers', label: 'Espetinhos' },
  { id: 'salads', label: 'Saladas & Saudável' },
  { id: 'pasta', label: 'Massas & Pizza' },
  { id: 'oriental', label: 'Oriental' },
  { id: 'alacarte', label: 'À la Carte' },
  { id: 'selfservice', label: 'Self-Service' },
  { id: 'bars', label: 'Bares' },
  { id: 'cafes', label: 'Cafés & Padarias' },
  { id: 'snacks', label: 'Lanches & Delivery' },
  { id: 'essentials', label: 'Mercados & Farmácias' },
  { id: 'attractions', label: 'Passeios' },
  { id: 'events', label: 'Eventos & Shows' },
  { id: 'emergency', label: 'Emergência' },
];

const ContentManager: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // CORREÇÃO: Usando firebase.User
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Content State
  const [activeTab, setActiveTab] = useState<'places' | 'config' | 'suggestions' | 'reviews'>('places');
  const [places, setPlaces] = useState<PlaceRecommendation[]>([]);
  const [reviews, setReviews] = useState<GuestReview[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Config State
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [appSettings, setAppSettings] = useState<AppConfig>({
    wifiSSID: '',
    wifiPass: '',
    safeCode: '', 
    noticeActive: false,
    noticeText: '',
    aiSystemPrompt: '',
    cityCuriosities: []
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSavedSuccess, setConfigSavedSuccess] = useState(false);
  
  // Temp state for adding new curiosity
  const [newCuriosity, setNewCuriosity] = useState('');

  // Suggestions State (Agora Listas)
  const [suggestions, setSuggestions] = useState<SmartSuggestionsConfig>({
    morning: [],
    lunch: [],
    sunset: [],
    night: [],
  });
  const [isSavingSuggestions, setIsSavingSuggestions] = useState(false);
  const [suggestionsSavedSuccess, setSuggestionsSavedSuccess] = useState(false);
  
  // Temp Input State for Suggestions (Para adicionar novos)
  const [tempSuggestion, setTempSuggestion] = useState<{
    category: keyof SmartSuggestionsConfig;
    title: string;
    description: string;
  }>({ category: 'morning', title: '', description: '' });

  // Reviews Temp State
  const [newReview, setNewReview] = useState<{name: string, text: string}>({name: '', text: ''});

  // Form States (Places)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPlace, setNewPlace] = useState<Partial<PlaceRecommendation>>({
    tags: [],
    visible: true,
    category: 'burgers'
  });
  const [tagInput, setTagInput] = useState('');

  // Form States (Hero Images)
  const [newHeroImage, setNewHeroImage] = useState('');

  // State for Collapsed Categories in Places Tab
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);

  const toggleCategory = (catId: string) => {
    setCollapsedCategories(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  // --- FUNÇÃO DE VALIDAÇÃO DE URL ---
  const validateImageUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuth((u) => {
      setUser(u);
      if (u) {
        // Assim que o admin logar, carrega os dados e faz a faxina
        loadPlaces();
        loadConfig();
        loadReviews();
        cleanupExpiredEvents(); // <--- LIMPEZA AUTOMÁTICA AQUI
      }
    });
    return () => unsubscribe();
  }, []);

  const loadPlaces = async () => {
    setLoading(true);
    // O ADMIN SEMPRE FORÇA REFRESH (TRUE) PARA VER DADOS FRESCOS E IGNORAR CACHE
    const data = await getDynamicPlaces(true);
    setPlaces(data);
    setLoading(false);
  };

  const loadReviews = async () => {
    // OTIMIZAÇÃO: Carrega apenas as últimas 50 avaliações para gestão
    const data = await getGuestReviews(50);
    setReviews(data);
  };

  const loadConfig = async () => {
    // Carrega Imagens (FORÇANDO REFRESH NO ADMIN)
    const images = await getHeroImages(true);
    setHeroImages(images);

    // Carrega Configs Gerais
    const settings = await getAppSettings();
    if (settings) {
      setAppSettings({
        wifiSSID: settings.wifiSSID || '',
        wifiPass: settings.wifiPass || '',
        safeCode: settings.safeCode || '',
        noticeActive: settings.noticeActive || false,
        noticeText: settings.noticeText || '',
        aiSystemPrompt: settings.aiSystemPrompt || '',
        cityCuriosities: settings.cityCuriosities || []
      });
    }

    // Carrega Sugestões
    const suggs = await getSmartSuggestions();
    if (suggs) {
        // Garante que sejam arrays (caso venha do banco antigo ou vazio)
        setSuggestions({
            morning: Array.isArray(suggs.morning) ? suggs.morning : [],
            lunch: Array.isArray(suggs.lunch) ? suggs.lunch : [],
            sunset: Array.isArray(suggs.sunset) ? suggs.sunset : [],
            night: Array.isArray(suggs.night) ? suggs.night : [],
        });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await loginCMS(email, password);
    } catch (err: any) {
      setError('Erro ao logar. Verifique e-mail e senha.');
    }
  };

  // --- PLACES LOGIC ---

  const handleSavePlace = async () => {
    if (!newPlace.name || !newPlace.description || !newPlace.imageUrl || !newPlace.category) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    // VALIDAÇÃO DE SEGURANÇA DA URL
    if (!validateImageUrl(newPlace.imageUrl)) {
      alert("URL de imagem inválida! Certifique-se de usar um link completo começando com http:// ou https://");
      return;
    }

    setLoading(true);
    try {
      // PREPARAÇÃO DE DADOS (Sanitização)
      const placeData = {
        name: newPlace.name,
        description: newPlace.description,
        imageUrl: newPlace.imageUrl,
        category: newPlace.category as PlaceCategory,
        tags: newPlace.tags || [],
        address: newPlace.address || "",
        phoneNumber: newPlace.phoneNumber || "",
        orderLink: newPlace.orderLink || "",
        distance: newPlace.distance || "",
        // NOVOS CAMPOS DE EVENTO
        eventDate: newPlace.eventDate || "",
        eventEndDate: newPlace.eventEndDate || "",
        eventTime: newPlace.eventTime || "",
        eventEndTime: newPlace.eventEndTime || "",
        visible: true
      };

      if (editingId) {
        await updateDynamicPlace(editingId, placeData);
        // ATUALIZAÇÃO OTIMISTA: Atualiza o array localmente sem chamar loadPlaces()
        setPlaces(prev => prev.map(p => p.id === editingId ? { ...p, ...placeData } : p));
      } else {
        const newId = await addDynamicPlace(placeData);
        // ATUALIZAÇÃO OTIMISTA: Adiciona ao array localmente
        setPlaces(prev => [...prev, { id: newId, ...placeData }]);
      }
      
      handleCloseForm();
      // REMOVIDO: loadPlaces(); -> Economiza leitura
    } catch (e: any) {
      console.error(e);
      alert(`Erro ao salvar: ${e.message || "Tente novamente."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlace = (place: PlaceRecommendation) => {
    if (!place.id) return;
    setEditingId(place.id);
    setNewPlace(place);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setNewPlace({ tags: [], visible: true, category: 'burgers' });
    setTagInput('');
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Tem certeza que deseja excluir este local?")) return;
    setLoading(true);
    try {
      await deleteDynamicPlace(id);
      // ATUALIZAÇÃO OTIMISTA: Remove do array localmente
      setPlaces(prev => prev.filter(p => p.id !== id));
      // REMOVIDO: loadPlaces(); -> Economiza leitura
    } catch (e) {
      alert("Erro ao excluir.");
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setNewPlace(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setNewPlace(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, index) => index !== indexToRemove)
    }));
  };

  // --- CONFIG LOGIC (HERO IMAGES) ---

  const handleAddHeroImage = async () => {
    if (!newHeroImage.trim()) return;

    // VALIDAÇÃO DE SEGURANÇA DA URL
    if (!validateImageUrl(newHeroImage)) {
        alert("URL de imagem inválida! Use um link http:// ou https://");
        return;
    }

    const updatedList = [...heroImages, newHeroImage.trim()];
    setHeroImages(updatedList);
    setNewHeroImage('');
    await updateHeroImages(updatedList);
  };

  const handleRemoveHeroImage = async (index: number) => {
    if(!confirm("Remover esta imagem?")) return;
    const updatedList = heroImages.filter((_, i) => i !== index);
    setHeroImages(updatedList);
    await updateHeroImages(updatedList);
  };

  // --- CONFIG LOGIC (GENERAL APP SETTINGS) ---
  
  const handleAddCuriosity = () => {
    if (!newCuriosity.trim()) return;
    const currentList = appSettings.cityCuriosities || [];
    setAppSettings({
      ...appSettings,
      cityCuriosities: [...currentList, newCuriosity.trim()]
    });
    setNewCuriosity('');
  };

  const handleRemoveCuriosity = (index: number) => {
    const currentList = appSettings.cityCuriosities || [];
    const updated = currentList.filter((_, i) => i !== index);
    setAppSettings({ ...appSettings, cityCuriosities: updated });
  };

  const handleSaveAppConfig = async () => {
    setIsSavingConfig(true);
    setConfigSavedSuccess(false);
    try {
      await saveAppSettings(appSettings);
      setConfigSavedSuccess(true);
      setTimeout(() => setConfigSavedSuccess(false), 3000);
    } catch (e) {
      alert("Erro ao salvar configurações.");
    } finally {
      setIsSavingConfig(false);
    }
  };

  // --- SUGGESTIONS LOGIC (ADD/REMOVE LIST) ---
  
  const addSuggestion = (category: keyof SmartSuggestionsConfig) => {
    if (tempSuggestion.category === category && tempSuggestion.title && tempSuggestion.description) {
        const newItem: TimeOfDaySuggestion = {
            id: Date.now().toString(), // ID simples
            title: tempSuggestion.title,
            description: tempSuggestion.description
        };
        
        setSuggestions(prev => ({
            ...prev,
            [category]: [...prev[category], newItem]
        }));

        setTempSuggestion({ category, title: '', description: '' }); // Reset inputs
    }
  };

  const removeSuggestion = (category: keyof SmartSuggestionsConfig, id: string) => {
      setSuggestions(prev => ({
          ...prev,
          [category]: prev[category].filter(item => item.id !== id)
      }));
  };

  const handleSaveSuggestions = async () => {
    setIsSavingSuggestions(true);
    setSuggestionsSavedSuccess(false);
    try {
      await saveSmartSuggestions(suggestions);
      setSuggestionsSavedSuccess(true);
      setTimeout(() => setSuggestionsSavedSuccess(false), 3000);
    } catch (e) {
      alert("Erro ao salvar sugestões.");
    } finally {
      setIsSavingSuggestions(false);
    }
  };

  // --- REVIEWS LOGIC ---
  const handleAddReview = async () => {
    if(!newReview.name || !newReview.text) {
      alert("Preencha nome e comentário.");
      return;
    }
    setLoading(true);
    try {
      const newId = await addGuestReview(newReview);
      // ATUALIZAÇÃO OTIMISTA
      setReviews(prev => [...prev, { id: newId, ...newReview }]);
      setNewReview({name: '', text: ''});
      // REMOVIDO: loadReviews();
    } catch(e) {
      alert("Erro ao adicionar avaliação.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id?: string) => {
    if(!id || !confirm("Excluir esta avaliação?")) return;
    setLoading(true);
    try {
      await deleteGuestReview(id);
      // ATUALIZAÇÃO OTIMISTA
      setReviews(prev => prev.filter(r => r.id !== id));
      // REMOVIDO: loadReviews();
    } catch(e) {
      alert("Erro ao excluir.");
    } finally {
      setLoading(false);
    }
  };

  // Helper para renderizar a seção de sugestões
  const renderSuggestionSection = (
      key: keyof SmartSuggestionsConfig, 
      title: string, 
      icon: React.ReactNode, 
      colorClass: string
  ) => {
      const items = suggestions[key];
      return (
        <div className={`p-4 rounded-xl border ${colorClass} bg-opacity-10 bg-white dark:bg-opacity-5`}>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200">
               {icon} {title}
            </h3>
            
            {/* LISTA DE ITENS EXISTENTES */}
            <div className="space-y-2 mb-4">
                {items.length === 0 && <p className="text-xs text-gray-400 italic">Nenhuma sugestão cadastrada. O site usará o padrão.</p>}
                {items.map(item => (
                    <div key={item.id} className="flex justify-between items-start bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div>
                            <p className="text-xs font-bold text-gray-900 dark:text-white">{item.title}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{item.description}</p>
                        </div>
                        <button 
                            onClick={() => removeSuggestion(key, item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {/* FORMULÁRIO DE ADIÇÃO */}
            <div className="space-y-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <input 
                    placeholder="Novo Título (ex: Show no Pátio)" 
                    className="w-full p-2 text-xs rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-800 outline-none focus:ring-1 focus:ring-orange-500"
                    value={tempSuggestion.category === key ? tempSuggestion.title : ''}
                    onChange={(e) => setTempSuggestion({ category: key, title: e.target.value, description: tempSuggestion.category === key ? tempSuggestion.description : '' })}
                />
                <textarea 
                    placeholder="Nova Descrição..." 
                    className="w-full p-2 text-xs rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-800 outline-none focus:ring-1 focus:ring-orange-500 resize-none h-12"
                    value={tempSuggestion.category === key ? tempSuggestion.description : ''}
                    onChange={(e) => setTempSuggestion({ category: key, description: e.target.value, title: tempSuggestion.category === key ? tempSuggestion.title : '' })}
                />
                <button 
                    onClick={() => addSuggestion(key)}
                    disabled={tempSuggestion.category !== key || !tempSuggestion.title || !tempSuggestion.description}
                    className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-1.5 rounded-md text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                >
                    <Plus size={12} /> Adicionar à Lista
                </button>
            </div>
        </div>
      );
  };

  if (!isFirebaseConfigured()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-gray-900">
        <AlertCircle size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2 dark:text-white">Firebase não configurado</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Para usar o gerenciador de conteúdo, você precisa configurar as chaves do Firebase no arquivo <code>services/firebase.ts</code>.
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutGrid className="text-orange-600 dark:text-orange-400" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Login do Gestor</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Acesso restrito a administradores.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="admin@exemplo.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="••••••"
              />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

            <button type="submit" className="w-full bg-gray-900 dark:bg-black text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <LogIn size={18} /> Entrar no Painel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // CALCULATE UNCATEGORIZED ITEMS
  const uncategorizedPlaces = places.filter(p => !CATEGORIES.some(c => c.id === p.category));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 relative">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                <LayoutGrid size={20} className="text-orange-600 dark:text-orange-400" />
             </div>
             <h1 className="font-heading font-bold text-lg hidden sm:block">Painel CMS</h1>
          </div>
          
          {/* TABS DE NAVEGAÇÃO */}
          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg overflow-x-auto">
             <button 
               onClick={() => setActiveTab('places')}
               className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'places' ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
             >
               <Store size={14} /> Locais
             </button>
             <button 
               onClick={() => setActiveTab('suggestions')}
               className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'suggestions' ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
             >
               <Sparkles size={14} /> Sugestões
             </button>
             <button 
               onClick={() => setActiveTab('reviews')}
               className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'reviews' ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
             >
               <Star size={14} /> Avaliações
             </button>
             <button 
               onClick={() => setActiveTab('config')}
               className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'config' ? 'bg-white dark:bg-gray-600 text-orange-600 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
             >
               <Settings size={14} /> Configs
             </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={logoutCMS}
              className="text-gray-500 hover:text-red-500 p-2 transition-colors"
              title="Sair"
            >
              <LogIn size={20} className="rotate-180" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-6 pb-20">
        {loading && <div className="text-center py-10 opacity-50 flex items-center justify-center gap-2"><div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div> Carregando...</div>}

        {/* === ABA: AVALIAÇÕES (REVIEWS) === */}
        {activeTab === 'reviews' && !loading && (
           <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                 <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                   <Star size={20} className="text-orange-500" />
                   Gestão de Avaliações (Landing Page)
                 </h2>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                   Copie os melhores comentários do Airbnb e cole aqui para exibir no site. Isso ajuda a passar confiança!
                 </p>

                 {/* Formulário de Adição */}
                 <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-6 space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase">Adicionar Nova</h3>
                    <input 
                      placeholder="Nome do Hóspede (ex: Maria Silva)"
                      className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                      value={newReview.name}
                      onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    />
                    <textarea 
                      placeholder="Cole o comentário aqui..."
                      className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 outline-none focus:ring-1 focus:ring-orange-500 text-sm resize-none h-24"
                      value={newReview.text}
                      onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                    />
                    <button 
                      onClick={handleAddReview}
                      className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors"
                    >
                      Adicionar Avaliação
                    </button>
                 </div>

                 {/* Lista de Avaliações */}
                 <div className="space-y-3">
                    {reviews.length === 0 && <p className="text-center text-gray-400 text-sm py-4">Nenhuma avaliação cadastrada.</p>}
                    {reviews.map(review => (
                       <div key={review.id} className="bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-start gap-4">
                          <div>
                             <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                               {review.name} 
                               <span className="text-amber-500 flex"><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /></span>
                             </p>
                             <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">"{review.text}"</p>
                          </div>
                          <button 
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* === ABA: SUGESTÕES INTELIGENTES === */}
        {activeTab === 'suggestions' && !loading && (
           <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                 <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                   <Sparkles size={20} className="text-orange-500" />
                   Sugestões do Dia (Pool de Ideias)
                 </h2>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                   Adicione várias sugestões para cada horário. O sistema escolherá <strong>uma aleatoriamente</strong> para mostrar ao hóspede a cada acesso.
                 </p>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderSuggestionSection('morning', 'Manhã (05h-11h)', <Coffee size={16}/>, 'border-orange-200 dark:border-orange-900')}
                    {renderSuggestionSection('lunch', 'Almoço (11h-15h)', <Utensils size={16}/>, 'border-red-200 dark:border-red-900')}
                    {renderSuggestionSection('sunset', 'Fim de Tarde (15h-18h)', <Sunset size={16}/>, 'border-indigo-200 dark:border-indigo-900')}
                    {renderSuggestionSection('night', 'Noite (18h-05h)', <Moon size={16}/>, 'border-slate-200 dark:border-slate-700')}
                 </div>

                 <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <button 
                      onClick={handleSaveSuggestions}
                      disabled={isSavingSuggestions}
                      className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${suggestionsSavedSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                    >
                       {isSavingSuggestions ? (
                         <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                       ) : suggestionsSavedSuccess ? (
                         <><Check size={18} /> Lista Salva com Sucesso!</>
                       ) : (
                         <><Save size={18} /> Salvar Todas as Sugestões</>
                       )}
                    </button>
                 </div>
              </div>
           </div>
        )}

        {/* === ABA: CONFIGURAÇÕES (CAPA + WIFI + AVISOS + IA + CURIOSIDADES) === */}
        {activeTab === 'config' && !loading && (
           <div className="max-w-2xl mx-auto space-y-6">
              
              {/* SEÇÃO 1: CAPA DO SITE (HERO) */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                 <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                   <ImageIcon size={20} className="text-orange-500" />
                   Imagens do Carrossel (Hero)
                 </h2>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                   Adicione as URLs das imagens que aparecem no topo do site. A primeira imagem é a principal.
                 </p>

                 <div className="space-y-4 mb-6">
                    {heroImages.length === 0 && (
                      <p className="text-sm italic text-gray-400 text-center py-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        Nenhuma imagem customizada. O site usará as imagens padrão.
                      </p>
                    )}
                    {heroImages.map((url, idx) => (
                       <div key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-700 group">
                          <div className="w-16 h-10 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                             <OptimizedImage src={url} className="w-full h-full object-cover" alt="Capa" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="text-xs text-gray-500 truncate font-mono">{url}</p>
                          </div>
                          <button 
                            onClick={() => handleRemoveHeroImage(idx)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                    ))}
                 </div>

                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newHeroImage}
                      onChange={(e) => setNewHeroImage(e.target.value)}
                      placeholder="Cole o link da imagem aqui..."
                      className="flex-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button 
                      onClick={handleAddHeroImage}
                      disabled={!newHeroImage}
                      className="bg-orange-500 text-white px-4 rounded-xl font-bold text-sm hover:bg-orange-600 disabled:opacity-50 transition-colors"
                    >
                      Adicionar
                    </button>
                 </div>
              </div>

              {/* SEÇÃO 2: CONFIGURAÇÕES GERAIS (WIFI, COFRE & AVISOS) */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                 <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                   <Settings size={20} className="text-orange-500" />
                   Geral, Acesso & Avisos
                 </h2>
                 
                 <div className="space-y-6">
                    
                    {/* GRUPO DE ACESSO (WIFI E COFRE) */}
                    <div className="grid grid-cols-1 gap-4">
                        {/* WIFI */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                           <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                              <Wifi size={16} className="text-blue-500"/> Rede Wi-Fi
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome da Rede (SSID)</label>
                                 <input 
                                   value={appSettings.wifiSSID}
                                   onChange={(e) => setAppSettings({...appSettings, wifiSSID: e.target.value})}
                                   placeholder="Ex: Flat_Lili_5G"
                                   className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                 />
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha do Wi-Fi</label>
                                 <input 
                                   value={appSettings.wifiPass}
                                   onChange={(e) => setAppSettings({...appSettings, wifiPass: e.target.value})}
                                   placeholder="Ex: visitante123"
                                   className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                 />
                              </div>
                           </div>
                        </div>

                        {/* SENHA DO COFRE (NOVO) */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                           <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                              <Box size={16} className="text-orange-500"/> Senha do Cofre (Global)
                           </h3>
                           <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha Atual do Cofre de Chaves</label>
                               <div className="relative">
                                 <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                 <input 
                                   value={appSettings.safeCode}
                                   onChange={(e) => setAppSettings({...appSettings, safeCode: e.target.value.replace(/\D/g, '')})}
                                   placeholder="Ex: 8080"
                                   inputMode="numeric"
                                   className="w-full p-3 pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-widest"
                                 />
                               </div>
                               <p className="text-[10px] text-gray-400 mt-1 ml-1">Esta senha será mostrada para TODOS os hóspedes ativos.</p>
                           </div>
                        </div>
                    </div>

                    {/* AVISOS */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                       <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-bold text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                             <Megaphone size={16}/> Aviso Global (Para Todos)
                          </h3>
                          <div className="flex items-center gap-2">
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer" 
                                  checked={appSettings.noticeActive}
                                  onChange={(e) => setAppSettings({...appSettings, noticeActive: e.target.checked})}
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                                <span className="ml-2 text-xs font-medium text-gray-900 dark:text-gray-300">{appSettings.noticeActive ? 'Ativado' : 'Desativado'}</span>
                             </label>
                          </div>
                       </div>
                       
                       <textarea 
                          value={appSettings.noticeText}
                          onChange={(e) => setAppSettings({...appSettings, noticeText: e.target.value})}
                          placeholder="Ex: Manutenção na piscina dia 20/10 das 8h às 12h."
                          className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-500 min-h-[80px]"
                          disabled={!appSettings.noticeActive}
                       />
                       {appSettings.noticeActive && (
                          <div className="mt-2 p-2 bg-yellow-500 text-white text-xs font-bold text-center rounded-lg shadow-sm">
                             Prévia: {appSettings.noticeText || "Seu texto aqui..."}
                          </div>
                       )}
                    </div>

                    {/* CÉREBRO DA IA */}
                    <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                       <h3 className="text-sm font-bold text-purple-700 dark:text-purple-400 flex items-center gap-2 mb-3">
                          <Sparkles size={16}/> Cérebro da IA (Mandacaru)
                       </h3>
                       <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">
                          Aqui você define a personalidade e o conhecimento da Inteligência Artificial. Tudo o que você escrever aqui será a "verdade absoluta" para o robô.
                       </p>
                       
                       <textarea 
                          value={appSettings.aiSystemPrompt || ''}
                          onChange={(e) => setAppSettings({...appSettings, aiSystemPrompt: e.target.value})}
                          placeholder={DEFAULT_SYSTEM_INSTRUCTION}
                          className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500 min-h-[200px] font-mono leading-relaxed"
                       />
                       <p className="text-[10px] text-gray-400 mt-2 text-right">
                          Deixe em branco para usar o padrão do sistema (definido no código).
                       </p>
                    </div>

                    {/* CURIOSIDADES DA CIDADE (NOVO) */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                       <h3 className="text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-3">
                          <Lightbulb size={16}/> Curiosidades da Cidade (Stories)
                       </h3>
                       <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                          Essas frases aparecem aleatoriamente nos Stories para os hóspedes. Adicione fatos interessantes sobre Petrolina.
                       </p>
                       
                       <div className="space-y-2 mb-4">
                          {appSettings.cityCuriosities?.map((curiosity, idx) => (
                             <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300">
                                <span>{curiosity}</span>
                                <button onClick={() => handleRemoveCuriosity(idx)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                   <Trash2 size={14} />
                                </button>
                             </div>
                          ))}
                          {(!appSettings.cityCuriosities || appSettings.cityCuriosities.length === 0) && (
                             <p className="text-xs text-gray-400 italic text-center py-2">Nenhuma curiosidade personalizada (usando padrão).</p>
                          )}
                       </div>

                       <div className="flex gap-2">
                          <input 
                             value={newCuriosity}
                             onChange={(e) => setNewCuriosity(e.target.value)}
                             placeholder="Nova curiosidade..."
                             className="flex-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500"
                             onKeyDown={(e) => e.key === 'Enter' && handleAddCuriosity()}
                          />
                          <button 
                             onClick={handleAddCuriosity}
                             disabled={!newCuriosity.trim()}
                             className="bg-blue-500 text-white px-3 rounded-lg font-bold text-xs hover:bg-blue-600 disabled:opacity-50 transition-colors"
                          >
                             Adicionar
                          </button>
                       </div>
                    </div>

                    <button 
                      onClick={handleSaveAppConfig}
                      disabled={isSavingConfig}
                      className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${configSavedSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600'}`}
                    >
                       {isSavingConfig ? (
                         <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                       ) : configSavedSuccess ? (
                         <><Check size={18} /> Salvo com Sucesso!</>
                       ) : (
                         <><Save size={18} /> Salvar Configurações</>
                       )}
                    </button>
                 </div>
              </div>

           </div>
        )}

        {/* === ABA: LOCAIS (AGRUPADO POR CATEGORIAS) === */}
        {activeTab === 'places' && (
          <>
            <div className="flex justify-end mb-6">
                <button 
                  onClick={() => setIsFormOpen(true)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                >
                  <Plus size={16} /> Novo Local
                </button>
            </div>

            {!loading && places.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 border-dashed">
                <p className="text-gray-400 font-medium">Nenhum local cadastrado ainda.</p>
                <button onClick={() => setIsFormOpen(true)} className="mt-4 text-orange-500 font-bold hover:underline">Cadastrar o primeiro</button>
              </div>
            )}

            {/* RENDERIZAÇÃO AGRUPADA POR CATEGORIA */}
            <div className="space-y-8">
              {CATEGORIES.map(category => {
                const categoryPlaces = places.filter(p => p.category === category.id);
                if (categoryPlaces.length === 0) return null; // Não exibe categoria vazia

                const isCollapsed = collapsedCategories.includes(category.id);

                return (
                  <div key={category.id} className="bg-white/50 dark:bg-gray-800/30 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    
                    {/* CABEÇALHO DA CATEGORIA (CLICÁVEL) */}
                    <button 
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold font-heading text-gray-800 dark:text-white flex items-center gap-2">
                          {category.label} 
                          <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs px-2 py-0.5 rounded-full font-sans">
                            {categoryPlaces.length}
                          </span>
                        </h2>
                      </div>
                      {isCollapsed ? <ChevronDown className="text-gray-400" /> : <ChevronUp className="text-gray-400" />}
                    </button>

                    {/* GRID DE LOCAIS (COLLAPSIBLE) */}
                    {!isCollapsed && (
                      <div className="p-4 border-t border-gray-100 dark:border-gray-700 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {categoryPlaces.map(place => (
                            <div key={place.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex flex-col group">
                              <div className="h-40 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                                <OptimizedImage src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg font-heading mb-1">{place.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{place.description}</p>
                                
                                {(place.category === 'events' && place.eventDate) && (
                                    <div className="mb-3 flex items-center gap-1.5 text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded-md w-fit">
                                        <Calendar size={12} /> 
                                        {place.eventDate.split('-').reverse().join('/')}
                                        {place.eventTime && ` • ${place.eventTime}`}
                                    </div>
                                )}

                                <div className="mt-auto flex justify-end pt-3 border-t border-gray-100 dark:border-gray-700 gap-2">
                                    <button 
                                      onClick={() => handleEditPlace(place)}
                                      className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase"
                                    >
                                      <Edit size={16} /> Editar
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(place.id)}
                                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase"
                                    >
                                      <Trash2 size={16} /> Excluir
                                    </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* LOCAIS SEM CATEGORIA (SE HOUVER) */}
              {uncategorizedPlaces.length > 0 && (
                 <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl border border-red-200 dark:border-red-900 overflow-hidden">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/30">
                       <h2 className="text-lg font-bold font-heading text-red-700 dark:text-red-400 flex items-center gap-2">
                          <AlertCircle size={20} /> Outros / Sem Categoria
                          <span className="bg-white dark:bg-black/20 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded-full font-sans">
                            {uncategorizedPlaces.length}
                          </span>
                       </h2>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {uncategorizedPlaces.map(place => (
                          <div key={place.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
                              <div className="p-4">
                                 <h3 className="font-bold">{place.name}</h3>
                                 <p className="text-xs text-gray-500 mb-2">Categoria inválida: {place.category}</p>
                                 <button onClick={() => handleEditPlace(place)} className="text-blue-500 text-xs font-bold uppercase">Corrigir Agora</button>
                              </div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* MODAL DE ADIÇÃO/EDIÇÃO DE LOCAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseForm}></div>
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 rounded-t-2xl">
              <h2 className="text-xl font-bold font-heading">{editingId ? 'Editar Local' : 'Novo Local'}</h2>
              <button onClick={handleCloseForm} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Local *</label>
                    <input 
                      className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none" 
                      placeholder="Ex: Pizzaria Bella Napoli"
                      value={newPlace.name || ''}
                      onChange={e => setNewPlace({...newPlace, name: e.target.value})}
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria *</label>
                    <select 
                      className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none appearance-none"
                      value={newPlace.category}
                      onChange={e => setNewPlace({...newPlace, category: e.target.value as PlaceCategory})}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                 </div>

                 {/* --- CAMPOS ESPECÍFICOS PARA EVENTOS --- */}
                 {newPlace.category === 'events' && (
                    <div className="col-span-1 md:col-span-2 bg-pink-50 dark:bg-pink-900/20 p-4 rounded-xl border border-pink-100 dark:border-pink-800/30 grid grid-cols-2 gap-4 animate-fadeIn">
                        <div className="col-span-2">
                            <p className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1 mb-2 uppercase tracking-wider">
                                <Calendar size={14} /> Configuração do Evento
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data do Evento (Início) *</label>
                            <input 
                                type="date"
                                className="w-full p-3 bg-white dark:bg-gray-800 rounded-xl border border-pink-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                value={newPlace.eventDate || ''}
                                onChange={e => setNewPlace({...newPlace, eventDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data Fim (Opcional)</label>
                            <input 
                                type="date"
                                className="w-full p-3 bg-white dark:bg-gray-800 rounded-xl border border-pink-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                value={newPlace.eventEndDate || ''}
                                onChange={e => setNewPlace({...newPlace, eventEndDate: e.target.value})}
                            />
                        </div>
                        
                        {/* CAMPOS DE HORA (NOVO) */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hora Início (Opcional)</label>
                            <div className="relative">
                                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="time"
                                    className="w-full p-3 pl-9 bg-white dark:bg-gray-800 rounded-xl border border-pink-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                    value={newPlace.eventTime || ''}
                                    onChange={e => setNewPlace({...newPlace, eventTime: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hora Fim (Opcional)</label>
                            <div className="relative">
                                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="time"
                                    className="w-full p-3 pl-9 bg-white dark:bg-gray-800 rounded-xl border border-pink-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                    value={newPlace.eventEndTime || ''}
                                    onChange={e => setNewPlace({...newPlace, eventEndTime: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="col-span-2 text-[10px] text-pink-600 dark:text-pink-400 italic">
                            * O evento deixará de aparecer no guia automaticamente após a data final.
                        </div>
                    </div>
                 )}
                 
                 <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição *</label>
                    <textarea 
                      className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none resize-none h-24" 
                      placeholder="Descreva o local em poucas palavras..."
                      value={newPlace.description || ''}
                      onChange={e => setNewPlace({...newPlace, description: e.target.value})}
                    />
                 </div>

                 <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><ImageIcon size={12}/> URL da Imagem *</label>
                    <input 
                      className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none font-mono text-sm" 
                      placeholder="https://..."
                      value={newPlace.imageUrl || ''}
                      onChange={e => setNewPlace({...newPlace, imageUrl: e.target.value})}
                    />
                    {newPlace.imageUrl && (
                      <div className="mt-2 h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-black/50 border border-gray-200 dark:border-gray-700">
                        <OptimizedImage src={newPlace.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                 </div>

                 <div className="col-span-1 md:col-span-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><MapPin size={12}/> Endereço</label>
                        <input 
                          className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none" 
                          placeholder="Rua..."
                          value={newPlace.address || ''}
                          onChange={e => setNewPlace({...newPlace, address: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Distância (Opcional)</label>
                        <input 
                          className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none" 
                          placeholder="Ex: 500m"
                          value={newPlace.distance || ''}
                          onChange={e => setNewPlace({...newPlace, distance: e.target.value})}
                        />
                      </div>
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><LinkIcon size={12}/> Link Pedido/Site</label>
                    <input 
                      className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none" 
                      placeholder="https://ifood..."
                      value={newPlace.orderLink || ''}
                      onChange={e => setNewPlace({...newPlace, orderLink: e.target.value})}
                    />
                 </div>
                 
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><Phone size={12}/> Telefone (Só Números)</label>
                    <input 
                      className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none" 
                      placeholder="55879..."
                      value={newPlace.phoneNumber || ''}
                      onChange={e => setNewPlace({...newPlace, phoneNumber: e.target.value})}
                    />
                 </div>

                 <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><Tag size={12}/> Tags</label>
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none" 
                        placeholder="Adicione tags (Enter)"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addTag()}
                      />
                      <button onClick={addTag} className="bg-gray-200 dark:bg-gray-700 px-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-bold text-xl">+</button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newPlace.tags?.map((tag, i) => (
                        <span key={i} className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                          {tag}
                          <button onClick={() => removeTag(i)} className="hover:text-red-500"><X size={12}/></button>
                        </span>
                      ))}
                    </div>
                 </div>

               </div>
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
              <button 
                onClick={handleSavePlace}
                disabled={loading}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50"
              >
                {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div> : <Save size={20} />}
                {editingId ? 'Atualizar Local' : 'Salvar Local'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ContentManager;