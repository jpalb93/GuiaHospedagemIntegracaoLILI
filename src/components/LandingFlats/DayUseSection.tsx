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

                    <div className="lg:col-span-6 bg-[#141210] text-white rounded-3xl p-8 md:p-10 shadow-xl border border-white/10">
                        <p className="font-heading text-3xl md:text-4xl font-semibold text-white">
                            Das 8h às 12h
                        </p>
                        <p className="mt-2 text-base md:text-lg text-[#E5C98B]">
                            4 horas pela manhã · 1 pessoa · sem pernoite
                        </p>
                        <p className="mt-5 leading-relaxed text-stone-300 text-sm md:text-base">
                            Uso individual, sem visitantes. Reserve antecipadamente, sujeito à
                            disponibilidade. Para outros horários, consulte a equipe.
                        </p>
                        <a
                            href={DAY_USE_WHATSAPP}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[#E5C98B] hover:bg-[#edd6a1] px-7 py-3.5 text-center text-sm font-semibold text-[#141210] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E5C98B]"
                        >
                            Consultar day use no WhatsApp
                        </a>
                        <p className="mt-3 text-xs text-stone-400">
                            Consulte valores e disponibilidade antes de reservar.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
