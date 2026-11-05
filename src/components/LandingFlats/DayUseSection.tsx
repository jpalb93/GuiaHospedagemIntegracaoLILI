import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DAY_USE_PATH, DAY_USE_WHATSAPP } from '../../data/dayUse';

export default function DayUseSection() {
    return (
        <section
            id="day-use"
            aria-labelledby="day-use-title"
            className="bg-stone-950 py-24 md:py-32"
        >
            <div className="mx-auto grid max-w-[1400px] gap-10 px-6 md:px-12 lg:grid-cols-2 lg:gap-20">
                <div>
                    <h2
                        id="day-use-title"
                        className="font-heading text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl"
                    >
                        Day use em Petrolina.
                        <br />
                        Uma pausa no seu dia.
                    </h2>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-300">
                        Precisa de algumas horas para descansar entre compromissos? No Flats
                        Integração, você pode reservar um flat no Centro de Petrolina para uso
                        durante o dia, sem pernoite.
                    </p>
                    <Link
                        to={DAY_USE_PATH}
                        className="mt-6 inline-flex min-h-11 items-center gap-2 text-orange-400 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
                    >
                        Saiba como funciona o day use <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                </div>
                <div className="border-y border-stone-800 py-8">
                    <p className="font-heading text-3xl font-bold text-white">Das 8h às 12h</p>
                    <p className="mt-2 text-lg text-stone-300">
                        4 horas pela manhã · 1 pessoa · sem pernoite
                    </p>
                    <p className="mt-6 leading-relaxed text-stone-300">
                        Uso individual, sem visitantes. Reserve antecipadamente, sujeito à
                        disponibilidade. Para outros horários, consulte a equipe.
                    </p>
                    <a
                        href={DAY_USE_WHATSAPP}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-orange-700 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-orange-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
                    >
                        Consultar day use no WhatsApp
                    </a>
                    <p className="mt-3 text-sm text-stone-400">
                        Consulte valores e disponibilidade antes de reservar.
                    </p>
                </div>
            </div>
        </section>
    );
}
