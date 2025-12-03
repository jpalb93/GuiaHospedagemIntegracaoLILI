import React, { useRef, useState, useEffect } from 'react';

interface HolographicCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
    title?: string;
}

const HolographicCard: React.FC<HolographicCardProps> = ({ children, className = '', onClick, title }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [shine, setShine] = useState({ x: 0, y: 0, opacity: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calcula a rotação (limitada a +/- 10 graus)
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        setRotation({ x: rotateX, y: rotateY });
        setShine({ x, y, opacity: 1 });
    };

    const handleMouseLeave = () => {
        // Reseta suavemente ao sair
        setRotation({ x: 0, y: 0 });
        setShine(prev => ({ ...prev, opacity: 0 }));
    };

    // Suporte a Giroscópio (Mobile)
    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (!event.beta || !event.gamma) return;

            // Beta: Inclinação frente/trás (-180 a 180)
            // Gamma: Inclinação esquerda/direita (-90 a 90)

            // Limitamos e suavizamos os valores para não ficar enjoativo
            const rotateX = Math.min(Math.max(event.beta, -20), 20) * -0.5; // Invertido para parecer natural
            const rotateY = Math.min(Math.max(event.gamma, -20), 20) * 0.5;

            setRotation({ x: rotateX, y: rotateY });

            // Simula o brilho baseado na inclinação
            setShine({
                x: 50 + (rotateY * 2), // % aproximada
                y: 50 + (rotateX * 2),
                opacity: 0.5 // Brilho constante no mobile
            });
        };

        // Verifica permissão (necessário no iOS 13+)
        if (typeof DeviceOrientationEvent !== 'undefined' &&
            (DeviceOrientationEvent as any).requestPermission) {
            // No iOS, a permissão precisa ser disparada por um clique do usuário.
            // Por enquanto, deixamos o efeito passivo apenas se já tiver permissão ou for Android.
        } else {
            window.addEventListener('deviceorientation', handleOrientation);
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className={`relative transform-gpu transition-all duration-200 ease-out ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            title={title}
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1, 1, 1)`,
            }}
        >
            {/* Conteúdo do Card */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Camada de Brilho (Shine Effect) */}
            <div
                className="absolute inset-0 pointer-events-none rounded-xl z-20 mix-blend-overlay"
                style={{
                    background: `radial-gradient(circle at ${shine.x}px ${shine.y}px, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 80%)`,
                    opacity: shine.opacity,
                    transition: 'opacity 0.3s ease',
                }}
            />

            {/* Borda Brilhante Sutil */}
            <div
                className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none z-20"
                style={{
                    opacity: shine.opacity > 0 ? 1 : 0.3,
                    transition: 'opacity 0.3s ease'
                }}
            />
        </div>
    );
};

export default HolographicCard;
