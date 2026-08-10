/**
 * Constantes globais e estatísticas do sistema Flats Integração.
 */

/**
 * Quantidade mínima de dados estatísticos (reservas concluídas / dias de operação)
 * para exibição de badges qualitativos de tendência (ex: "Movimento Alto", "Movimento Baixo").
 *
 * RATIONALE: Com poucas reservas (sistema recente com ~15 reservas), qualquer variação
 * pontual distorce o cálculo e cria falsas percepções de alta/baixa demanda.
 * Apenas após atingir a amostra mínima estatística os badges são ativados.
 */
export const MIN_SAMPLE_FOR_TREND_BADGES = 50;
