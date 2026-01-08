import { useRef, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
// GSAP dynamically imported

const BlogSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        let ctx: any;

        const initGsap = async () => {
            const [gsapModule, scrollTriggerModule] = await Promise.all([
                import('gsap'),
                import('gsap/ScrollTrigger')
            ]);

            const gsap = gsapModule.default;
            const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
            gsap.registerPlugin(ScrollTrigger);

            const mm = gsap.matchMedia();

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
                        '.blog-header',
                        { y: 30, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
                    ).fromTo(
                        '.blog-card',
                        { y: 50, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
                        '-=0.4'
                    );
                }, sectionRef);
            });

            mm.add('(max-width: 800px)', () => {
                if (sectionRef.current) {
                    const headers = sectionRef.current.querySelectorAll('.blog-header');
                    const cards = sectionRef.current.querySelectorAll('.blog-card');
                    headers.forEach((el) => { (el as HTMLElement).style.opacity = '1'; (el as HTMLElement).style.transform = 'translateY(0)'; });
                    cards.forEach((el) => { (el as HTMLElement).style.opacity = '1'; (el as HTMLElement).style.transform = 'translateY(0)'; });
                }
            });
        };

        initGsap();

        return () => {
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-stone-950 border-t border-stone-900">
            <div className="container mx-auto px-4">
                <div className="blog-header flex flex-col items-center mb-16 text-center">
                    <span className="text-stone-400 font-bold uppercase tracking-wider text-sm mb-3">
                        Explore a Região
                    </span>
                    <h2 className="text-3xl md:text-5xl font-heading font-light text-white">
                        Descubra Petrolina
                    </h2>
                    <p className="text-stone-400 mt-6 max-w-2xl font-light text-lg">
                        Aproveite o melhor que o Vale do São Francisco tem a oferecer com nossos
                        roteiros selecionados.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Roteiro do Vinho */}
                    <div className="blog-card bg-stone-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-stone-800 flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src="/assets/blog/vapor-do-vinho-montagem.webp"
                                alt="Roteiro do Vinho em Petrolina"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                                <h3 className="text-white text-xl font-bold font-heading tracking-wide">
                                    Roteiro do Vinho
                                </h3>
                            </div>
                        </div>
                        <div className="p-8 flex-grow flex flex-col justify-between">
                            <p className="text-stone-400 mb-6 text-sm leading-relaxed">
                                Guia completo sobre vinícolas, Vapor do Vinho e preços atualizados
                                para sua visita.
                            </p>
                            <a
                                href="/guia/roteiro-vinho-petrolina"
                                aria-label="Ler artigo: Roteiro do Vinho"
                                className="inline-flex items-center gap-2 text-orange-500 font-bold hover:text-orange-400 transition-colors uppercase tracking-wide text-xs"
                            >
                                Ler Artigo <ArrowRight size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Bodódromo */}
                    <div className="blog-card bg-stone-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-stone-800 flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src="/assets/blog/bododromo-petrolina.webp"
                                alt="Complexo Gastronômico Bodódromo"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                                <h3 className="text-white text-xl font-bold font-heading tracking-wide">
                                    Gastronomia Regional
                                </h3>
                            </div>
                        </div>
                        <div className="p-8 flex-grow flex flex-col justify-between">
                            <p className="text-stone-400 mb-6 text-sm leading-relaxed">
                                Onde comer a famosa carne de bode e peixes frescos do Rio São
                                Francisco.
                            </p>
                            <a
                                href="/guia/onde-comer-petrolina-bododromo"
                                aria-label="Ler artigo: Gastronomia Regional"
                                className="inline-flex items-center gap-2 text-orange-500 font-bold hover:text-orange-400 transition-colors uppercase tracking-wide text-xs"
                            >
                                Ler Artigo <ArrowRight size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Rio São Francisco */}
                    <div className="blog-card bg-stone-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-stone-800 flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src="/assets/blog/rio-sao-francisco-rodeadouro.webp"
                                alt="Ilha do Rodeadouro"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                                <h3 className="text-white text-xl font-bold font-heading tracking-wide">
                                    Experiências Fluviais
                                </h3>
                            </div>
                        </div>
                        <div className="p-8 flex-grow flex flex-col justify-between">
                            <p className="text-stone-400 mb-6 text-sm leading-relaxed">
                                Tudo sobre a travessia de barquinha e o banho na Ilha do Rodeadouro.
                            </p>
                            <a
                                href="/guia/rio-sao-francisco-rodeadouro-barquinha"
                                aria-label="Ler artigo: Experiências Fluviais"
                                className="inline-flex items-center gap-2 text-orange-500 font-bold hover:text-orange-400 transition-colors uppercase tracking-wide text-xs"
                            >
                                Ler Artigo <ArrowRight size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Corporativo */}
                    <div className="blog-card bg-stone-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-stone-800 flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src="/assets/gallery/gallery-5.webp"
                                alt="Hospedagem Corporativa"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                                <h3 className="text-white text-xl font-bold font-heading tracking-wide">
                                    Para Empresas
                                </h3>
                            </div>
                        </div>
                        <div className="p-8 flex-grow flex flex-col justify-between">
                            <p className="text-stone-400 mb-6 text-sm leading-relaxed">
                                Wi-Fi de alta velocidade, nota fiscal e localização estratégica para
                                negócios.
                            </p>
                            <a
                                href="/guia/hospedagem-corporativa-empresas-petrolina"
                                aria-label="Ler artigo: Para Empresas"
                                className="inline-flex items-center gap-2 text-orange-500 font-bold hover:text-orange-400 transition-colors uppercase tracking-wide text-xs"
                            >
                                Ler Artigo <ArrowRight size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
