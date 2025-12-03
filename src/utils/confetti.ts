import confetti from 'canvas-confetti';

export const triggerConfetti = (element?: HTMLElement) => {
    // Se um elemento for passado, tenta originar o confete dele (aproximação)
    // Caso contrário, ou como fallback, faz uma explosão no centro/baixo da tela

    const rect = element?.getBoundingClientRect();

    const origin = rect ? {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
    } : { x: 0.5, y: 0.7 };

    confetti({
        particleCount: 100,
        spread: 70,
        origin: origin,
        colors: ['#FF5733', '#FFC300', '#DAF7A6', '#C70039', '#900C3F'],
        disableForReducedMotion: true,
        zIndex: 9999, // Garantir que apareça sobre modais
    });
};
