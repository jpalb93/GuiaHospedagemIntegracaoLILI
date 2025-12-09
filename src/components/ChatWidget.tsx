import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useLanguage } from '../hooks/useLanguage';
import VoiceModeModal from './modals/VoiceModeModal';

interface ChatWidgetProps {
    guestName: string;
    systemInstruction?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
    guestName,
    systemInstruction,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false); // NEW STATE
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Estado para controle de áudio (Persistente seria ideal, mas local serve para demo)
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

    // Hook de Idioma
    const { t, currentLang } = useLanguage();

    // Hook de Reconhecimento de Voz (Input)
    const { isListening, transcript, startListening, stopListening, isSupported: isSpeechSupported } =
        useSpeechRecognition();

    // Hook de Síntese de Voz (Output)
    const { speak, cancel: cancelSpeech, isSpeaking } = useTextToSpeech();

    // Atualiza o input com o texto falado
    useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);

    // Mensagem inicial dinâmica
    useEffect(() => {
        const initialText = t(
            `Olá, ${guestName}! Sou o Concierge Virtual do flat. Posso ajudar com dicas de Petrolina, regras da casa ou dúvidas gerais?`,
            `Hello, ${guestName}! I'm the Virtual Concierge. Can I help you with tips about Petrolina, house rules, or general questions?`,
            `¡Hola, ${guestName}! Soy el Conserje Virtual. ¿Puedo ayudarte con consejos sobre Petrolina, reglas de la casa o preguntas generales?`
        );

        if (messages.length === 0) {
            setMessages([{ role: 'model', text: initialText }]);
        }
    }, [currentLang, guestName]);

    // Auto-scroll e cancela fala ao fechar
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        } else {
            cancelSpeech(); // Para de falar se fechar o chat
        }
    }, [isOpen, messages.length, cancelSpeech]);

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

        // Se estava ouvindo, para
        if (isListening) stopListening();
        // Se estava falando, para
        cancelSpeech();

        setMessages((prev) => [...prev, { role: 'user', text: userText }]);
        setIsLoading(true);

        try {
            const history = messages.filter((m) => !m.isError);

            let langInstruction = '';
            if (currentLang === 'en') {
                langInstruction = '\nIMPORTANT: The user is viewing the app in English. Please answer ALL questions in English.';
            } else if (currentLang === 'es') {
                langInstruction = '\nIMPORTANTE: El usuario está viendo la aplicación en Español. Por favor, responde TODAS las preguntas en Español.';
            }

            const finalInstruction = (systemInstruction || '') + langInstruction;

            const responseText = await sendMessageToGemini(
                userText,
                history,
                guestName,
                finalInstruction
            );

            if (responseText) {
                setMessages((prev) => [...prev, { role: 'model', text: responseText }]);

                // AUTO-SPEAK LOGIC
                if (isVoiceEnabled) {
                    // Remove asteriscos de markdown para leitura mais fluida
                    const cleanText = responseText.replace(/\*/g, '');
                    speak(cleanText, currentLang);
                }
            }
        } catch (_error) {
            const errorText = t(
                'Desculpe, tive um problema ao conectar. Tente novamente mais tarde.',
                'Sorry, I had trouble connecting. Please try again later.',
                'Lo siento, tuve problemas para conectar. Por favor, inténtalo de nuevo más tarde.'
            );
            setMessages((prev) => [...prev, { role: 'model', text: errorText, isError: true }]);
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

    const toggleVoice = () => {
        if (isVoiceEnabled) {
            setIsVoiceEnabled(false);
            cancelSpeech();
        } else {
            setIsVoiceEnabled(true);
            // Feedback sonoro opcional ou fala de teste
            // speak(t('Modo de voz ativado', 'Voice mode enabled', 'Modo de voz activado'), currentLang);
        }
    };

    const renderFormattedText = (text: string, isUser: boolean) => {
        return text.split('\n').map((line, i) => {
            const isList = line.trim().startsWith('* ') || line.trim().startsWith('- ');
            const cleanLine = isList ? line.trim().substring(2) : line;

            const parts = cleanLine.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                        <strong key={j} className="font-bold">
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                return part;
            });

            if (isList) {
                return (
                    <div
                        key={i}
                        className={`flex items-start gap-2 mb-1 ${isUser ? 'ml-2' : 'ml-1'}`}
                    >
                        <span
                            className={`mt-1.5 text-[8px] shrink-0 ${isUser ? 'text-orange-200' : 'text-orange-500'}`}
                        >
                            ●
                        </span>
                        <span className="leading-relaxed">{parts}</span>
                    </div>
                );
            }

            if (!line.trim()) return <div key={i} className="h-2" />;

            return (
                <p key={i} className="mb-1 leading-relaxed min-h-[20px]">
                    {parts}
                </p>
            );
        });
    };

    return (
        <>
            <VoiceModeModal
                isOpen={isVoiceModalOpen}
                onClose={() => setIsVoiceModalOpen(false)}
                guestName={guestName}
                systemInstruction={systemInstruction}
            />

            {/* Label "Tire dúvidas" -> Hide when Voice Mode is open or Chat is open */}
            <div
                className={`fixed bottom-24 right-6 z-40 pointer-events-none transition-all duration-500 ${isOpen || isVoiceModalOpen ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
            >
                <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-xs font-bold py-2 px-4 rounded-xl shadow-lg shadow-black/5 border border-gray-100 dark:border-gray-700 relative">
                    {t('Tire dúvidas', 'Ask a question', 'Hacer una pregunta')}
                    <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-white dark:bg-gray-800 transform rotate-45 border-r border-b border-gray-100 dark:border-gray-700"></div>
                </div>
            </div>

            {/* Floating Microphone Button (Voice Mode) */}
            <button
                onClick={() => setIsVoiceModalOpen(true)}
                aria-label={t('Modo de Voz', 'Voice Mode', 'Modo de Voz')}
                className={`fixed bottom-6 right-24 md:right-48 z-40 p-4 rounded-full shadow-xl shadow-blue-500/30 transition-all duration-500 flex items-center gap-3
                ${isOpen || isVoiceModalOpen ? 'scale-0 opacity-0 translate-y-10' : 'scale-100 opacity-100 bg-white dark:bg-gray-800 text-blue-500 hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
                <div className="relative">
                    <Mic size={24} className="text-blue-500" />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    </span>
                </div>
            </button>

            <button
                onClick={() => setIsOpen(true)}
                aria-label={t('Abrir chat de suporte', 'Open support chat', 'Abrir chat de soporte')}
                aria-expanded={isOpen}
                className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-xl shadow-orange-500/30 transition-all duration-500 flex items-center gap-3
          ${isOpen || isVoiceModalOpen ? 'scale-0 opacity-0 translate-y-10' : 'scale-100 opacity-100 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:scale-105 hover:shadow-orange-500/40'}`}
            >
                <MessageCircle
                    size={28}
                    fill="currentColor"
                    className="text-white/90"
                    aria-hidden="true"
                />
                <span className="font-bold hidden md:inline font-heading tracking-wide text-lg">
                    {t('Concierge', 'Concierge', 'Conserje')}
                </span>
            </button>

            <div
                className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-96 h-[100dvh] sm:h-[600px] bg-white dark:bg-gray-900 sm:rounded-[32px] shadow-2xl flex flex-col transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) origin-bottom-right border border-gray-100 dark:border-gray-700 font-sans overflow-hidden
        ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`}
            >
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 text-white flex justify-between items-center shadow-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm relative">
                            <Sparkles size={20} className="text-yellow-200" />
                            {isSpeaking && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                </span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold font-heading text-lg">
                                {t('Concierge Virtual', 'Virtual Concierge', 'Conserje Virtual')}
                            </h3>
                            <p className="text-xs text-orange-100 opacity-90 font-medium">
                                Powered by Gemini AI
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={toggleVoice}
                            className={`p-2 rounded-full transition-all ${isVoiceEnabled ? 'bg-white/20 text-white' : 'text-orange-200 hover:text-white hover:bg-white/10'}`}
                            title={isVoiceEnabled ? t('Desativar voz', 'Disable voice', 'Desactivar voz') : t('Ativar voz', 'Enable voice', 'Activar voz')}
                        >
                            {isVoiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            aria-label={t('Fechar chat', 'Close chat', 'Cerrar chat')}
                        >
                            <X size={24} aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 bg-gray-50 dark:bg-gray-800 space-y-5">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                    ? 'bg-orange-500 text-white rounded-br-none shadow-orange-500/20'
                                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-600 rounded-bl-none shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                                    }`}
                            >
                                {renderFormattedText(msg.text, msg.role === 'user')}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start animate-fadeIn">
                            <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-600 shadow-sm flex items-center gap-3 px-4">
                                <Loader2 size={18} className="animate-spin text-orange-500" />
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                                    {t('Digitando...', 'Typing...', 'Escribiendo...')}
                                </span>
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
                                if (isListening) stopListening();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={
                                isListening
                                    ? t('Ouvindo...', 'Listening...', 'Escuchando...')
                                    : t('Pergunte sobre o flat ou a cidade...', 'Ask about the flat or the city...', 'Pregunta sobre el piso o la ciudad...')
                            }
                            className={`w-full bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full py-3.5 pl-5 pr-24 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/30 focus:bg-white dark:focus:bg-gray-700 transition-all text-sm font-medium placeholder:text-gray-400 ${isListening ? 'ring-2 ring-red-400 bg-red-50 dark:bg-red-900/10 placeholder:text-red-500' : ''}`}
                        />

                        <div className="absolute right-1.5 flex items-center gap-1">
                            {isSpeechSupported && (
                                <button
                                    onClick={isListening ? stopListening : startListening}
                                    className={`p-2.5 rounded-full transition-all duration-300 ${isListening
                                        ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                                        : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700'
                                        }`}
                                    title={t('Falar', 'Speak', 'Hablar')}
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
