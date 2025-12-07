import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, Mic, MicOff } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface ChatWidgetProps {
  guestName: string;
  systemInstruction?: string;
  language?: 'pt' | 'en'; // NOVO PROP
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ guestName, systemInstruction, language = 'pt' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hook de Reconhecimento de Voz
  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition();

  // Atualiza o input com o texto falado
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Mensagem inicial dinâmica baseada no idioma (otimizado com ref)
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const initialText = language === 'pt'
        ? `Olá, ${guestName}! Sou o Concierge Virtual do flat. Posso ajudar com dicas de Petrolina, regras da casa ou dúvidas gerais?`
        : `Hello, ${guestName}! I'm the Virtual Concierge. Can I help you with tips about Petrolina, house rules, or general questions?`;

      setMessages([{ role: 'model', text: initialText }]);
    }
  }, [language, guestName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const history = messages.filter(m => !m.isError);

      // INJEÇÃO DE IDIOMA NO PROMPT
      // Se o idioma for inglês, adicionamos uma instrução extra para a IA
      const langInstruction = language === 'en'
        ? "\nIMPORTANT: The user is viewing the app in English. Please answer ALL questions in English."
        : "";

      const finalInstruction = (systemInstruction || "") + langInstruction;

      const responseText = await sendMessageToGemini(userText, history, guestName, finalInstruction);

      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      }
    } catch (_error) {
      const errorText = language === 'pt'
        ? "Desculpe, tive um problema ao conectar. Tente novamente mais tarde."
        : "Sorry, I had trouble connecting. Please try again later.";
      setMessages(prev => [...prev, { role: 'model', text: errorText, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderFormattedText = (text: string, isUser: boolean) => {
    return text.split('\n').map((line, i) => {
      const isList = line.trim().startsWith('* ') || line.trim().startsWith('- ');
      const cleanLine = isList ? line.trim().substring(2) : line;

      const parts = cleanLine.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isList) {
        return (
          <div key={i} className={`flex items-start gap-2 mb-1 ${isUser ? 'ml-2' : 'ml-1'}`}>
            <span className={`mt-1.5 text-[8px] shrink-0 ${isUser ? 'text-orange-200' : 'text-orange-500'}`}>●</span>
            <span className="leading-relaxed">{parts}</span>
          </div>
        );
      }

      if (!line.trim()) return <div key={i} className="h-2" />;

      return <p key={i} className="mb-1 leading-relaxed min-h-[20px]">{parts}</p>;
    });
  };

  return (
    <>
      {/* Label "Tire dúvidas" */}
      <div className={`fixed bottom-24 right-6 z-40 pointer-events-none transition-all duration-500 ${isOpen ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-xs font-bold py-2 px-4 rounded-xl shadow-lg shadow-black/5 border border-gray-100 dark:border-gray-700 relative">
          {language === 'pt' ? 'Tire dúvidas' : 'Ask a question'}
          <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-white dark:bg-gray-800 transform rotate-45 border-r border-b border-gray-100 dark:border-gray-700"></div>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        aria-label={language === 'pt' ? 'Abrir chat de suporte' : 'Open support chat'}
        aria-expanded={isOpen}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-xl shadow-orange-500/30 transition-all duration-500 flex items-center gap-3
          ${isOpen ? 'scale-0 opacity-0 translate-y-10' : 'scale-100 opacity-100 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:scale-105 hover:shadow-orange-500/40'}`}
      >
        <MessageCircle size={28} fill="currentColor" className="text-white/90" aria-hidden="true" />
        <span className="font-bold hidden md:inline font-heading tracking-wide text-lg">Concierge</span>
      </button>

      <div className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-96 h-[100dvh] sm:h-[600px] bg-white dark:bg-gray-900 sm:rounded-[32px] shadow-2xl flex flex-col transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) origin-bottom-right border border-gray-100 dark:border-gray-700 font-sans overflow-hidden
        ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 text-white flex justify-between items-center shadow-md z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <Sparkles size={20} className="text-yellow-200" />
            </div>
            <div>
              <h3 className="font-bold font-heading text-lg">{language === 'pt' ? 'Concierge Virtual' : 'Virtual Concierge'}</h3>
              <p className="text-xs text-orange-100 opacity-90 font-medium">Powered by Gemini AI</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label={language === 'pt' ? 'Fechar chat' : 'Close chat'}
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-gray-50 dark:bg-gray-800 space-y-5">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                ? 'bg-orange-500 text-white rounded-br-none shadow-orange-500/20'
                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-600 rounded-bl-none shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                }`}>
                {renderFormattedText(msg.text, msg.role === 'user')}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-600 shadow-sm flex items-center gap-3 px-4">
                <Loader2 size={18} className="animate-spin text-orange-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{language === 'pt' ? 'Digitando...' : 'Typing...'}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="relative flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Se o usuário digitar, limpamos o transcript para não sobrescrever
                if (isListening) stopListening();
              }}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? (language === 'pt' ? "Ouvindo..." : "Listening...") : (language === 'pt' ? "Pergunte sobre o flat ou a cidade..." : "Ask about the flat or the city...")}
              className={`w-full bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full py-3.5 pl-5 pr-24 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/30 focus:bg-white dark:focus:bg-gray-700 transition-all text-sm font-medium placeholder:text-gray-400 ${isListening ? 'ring-2 ring-red-400 bg-red-50 dark:bg-red-900/10 placeholder:text-red-500' : ''}`}
            />

            <div className="absolute right-1.5 flex items-center gap-1">
              {/* Botão de Microfone (Só aparece se suportado) */}
              {isSupported && (
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`p-2.5 rounded-full transition-all duration-300 ${isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                    : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700'
                    }`}
                  title={language === 'pt' ? "Falar" : "Speak"}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
              )}

              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2.5 bg-orange-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
