import React from 'react';
import {
    Trash2,
    Droplets,
    CheckCircle2,
    Ban,
    Lightbulb,
    UserCheck,
    AlertCircle,
    Camera,
    Zap,
    Shield,
} from 'lucide-react';
import { useLanguage } from '../../../../hooks/useLanguage';

interface RulesSheetProps {
    onOpenKeyDetails?: () => void;
}

/**
 * Conteúdo do sheet "Regras & Avisos"
 * Contém as regras do flat e informações importantes para o hóspede
 */
const RulesSheet: React.FC<RulesSheetProps> = ({ onOpenKeyDetails }) => {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col gap-5 text-stone-700 dark:text-stone-300">
            {/* Bloco 1: Alertas Críticos de Segurança e Acesso (Grid 2 colunas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Voltagem */}
                <div className="bg-amber-500/10 dark:bg-amber-500/15 border border-amber-300/70 dark:border-amber-500/30 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-2">
                        <div className="p-1.5 rounded-lg bg-amber-200/70 dark:bg-amber-500/25 text-amber-800 dark:text-amber-300 shrink-0">
                            <Zap size={16} />
                        </div>
                        <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-200">
                            {t(
                                'Atenção: Voltagem 220V',
                                'Warning: 220V Voltage',
                                'Atención: Voltaje 220V'
                            )}
                        </h4>
                    </div>
                    <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed font-sans">
                        {t(
                            'Cuidado ao ligar secadores e equipamentos.',
                            'Be careful when plugging in dryers and equipment.',
                            'Tenga cuidado al conectar secadores y equipos.'
                        )}
                    </p>
                </div>

                {/* Hóspedes da Reserva */}
                <div className="bg-rose-500/10 dark:bg-rose-500/15 border border-rose-300/70 dark:border-rose-500/30 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-2">
                        <div className="p-1.5 rounded-lg bg-rose-200/70 dark:bg-rose-500/25 text-rose-800 dark:text-rose-300 shrink-0">
                            <UserCheck size={16} />
                        </div>
                        <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-rose-900 dark:text-rose-200">
                            {t(
                                'Hóspedes da Reserva',
                                'Reservation Guests',
                                'Huéspedes de la Reserva'
                            )}
                        </h4>
                    </div>
                    <p className="text-xs text-rose-900/80 dark:text-rose-200/80 leading-relaxed font-sans">
                        {t(
                            'Acesso exclusivo aos hóspedes da reserva. Proibida a entrada de visitantes.',
                            'Exclusive access to reservation guests. No visitors allowed.',
                            'Acceso exclusivo a los huéspedes de la reserva. Prohibida la entrada de visitantes.'
                        )}
                    </p>
                </div>
            </div>

            {/* Bloco 2: Cuidados com o Flat & Convivência (Lixo & Enxoval) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Lixo */}
                <div className="bg-white dark:bg-[#241C19] border border-stone-200/80 dark:border-amber-500/15 rounded-2xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 shrink-0">
                            <Trash2 size={16} />
                        </div>
                        <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100">
                            {t('Descarte de Lixo', 'Trash Disposal', 'Eliminación de Basura')}
                        </h4>
                    </div>
                    <p className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                        {t(
                            'Segunda, Quarta e Sexta (06:00 – 18:00h).',
                            'Monday, Wednesday and Friday (06:00 – 18:00h).',
                            'Lunes, Miércoles y Viernes (06:00 – 18:00h).'
                        )}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                        {t(
                            'Local: Na calçada entre o totem e o poste (',
                            'Location: On the sidewalk between the totem and the pole (',
                            'Ubicación: En la acera entre el tótem y el poste ('
                        )}
                        <strong className="text-stone-800 dark:text-stone-200 font-semibold">
                            {t(
                                'não colocar no vizinho',
                                "do not place at the neighbor's",
                                'no colocar en el vecino'
                            )}
                        </strong>
                        ).
                    </p>
                </div>

                {/* Enxoval */}
                <div className="bg-white dark:bg-[#241C19] border border-stone-200/80 dark:border-amber-500/15 rounded-2xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/15 text-[#C85A32] dark:text-amber-400 shrink-0">
                            <Droplets size={16} />
                        </div>
                        <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100">
                            {t(
                                'Cuidado com o Enxoval',
                                'Care with Linen',
                                'Cuidado con la Ropa de Cama'
                            )}
                        </h4>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                        {t(
                            'Danos ou manchas em lençóis e toalhas poderão gerar cobrança de taxa de reposição.',
                            'Damage or stains on sheets and towels may result in a replacement fee.',
                            'Daños o manchas en sábanas y toallas pueden generar cargo por reposición.'
                        )}
                    </p>
                </div>
            </div>

            {/* Bloco 3: Check-out Rápido & Devolução da Chave */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-500/15 dark:to-[#1C1614] border border-emerald-300/70 dark:border-emerald-500/25 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shrink-0">
                            <CheckCircle2 size={16} />
                        </div>
                        <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
                            {t('Check-out Rápido', 'Quick Check-out', 'Check-out Rápido')}
                        </h4>
                    </div>
                    <button
                        type="button"
                        onClick={onOpenKeyDetails}
                        className="px-3 py-1.5 bg-white dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-200 uppercase tracking-wide flex items-center gap-1.5 shadow-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/40 active:scale-95 transition-all cursor-pointer"
                    >
                        <Camera size={14} className="text-emerald-600 dark:text-emerald-400" />
                        <span>{t('Ver Foto', 'See Photo', 'Ver Foto')}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {[
                        t(
                            'Apague luzes e desligue o AC',
                            'Turn off lights and AC',
                            'Apague luces y aire acondicionado'
                        ),
                        t('Feche as janelas', 'Close the windows', 'Cierre las ventanas'),
                        t(
                            'Chave: Devolva na caixinha "Self Checkout"',
                            'Key: Return in the "Self Checkout" box',
                            'Llave: Devuélvala en la cajita "Self Checkout"'
                        ),
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-2 p-2 rounded-xl bg-white/70 dark:bg-[#241C19]/80 border border-emerald-200/50 dark:border-emerald-500/15 text-xs text-stone-700 dark:text-stone-300"
                        >
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                            <span
                                className="leading-snug"
                                dangerouslySetInnerHTML={{
                                    __html: item.replace(
                                        '"Self Checkout"',
                                        '<strong class="font-bold text-emerald-800 dark:text-emerald-300">"Self Checkout"</strong>'
                                    ),
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bloco 4: Regras da Casa & Boas Práticas (Painel Organizado) */}
            <div className="bg-white dark:bg-[#241C19] border border-stone-200/80 dark:border-amber-500/15 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                    <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 shrink-0">
                        <Shield size={16} />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200">
                        {t(
                            'Regras & Avisos da Casa',
                            'House Rules & Notices',
                            'Reglas y Avisos de la Casa'
                        )}
                    </h4>
                </div>

                {/* Proibições & Normas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <RuleItem
                        icon={Ban}
                        text={t(
                            'Limpeza por conta do hóspede durante a estadia',
                            'Cleaning by guest during stay',
                            'Limpieza por cuenta del huésped durante la estancia'
                        )}
                    />
                    <RuleItem
                        icon={Ban}
                        text={t(
                            'Não deixar pertences no hall ou áreas comuns',
                            'Do not leave belongings in the hall or common areas',
                            'No dejar pertenencias en el pasillo o áreas comunes'
                        )}
                    />
                    <RuleItem
                        icon={Ban}
                        text={t(
                            'Proibido fumar dentro do flat',
                            'No smoking inside the flat',
                            'Prohibido fumar dentro del piso'
                        )}
                    />
                    <RuleItem
                        icon={Ban}
                        text={t(
                            'Proibido som alto',
                            'Loud music prohibited',
                            'Prohibida la música alta'
                        )}
                    />
                    <RuleItem
                        icon={Ban}
                        text={t(
                            'Não são permitidos animais',
                            'No pets allowed',
                            'No se permiten mascotas'
                        )}
                    />
                    <RuleItem
                        icon={Ban}
                        text={t(
                            'Não permitimos festas/eventos',
                            'No parties/events allowed',
                            'No se permiten fiestas/eventos'
                        )}
                    />
                    <RuleItem
                        icon={Ban}
                        text={t(
                            'Não usar para qualquer atividade ilegal',
                            'Do not use for any illegal activity',
                            'No usar para ninguna actividad ilegal'
                        )}
                    />
                    <RuleItem
                        icon={Ban}
                        text={t(
                            'Não secar roupas na cama ou sofá',
                            'Do not dry clothes on bed or sofa',
                            'No secar ropa en la cama o sofá'
                        )}
                    />
                </div>

                {/* Dicas e Boas Práticas Conscientes */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <RuleItem
                        icon={Lightbulb}
                        text={t(
                            'Usar AC com portas/janelas fechadas',
                            'Use AC with doors/windows closed',
                            'Usar AA con puertas/ventanas cerradas'
                        )}
                        positive
                    />
                    <RuleItem
                        icon={Lightbulb}
                        text={t(
                            'Usar água e energia de forma responsável',
                            'Use water and energy responsibly',
                            'Usar agua y energía de manera responsable'
                        )}
                        positive
                    />
                </div>

                {/* Notificação de Danos */}
                <div className="pt-1">
                    <RuleItem
                        icon={AlertCircle}
                        text={t(
                            'Avisar imediatamente sobre danos',
                            'Report damages immediately',
                            'Reportar daños inmediatamente'
                        )}
                        warning
                    />
                </div>
            </div>
        </div>
    );
};

interface RuleItemProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    text: string;
    positive?: boolean;
    warning?: boolean;
}

const RuleItem: React.FC<RuleItemProps> = ({ icon: Icon, text, positive, warning }) => {
    const bgClass = warning
        ? 'bg-red-500/10 dark:bg-red-500/15 border-red-200/60 dark:border-red-500/25 text-red-800 dark:text-red-200'
        : positive
          ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-200/60 dark:border-emerald-500/25 text-emerald-800 dark:text-emerald-200'
          : 'bg-stone-50 dark:bg-[#1E1815] border-stone-200/70 dark:border-amber-500/15 text-stone-700 dark:text-stone-300';

    const iconColorClass = warning
        ? 'text-red-600 dark:text-red-400'
        : positive
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-stone-400 dark:text-stone-500';

    return (
        <div
            className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium ${bgClass}`}
        >
            <Icon size={14} className={`${iconColorClass} shrink-0`} />
            <span className="leading-tight">{text}</span>
        </div>
    );
};

export default RulesSheet;
