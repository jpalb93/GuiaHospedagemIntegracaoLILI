import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CalendarCheck, Clock, HelpCircle, MapPin, MessageCircle, Sun } from 'lucide-react';
import ArticleScrollReset from '../../components/ArticleScrollReset';
import {
    DAY_USE_DESCRIPTION,
    DAY_USE_FAQS,
    DAY_USE_PATH,
    DAY_USE_TITLE,
    DAY_USE_WHATSAPP,
} from '../../data/dayUse';

const siteUrl = 'https://www.flatsintegracao.com.br';
const canonicalUrl = `${siteUrl}${DAY_USE_PATH}`;
const articleImage = '/images/quarto-lavanderia.jpg';
const sectionHeadingClass =
    'flex items-start gap-3 mt-12 mb-6 text-2xl md:text-3xl text-white border-b border-white/10 pb-4';
const sectionIconClass = 'mt-1 shrink-0 text-orange-500';

export default function DayUseArticle() {
    return (
        <article className="pt-24 pb-16 min-h-screen bg-stone-950 text-stone-200">
            <ArticleScrollReset />
            <Helmet>
                <title>{DAY_USE_TITLE}</title>
                <meta name="description" content={DAY_USE_DESCRIPTION} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content={DAY_USE_TITLE} />
                <meta property="og:description" content={DAY_USE_DESCRIPTION} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="article" />
                <meta property="og:locale" content="pt_BR" />
                <meta property="og:image" content={`${siteUrl}${articleImage}`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={DAY_USE_TITLE} />
                <meta name="twitter:description" content={DAY_USE_DESCRIPTION} />
                <meta name="twitter:image" content={`${siteUrl}${articleImage}`} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: DAY_USE_TITLE,
                        description: DAY_USE_DESCRIPTION,
                        mainEntityOfPage: canonicalUrl,
                        image: `${siteUrl}${articleImage}`,
                        inLanguage: 'pt-BR',
                        author: { '@type': 'Organization', name: 'Flats Integração', url: siteUrl },
                        publisher: {
                            '@type': 'Organization',
                            name: 'Flats Integração',
                            url: siteUrl,
                        },
                        about: {
                            '@type': 'Service',
                            name: 'Day use individual em Petrolina',
                            description: DAY_USE_FAQS[0].answer,
                            areaServed: { '@type': 'City', name: 'Petrolina' },
                            provider: {
                                '@type': 'LodgingBusiness',
                                '@id': siteUrl,
                                name: 'Flats Integração',
                                url: siteUrl,
                            },
                        },
                    })}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            { '@type': 'ListItem', position: 1, name: 'Início', item: siteUrl },
                            {
                                '@type': 'ListItem',
                                position: 2,
                                name: 'Guia de Petrolina',
                                item: `${siteUrl}/guia`,
                            },
                            {
                                '@type': 'ListItem',
                                position: 3,
                                name: 'Day use em Petrolina',
                                item: canonicalUrl,
                            },
                        ],
                    })}
                </script>
            </Helmet>
            <div className="container mx-auto max-w-3xl px-4">
                <nav
                    aria-label="Caminho da página"
                    className="mb-8 flex flex-wrap gap-2 text-sm text-stone-400"
                >
                    <Link to="/" className="underline underline-offset-4">
                        Início
                    </Link>
                    <span aria-hidden="true">/</span>
                    <Link to="/guia" className="underline underline-offset-4">
                        Guia de Petrolina
                    </Link>
                </nav>
                <header className="mb-12 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-6 leading-tight">
                        {DAY_USE_TITLE}
                    </h1>
                    <p className="text-xl text-stone-400 leading-relaxed italic">
                        Uma pausa entre compromissos, sem precisar passar a noite. Conheça o day use
                        individual do Flats Integração e saiba o que consultar antes de reservar.
                    </p>
                    <p className="mt-4 text-sm text-stone-400">Por Flats Integração</p>
                </header>
            </div>
            <div className="container mx-auto px-4 max-w-4xl mb-12">
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                    <img
                        src={articleImage}
                        alt="Interior de um flat do Flats Integração, no Centro de Petrolina"
                        width={1200}
                        height={675}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            <div className="container mx-auto px-4 max-w-[800px] prose prose-lg prose-invert prose-orange prose-headings:font-heading prose-headings:font-bold text-stone-300">
                <div className="space-y-10 text-lg leading-relaxed [&_p+p]:mt-4">
                    <section>
                        <h2 className={sectionHeadingClass}>
                            <Sun className={sectionIconClass} size={28} aria-hidden="true" />O que é
                            day use em um flat?
                        </h2>
                        <p>
                            Day use é a reserva de um espaço para uso durante o dia, sem incluir uma
                            noite de hospedagem. No Flats Integração, em Petrolina (PE), essa
                            modalidade é individual: destinada a 1 pessoa, sem visitantes.
                        </p>
                        <p>
                            A proposta é ter um lugar para descansar por algumas horas antes de
                            seguir a rotina. Se você precisa dormir no local durante a noite ou
                            viajar acompanhado, veja as{' '}
                            <Link
                                to="/hospedagem-em-petrolina"
                                className="text-orange-400 underline underline-offset-4"
                            >
                                opções de hospedagem em Petrolina
                            </Link>{' '}
                            e consulte a equipe sobre a modalidade adequada.
                        </p>
                    </section>
                    <section>
                        <h2 className={sectionHeadingClass}>
                            <Clock className={sectionIconClass} size={28} aria-hidden="true" />
                            Horário e regras do day use em Petrolina
                        </h2>
                        <div className="bg-orange-500/5 p-6 md:p-8 rounded-2xl border border-orange-500/20 my-8">
                            <ul className="list-disc space-y-2 pl-6">
                                <li>
                                    <strong className="text-white">
                                        Manhã: 4 horas, das 8h às 12h.
                                    </strong>
                                </li>
                                <li>Uso individual, para 1 pessoa, sem visitantes.</li>
                                <li>Sem pernoite.</li>
                                <li>Reserva antecipada, sujeita à disponibilidade.</li>
                                <li>Outros horários: sob consulta e sujeitos à disponibilidade.</li>
                            </ul>
                        </div>
                        <p className="mt-4">
                            O período da manhã começa às 8h e termina às 12h. Caso precise chegar em
                            outro horário, consulte a equipe antes: não considere a entrada flexível
                            ou a extensão do período como confirmadas.
                        </p>
                    </section>
                    <section>
                        <h2 className={sectionHeadingClass}>
                            <MapPin className={sectionIconClass} size={28} aria-hidden="true" />
                            Uma pausa no Centro de Petrolina
                        </h2>
                        <p>
                            Para quem vem a Petrolina resolver assuntos de trabalho, fazer uma
                            consulta ou cumprir compromissos no Centro, pode surgir um intervalo em
                            que voltar para casa não compensa. O day use é uma opção para usar esse
                            tempo para descansar, desde que o horário disponível se encaixe na sua
                            agenda.
                        </p>
                        <p>
                            Os Flats Integração ficam na R. São José, 475 B, Centro, Petrolina – PE.
                            Veja mais sobre a{' '}
                            <Link
                                to="/flat-centro-petrolina"
                                className="text-orange-400 underline underline-offset-4"
                            >
                                localização do flat no Centro de Petrolina
                            </Link>{' '}
                            e planeje seus deslocamentos considerando o horário de saída do day use.
                        </p>
                    </section>
                    <section>
                        <h2 className={sectionHeadingClass}>
                            <CalendarCheck
                                className={sectionIconClass}
                                size={28}
                                aria-hidden="true"
                            />
                            Como consultar valores e reservar
                        </h2>
                        <p>
                            Entre em contato pelo WhatsApp e informe a data e o horário desejados.
                            Para a manhã, solicite o período das 8h às 12h. Para outros horários,
                            explique de que intervalo precisa para que a equipe verifique a
                            possibilidade.
                        </p>
                        <p>
                            Antes de concluir, confirme o valor, a disponibilidade e as condições da
                            reserva. O envio da mensagem é uma consulta; aguarde a confirmação da
                            equipe para organizar sua chegada.
                        </p>
                    </section>
                    <section>
                        <h2 className={sectionHeadingClass}>
                            <HelpCircle className={sectionIconClass} size={28} aria-hidden="true" />
                            Dúvidas sobre day use no Flats Integração
                        </h2>
                        <dl className="space-y-6">
                            {DAY_USE_FAQS.map((faq) => (
                                <div
                                    key={faq.question}
                                    className="bg-white/5 p-6 rounded-2xl border border-white/10"
                                >
                                    <dt className="font-semibold text-white">{faq.question}</dt>
                                    <dd className="mt-2">{faq.answer}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                </div>
            </div>
            <div className="bg-orange-600 text-white py-16 mt-16 text-center">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h2 className="text-3xl font-bold mb-4 font-heading">
                        Precisa de uma pausa em Petrolina?
                    </h2>
                    <p className="text-white mb-10 text-lg leading-relaxed">
                        Consulte o day use individual das 8h às 12h. Reserva antecipada, sem
                        visitantes e sem pernoite. Outros horários sujeitos à disponibilidade.
                    </p>
                    <a
                        href={DAY_USE_WHATSAPP}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-12 max-w-full items-center justify-center gap-3 bg-white text-orange-700 px-6 md:px-10 py-5 rounded-full font-extrabold text-lg md:text-xl transition-colors hover:bg-orange-50 shadow-xl shadow-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                        <MessageCircle size={24} className="shrink-0" aria-hidden="true" />
                        Consultar day use no WhatsApp
                    </a>
                </div>
            </div>
        </article>
    );
}
