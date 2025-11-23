import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatWidgetProps {
  guestName: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ guestName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Olá, ${guestName}! Sou o Concierge Virtual do flat. Posso ajudar com dicas de Petrolina, regras da casa ou dúvidas gerais?` }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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
      const responseText = await sendMessageToGemini(userText, history, guestName);
      
      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Desculpe, tive um problema ao conectar. Tente novamente mais tarde.", isError: true }]);
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
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-xl shadow-orange-500/30 transition-all duration-500 flex items-center gap-3
          ${isOpen ? 'scale-0 opacity-0 translate-y-10' : 'scale-100 opacity-100 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:scale-105 hover:shadow-orange-500/40'}`}
      >
        <MessageCircle size={28} fill="currentColor" className="text-white/90" />
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
              <h3 className="font-bold font-heading text-lg">Concierge Virtual</h3>
              <p className="text-xs text-orange-100 opacity-90 font-medium">Powered by Gemini AI</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-gray-50 dark:bg-gray-800 space-y-5">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
                msg.role === 'user' 
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
                 <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Digitando...</span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="relative flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre o flat ou a cidade..."
              className="w-full bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full py-3.5 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/30 focus:bg-white dark:focus:bg-gray-700 transition-all text-sm font-medium placeholder:text-gray-400"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-1.5 p-2.5 bg-orange-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;