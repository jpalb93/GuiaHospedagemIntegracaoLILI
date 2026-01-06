import React, { useState, useRef } from 'react';
import { ArrowRight, KeyRound, Loader2 } from 'lucide-react';
import { fetchGuestConfig } from '../../services/guest';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GuestAccessSection: React.FC = () => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add('(min-width: 801px)', () => {
                gsap.from(contentRef.current, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                });
            });

            mm.add('(max-width: 800px)', () => {
                gsap.set(contentRef.current, { opacity: 1, y: 0 });
            });

            return () => mm.revert();
        },
        { scope: sectionRef }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            let rid = code.trim();
            if (rid.includes('http') || rid.includes('.com')) {
                const urlObj = new URL(rid.startsWith('http') ? rid : `https://${rid}`);
                const idParam = urlObj.searchParams.get('rid');
                rid = idParam || rid;
            }

            const config = await fetchGuestConfig(rid);
            if (config) {
                localStorage.setItem('flat_lili_last_rid', rid);
                window.location.href = `/?rid=${rid}`;
            } else {
                setError('Código inválido.');
            }
        } catch (err) {
            console.error(err);
            setError('Erro ao verificar.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section ref={sectionRef} className="py-24 bg-stone-900 text-stone-200">
            <div className="container mx-auto px-6 md:px-12">
                <div
                    ref={contentRef}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                >
                    {/* Text Side */}
                    <div className="space-y-8">
                        <div className="w-12 h-12 border border-stone-700 rounded-full flex items-center justify-center text-stone-400">
                            <KeyRound size={20} className="stroke-1" />
                        </div>
                        <h2 className="text-4xl font-heading font-light text-white leading-tight">
                            Exclusivo <br />
                            <span className="italic font-serif text-stone-500">
                                Área do Hóspede
                            </span>
                        </h2>
                        <p className="font-light text-stone-400 max-w-md leading-relaxed">
                            Já possui uma reserva? Digite seu código de acesso para desbloquear o
                            Guia Digital completo da propriedade.
                        </p>
                    </div>

                    {/* Form Side - Minimalist */}
                    <div className="lg:pl-12">
                        <form onSubmit={handleSubmit} className="relative">
                            <label className="block text-xs font-bold tracking-[0.2em] text-stone-500 uppercase mb-6">
                                Código da Reserva
                            </label>

                            <div className="relative group">
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Digite seu código..."
                                    className="w-full bg-transparent border-b border-stone-700 text-3xl font-light text-white pb-4 focus:outline-none focus:border-stone-400 transition-colors placeholder:text-stone-700"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !code}
                                    className="absolute right-0 top-0 bottom-4 text-stone-400 hover:text-white disabled:text-stone-800 transition-colors"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <ArrowRight size={28} className="stroke-1" />
                                    )}
                                </button>
                            </div>

                            {error && (
                                <p className="text-red-400/80 text-sm mt-4 flex items-center gap-2 font-light animate-fadeIn">
                                    <span className="w-1 h-1 bg-red-400 rounded-full"></span>{' '}
                                    {error}
                                </p>
                            )}

                            <p className="text-stone-600 text-xs mt-6 font-light">
                                Encontre o código na confirmação enviada via WhatsApp.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GuestAccessSection;
