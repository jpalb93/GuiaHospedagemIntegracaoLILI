Design Principles — Flats Integração

Documento de referência única. Todo prompt de IA (Antigravity, Cursor, etc.) que altera UI deve ler este arquivo primeiro e segui-lo. Qualquer decisão de cor, hierarquia, componentização ou ícone tomada aqui vale para TODAS as telas do sistema — nunca redefinir localmente por tela ou por componente.

Este documento nasceu de uma auditoria heurística real do sistema (Home + Central de Reservas) e foi sendo expandido conforme inconsistências reais apareciam entre telas e entre implementações mobile/desktop. Cada seção existe porque um problema concreto já aconteceu — não são regras hipotéticas.

1. Princípio de ordenação: Urgência Operacional > Métrica Financeira

Toda tela que combina dados retrospectivos (faturamento, histórico) com dados acionáveis (pendências, check-ins de hoje) deve ordenar por:

1º — Itens com janela de ação < 24h e custo de ignorar irreversível (cobranças pendentes no check-in, vistorias pendentes) 2º — Itens com janela de ação < 24h, custo reversível (chegando hoje, saindo hoje) 3º — Itens sem janela de ação mas indicando risco acumulado (total de diárias pendentes, saldo a receber) 4º — Dado puramente retrospectivo/histórico (faturamento do mês, gráficos de tendência, feed de atividades)

Referência de aplicação correta: seção "Central de Reservas" (Saindo Hoje → Hospedados → Próximas Chegadas → Histórico). Referência de aplicação corrigida: Home (bloco "Ações Pendentes Hoje" elevado ao topo, acima de faturamento/gráficos).

2. Sistema de cor — mapa único de significado

Cor NUNCA pode significar duas coisas diferentes em telas ou componentes diferentes do sistema. Mapa oficial (não criar variações locais):

Cor Significado ÚNICO Onde usar
Laranja de marca (hex atual do tema) Ação primária de navegação / status de urgência-pendência Item de menu ativo, tags de status "Checkout Hoje"
Roxo Ação de Vistoria (sempre, em qualquer contexto) Botão/ícone de vistoria — Home e Reservas
Verde Status positivo / concluído / pago / ação de cobrança "Ocupado", "Pago Integral", "Hospedado", botão "Dar Baixa"/"Quitar"
Azul Informativo / canal / entrando Tag "FLATS INTEGRAÇÃO" (canal), "Entrando Hoje"
Âmbar/Amarelo (NÃO usar o mesmo hex do laranja de marca) Atenção / pendência financeira parcial "Sinal Pago" (parcial)
Vermelho Bloqueio / falta pagar / ação destrutiva "Falta Pagar", excluir
Cinza/neutro Sem ação necessária / vazio / fase informativa "Livre", tags de fase sem cor semântica própria

REGRA — separação de taxonomias na mesma célula/card: se um componente precisa comunicar mais de uma taxonomia (ex.: fase da estadia E status financeiro), cada taxonomia usa um ESTILO diferente, nunca cores concorrentes:

Fase da estadia (canal, checkout, hospedado): tag outline/contorno, sem preenchimento sólido
Status financeiro (pago, falta pagar, sinal): tag sólida, cor do mapa acima

REGRA — cor de botão é sobre AÇÃO, nunca sobre urgência: laranja nunca deve ser usado como cor de botão de CTA (ex.: botão de "Vistoria" não pode ser laranja, mesmo que a tarefa seja urgente — a urgência já é comunicada pela posição do card na ordenação da seção 1, não precisa ser reforçada na cor do botão). Laranja fica reservado para tags/badges de status, nunca para botões de ação.

Todo status codificado por cor em qualquer mapa/lista de flats precisa de um segundo canal redundante (ícone) — nunca cor pura, por critério de acessibilidade (WCAG 1.4.1). Testar com simulador de daltonismo antes de aprovar qualquer novo componente de status.

3. Badges qualitativos exigem amostra mínima

Nenhum badge do tipo "Alto/Baixo/Crítico" pode ser exibido sem baseline estatística suficiente (ex.: "Movimento Alto" não deve aparecer para 1 check-in sem contexto histórico). Constante única do projeto: MIN_SAMPLE_FOR_TREND_BADGES (definir em config/constants, sugestão inicial: 30 dias de operação OU 50 reservas concluídas — ajustar conforme volume real do negócio). Abaixo do threshold: mostrar apenas o número puro, sem badge qualitativo, sem placeholder que pareça um julgamento.

Quando o threshold for atingido, o badge deve ser calculado por comparação com média móvel real (ex. média dos últimos 30 dias daquele dia da semana), nunca um valor fixo hardcoded.

4. Gráficos de série temporal — granularidade adaptativa

Nenhum gráfico de histórico pode plotar período (mês/semana) sem dado real, disfarçado de barra baixa — isso comunica tendência que não existe. Regra de granularidade adaptativa baseada em dias com dado real disponível:

< 14 dias de dado real: não renderizar gráfico de série. Mostrar apenas os números atuais (ex. ADR, diárias vendidas), com nota discreta: "Histórico será exibido após acumularmos dados suficientes."
14–60 dias: renderizar granularidade DIÁRIA, não mensal — granularidade fina é mais honesta que granularidade grosseira com buracos.
≥ 60 dias: granularidade mensal permitida, mas barra "sem dado" deve ser visualmente distinta (ex. hachurada/tracejada) de barra "dado real baixo" — nunca a mesma representação visual para semânticas diferentes.

Todo gráfico precisa de eixo Y rotulado e tooltip on-hover com valor exato por período, e o título do card deve deixar explícito o que está sendo plotado (receita? ADR? diárias?).

Antes de subir qualquer gráfico à produção, auditar a fonte de dado do componente: confirmar ausência de arrays hardcoded ou valores default de altura mínima em bibliotecas de chart que possam mascarar ausência real de dado.

5. Reuso de ícone por conceito
   Conceito Ícone/cor
   Vistoria Clipboard roxo (ícone E botão, sempre)
   Compartilhar Ícone verde
   Link/cópia Ícone azul
   Editar Lápis cinza
   Excluir Lixeira vermelha
   Ação financeira primária (quitar/dar baixa) Botão sólido verde com texto (nunca só ícone)

Todo ícone sem rótulo textual permanente precisa de identificação acessível — ver seção 9 sobre a diferença entre contexto mouse (title/tooltip aceitável) e contexto touch (rótulo sempre visível obrigatório).

6. Paridade de affordance por criticidade

Ações de mesma criticidade operacional (ex.: cobrança pendente vs. vistoria pendente) devem ter o mesmo peso visual de CTA (botão sólido com texto e cor definida na seção 2), nunca uma ação com botão proeminente e outra apenas com seta/ícone genérico de navegação.

7. Consistência de regras de negócio (afeta UI mesmo sendo regra de dado)
   Agrupamento cronológico de histórico: sempre por DATA DE ENTRADA (check-in), não data de saída. Aplicar esse critério em qualquer lista/agrupamento futuro que envolva data de estadia, de forma consistente em todas as telas.
   Pagamentos "fora do sistema" (ex. status "Pagamento Externo"): a lógica de cálculo de faturamento já exclui corretamente esses valores do total — isso é intencional e correto, não alterar. O requisito é de comunicação: o campo de valor nunca deve aparecer como "—" vazio sem explicação; deve mostrar um texto curto (ex. "Pago fora do sistema") para que ninguém confunda "vazio intencional" com "bug de preenchimento".
8. Estados "vazios com propósito" vs. "vazios por bug"

Todo campo que aparece vazio/travessão por decisão de produto (não por falta de dado) precisa de um indicador textual mínimo explicando o porquê. Isso evita que qualquer pessoa — inclusive o próprio time, meses depois — confunda "vazio intencional" com "bug de preenchimento".

9. Tablet (iPad) — PWA responsivo

Uso confirmado: iPad, orientação mista (portrait em pé / landscape sentado), acesso via navegador (PWA), sem app nativo dedicado.

Breakpoints
Tablet portrait: min-width: 744px e max-width: 1024px, orientation: portrait
Tablet landscape: min-width: 1024px e max-width: 1366px, orientation: landscape
O layout deve permanecer funcional em qualquer largura arbitrária dentro desses ranges (suporte a Split View/Slide Over do iPadOS, que pode reduzir a viewport para ~320px mesmo em iPad grande)
Alvos de toque (pointer: coarse)
Mínimo 44×44px por alvo interativo (piso absoluto)
48–56px para CTAs financeiros/operacionais primários (Quitar, Dar Baixa, Realizar Vistoria)
Espaçamento mínimo de 8px entre alvos adjacentes
Ações destrutivas (excluir) fisicamente isoladas do cluster de ações neutras, ou movidas para menu overflow (⋯), para reduzir risco de toque acidental
Regra de rótulo em touch (substitui uso isolado de title/tooltip)

title attribute NÃO dispara em iOS Safari por toque. Em qualquer contexto (pointer: coarse), todo ícone de ação sem rótulo visível permanente é considerado não-acessível. Usar label textual sempre visível (mesmo que abreviado) junto ao ícone. Manter title apenas como reforço para contexto pointer: fine (mouse/trackpad conectado ao iPad).

Layout adaptativo por orientação (não só por largura)
Portrait = contexto de ação pontual (uso em pé, possivelmente uma mão ocupada): priorizar cards empilhados em largura total, CTA grande, uma tarefa por vez. Mapa de Ocupação em scroll horizontal de cards, não grid compacto multi-coluna.
Landscape = contexto de revisão (uso sentado): grid multi-coluna permitido, mais densidade de informação por tela, próximo ao layout desktop mas com alvos de toque ampliados.
Requisitos técnicos de PWA em iOS/iPadOS
Usar 100dvh em vez de 100vh em containers de altura total (barra do Safari expande/retrai e quebra o cálculo de 100vh)
env(safe-area-inset-\*) em headers/footers fixos, com viewport-fit=cover na meta viewport
apple-touch-icon + splash screens estáticas por resolução (iOS não gera automaticamente como Android)
touch-action: manipulation em botões e elementos interativos para evitar double-tap-zoom acidental
Todo elemento revelado apenas por :hover no CSS/JS deve ser sempre visível em @media (hover: none) — não existe hover em touch
Testar explicitamente com mouse/trackpad Bluetooth conectado ao iPad (uso "sentado" pode ter pointer: fine mesmo em tablet — não assumir touch puro em toda a faixa de largura tablet) 10. iPhone (PWA responsivo) — além do tablet

Confirmado: uso frequente por uma das donas em iPhone, além do dono em iPad. iPhone não é "tablet menor" — é uma categoria ergonômica distinta, com uso predominante de uma mão só (polegar), o que muda onde ações primárias devem ficar na tela.

Breakpoints de phone
375px–430px, portrait como orientação primária
Landscape de iPhone (até ~930px de largura) deve reutilizar o layout de "tablet portrait" (seção 9), não um terceiro layout dedicado
Ergonomia de polegar (thumb zone)

Ações primárias e frequentes (Nova Reserva, confirmar/quitar em contexto de lista) devem ser ancoradas na parte inferior da tela em breakpoint de phone (bottom-anchored action), respeitando env(safe-area-inset-bottom). Nunca depender apenas de botão no header superior para ação de uso frequente em phone — essa é a região de mais difícil alcance em uso de uma mão só.

Navegação

Sidebar de desktop/tablet não se aplica a phone (consome proporção grande demais da tela em 375–430px). Usar bottom tab bar com os itens de maior frequência de uso real confirmada pelo cliente + acesso aos demais itens via "Mais". A escolha de quais itens entram na tab bar é decisão de produto (depende do uso real do negócio), não decisão puramente visual.

Safe area — Dynamic Island

iPhone 14 Pro em diante tem a Dynamic Island sobrepondo a área superior central — mais crítico que em iPad. Todo header sticky/fixo precisa ser validado especificamente contra esse elemento, não apenas contra notch genérico.

Densidade de card em breakpoint de phone

Cards de reserva/pendência em phone reduzem para no máximo 1–2 ações rápidas visíveis por padrão (ex. ação financeira/operacional primária); demais ações agrupadas em menu overflow (⋯). Não replicar a densidade de tablet (ex. 5 ícones em fileira única) em phone — não cabe de forma legível/tocável em 375px.

Teclado virtual

Todo formulário/modal com input de texto deve garantir scroll automático do campo ativo para above-the-keyboard no focus, testado com teclado iOS realmente aberto (não apenas simulado reduzindo a viewport manualmente).

11. Componentização de cards de ação (correção de arquitetura)

Cards que representam uma reserva ou uma pendência com ação associada — por exemplo, o card de reserva nas listas "Saindo Hoje"/ "Hospedados"/"Próximas Chegadas" da tela Reservas, e o card de pendência no bloco "Ações Pendentes Hoje" da Home — DEVEM usar o MESMO componente base, parametrizado por variante/contexto (ex. variant="pending" vs variant="reservation"). Nunca implementações separadas.

Motivo, com evidência real: implementações separadas já geraram divergência de layout (overflow de texto sob botão em um contexto, ausente no outro) e divergência de cor (botão de vistoria roxo em um contexto, laranja em outro, para a mesma ação exata). Consolidar em um componente único elimina a possibilidade estrutural desse tipo de bug se repetir a cada nova alteração.

Layout de card de ação — regra de composição vertical

Todo card com [ícone/tag + nome + metadado + descrição + CTA] deve usar composição EMPILHADA (vertical), nunca layout inline comprimido em uma única linha com posicionamento absoluto do botão sobre texto. Motivo: texto de descrição tem comprimento variável e precisa poder quebrar em múltiplas linhas sem sobrepor elementos vizinhos. Testar sempre com o texto de descrição mais longo já existente no sistema, não apenas com exemplos curtos.

12. Bottom navigation flutuante — compensação de espaço

Container de conteúdo scrollável deve ter padding-bottom equivalente à soma de dois valores independentes:

padding-bottom = (altura real medida da bottom nav) + env(safe-area-inset-bottom)

Os dois valores NÃO podem ser confundidos como a mesma coisa: safe-area-inset-bottom cobre apenas o hardware do dispositivo (home indicator bar); a altura da própria barra de navegação é decisão de design do app e precisa ser somada separadamente. Nenhum item de lista pode ficar parcial ou totalmente coberto pela nav flutuante ao rolar até o fim do conteúdo — testar explicitamente rolando até o último item de cada lista do sistema.
