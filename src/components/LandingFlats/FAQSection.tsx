import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
    {
        question: 'O flats possui estacionamento?',
        answer: 'Não possuímos estacionamento próprio, mas é totalmente seguro estacionar na rua.',
    },
    {
        question: 'Qual a voltagem das tomadas?',
        answer: 'Em Petrolina a voltagem é 220v. Nossos flats possuem tomadas padrão novo.',
    },
    {
        question: 'Fica perto de restaurantes?',
        answer: 'Sim, estamos no Centro, a 5 min do Bodódromo e com vários deliverys disponíveis.',
    },
    {
        question: 'Tem Wi-Fi para trabalhar?',
        answer: 'Sim, internet fibra ótica de alta velocidade em todas as unidades.',
    },
];

const FAQSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const sectionRef = useRef<HTMLElement>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add('(min-width: 801px)', () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                });

                tl.fromTo(
                    '.faq-header',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
                ).fromTo(
                    '.faq-item',
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
                    '-=0.4'
                );
            });

            mm.add('(max-width: 800px)', () => {
                gsap.set('.faq-header', { opacity: 1, y: 0 });
                gsap.set('.faq-item', { opacity: 1, y: 0 });
            });

            return () => mm.revert();
        },
        { scope: sectionRef }
    );

    return (
        <section ref={sectionRef} className="py-24 bg-stone-950" id="faq">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="faq-header text-center mb-16">
                    <span className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-3 flex items-center justify-center gap-2">
                        <HelpCircle size={18} />
                        Dúvidas
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white font-heading font-light">
                        Perguntas Frequentes
                    </h2>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item border rounded-2xl overflow-hidden transition-all duration-300 ${
                                openIndex === index
                                    ? 'border-orange-500/30 bg-stone-900 shadow-lg shadow-orange-900/10'
                                    : 'border-stone-800 bg-stone-900/50 hover:bg-stone-900 hover:border-stone-700'
                            }`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                aria-expanded={openIndex === index}
                                aria-controls={`faq-answer-${index}`}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span
                                    id={`faq-question-${index}`}
                                    className={`font-bold text-lg transition-colors ${openIndex === index ? 'text-orange-500' : 'text-stone-300 group-hover:text-white'}`}
                                >
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="text-orange-500 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="text-stone-500 flex-shrink-0" />
                                )}
                            </button>
                            <div
                                id={`faq-answer-${index}`}
                                role="region"
                                aria-labelledby={`faq-question-${index}`}
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                    openIndex === index
                                        ? 'max-h-40 opacity-100'
                                        : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="p-6 pt-0 text-stone-400 leading-relaxed border-t border-stone-800/50 mt-2">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
