import React, { useRef } from 'react';
import { Star } from 'lucide-react';
import OptimizedImage from '../ui/OptimizedImage';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const About: React.FC = () => {
    const containerRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // Text Animation
            gsap.from(textRef.current, {
                opacity: 0,
                x: -50,
                duration: 1,
                scrollTrigger: {
                    trigger: textRef.current,
                    start: 'top 80%',
                },
            });

            // Image Animation
            gsap.from(imageRef.current, {
                opacity: 0,
                x: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: imageRef.current,
                    start: 'top 80%',
                },
            });
        },
        { scope: containerRef }
    );

    return (
        <section id="sobre" ref={containerRef} className="py-24 md:py-32 bg-stone-950">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-start">
                    {/* Coluna de Texto (Esquerda) */}
                    <div ref={textRef} className="md:col-span-7">
                        <h2 className="text-4xl md:text-6xl font-heading font-medium text-white leading-tight mb-12">
                            30m² de <span className="text-orange-500 italic">personalidade.</span>
                        </h2>
                        <div className="space-y-6 text-lg font-light text-stone-400 leading-relaxed md:pr-12 text-justify">
                            <p>
                                <span className="text-orange-500 font-bold">30 m²</span> cheio de
                                estilo, funcionalidade e economia. Um flat pequeno e fácil de
                                organizar, que atende às suas necessidades.
                            </p>
                            <p>
                                Quarto confortável com lençóis, alguns armários, arara, ar
                                condicionado, TV e escrivaninha com teclado e mouse sem fio a sua
                                disposição.
                            </p>
                            <p>
                                Banheiro com box espaçoso, chuveiro com boa vazão, toalhas, shampoo,
                                condicionador e sabonete. Sala de estar com TV 50", streaming
                                Paramount, cafeteira, chás, jogos de tabuleiro e livros para você
                                aproveitar.
                            </p>
                            <p>
                                A cozinha é bem equipada com tudo que você precisa: louça, talheres,
                                panelas, purificador de água, microondas, liquidificador,
                                sanduicheira, miniprocessador, etc. Na mini área de serviço, você
                                encontrará produtos de limpeza, tanque de lavar roupa e varal
                                retrátil.
                            </p>
                        </div>

                        {/* Assinatura Visual */}
                        <div className="mt-16 flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-stone-800 overflow-hidden">
                                <img
                                    src="https://i.postimg.cc/JnkG03mm/5930cc64_fdef_4d4a_b6ba_a8380fde40de.jpg"
                                    alt="Lili"
                                    className="w-full h-full object-cover grayscale opacity-80"
                                />
                            </div>
                            <div>
                                <span className="block font-heading font-bold text-white">
                                    Lili
                                </span>
                                <span className="block text-xs uppercase tracking-widest text-stone-500">
                                    Superhost
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Coluna Visual (Direita) - Floating Card */}
                    <div ref={imageRef} className="md:col-span-5 relative mt-12 md:mt-0">
                        <div className="aspect-[3/4] overflow-hidden rounded-sm bg-stone-900 border border-stone-800">
                            <OptimizedImage
                                src="https://i.postimg.cc/nzDCrKZn/aca338a7-c3f0-4838-90bf-4639fde2d2c4.jpg"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 opacity-90"
                                alt="Detalhe do Flat de Lili"
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-stone-900 border border-stone-800 p-6 shadow-xl max-w-[200px]">
                            <div className="flex gap-1 text-orange-500 mb-2">
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                            </div>
                            <p className="text-xs font-bold text-white leading-tight">
                                "O lugar mais charmoso que já fiquei em Petrolina."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
