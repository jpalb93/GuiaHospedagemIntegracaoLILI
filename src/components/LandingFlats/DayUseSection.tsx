import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DAY_USE_PATH, DAY_USE_WHATSAPP } from '../../data/dayUse';

export default function DayUseSection() {
    return (
        <section
            id="day-use"
            aria-labelledby="day-use-title"
            className="bg-[#F5F2EB] text-[#181614] pt-4 pb-20 md:pb-28"
        >
            <div className="mx-auto max-w-[1320px] px-6 md:px-12">
                <div className="border-t border-[#E5E0D5] pt-14 md:pt-16 grid gap-10 lg:grid-cols-12 lg:gap-12 items-center">
                    <div className="lg:col-span-6">
                        <h2
                            id="day-use-title"
                            className="font-heading text-3xl font-semibold leading-tight tracking-tight text-[#181614] md:text-5xl"
                        >
                            Day use em Petrolina.
                            <br />
                            <span className="text-[#9E6B2B]">Uma pausa no seu dia.</span>
                        </h2>
                        <p className="mt-5 max-w-xl text-base md:text-lg leading-relaxed text-[#5C564E]">
                            Precisa de algumas horas para descansar entre compromissos? No Flats
                            Integração, você pode reservar um flat no Centro de Petrolina para uso
                            durante o dia, sem pernoite.
                        </p>
                        <Link
                            to={DAY_USE_PATH}
                            className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#181614] hover:text-[#9E6B2B] underline underline-offset-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9E6B2B]"
                        >
                            Saiba como funciona o day use{' '}
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="group relative overflow-hidden lg:col-span-6 bg-[#141210] text-white rounded-[28px] p-8 md:p-11 shadow-[0_24px_60px_rgba(18,17,15,0.2)] border border-[#E5C98B]/20 hover:border-[#E5C98B]/45 transition-colors duration-500">
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(229,201,139,0.16)_0%,transparent_70%)]"
                        />
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E5C98B]/50 to-transparent"
                        />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <p className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight whitespace-nowrap">
                                    Das 8h às 12h
                                </p>
                                <span className="text-[11px] font-mono tracking-[0.18em] uppercase text-[#E5C98B]/80 shrink-0">
                                    Passe matinal
                                </span>
                            </div>
                            <p className="mt-2.5 text-base md:text-lg text-[#E5C98B]">
                                4 horas pela manhã · 1 pessoa · sem pernoite
                            </p>
                            <div className="my-6 h-px bg-white/10" aria-hidden="true" />
                            <p className="leading-relaxed text-stone-300 text-sm md:text-base">
                                Uso individual, sem visitantes. Reserve antecipadamente, sujeito à
                                disponibilidade. Para outros horários, consulte a equipe.
                            </p>
                            <a
                                href={DAY_USE_WHATSAPP}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/btn relative overflow-hidden mt-7 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-[#E5C98B] hover:bg-[#edd6a1] px-7 py-3.5 text-center text-sm font-semibold text-[#141210] transition-all duration-300 shadow-[0_10px_28px_rgba(229,201,139,0.16)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E5C98B]"
                            >
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 -translate-x-full group-hover/btn:translate-x-[130%] transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/45 to-transparent -skew-x-12"
                                />
                                <span className="relative">Consultar day use no WhatsApp</span>
                                <ArrowRight
                                    size={15}
                                    className="relative group-hover/btn:translate-x-1 transition-transform"
                                    aria-hidden="true"
                                />
                            </a>
                            <p className="mt-3.5 text-xs text-stone-400">
                                Consulte valores e disponibilidade antes de reservar.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
