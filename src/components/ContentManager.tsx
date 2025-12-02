import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { LayoutGrid, Store, Sparkles, Star, Settings, LogIn, AlertCircle } from 'lucide-react';
import { subscribeToAuth, logoutCMS, isFirebaseConfigured, cleanupExpiredEvents } from '../services/firebase';

import CMSLogin from './cms/CMSLogin';
import PlacesManager from './cms/PlacesManager';
import ReviewsManager from './cms/ReviewsManager';
import ConfigManager from './cms/ConfigManager';
import SuggestionsManager from './cms/SuggestionsManager';

const ContentManager: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'places' | 'config' | 'suggestions' | 'reviews'>('places');

  useEffect(() => {
    const unsubscribe = subscribeToAuth((u) => {
      setUser(u);
      if (u) {
        cleanupExpiredEvents();
      }
    });
    return () => unsubscribe();
  }, []);

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
    return <CMSLogin />;
  }

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
        {activeTab === 'places' && <PlacesManager />}
        {activeTab === 'suggestions' && <SuggestionsManager />}
        {activeTab === 'reviews' && <ReviewsManager />}
        {activeTab === 'config' && <ConfigManager />}
      </main>
    </div>
  );
};

export default ContentManager;