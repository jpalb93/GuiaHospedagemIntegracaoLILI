import { useRef } from 'react';
import { Clock, CigaretteOff, PartyPopper, PawPrint, VolumeX } from 'lucide-react';
import { useDesktopGsap } from '../../hooks/useDesktopGsap';

const RULES = [
    {
        icon: CigaretteOff,
        title: 'Sem cigarro',
        body: 'Proibido fumar nas áreas internas. Assim preservamos a higiene e o padrão do flat.',
    },
    {
        icon: PartyPopper,
        title: 'Sem eventos',
        body: 'Espaço para descanso e trabalho. Festas ou eventos não são permitidos.',
    },
    {
        icon: PawPrint,
        title: 'Sem pets',
        body: 'Não aceitamos animais de estimação, para manter limpeza e enxoval consistentes.',
    },
    {
        icon: VolumeX,
        title: 'Lei do silêncio',
        body: 'Silêncio entre 21h e 7h, por respeito ao descanso de todos os hóspedes.',
    },
] as const;

const InfoSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useDesktopGsap(sectionRef, (gsap) => {
        gsap.from('.info-reveal', {
            y: 12,
            duration: 0.45,
            stagger: 0.06,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 95%',
                toggleActions: 'play none none none',
            },
        });
    });

    return (
        <section
            ref={sectionRef}
            id="info"
            className="pt-8 md:pt-12 pb-20 md:pb-28 bg-[#F5F2EB] text-[#181614] relative overflow-hidden"
        >
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 relative z-10 space-y-12">
                <div className="info-reveal max-w-2xl space-y-3 border-t border-b border-[#E5E0D5] pt-14 pb-8">
                    <p className="text-[#9E6B2B] font-semibold text-xs uppercase tracking-[0.18em]">
                        Antes de reservar
                    </p>
                    <h2 className="text-3xl md:text-5xl font-heading font-semibold text-[#181614] leading-[1.1] tracking-tight">
                        Horários e regras da hospedagem
                    </h2>
                    <p className="text-[#5C564E] text-base md:text-lg leading-relaxed max-w-xl">
                        Informações práticas para planejar sua estadia em Petrolina, sem surpresa na
                        chegada.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                    <div className="info-reveal lg:col-span-4 bg-white border border-[#E5E0D5] rounded-3xl p-7 md:p-8 space-y-7 shadow-sm">
                        <div className="flex items-center gap-3">
                            <Clock size={20} className="text-[#9E6B2B]" aria-hidden />
                            <h3 className="text-xl font-heading font-semibold text-[#181614]">
                                Horários
                            </h3>
                        </div>

                        <div className="space-y-5 border-t border-[#E5E0D5] pt-5">
                            <div>
                                <p className="text-xs font-semibold text-[#5C564E] uppercase tracking-[0.15em] mb-1.5">
                                    Check-in
                                </p>
                                <p className="text-4xl font-heading font-semibold text-[#181614]">
                                    15:00
                                </p>
                                <p className="text-[#5C564E] text-sm mt-1">A partir das 15h</p>
                            </div>
                            <div className="h-px w-full bg-[#E5E0D5]" />
                            <div>
                                <p className="text-xs font-semibold text-[#5C564E] uppercase tracking-[0.15em] mb-1.5">
                                    Check-out
                                </p>
                                <p className="text-4xl font-heading font-semibold text-[#181614]">
                                    13:00
                                </p>
                                <p className="text-[#5C564E] text-sm mt-1">Até as 13h</p>
                            </div>
                        </div>

                        <p className="text-sm text-[#5C564E] leading-relaxed border-l-2 border-[#9E6B2B] pl-4">
                            <span className="text-[#181614] font-medium">Early / late:</span> valor
                            a combinar conforme disponibilidade.
                        </p>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 border-t border-[#E5E0D5]">
                        {RULES.map((rule, i) => (
                            <div
                                key={rule.title}
                                className={`info-reveal py-7 sm:px-6 space-y-3 ${
                                    i % 2 === 0 ? 'sm:border-r border-[#E5E0D5]' : ''
                                } ${i < 2 ? 'border-b border-[#E5E0D5]' : ''}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-white border border-[#E5E0D5] flex items-center justify-center text-[#9E6B2B]">
                                    <rule.icon size={18} strokeWidth={1.8} aria-hidden />
                                </div>
                                <h4 className="text-lg font-heading font-semibold text-[#181614]">
                                    {rule.title}
                                </h4>
                                <p className="text-sm text-[#5C564E] leading-relaxed max-w-xs">
                                    {rule.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InfoSection;
