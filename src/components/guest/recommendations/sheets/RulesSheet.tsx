import React from 'react';
import {
    AlertTriangle, Trash2, Droplets, CheckCircle2,
    Ban, Lightbulb, UserCheck, AlertCircle, Tv
} from 'lucide-react';

/**
 * Conteúdo do sheet "Regras & Avisos"
 * Contém as regras do flat e informações importantes para o hóspede
 */
const RulesSheet: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            {/* Hóspedes da Reserva */}
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <UserCheck size={18} className="text-red-500" />
                    <h4 className="font-heading font-bold text-sm text-red-800 dark:text-red-200">
                        Hóspedes da Reserva
                    </h4>
                </div>
                <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                    Acesso exclusivo aos hóspedes da reserva. Proibida a entrada de visitantes.
                </p>
            </div>

            {/* Voltagem */}
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={18} className="text-red-500" />
                    <h4 className="font-heading font-bold text-sm text-red-800 dark:text-red-200">
                        Atenção: Voltagem 220V
                    </h4>
                </div>
                <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                    Cuidado ao ligar secadores e equipamentos.
                </p>
            </div>

            {/* Lixo */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Trash2 size={18} className="text-blue-500" />
                    <h4 className="font-heading font-bold text-sm text-blue-800 dark:text-blue-200">
                        Descarte de Lixo
                    </h4>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed mb-1">
                    Segunda, Quarta e Sexta (06:00 – 18:00h).
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Local: Na calçada entre o totem e o poste (<span className="font-bold">não colocar no vizinho</span>).
                </p>
            </div>

            {/* Enxoval */}
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Droplets size={18} className="text-amber-500" />
                    <h4 className="font-heading font-bold text-sm text-amber-800 dark:text-amber-200">
                        Cuidado com o Enxoval
                    </h4>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                    Danos ou manchas em lençóis e toalhas poderão gerar cobrança de taxa de reposição.
                </p>
            </div>

            {/* Checkout Rápido */}
            <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={18} className="text-green-600" />
                    <h4 className="font-heading font-bold text-sm text-green-800 dark:text-green-200">
                        Check-out Rápido
                    </h4>
                </div>
                <ul className="space-y-2 mb-3">
                    {['Apague luzes e desligue o AC', 'Feche as janelas', 'Chave: Devolva na caixinha "Self Checkout"'].map((item, idx) => (
                        <li key={idx} className="text-xs text-green-700 dark:text-green-300 flex items-start gap-2">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                            <span dangerouslySetInnerHTML={{ __html: item.replace('"Self Checkout"', '<strong class="font-bold">"Self Checkout"</strong>') }} />
                        </li>
                    ))}
                </ul>
                <button className="px-3 py-2 bg-white dark:bg-green-900/40 border border-green-200 dark:border-green-800 rounded-lg text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wide flex items-center gap-1.5 shadow-sm hover:bg-green-50 dark:hover:bg-green-900/60 transition-colors min-h-[32px]">
                    <Tv size={12} /> Ver Foto
                </button>
            </div>

            {/* Lista de Proibições */}
            <div className="space-y-2.5 pl-1">
                <RuleItem icon={Ban} text="Limpeza por conta do hóspede durante a estadia" />
                <RuleItem icon={Ban} text="Não deixar pertences no hall ou áreas comuns" />
                <RuleItem icon={Ban} text="Proibido fumar dentro do flat" />
                <RuleItem icon={Ban} text="Proibido som alto" />
                <RuleItem icon={Ban} text="Não são permitidos animais" />
                <RuleItem icon={Ban} text="Não permitimos festas/eventos" />
                <RuleItem icon={Ban} text="Não usar para qualquer atividade ilegal" />
                <RuleItem icon={Ban} text="Não secar roupas na cama ou sofá" />
                <RuleItem icon={Lightbulb} text="Usar AC com portas/janelas fechadas" positive />
                <RuleItem icon={Lightbulb} text="Usar água e energia de forma responsável" positive />
                <RuleItem icon={AlertCircle} text="Avisar imediatamente sobre danos" warning />
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

    const iconColorClass = warning
        ? 'text-red-500'
        : positive
            ? 'text-green-500'
            : 'text-gray-400';

    return (
        <div className={`flex items-center gap-2 text-xs ${colorClass}`}>
            <Icon size={14} className={iconColorClass} />
            <span>{text}</span>
        </div>
    );
};

export default RulesSheet;
