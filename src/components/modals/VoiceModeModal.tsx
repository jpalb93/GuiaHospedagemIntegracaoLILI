import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, Volume2 } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { sendMessageToGemini } from '../../services/geminiService';
import { ChatMessage } from '../../types';

interface VoiceModeModalProps {
    isOpen: boolean;
    onClose: () => void;
    guestName: string;
    systemInstruction?: string;
}

const VoiceModeModal: React.FC<VoiceModeModalProps> = ({ isOpen, onClose, guestName, systemInstruction }) => {
    const { t, currentLang } = useLanguage();
    const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();
    const { speak, isSpeaking, cancel } = useTextToSpeech(); // Now supports Cloud TTS!

    const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    // Silence Detection for Auto-Send
    const silenceTimer = useRef<NodeJS.Timeout | null>(null);
    const lastTranscriptRef = useRef('');

    // --- EFFECTS ---

    // 1. Reset on Open
    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
            // Speak initial greeting
            const greeting = t(
                `Olá ${guestName}, estou ouvindo.`,
                `Hi ${guestName}, I'm listening.`,
                `Hola ${guestName}, te escucho.`
            );
            speak(greeting, currentLang, true); // Use Cloud TTS
        } else {
            stopListening();
            cancel();
            setMessages([]);
        }
    }, [isOpen]);

    // 2. Monitoring IsSpeaking to update status
    useEffect(() => {
        if (isSpeaking) {
            setStatus('speaking');
        } else if (status === 'speaking') {
            // Finished speaking, go back to listening automatically?
            // For now, let's go to idle and let user click, or auto-listen if desired.
            // Let's make it manual for v1 to avoid infinite loops.
            setStatus('idle');
        }
    }, [isSpeaking]);

    // 3. Auto-Send Logic (Debounced Silence)
    useEffect(() => {
        if (!isListening) return;

        setStatus('listening');

        if (transcript && transcript !== lastTranscriptRef.current) {
            // User is talking
            lastTranscriptRef.current = transcript;

            // Clear existing timer
            if (silenceTimer.current) clearTimeout(silenceTimer.current);

            // Set new timer: if 2 seconds of silence, SEND.
            silenceTimer.current = setTimeout(() => {
                handleSend(transcript);
            }, 2000);
        }
    }, [transcript, isListening]);

    // --- HANDLERS ---

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        stopListening();
        setStatus('processing');

        try {
            // Add user message to local history
            const userMessage: ChatMessage = { role: 'user', text };
            const newHistory = [...messages, userMessage];
            setMessages(newHistory);

            // Prompt Engineering for Voice
            const baseInstruction = systemInstruction || '';
            const voiceInstruction = `
            ${baseInstruction}

            STRICT VOICE MODE GUIDELINES:
            1. ONLY answer based on the provided System Instruction (House Rules/Tips).
            2. Do NOT search the internet or invent facts.
            3. Keep answers SHORT (max 2-3 sentences), CONVERSATIONAL, and WARM.
            4. Do NOT use markdown (*, #) or emojis.
            `;

            const response = await sendMessageToGemini(text, newHistory, guestName, voiceInstruction);

            if (response) {
                setMessages(prev => [...prev, { role: 'model', text: response }]);
                // Speak response using Cloud TTS
                speak(response, currentLang, true);
            }

        } catch (error) {
            speak(t('Desculpe, não entendi.', 'Sorry, I missed that.', 'Perdón, no entendí.'), currentLang, true);
            setStatus('idle');
        }

        setTranscript('');
        lastTranscriptRef.current = '';
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
            setStatus('idle');
        } else {
            // Stop speaking if currently speaking
            if (isSpeaking) cancel();

            startListening();
            setStatus('listening');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-md flex flex-col items-center justify-center text-white animate-fadeIn">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-4 bg-white/10 rounded-full hover:bg-white/20 transition-all"
            >
                <X size={24} />
            </button>

            {/* Status Text */}
            <div className="absolute top-24 text-center px-6">
                <h2 className="text-2xl font-bold font-heading mb-2">
                    {status === 'listening' && t('Ouvindo...', 'Listening...', 'Escuchando...')}
                    {status === 'processing' && t('Pensando...', 'Thinking...', 'Pensando...')}
                    {status === 'speaking' && t('Falando...', 'Speaking...', 'Hablando...')}
                    {status === 'idle' && t('Toque para falar', 'Tap to speak', 'Toca para hablar')}
                </h2>
                {transcript && status === 'listening' && (
                    <p className="text-gray-400 text-lg mt-4 animate-pulse">"{transcript}"</p>
                )}
            </div>

            {/* Main Visualizer (Pulsing Circle) */}
            <button
                onClick={toggleListening}
                className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 scale-100 active:scale-95
                    ${status === 'listening' ? 'shadow-[0_0_100px_rgba(255,59,48,0.6)]' : ''}
                    ${status === 'speaking' ? 'shadow-[0_0_100px_rgba(52,199,89,0.6)]' : ''}
                    ${status === 'processing' ? 'shadow-[0_0_100px_rgba(255,204,0,0.4)]' : ''}
                `}
            >
                {/* Background Circles */}
                <div className={`absolute inset-0 rounded-full border-4 border-white/10 ${status === 'listening' ? 'animate-ping' : ''}`}></div>
                <div className={`absolute inset-4 rounded-full border-4 border-white/20 ${status === 'processing' ? 'animate-spin-slow' : ''}`}></div>

                {/* Icon */}
                <div className={`z-10 bg-white text-gray-900 p-8 rounded-full transition-all duration-300
                    ${status === 'listening' ? 'scale-110 bg-red-500 text-white' : ''}
                    ${status === 'speaking' ? 'scale-110 bg-green-500 text-white' : ''}
                `}>
                    {status === 'speaking' ? (
                        <Volume2 size={48} className="animate-pulse" />
                    ) : (
                        <Mic size={48} className={status === 'listening' ? 'animate-bounce' : ''} />
                    )}
                </div>
            </button>

            {/* Instruction */}
            <p className="absolute bottom-12 text-white/40 text-sm max-w-xs text-center">
                {t(
                    'Pressione o ícone para iniciar ou parar a conversa.',
                    'Press the icon to start or stop the conversation.',
                    'Presiona el icono para iniciar o detener la conversación.'
                )}
            </p>
        </div>
    );
};

export default VoiceModeModal;
