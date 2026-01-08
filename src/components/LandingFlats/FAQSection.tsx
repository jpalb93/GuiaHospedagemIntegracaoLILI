import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
// GSAP dynamically imported

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

    useEffect(() => {
        let ctx: any;
        let mm: any;

        const initGsap = async () => {
            const [gsapModule, scrollTriggerModule] = await Promise.all([
                import('gsap'),
                import('gsap/ScrollTrigger')
            ]);

            const gsap = gsapModule.default;
            const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
            gsap.registerPlugin(ScrollTrigger);

            mm = gsap.matchMedia();

            mm.add('(min-width: 801px)', () => {
                ctx = gsap.context(() => {
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
                }, sectionRef);
            });

            mm.add('(max-width: 800px)', () => {
                if (sectionRef.current) {
                    const headers = sectionRef.current.querySelectorAll('.faq-header');
                    const items = sectionRef.current.querySelectorAll('.faq-item');
                    headers.forEach((el) => { (el as HTMLElement).style.opacity = '1'; (el as HTMLElement).style.transform = 'translateY(0)'; });
                    items.forEach((el) => { (el as HTMLElement).style.opacity = '1'; (el as HTMLElement).style.transform = 'translateY(0)'; });
                }
            });
        };

        const timer = setTimeout(() => {
            initGsap();
        }, 100);

        return () => {
            clearTimeout(timer);
            if (ctx) ctx.revert();
            if (mm) mm.revert();
        };
    }, []);

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
                            className={`faq-item border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index
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
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index
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
