import React, { useState, useEffect, useRef } from 'react';
import OptimizedImage from '../ui/OptimizedImage';
import { LANDING_HERO_SLIDES } from '../../constants';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % LANDING_HERO_SLIDES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    useGSAP(
        () => {
            // Parallax Effect on Background
            gsap.to(bgRef.current, {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            // Text Entrance Animation
        },
        { scope: containerRef }
    );

    return (
        <section
            id="inicio"
            ref={containerRef}
            className="relative h-[100dvh] min-h-[700px] w-full overflow-hidden"
        >
            {/* Background Slider */}
            <div ref={bgRef} className="absolute inset-0 z-0">
                {LANDING_HERO_SLIDES.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
                            currentSlide === index ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                        }`}
                    >
                        <OptimizedImage
                            src={img}
                            className="w-full h-full object-cover"
                            alt="Flat de Lili Interior"
                            loading="eager"
                        />
                        <div className="absolute inset-0 bg-black/40" /> {/* Overlay mais suave */}
                    </div>
                ))}
            </div>

            {/* Content: Bottom Left Alignment */}
            <div className="absolute inset-0 z-10 container mx-auto px-6 md:px-12 pb-12 md:pb-24 flex flex-col justify-end items-start text-white">
                <div ref={textRef} className="max-w-4xl">
                    <span className="block text-orange-400 font-bold tracking-[0.2em] uppercase text-sm mb-6 flex items-center gap-3">
                        <span className="w-12 h-[1px] bg-orange-400"></span>
                        Flat de Lili Apresenta
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-medium leading-[1.1] mb-8">
                        A experiência <br />
                        <span className="italic font-light text-white">boutique</span> de <br />
                        <span className="text-orange-500 font-bold">Petrolina.</span>
                    </h1>
                    <p className="text-lg md:text-xl font-light text-white/80 max-w-lg leading-relaxed mb-10 border-l border-white/30 pl-6">
                        Design autoral, conforto absoluto e uma localização privilegiada no centro
                        da cidade. Bem-vindo ao seu novo refúgio.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4">
                        <a
                            href="#calendario"
                            className="px-8 py-4 bg-white text-gray-900 rounded-none text-sm font-bold uppercase tracking-widest hover:bg-orange-50 transition-colors text-center"
                        >
                            Checar Disponibilidade
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
