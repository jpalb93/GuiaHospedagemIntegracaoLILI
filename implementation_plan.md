# Plano de Implementação - Melhorias Landing Page Lili (Fase 2)

## Objetivo

Tornar o conteúdo da Landing Page dinâmico e configurável, removendo textos "chumbados" (hardcoded) do código fonte. Isso facilitará a manutenção e futuras integrações com CMS.

## Mudanças Propostas

### 1. Centralização de Conteúdo

Vamos criar um arquivo de configuração centralizado para todos os textos e dados estáticos da Landing Page.

#### [NEW] `src/config/landing_lili.ts`

Este arquivo exportará um objeto `LANDING_LILI_CONTENT` contendo:

- **Hero**: Título, subtítulo, texto do botão.
- **Sobre**: Título, descrição curta, descrição longa (parágrafos).
- **Comodidades**: Lista de itens do acordeão (id, título, ícone, lista de itens).
- **Localização**: Título, descrição, endereço.
- **Reviews (Fallback)**: Lista de avaliações padrão para quando a API falhar ou não houver dados.

### 2. Refatoração do Componente

Atualizar o componente principal para consumir este arquivo de configuração.

#### [MODIFY] `src/components/LandingLili/index.tsx`

- Importar `LANDING_LILI_CONTENT`.
- Substituir textos hardcoded pelas variáveis da config.
- Mapear a lista de comodidades dinamicamente.

### 3. Ajustes nos Sub-componentes

Garantir que os sub-componentes aceitem os dados dinâmicos corretamente.

#### [MODIFY] `src/components/LandingLili/AccordionItem.tsx`

- (Provavelmente não precisará de mudanças estruturais, apenas no uso dentro do `index.tsx`).

### 4. Interatividade do Calendário (Fase 3)

Permitir que o usuário selecione datas no calendário para pré-preencher a mensagem do WhatsApp.

#### [MODIFY] `src/components/LandingLili/AvailabilityCalendar.tsx`

- Adicionar props `onDateSelect` (callback).
- Adicionar estado local para `startDate` e `endDate`.
- Implementar lógica de seleção de range (clique inicial = start, clique final = end).
- Estilizar visualmente o range selecionado.

#### [MODIFY] `src/components/LandingLili/index.tsx`

- Adicionar estado `selectedDates` ({ start, end }).
- Passar função de atualização para o `AvailabilityCalendar`.
- Atualizar o link do WhatsApp para incluir as datas selecionadas na mensagem: "Olá Lili! Gostaria de saber sobre a disponibilidade de DD/MM a DD/MM."

### 5. UI Polish (Fase 4 - Visual Premium)

Modernizar o visual para transmitir uma sensação de hospedagem de alto padrão.

#### [MODIFY] `index.html` (ou CSS global)

- Importar fontes do Google Fonts:
    - _Playfair Display_ (para Títulos/Headings) -> Sofisticação.
    - _Inter_ ou _Lato_ (para Corpo/Body) -> Leitura limpa e moderna.

#### [MODIFY] `src/components/LandingLili/index.tsx` (Hero Section)

- **Layout**: Mudar de "Texto centralizado" para "Texto à esquerda com Glassmorphism".
- **Glassmorphism**: Adicionar box com fundo semi-transparente (`bg-white/10 backdrop-blur-md`) para o conteúdo do Hero.
- **Tipografia**: Aplicar `font-serif` (Playfair) nos títulos e aumentar o contraste.
- **Botão**: Tornar o botão mais elegante (menos arredondado ou com borda sutil, sombra suave).

#### [MODIFY] `src/components/LandingLili/index.tsx` (Location & Typography)

- **Mapa**: Adicionar `iframe` com Google Maps Embed usando `FLAT_ADDRESS`.
- **Tipografia**: Aplicar `font-serif` (Playfair) em todos os títulos de seção (`h2`).
- **Espaçamento**: Ajustar paddings para dar mais respiro entre as seções.

### 6. Android App Fixes

Corrigir problema de loop de carregamento no app Android devido ao uso de caminhos relativos na API fetch.

#### [MODIFY] `src/services/guest.ts`

- Detectar se está rodando em ambiente nativo (Capacitor).
- Usar URL completa da Vercel (https://flat-lili.vercel.app) se estiver no app, em vez de caminho relativo.

## Plano de Verificação

### Testes Manuais

1.  **Conteúdo**: Verificar se todos os textos (Hero, Sobre, Comodidades) continuam aparecendo corretamente na página `/lili`.
2.  **Integridade**: Garantir que nenhuma seção quebrou ou ficou vazia.
3.  **Facilidade de Edição**: Testar mudar um texto no arquivo `src/config/landing_lili.ts` e ver a mudança refletida na tela (Hot Reload).
4.  **Calendário**:
    - Clicar em uma data disponível -> Define Data de Entrada.
    - Clicar em outra data posterior -> Define Data de Saída e fecha o range.
    - Verificar se o botão do WhatsApp atualizou a mensagem.
5.  **Visual**: Verificar se as novas fontes carregaram e se o Hero está responsivo (mobile vs desktop).
6.  **Mapa**: Verificar se o mapa carrega o endereço correto.
