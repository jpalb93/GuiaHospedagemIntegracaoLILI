import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown } from 'lucide-react';
import { DAY_USE_FAQS } from '../../data/dayUse';

const FAQS = [
    DAY_USE_FAQS[0],
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
        <section className="py-20 md:py-28 bg-[#F5F2EB] text-[#181614]" id="faq">
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

            <div className="max-w-[1320px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                    <div className="lg:col-span-4 space-y-3">
                        <p className="text-[#9E6B2B] font-semibold text-xs uppercase tracking-[0.18em]">
                            Dúvidas
                        </p>
                        <h2 className="text-3xl md:text-4xl font-heading font-semibold text-[#181614] tracking-tight leading-tight">
                            Dúvidas sobre a hospedagem em Petrolina
                        </h2>
                    </div>

                    <div className="lg:col-span-8 divide-y divide-[#E5E0D5] border-y border-[#E5E0D5]">
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
                                            className={`font-heading font-semibold text-base md:text-lg transition-colors ${
                                                isOpen
                                                    ? 'text-[#181614]'
                                                    : 'text-[#3F3A34] group-hover:text-[#181614]'
                                            }`}
                                        >
                                            {faq.question}
                                        </span>
                                        <ChevronDown
                                            className={`shrink-0 mt-1 text-[#5C564E] transition-transform duration-300 ${
                                                isOpen ? 'rotate-180 text-[#9E6B2B]' : ''
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
                                            <p className="pb-5 pr-8 text-[#5C564E] leading-relaxed text-sm md:text-base">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
