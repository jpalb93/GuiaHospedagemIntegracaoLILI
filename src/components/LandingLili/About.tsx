import React from 'react';
import { Star } from 'lucide-react';
import OptimizedImage from '../ui/OptimizedImage';

const About: React.FC = () => {
    return (
        <section id="sobre" className="py-24 md:py-32 bg-stone-50">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-start">
                    {/* Coluna de Texto (Esquerda) */}
                    <div className="md:col-span-7">
                        <h2 className="text-4xl md:text-6xl font-heading font-medium text-gray-900 leading-tight mb-12">
                            30m² de <span className="text-orange-600 italic">personalidade.</span>
                        </h2>
                        <div className="space-y-6 text-lg font-light text-gray-600 leading-relaxed md:pr-12 text-justify">
                            <p>
                                <span className="text-orange-600 font-bold">30 m²</span> cheio de
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
                            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                                <img
                                    src="https://i.postimg.cc/JnkG03mm/5930cc64_fdef_4d4a_b6ba_a8380fde40de.jpg"
                                    alt="Lili"
                                    className="w-full h-full object-cover grayscale"
                                />
                            </div>
                            <div>
                                <span className="block font-heading font-bold text-gray-900">
                                    Lili
                                </span>
                                <span className="block text-xs uppercase tracking-widest text-gray-500">
                                    Superhost
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Coluna Visual (Direita) - Floating Card */}
                    <div className="md:col-span-5 relative mt-12 md:mt-0">
                        <div className="aspect-[3/4] overflow-hidden rounded-sm">
                            <OptimizedImage
                                src="https://i.postimg.cc/nzDCrKZn/aca338a7-c3f0-4838-90bf-4639fde2d2c4.jpg"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                alt="Detalhe do Flat de Lili"
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl max-w-[200px]">
                            <div className="flex gap-1 text-orange-500 mb-2">
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                                <Star size={14} fill="currentColor" />
                            </div>
                            <p className="text-xs font-bold text-gray-900 leading-tight">
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
