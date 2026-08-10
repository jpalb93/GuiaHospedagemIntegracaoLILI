import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown } from 'lucide-react';

const FAQS = [
    {
        question: 'A hospedagem fica no Centro de Petrolina?',
        answer: 'Sim. Os Flats Integração ficam na R. São José, 475 B, Centro de Petrolina (PE), perto de hospitais, comércio e polos de trabalho.',
    },
    {
        question: 'Tem estacionamento?',
        answer: 'Não há vaga privativa. No Centro de Petrolina é comum e seguro estacionar na rua em frente à propriedade.',
    },
    {
        question: 'Qual a voltagem das tomadas?',
        answer: 'Em Petrolina o padrão é 220V. As tomadas seguem o padrão brasileiro novo.',
    },
    {
        question: 'Fica perto de restaurantes e do Bodódromo?',
        answer: 'Sim. A hospedagem fica no Centro, a poucos minutos do Bodódromo e perto de restaurantes, farmácias e supermercados.',
    },
    {
        question: 'O Wi-Fi serve para trabalho remoto?',
        answer: 'Sim. Todas as unidades têm internet fibra de alta velocidade, adequada para reuniões e home office.',
    },
] as const;

const FAQSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 md:py-28 bg-stone-950" id="faq">
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: FAQS.map((faq) => ({
                            '@type': 'Question',
                            name: faq.question,
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: faq.answer,
                            },
                        })),
                    })}
                </script>
            </Helmet>

            <div className="max-w-3xl mx-auto px-6 md:px-12">
                <div className="mb-12 space-y-3">
                    <p className="text-orange-500 font-heading font-bold text-xs uppercase tracking-[0.2em]">
                        Dúvidas
                    </p>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">
                        Dúvidas sobre a hospedagem em Petrolina
                    </h2>
                </div>

                <div className="divide-y divide-stone-800 border-y border-stone-800">
                    {FAQS.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={faq.question}>
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-answer-${index}`}
                                    className="w-full flex items-start justify-between gap-6 py-5 text-left group"
                                >
                                    <span
                                        id={`faq-question-${index}`}
                                        className={`font-heading font-medium text-base md:text-lg transition-colors ${
                                            isOpen
                                                ? 'text-white'
                                                : 'text-stone-300 group-hover:text-white'
                                        }`}
                                    >
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`shrink-0 mt-1 text-stone-500 transition-transform duration-300 ${
                                            isOpen ? 'rotate-180 text-orange-500' : ''
                                        }`}
                                        size={20}
                                        aria-hidden
                                    />
                                </button>
                                <div
                                    id={`faq-answer-${index}`}
                                    role="region"
                                    aria-labelledby={`faq-question-${index}`}
                                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                                    }`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="pb-5 pr-8 text-stone-400 leading-relaxed text-sm md:text-base">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
