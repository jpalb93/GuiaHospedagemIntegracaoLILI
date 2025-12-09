import React from 'react';
import {
    AlertTriangle,
    Trash2,
    Droplets,
    CheckCircle2,
    Ban,
    Lightbulb,
    UserCheck,
    AlertCircle,
    Tv,
} from 'lucide-react';
import { useLanguage } from '../../../../hooks/useLanguage';

/**
 * Conteúdo do sheet "Regras & Avisos"
 * Contém as regras do flat e informações importantes para o hóspede
 */
const RulesSheet: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col gap-4">
            {/* Hóspedes da Reserva */}
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <UserCheck size={18} className="text-red-500" />
                    <h4 className="font-heading font-bold text-sm text-red-800 dark:text-red-200">
                        {t('Hóspedes da Reserva', 'Reservation Guests', 'Huéspedes de la Reserva')}
                    </h4>
                </div>
                <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                    {t(
                        'Acesso exclusivo aos hóspedes da reserva. Proibida a entrada de visitantes.',
                        'Exclusive access to reservation guests. No visitors allowed.',
                        'Acceso exclusivo a los huéspedes de la reserva. Prohibida la entrada de visitantes.'
                    )}
                </p>
            </div>

            {/* Voltagem */}
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={18} className="text-red-500" />
                    <h4 className="font-heading font-bold text-sm text-red-800 dark:text-red-200">
                        {t('Atenção: Voltagem 220V', 'Warning: 220V Voltage', 'Atención: Voltaje 220V')}
                    </h4>
                </div>
                <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                    {t(
                        'Cuidado ao ligar secadores e equipamentos.',
                        'Be careful when plugging in dryers and equipment.',
                        'Tenga cuidado al conectar secadores y equipos.'
                    )}
                </p>
            </div>

            {/* Lixo */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Trash2 size={18} className="text-blue-500" />
                    <h4 className="font-heading font-bold text-sm text-blue-800 dark:text-blue-200">
                        {t('Descarte de Lixo', 'Trash Disposal', 'Eliminación de Basura')}
                    </h4>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed mb-1">
                    {t(
                        'Segunda, Quarta e Sexta (06:00 – 18:00h).',
                        'Monday, Wednesday and Friday (06:00 – 18:00h).',
                        'Lunes, Miércoles y Viernes (06:00 – 18:00h).'
                    )}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {t('Local: Na calçada entre o totem e o poste (', 'Location: On the sidewalk between the totem and the pole (', 'Ubicación: En la acera entre el tótem y el poste (')}
                    <span className="font-bold">{t('não colocar no vizinho', 'do not place at the neighbor\'s', 'no colocar en el vecino')}</span>).
                </p>
            </div>

            {/* Enxoval */}
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Droplets size={18} className="text-amber-500" />
                    <h4 className="font-heading font-bold text-sm text-amber-800 dark:text-amber-200">
                        {t('Cuidado com o Enxoval', 'Care with Linen', 'Cuidado con la Ropa de Cama')}
                    </h4>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                    {t(
                        'Danos ou manchas em lençóis e toalhas poderão gerar cobrança de taxa de reposição.',
                        'Damage or stains on sheets and towels may result in a replacement fee.',
                        'Daños o manchas en sábanas y toallas pueden generar cargo por reposición.'
                    )}
                </p>
            </div>

            {/* Checkout Rápido */}
            <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={18} className="text-green-600" />
                    <h4 className="font-heading font-bold text-sm text-green-800 dark:text-green-200">
                        {t('Check-out Rápido', 'Quick Check-out', 'Check-out Rápido')}
                    </h4>
                </div>
                <ul className="space-y-2 mb-3">
                    {[
                        t('Apague luzes e desligue o AC', 'Turn off lights and AC', 'Apague luces y aire acondicionado'),
                        t('Feche as janelas', 'Close the windows', 'Cierre las ventanas'),
                        t('Chave: Devolva na caixinha "Self Checkout"', 'Key: Return in the "Self Checkout" box', 'Llave: Devuélvala en la cajita "Self Checkout"'),
                    ].map((item, idx) => (
                        <li
                            key={idx}
                            className="text-xs text-green-700 dark:text-green-300 flex items-start gap-2"
                        >
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: item.replace(
                                        '"Self Checkout"',
                                        '<strong class="font-bold">"Self Checkout"</strong>'
                                    ),
                                }}
                            />
                        </li>
                    ))}
                </ul>
                <button className="px-3 py-2 bg-white dark:bg-green-900/40 border border-green-200 dark:border-green-800 rounded-lg text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wide flex items-center gap-1.5 shadow-sm hover:bg-green-50 dark:hover:bg-green-900/60 transition-colors min-h-[32px]">
                    <Tv size={12} /> {t('Ver Foto', 'See Photo', 'Ver Foto')}
                </button>
            </div>

            {/* Lista de Proibições */}
            <div className="space-y-2.5 pl-1">
                <RuleItem icon={Ban} text={t('Limpeza por conta do hóspede durante a estadia', 'Cleaning by guest during stay', 'Limpieza por cuenta del huésped durante la estancia')} />
                <RuleItem icon={Ban} text={t('Não deixar pertences no hall ou áreas comuns', 'Do not leave belongings in the hall or common areas', 'No dejar pertenencias en el pasillo o áreas comunes')} />
                <RuleItem icon={Ban} text={t('Proibido fumar dentro do flat', 'No smoking inside the flat', 'Prohibido fumar dentro del piso')} />
                <RuleItem icon={Ban} text={t('Proibido som alto', 'Loud music prohibited', 'Prohibida la música alta')} />
                <RuleItem icon={Ban} text={t('Não são permitidos animais', 'No pets allowed', 'No se permiten mascotas')} />
                <RuleItem icon={Ban} text={t('Não permitimos festas/eventos', 'No parties/events allowed', 'No se permiten fiestas/eventos')} />
                <RuleItem icon={Ban} text={t('Não usar para qualquer atividade ilegal', 'Do not use for any illegal activity', 'No usar para ninguna actividad ilegal')} />
                <RuleItem icon={Ban} text={t('Não secar roupas na cama ou sofá', 'Do not dry clothes on bed or sofa', 'No secar ropa en la cama o sofá')} />
                <RuleItem icon={Lightbulb} text={t('Usar AC com portas/janelas fechadas', 'Use AC with doors/windows closed', 'Usar AA con puertas/ventanas cerradas')} positive />
                <RuleItem
                    icon={Lightbulb}
                    text={t('Usar água e energia de forma responsável', 'Use water and energy responsibly', 'Usar agua y energía de manera responsable')}
                    positive
                />
                <RuleItem icon={AlertCircle} text={t('Avisar imediatamente sobre danos', 'Report damages immediately', 'Reportar daños inmediatamente')} warning />
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
    const colorClass = warning
        ? 'text-red-600 dark:text-red-400'
        : positive
            ? 'text-green-600 dark:text-green-400'
            : 'text-gray-600 dark:text-gray-400';

    const iconColorClass = warning ? 'text-red-500' : positive ? 'text-green-500' : 'text-gray-400';

    return (
        <div className={`flex items-center gap-2 text-xs ${colorClass}`}>
            <Icon size={14} className={iconColorClass} />
            <span>{text}</span>
        </div>
    );
};

export default RulesSheet;
