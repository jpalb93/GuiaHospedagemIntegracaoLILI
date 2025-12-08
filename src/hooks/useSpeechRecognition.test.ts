import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSpeechRecognition } from './useSpeechRecognition';

describe('useSpeechRecognition', () => {
    const mockRecognition = {
        continuous: false,
        interimResults: false,
        lang: '',
        start: vi.fn(),
        stop: vi.fn(),
        abort: vi.fn(),
        onresult: null as any,
        onerror: null as any,
        onend: null as any,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock SpeechRecognition API
        (global as any).window.SpeechRecognition = vi.fn(() => mockRecognition);
        (global as any).window.webkitSpeechRecognition = vi.fn(() => mockRecognition);
    });

    it('should detect browser support', () => {
        const { result } = renderHook(() => useSpeechRecognition());

        expect(result.current.isSupported).toBe(true);
    });

    it('should initialize with empty transcript and not listening', () => {
        const { result } = renderHook(() => useSpeechRecognition());

        expect(result.current.transcript).toBe('');
        expect(result.current.isListening).toBe(false);
    });

    it('should start listening', () => {
        const { result } = renderHook(() => useSpeechRecognition());

        act(() => {
            result.current.startListening();
        });

        expect(mockRecognition.start).toHaveBeenCalled();
        expect(result.current.isListening).toBe(true);
    });

    it('should stop listening', () => {
        const { result } = renderHook(() => useSpeechRecognition());

        act(() => {
            result.current.startListening();
        });

        act(() => {
            result.current.stopListening();
        });

        expect(mockRecognition.stop).toHaveBeenCalled();
    });

    it('should clear transcript when starting', () => {
        const { result } = renderHook(() => useSpeechRecognition());

        act(() => {
            result.current.setTranscript('old text');
        });

        act(() => {
            result.current.startListening();
        });

        expect(result.current.transcript).toBe('');
    });

    it('should allow manually setting transcript', () => {
        const { result } = renderHook(() => useSpeechRecognition());

        act(() => {
            result.current.setTranscript('Manual text');
        });

        expect(result.current.transcript).toBe('Manual text');
    });

    it('should configure Portuguese BR language', () => {
        renderHook(() => useSpeechRecognition());

        expect(mockRecognition.lang).toBe('pt-BR');
    });

    it('should not start if already listening', () => {
        const { result } = renderHook(() => useSpeechRecognition());

        act(() => {
            result.current.startListening();
        });

        vi.clearAllMocks();

        act(() => {
            result.current.startListening();
        });

        expect(mockRecognition.start).not.toHaveBeenCalled();
    });
});
