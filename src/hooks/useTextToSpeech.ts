import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTextToSpeechReturn {
    speak: (text: string, lang?: string, useCloud?: boolean) => void;
    cancel: () => void;
    isSpeaking: boolean;
    isSupported: boolean;
    hasVoice: boolean;
}

export const useTextToSpeech = (): UseTextToSpeechReturn => {
    const [isSupported, setIsSupported] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    // Audio element for Cloud TTS
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setIsSupported(true);

            // Carrega vozes
            const loadVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                setVoices(availableVoices);
            };

            loadVoices();

            // Chrome carrega vozes assincronamente
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const getBestVoice = useCallback((lang: string) => {
        if (!voices.length) return null;

        // Prioridade 1: Vozes "Google" ou "Premium" no idioma exato
        const exactMatch = voices.find(
            (v) => v.lang.startsWith(lang) && (v.name.includes('Google') || v.name.includes('Premium'))
        );
        if (exactMatch) return exactMatch;

        // Prioridade 2: Qualquer voz no idioma exato
        const langMatch = voices.find((v) => v.lang.startsWith(lang));
        if (langMatch) return langMatch;

        // Fallback: Tenta um match parcial (ex: 'pt' pega 'pt-BR')
        const partialMatch = voices.find((v) => v.lang.includes(lang.split('-')[0]));
        return partialMatch || null;
    }, [voices]);

    // --- STOP / CANCEL FUNCTION (Defined first to be used by speak) ---
    const cancel = useCallback(() => {
        if (isSupported) {
            window.speechSynthesis.cancel();
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsSpeaking(false);
    }, [isSupported]);

    // --- BROWSER NATIVE SPEAK ---
    const speakNative = useCallback((text: string, targetLang: string) => {
        // Cancela fala anterior
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        const voice = getBestVoice(targetLang);

        if (voice) {
            utterance.voice = voice;
        }

        utterance.lang = targetLang;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [getBestVoice]);

    // --- MAIN SPEAK FUNCTION ---
    const speak = useCallback(async (text: string, lang: string = 'pt-BR', useCloud: boolean = false) => {
        if (!isSupported) return;

        // Pare tudo antes de começar
        cancel();
        setIsSpeaking(true);

        // Mapeia idiomas do app para BCP 47 tags
        let targetLang = 'pt-BR';
        if (lang === 'en') targetLang = 'en-US';
        if (lang === 'es') targetLang = 'es-ES';

        // Tenta usar Cloud TTS se solicitado
        if (useCloud) {
            try {
                const response = await fetch('/api/tts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, lang: targetLang }),
                });

                if (!response.ok) {
                    const errDetail = await response.json().catch(() => ({}));
                    console.error('TTS API Failed:', errDetail);

                    // DEBUG: Alert user if API Key is bad
                    if (response.status === 500 && JSON.stringify(errDetail).includes("API Key")) {
                        alert('Erro na API de Voz: Chave inválida ou API não ativada no Google Cloud. Usando voz robótica.');
                    }

                    throw new Error('Cloud TTS failed');
                }

                const data = await response.json();

                if (data.audioContent) {
                    const audioSrc = `data:audio/mp3;base64,${data.audioContent}`;

                    if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current = null;
                    }

                    const audio = new Audio(audioSrc);
                    audioRef.current = audio;

                    audio.onended = () => {
                        setIsSpeaking(false);
                        audioRef.current = null;
                    };

                    audio.onerror = () => {
                        console.error("Audio playback error");
                        setIsSpeaking(false);
                        speakNative(text, targetLang); // Fallback on playback error
                    };

                    await audio.play();
                    return; // Sucesso com Cloud
                }
            } catch (error) {
                console.warn('Falling back to native TTS due to error:', error);
                // Fallback continua abaixo
            }
        }

        // Se chegou aqui: ou useCloud=false ou Cloud falhou -> Usa Native
        speakNative(text, targetLang);

    }, [isSupported, speakNative, cancel]);

    return {
        speak,
        cancel,
        isSpeaking,
        isSupported,
        hasVoice: voices.length > 0
    };
};
