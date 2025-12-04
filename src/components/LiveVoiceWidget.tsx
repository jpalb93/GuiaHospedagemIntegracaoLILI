import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Loader2, Volume2, AlertCircle } from 'lucide-react';

interface LiveVoiceWidgetProps {
    guestName: string;
    systemInstruction?: string;
}

const LiveVoiceWidget: React.FC<LiveVoiceWidgetProps> = ({ guestName, systemInstruction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    // const [isConnected, setIsConnected] = useState(false); // Unused for now
    // const [isRecording, setIsRecording] = useState(false); // Unused for now
    const [error, setError] = useState<string | null>(null);
    const [audioLevel, setAudioLevel] = useState(0);
    const [assistantSpeaking, setAssistantSpeaking] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const audioQueueRef = useRef<string[]>([]);
    const isPlayingRef = useRef(false);
    const playbackContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef<number>(0);

    // Cleanup playback context on unmount
    useEffect(() => {
        return () => {
            if (playbackContextRef.current) {
                playbackContextRef.current.close();
            }
        };
    }, []);

    // Helper to fetch API Key
    const getApiKey = async () => {
        try {
            const res = await fetch('/api/gemini-key');
            if (!res.ok) throw new Error('Failed to fetch API key');
            const data = await res.json();
            return data.key;
        } catch (err) {
            console.error(err);
            setError('Erro de configuração da API.');
            return null;
        }
    };

    const connectToGemini = async () => {
        setIsConnecting(true);
        setError(null);

        const apiKey = await getApiKey();
        if (!apiKey) {
            setIsConnecting(false);
            return;
        }

        const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;

        try {
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('✅ Connected to Gemini Live WebSocket');
                // setIsConnected(true);
                setIsConnecting(false);

                // Send Setup Message
                const setupMessage = {
                    setup: {
                        model: "models/gemini-2.0-flash-exp",
                        generation_config: {
                            response_modalities: ["AUDIO"],
                            speech_config: {
                                voice_config: {
                                    prebuilt_voice_config: {
                                        voice_name: "Aoede"
                                    }
                                }
                            }
                        },
                        system_instruction: {
                            parts: [{ text: `${systemInstruction || ''}\n\nO nome do hóspede é ${guestName}. Seja breve e simpática.` }]
                        }
                    }
                };
                console.log('Sending setup message:', setupMessage);
                ws.send(JSON.stringify(setupMessage));

                // Start Audio Recording immediately after connection
                startRecording();
            };

            ws.onmessage = async (event) => {
                console.log('📩 Received message from Gemini:', event.data.substring(0, 100) + '...');
                const data = JSON.parse(event.data); // Gemini sends text/json messages, audio is base64 inside

                if (data.serverContent) {
                    if (data.serverContent.modelTurn) {
                        const parts = data.serverContent.modelTurn.parts;
                        for (const part of parts) {
                            if (part.inlineData && part.inlineData.mimeType.startsWith('audio/')) {
                                // Audio chunk received
                                const base64Audio = part.inlineData.data;
                                queueAudio(base64Audio);
                            }
                        }
                    }

                    if (data.serverContent.turnComplete) {
                        // Turn complete
                    }
                }
            };

            ws.onerror = (err) => {
                console.error('❌ WebSocket Error:', err);
                setError('Erro na conexão com a IA.');
                setIsConnecting(false);
                stopRecording();
            };

            ws.onclose = (event) => {
                console.log('🔌 Disconnected:', event.code, event.reason);
                // setIsConnected(false);
                setIsConnecting(false);
                stopRecording();
            };

        } catch (err) {
            console.error(err);
            setError('Falha ao conectar.');
            setIsConnecting(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1
                }
            });
            mediaStreamRef.current = stream;

            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
                if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

                const inputData = e.inputBuffer.getChannelData(0);
                // console.log('🎤 Audio chunk captured, size:', inputData.length); // Debug log (commented out to avoid spam)

                // Calculate volume for visualizer
                let sum = 0;
                for (let i = 0; i < inputData.length; i++) {
                    sum += inputData[i] * inputData[i];
                }
                setAudioLevel(Math.sqrt(sum / inputData.length));

                // Convert Float32 to Int16 (PCM)
                const pcmData = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    let s = Math.max(-1, Math.min(1, inputData[i]));
                    pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                }

                // Convert to Base64
                const base64Audio = btoa(
                    String.fromCharCode(...new Uint8Array(pcmData.buffer))
                );

                // Send to Gemini
                const audioMessage = {
                    realtime_input: {
                        media_chunks: [{
                            mime_type: "audio/pcm",
                            data: base64Audio
                        }]
                    }
                };
                wsRef.current.send(JSON.stringify(audioMessage));
            };

            source.connect(processor);
            processor.connect(audioContext.destination);
            // setIsRecording(true);

        } catch (err) {
            console.error('Error accessing microphone:', err);
            setError('Permissão de microfone negada.');
        }
    };

    const stopRecording = () => {
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        // setIsRecording(false);
    };

    const disconnect = () => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        stopRecording();
        setIsOpen(false);
    };

    // Audio Playback Queue
    const queueAudio = (base64Data: string) => {
        audioQueueRef.current.push(base64Data);
        if (!isPlayingRef.current) {
            playNextChunk();
        }
    };

    const playNextChunk = async () => {
        if (audioQueueRef.current.length === 0) {
            isPlayingRef.current = false;
            setAssistantSpeaking(false);
            return;
        }

        isPlayingRef.current = true;
        setAssistantSpeaking(true);

        // Ensure playback context exists
        if (!playbackContextRef.current) {
            playbackContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = playbackContextRef.current;

        // Resume if suspended
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        const chunk = audioQueueRef.current.shift();

        if (chunk) {
            try {
                const binaryString = atob(chunk);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                const float32Data = new Float32Array(bytes.length / 2);
                const dataView = new DataView(bytes.buffer);

                for (let i = 0; i < bytes.length / 2; i++) {
                    const int16 = dataView.getInt16(i * 2, true);
                    float32Data[i] = int16 / 32768.0;
                }

                const buffer = ctx.createBuffer(1, float32Data.length, 24000);
                buffer.getChannelData(0).set(float32Data);

                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);

                // Schedule playback
                const currentTime = ctx.currentTime;
                // If nextStartTime is in the past, reset it to now
                if (nextStartTimeRef.current < currentTime) {
                    nextStartTimeRef.current = currentTime;
                }

                source.start(nextStartTimeRef.current);

                // Update next start time
                nextStartTimeRef.current += buffer.duration;

                // Schedule next chunk processing immediately
                playNextChunk();

                // Auto-stop "speaking" visualizer after the last chunk finishes
                // We use a timeout or check periodically, but for simplicity, let's use onended of the last source if queue is empty
                // However, since we call playNextChunk immediately, we need a way to know when the *audio* actually stops.
                // We can check if queue is empty AND currentTime > nextStartTime

                // Simple check:
                setTimeout(() => {
                    if (audioQueueRef.current.length === 0 && ctx.currentTime >= nextStartTimeRef.current - 0.2) {
                        setAssistantSpeaking(false);
                    }
                }, (nextStartTimeRef.current - currentTime) * 1000 + 100);


            } catch (e) {
                console.error("Error playing audio chunk", e);
                playNextChunk();
            }
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => { setIsOpen(true); connectToGemini(); }}
                className="fixed bottom-24 right-6 z-40 p-4 rounded-full shadow-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 transition-all duration-300 flex items-center gap-2"
                title="Falar com Lili (Voz)"
            >
                <Mic size={24} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-2 animate-fade-up">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-72 border border-purple-100 dark:border-gray-700 relative overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Lili (Voz)
                    </h3>
                    <button onClick={disconnect} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={20} />
                    </button>
                </div>

                {/* Status Display */}
                <div className="flex flex-col items-center justify-center h-32 gap-4 relative">

                    {error ? (
                        <div className="text-red-500 text-center text-sm flex flex-col items-center gap-2">
                            <AlertCircle size={24} />
                            {error}
                        </div>
                    ) : isConnecting ? (
                        <div className="flex flex-col items-center gap-2 text-purple-600">
                            <Loader2 size={32} className="animate-spin" />
                            <span className="text-xs font-medium">Conectando...</span>
                        </div>
                    ) : (
                        <>
                            {/* Visualizer */}
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                {/* Assistant Speaking Ring */}
                                {assistantSpeaking && (
                                    <div className="absolute inset-0 rounded-full border-4 border-purple-400 opacity-50 animate-ping"></div>
                                )}

                                {/* User Speaking Ring */}
                                <div
                                    className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 rounded-full transition-all duration-75"
                                    style={{ transform: `scale(${1 + audioLevel * 5})` }}
                                ></div>

                                <div className={`z-10 w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300 ${assistantSpeaking ? 'bg-purple-600' : 'bg-indigo-500'}`}>
                                    {assistantSpeaking ? <Volume2 className="text-white" size={24} /> : <Mic className="text-white" size={24} />}
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 font-medium">
                                {assistantSpeaking ? "Lili falando..." : "Ouvindo você..."}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveVoiceWidget;
